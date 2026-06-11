import { useMemo, memo } from "react";
import { Link } from "react-router";
import { Product } from "../store";
import { trackSelectItem } from "../tracking";
import {
  formatPrice,
  optimizeImage,
  getImageAlt,
} from "../utils";
import { OptimizedImage } from "./OptimizedImage";

interface ProductCardProps {
  product: Product;
  idx?: number;
  priority?: boolean;
  onQuickView?: (product: Product) => void;
  hideCategory?: boolean;
  hideRating?: boolean;
}

export const ProductCard = memo(function ProductCard({
  product,
  idx = 0,
  priority = false,
  onQuickView,
  hideCategory = false,
  hideRating = false,
}: ProductCardProps) {

  const displayName = useMemo(() => {
    let name = product.name || "";
    if (product.category) {
      const category = product.category.trim();
      const prefixes = [
        `${category} — `,
        `${category} - `,
        `${category}: `,
        `${category} `,
      ];
      for (const prefix of prefixes) {
        if (name.toLowerCase().startsWith(prefix.toLowerCase())) {
          return name.slice(prefix.length).trim();
        }
      }
    }
    return name;
  }, [product.name, product.category]);

  const discountPercentage = useMemo(() => {
    if (product.originalPrice && product.originalPrice > product.price) {
      return Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      );
    }
    return null;
  }, [product.price, product.originalPrice]);

  return (
    <Link
      to={`/product/${product.slug}`}
      onClick={() => trackSelectItem(product)}
      className="product-card group flex flex-col h-full bg-white rounded-[18px] md:rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden hover:-translate-y-1 transform-gpu"
    >
      <div
        className="relative aspect-[3/4] w-full overflow-hidden flex items-center justify-center p-0 flex-shrink-0"
        style={{ backgroundColor: '#FAF8F5' }}
      >
        <OptimizedImage
          src={product.image}
          width={400}
          height={500}
          srcSet={`${optimizeImage(product.image, 300)} 300w, ${optimizeImage(product.image, 600)} 600w`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          alt={getImageAlt(product)}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="w-full h-full object-cover object-top transform-gpu transition-all duration-700 ease-out group-hover:scale-105"
        />

        {/* Floating Badges — bottom-left */}
        {((product as any).badge || product.isTrending || product.isNew || product.isBestSelling) && (
          <span style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            backgroundColor: 'rgba(26,10,0,0.75)',
            color: '#f0b429',
            fontSize: '9px',
            fontWeight: '700',
            letterSpacing: '1.5px',
            padding: '4px 10px',
            borderRadius: '4px',
            textTransform: 'uppercase',
            backdropFilter: 'blur(4px)',
            zIndex: 10
          }}>
            {(product as any).badge || (product.isTrending ? "TRENDING" : product.isNew ? "NEW" : "BEST SELLER")}
          </span>
        )}
      </div>

      <div className="product-card-body flex flex-col flex-grow bg-white items-start text-left justify-between px-3 md:px-4 pb-3.5 md:pb-4 pt-3.5 md:pt-4 rounded-b-[18px] md:rounded-b-[24px]">
        <div className="flex flex-col items-start w-full">
          <h3 className="product-card-title line-clamp-2 leading-snug mb-1.5 md:mb-2 w-full text-left px-1 text-inherit"
            style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#1a1a1a',
              lineHeight: '1.35',
              minHeight: 'auto',
              whiteSpace: 'normal',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              textOverflow: 'ellipsis',
              textAlign: 'left'
            }}
            title={product.name}
          >
            {product.name}
          </h3>
        </div>

        <div className="mt-auto flex items-center justify-center gap-1.5 md:gap-2 w-full whitespace-nowrap overflow-hidden">
          <span className="product-card-price text-[14px] sm:text-[15px] md:text-[16px] font-bold text-[#2C241B] shrink-0">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <>
              <span className="text-[10px] sm:text-[11px] md:text-[12px] text-[#8C8276] line-through font-normal shrink-0">
                {formatPrice(product.originalPrice)}
              </span>
              {discountPercentage !== null && (
                <span className="text-[9px] sm:text-[10px] font-extrabold text-[#8C1D18] bg-[#FFF1F2] border border-[#FECDD3] rounded-[4px] px-1.5 py-0.5 tracking-[0.05em] uppercase shrink-0">
                  {discountPercentage}% OFF
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </Link>
  );
});
