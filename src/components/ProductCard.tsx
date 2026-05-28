import { useState, useMemo } from "react";
import { Link } from "react-router";
import { Eye, Star } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Product, useStore } from "../store";
import {
  formatPrice,
  optimizeImage,
  getProductReviewStats,
  getImageAlt,
} from "../utils";
import { trackAddToCart } from "../tracking";
import { OptimizedImage } from "./OptimizedImage";

interface ProductCardProps {
  product: Product;
  idx?: number;
  priority?: boolean;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({
  product,
  idx = 0,
  priority = false,
  onQuickView,
}: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useStore();

  const stats = useMemo(() => getProductReviewStats(product), [product.id]);

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

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, product.category === "Co-Ord Sets" ? "M" : undefined, 1);
    trackAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 3000);
  };

  return (
    <div className="group flex flex-col h-full bg-white rounded-[18px] md:rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden hover:-translate-y-1 transform-gpu">
      <div
        className="relative aspect-[3/4] w-full overflow-hidden flex items-center justify-center p-0 flex-shrink-0"
        style={{ backgroundColor: '#FAF8F5' }}
      >
        <Link to={`/product/${product.slug}`} className="block h-full w-full">
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
            className="w-full h-full object-contain object-center transform-gpu transition-all duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Floating Badges — non-intrusive bottom-left, semi-transparent */}
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

        {/* Hover Action Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400 hidden lg:flex gap-2">
          <button
            onClick={handleQuickAdd}
            className="flex-1 h-12 rounded-[4px] bg-primary-950 text-white text-[11px] uppercase tracking-[2px] font-medium hover:bg-black transition-all flex items-center justify-center border border-primary-950"
            aria-label="Quick Add"
          >
            Quick Add
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              if (onQuickView) onQuickView(product);
            }}
            className="w-12 h-12 rounded-[4px] bg-white text-primary-950 border border-gold-200 flex items-center justify-center hover:bg-primary-50 transition-all"
            title="Quick View"
            aria-label="Quick View"
          >
            <Eye size={16} strokeWidth={1.5} />
          </button>
        </div>

        <AnimatePresence>
          {isAdded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20 pointer-events-none"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 rounded-full border-2 border-gold-500 border-t-transparent animate-spin" />
                <span className="text-primary-950 text-[10px] font-bold uppercase tracking-[2px]">
                  Added to Bag
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col flex-grow bg-white items-center text-center justify-between px-3 md:px-4 pb-4 md:pb-5 pt-4 rounded-b-[18px] md:rounded-b-[24px]">
        <div className="flex flex-col items-center w-full">
          <div className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-[#8C8276] font-medium w-full mb-1.5">
            {product.category}
          </div>
          <h3 className="line-clamp-2 leading-snug mb-2.5 w-full text-center px-1"
            style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#1a1a1a',
              lineHeight: '1.35',
              minHeight: '2.4em',
              whiteSpace: 'normal',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              textOverflow: 'ellipsis'
            }}>
            <Link to={`/product/${product.slug}`} title={product.name} className="hover:text-gold-600 transition-colors duration-200">
              {product.name}
            </Link>
          </h3>

          {/* Rating Section */}
          <div className="flex items-center justify-center gap-1.5 mb-3 w-full">
            <div className="flex items-center gap-[2px]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-[10px] h-[10px] sm:w-[11px] sm:h-[11px] ${
                    stats.rating >= i + 1
                      ? "fill-[#F4B63D] text-[#F4B63D]"
                      : stats.rating >= i + 0.5
                        ? "fill-[#F4B63D] text-[#F4B63D] opacity-50"
                        : "fill-[#E6DEC8] text-[#E6DEC8]"
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] sm:text-[12px] text-[#9CA3AF] font-medium leading-none">
              ({product.reviewsCount || stats.reviewCount})
            </span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-center gap-1.5 md:gap-2 w-full whitespace-nowrap overflow-hidden">
          <span className="text-[14px] sm:text-[15px] md:text-[16px] font-bold text-[#2C241B] shrink-0">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <>
              <span className="text-[10px] sm:text-[11px] md:text-[12px] text-[#8C8276] line-through font-normal shrink-0">
                {formatPrice(product.originalPrice)}
              </span>
              <span className="text-[8px] sm:text-[9px] md:text-[10px] font-medium text-[#2C241B] bg-[#F4F0EA] rounded-[4px] px-1.5 py-0.5 tracking-[0.05em] uppercase shrink-0">
                {Math.round(
                  ((product.originalPrice - product.price) /
                    product.originalPrice) *
                    100,
                )}
                % OFF
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
