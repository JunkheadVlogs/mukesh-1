import React, { useState, useMemo, memo } from "react";
import { Link } from "react-router";
import { Heart, Eye, Sparkles } from "lucide-react";
import { Product, useStore } from "../store";
import { trackSelectItem } from "../tracking";
import {
  formatPrice,
  getImageAlt,
  getResponsiveSrcSet,
} from "../utils";
import { OptimizedImage } from "./OptimizedImage";
import QuickViewModal from "../QuickViewModal";

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
  const isPriority = Boolean(priority);
  const { wishlist, toggleWishlist } = useStore();
  const storeInventory = useStore((state) => state.inventory);
  const [internalQuickViewOpen, setInternalQuickViewOpen] = useState(false);

  const isWishlisted = wishlist.includes(product.id);

  const effectiveStock =
    storeInventory && typeof storeInventory[product.sku || product.id] === "number"
      ? storeInventory[product.sku || product.id]
      : (product.stock ?? 9);

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

  const hasGenuineSimilar = Boolean(
    (product as any).similarProducts ||
    (product as any).relatedProducts ||
    (product as any).frequentlyBoughtTogether
  );

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    } else {
      setInternalQuickViewOpen(true);
    }
  };

  const handleSimilarClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    } else {
      setInternalQuickViewOpen(true);
    }
  };

  return (
    <>
      <article className="h-full">
        <div className="product-card group flex flex-col h-full bg-white rounded-[2px] border border-[#dfd9d5] transition-all duration-300 overflow-hidden hover:shadow-md hover:-translate-y-0.5">
          {/* Product Image Area */}
          <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#faf8f6] flex items-center justify-center shrink-0">
            {/* Clickable Image Link to Product Page */}
            <Link
              to={`/product/${product.slug}/`}
              onClick={() => trackSelectItem(product)}
              aria-label={`View ${product.name} - ${formatPrice(product.price)}`}
              className="w-full h-full block relative"
            >
              <OptimizedImage
                src={product.image}
                width={400}
                height={600}
                srcSet={getResponsiveSrcSet(product.image, [300, 450, 600])}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                alt={getImageAlt(product)}
                priority={isPriority}
                loading={isPriority ? "eager" : "lazy"}
                fetchPriority={isPriority ? "high" : "low"}
                decoding="async"
                className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />

              {/* Subtle Dark Hover Overlay on Desktop */}
              <div
                className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-[1]"
                aria-hidden="true"
              />
            </Link>

            {/* Top-Left Rust/Berry Badge (Only when supported by real data) */}
            {(product.isNew || discountPercentage || (effectiveStock > 0 && effectiveStock <= 5) || product.isBestSelling || product.isTrending) && (
              <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 pointer-events-none">
                {product.isNew && (
                  <span className="bg-[#8a2633] text-white text-[11px] font-medium rounded-[4px] px-[6px] py-[3px] leading-none tracking-[0.04em] shadow-xs">
                    NEW ARRIVAL
                  </span>
                )}
                {discountPercentage && !product.isNew && (
                  <span className="bg-[#8a2633] text-white text-[11px] font-medium rounded-[4px] px-[6px] py-[3px] leading-none tracking-[0.04em] shadow-xs">
                    {discountPercentage}% OFF
                  </span>
                )}
                {effectiveStock > 0 && effectiveStock <= 5 && !product.isNew && !discountPercentage && (
                  <span className="bg-[#8a2633] text-white text-[11px] font-medium rounded-[4px] px-[6px] py-[3px] leading-none tracking-[0.04em] shadow-xs">
                    ONLY {effectiveStock} LEFT
                  </span>
                )}
                {(product.isBestSelling || product.isTrending) && !product.isNew && !discountPercentage && effectiveStock > 5 && (
                  <span className="bg-[#8a2633] text-white text-[11px] font-medium rounded-[4px] px-[6px] py-[3px] leading-none tracking-[0.04em] shadow-xs">
                    BESTSELLER
                  </span>
                )}
              </div>
            )}

            {/* Top-Right Wishlist Icon Button */}
            <button
              type="button"
              onClick={handleWishlistClick}
              aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
              title={isWishlisted ? "Wishlisted" : "Add to Wishlist"}
              className={`absolute top-2.5 right-2.5 z-20 w-11 h-11 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-white/90 hover:bg-white text-[#1f1b1b] border shadow-md transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a2633] ${
                isWishlisted
                  ? "border-[#8a2633] text-[#8a2633]"
                  : "border-[#dfd9d5] hover:border-[#8a2633] hover:text-[#8a2633]"
              }`}
            >
              <Heart
                size={18}
                className={`transition-colors ${
                  isWishlisted ? "fill-[#8a2633] text-[#8a2633]" : "text-[#1f1b1b]"
                }`}
              />
            </button>

            {/* Optional Similar Product Button (Rendered ONLY if genuine related data exists) */}
            {hasGenuineSimilar && (
              <button
                type="button"
                onClick={handleSimilarClick}
                aria-label={`View products similar to ${product.name}`}
                title="View Similar Products"
                className="absolute top-14 right-2.5 z-20 w-10 h-10 rounded-full flex items-center justify-center bg-white/90 hover:bg-white text-[#1f1b1b] hover:text-[#8a2633] border border-[#dfd9d5] shadow-md transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a2633]"
              >
                <Sparkles size={16} />
              </button>
            )}

            {/* Quick View Button Overlay */}
            <button
              type="button"
              onClick={handleQuickViewClick}
              className="absolute bottom-2.5 left-2.5 right-2.5 z-20 w-[calc(100%-20px)] mx-auto h-[44px] rounded-[2px] bg-white/95 hover:bg-white text-[#1f1b1b] hover:text-[#8a2633] border border-[#dfd9d5] shadow-md flex items-center justify-center gap-2 text-[13px] font-medium tracking-[0.08em] uppercase transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a2633] block opacity-100 translate-y-0 md:opacity-0 md:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 focus-within:opacity-100 focus-within:translate-y-0"
            >
              <Eye size={16} />
              <span>Quick View</span>
            </button>
          </div>

          {/* Product Card Details Body */}
          <Link
            to={`/product/${product.slug}/`}
            onClick={() => trackSelectItem(product)}
            className="product-card-body flex flex-col flex-grow bg-white items-start text-left justify-between p-3.5 no-underline text-inherit"
          >
            <div className="w-full mb-2">
              {!hideCategory && product.category && (
                <span className="text-[11px] uppercase tracking-[0.08em] text-[#6b6461] block mb-0.5">
                  {product.category}
                </span>
              )}
              <h3
                className="text-[13px] sm:text-[14px] font-medium text-[#1f1b1b] leading-[1.35] line-clamp-2 m-0"
                title={product.name}
              >
                {displayName}
              </h3>
            </div>

            <div className="mt-auto flex items-baseline gap-2 w-full flex-wrap pt-1 border-t border-[#dfd9d5]/40">
              <span className="text-[15px] sm:text-[16px] font-medium text-[#1f1b1b]">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[12px] text-[#6b6461] line-through font-normal">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </Link>
        </div>
      </article>

      {/* Internal Quick View Modal fallback when no onQuickView prop is supplied by parent */}
      {internalQuickViewOpen && (
        <QuickViewModal
          product={product}
          onClose={() => setInternalQuickViewOpen(false)}
        />
      )}
    </>
  );
});
