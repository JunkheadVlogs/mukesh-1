import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import {
  X,
  Heart,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Check,
  ShoppingBag,
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Product, useStore } from "./store";
import { formatPrice, getImageAlt, getResponsiveSrcSet, getProductReviewStats, optimizeImage } from "./utils";
import { OptimizedImage } from "./components/OptimizedImage";
import { trackAddToCart } from "./tracking";

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

const isVideoUrl = (url?: string): boolean => {
  if (!url) return false;
  return url.endsWith(".webm") || url.includes(".webm") || url.endsWith(".mp4") || url.includes(".mp4");
};

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const storeInventory = useStore((state) => state.inventory);
  const [isAdded, setIsAdded] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  // Keyboard Escape listener & scroll lock
  useEffect(() => {
    if (product) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [product, onClose]);

  if (!product) return null;

  const productImages =
    product.images && product.images.length > 0
      ? [...product.images]
      : product.image
        ? [product.image]
        : [];

  const isWishlisted = wishlist.includes(product.id);
  const effectiveStock =
    storeInventory && typeof storeInventory[product.sku || product.id] === "number"
      ? storeInventory[product.sku || product.id]
      : (product.stock ?? 9);
  const isOutOfStock = effectiveStock === 0;

  const stats = getProductReviewStats(product);

  const discountPercentage =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, undefined, 1);
    trackAddToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % productImages.length);
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quickview-title"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        ref={modalRef}
        className="relative bg-white w-full max-w-[920px] max-h-[90vh] md:max-h-[85vh] overflow-hidden shadow-2xl flex flex-col md:flex-row rounded-[4px] border border-[#dfd9d5] z-10 my-auto animate-fade-in"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#1f1b1b] border border-[#dfd9d5] flex items-center justify-center shadow-md transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a2633]"
        >
          <X size={18} />
        </button>

        {/* Gallery Left Column (50% on desktop) */}
        <div className="w-full md:w-1/2 relative bg-[#faf8f6] flex flex-col items-center justify-center min-h-[300px] md:min-h-[480px] aspect-[2/3] md:aspect-auto shrink-0 select-none overflow-hidden">
          {/* Main Active Image / Video */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {isVideoUrl(productImages[activeImageIndex]) ? (
              <video
                src={productImages[activeImageIndex]}
                autoPlay
                loop
                muted
                playsInline
                controls
                className="w-full h-full object-cover"
                ref={(el) => {
                  if (el) el.muted = true;
                }}
              />
            ) : (
              <OptimizedImage
                src={productImages[activeImageIndex]}
                width={600}
                height={900}
                srcSet={getResponsiveSrcSet(productImages[activeImageIndex], [300, 450, 600])}
                sizes="(max-width: 768px) 100vw, 450px"
                alt={getImageAlt(product)}
                loading="eager"
                priority={true}
                className="w-full h-full object-cover object-top"
              />
            )}

            {/* Badge Overlay */}
            {discountPercentage && (
              <span className="absolute top-3 left-3 bg-[#8a2633] text-white text-[11px] font-medium rounded-[4px] px-[6px] py-[3px] leading-none tracking-[0.04em] shadow-xs z-10">
                {discountPercentage}% OFF
              </span>
            )}

            {/* Prev / Next Arrows */}
            {productImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#1f1b1b] border border-[#dfd9d5] flex items-center justify-center shadow-sm transition-all z-20 cursor-pointer"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#1f1b1b] border border-[#dfd9d5] flex items-center justify-center shadow-sm transition-all z-20 cursor-pointer"
                  aria-label="Next image"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Dot Strip */}
          {productImages.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5 z-20 px-4">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                    activeImageIndex === idx
                      ? "w-6 bg-[#8a2633]"
                      : "w-1.5 bg-[#1f1b1b]/30 hover:bg-[#1f1b1b]/60"
                  }`}
                  aria-label={`View image ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Information Right Column (50% on desktop) */}
        <div className="w-full md:w-1/2 p-5 sm:p-6 md:p-8 overflow-y-auto flex flex-col justify-between bg-white">
          <div className="space-y-4">
            {/* Category */}
            <div className="text-[11px] uppercase tracking-[0.1em] text-[#6b6461] font-medium">
              {product.category}
            </div>

            {/* Title */}
            <h2
              id="quickview-title"
              className="text-[18px] sm:text-[20px] md:text-[22px] font-sans font-medium text-[#1f1b1b] leading-snug"
            >
              {product.name}
            </h2>

            {/* Rating */}
            {(stats.reviewCount > 0 || (product.reviewsCount && product.reviewsCount > 0)) && (
              <div className="flex items-center gap-1.5 text-[12px] text-[#1f1b1b]">
                <div className="flex items-center gap-[2px]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        stats.rating >= i + 1
                          ? "fill-[#F4B63D] text-[#F4B63D]"
                          : "fill-[#dfd9d5] text-[#dfd9d5]"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-medium">{stats.rating.toFixed(1)}</span>
                <span className="text-[#6b6461]">({product.reviewsCount || stats.reviewCount} reviews)</span>
              </div>
            )}

            {/* Price & Tax */}
            <div className="space-y-1 pt-1 border-t border-[#dfd9d5]">
              <div className="flex items-baseline gap-2.5 flex-wrap">
                <span className="text-[20px] font-medium text-[#1f1b1b]">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-[14px] text-[#6b6461] line-through font-normal">
                      MRP {formatPrice(product.originalPrice)}
                    </span>
                    <span className="bg-[#8a2633] text-white text-[11px] font-medium rounded-[4px] px-[6px] py-[3px] leading-none">
                      {discountPercentage}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-[12px] text-[#6b6461] m-0">
                Inclusive of all taxes. Free express shipping across India.
              </p>
            </div>

            {/* Compact Fact Specifications */}
            <div className="py-3 border-t border-b border-[#dfd9d5] space-y-1.5 text-[13px] text-[#1f1b1b]">
              {product.fabric && (
                <div className="flex justify-between">
                  <span className="text-[#6b6461]">Fabric</span>
                  <span className="font-medium">{product.fabric}</span>
                </div>
              )}
              {product.color && (
                <div className="flex justify-between">
                  <span className="text-[#6b6461]">Color</span>
                  <span className="font-medium">{product.color}</span>
                </div>
              )}
              {product.sku && (
                <div className="flex justify-between">
                  <span className="text-[#6b6461]">SKU</span>
                  <span className="font-mono text-[12px]">{product.sku}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#6b6461]">Availability</span>
                <span className={`font-medium ${isOutOfStock ? "text-[#8a2633]" : "text-emerald-700"}`}>
                  {isOutOfStock ? "Sold Out" : effectiveStock <= 5 ? `Only ${effectiveStock} Left` : "In Stock"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 h-[48px] bg-[#8a2633] hover:bg-[#6f1d29] disabled:bg-[#dfd9d5] disabled:text-[#6b6461] text-white text-[12px] uppercase tracking-[0.08em] font-medium rounded-[2px] transition-colors flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a2633]"
                >
                  <ShoppingBag size={16} />
                  <span>{isOutOfStock ? "Sold Out" : isAdded ? "✓ Added to Cart" : "Add to Cart"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleWishlistToggle}
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  className="w-[48px] h-[48px] rounded-[2px] border border-[#dfd9d5] hover:border-[#8a2633] flex items-center justify-center transition-colors cursor-pointer shrink-0"
                >
                  <Heart
                    size={20}
                    className={`transition-colors ${
                      isWishlisted ? "fill-[#8a2633] text-[#8a2633]" : "text-[#1f1b1b]"
                    }`}
                  />
                </button>
              </div>

              <Link
                to={`/product/${product.slug}/`}
                onClick={onClose}
                className="w-full h-[44px] bg-white hover:bg-[#faf8f6] text-[#1f1b1b] border border-[#1f1b1b] text-[12px] uppercase tracking-[0.08em] font-medium rounded-[2px] flex items-center justify-center gap-2 transition-colors no-underline cursor-pointer"
                style={{ textDecoration: "none" }}
              >
                <span>View Full Details</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Micro Trust Markers Footer */}
          <div className="pt-4 mt-4 border-t border-[#dfd9d5] grid grid-cols-2 gap-2 text-[11px] text-[#6b6461]">
            <div className="flex items-center gap-1.5">
              <Truck size={14} className="text-[#8a2633] shrink-0" />
              <span>Free Delivery in India</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#8a2633] shrink-0" />
              <span>Authentic Weaver Direct</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
