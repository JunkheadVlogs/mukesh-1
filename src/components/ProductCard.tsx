import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router";
import { Eye, Plus, Star } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Product, useStore } from "../store";
import {
  formatPrice,
  optimizeImage,
  getProductReviewStats,
  getImageAlt,
} from "../utils";
import { trackAddToCart } from "../tracking";
import { Skeleton } from "./Skeleton";
import { OptimizedImage } from "./OptimizedImage";

interface ProductCardProps {
  product: Product;
  idx?: number;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({
  product,
  idx = 0,
  onQuickView,
}: ProductCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useStore();

  const stats = useMemo(() => getProductReviewStats(product), [product.id]);

  useEffect(() => {
    if (idx < 4) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "600px 0px",
        threshold: 0,
      },
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [idx]);

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
        ref={imageRef}
        className="relative aspect-[3/4] w-full overflow-hidden bg-primary-50 flex items-center justify-center p-0 flex-shrink-0"
      >
        {!isLoaded && <Skeleton className="absolute inset-0 z-10" />}
        <Link to={`/product/${product.slug}`} className="block h-full w-full">
          {isInView && (
            <OptimizedImage
              src={product.image}
              width={idx < 4 ? 400 : 300}
              srcSet={`${optimizeImage(product.image, 300)} 300w, ${optimizeImage(product.image, 600)} 600w`}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              alt={getImageAlt(product)}
              priority={idx < 4}
              onLoad={() => setIsLoaded(true)}
              className={`w-full h-full object-cover object-top transform-gpu transition-transform duration-700 ease-out group-hover:scale-105 ${isLoaded ? "opacity-100" : "opacity-0 transition-opacity"}`}
            />
          )}
        </Link>

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isNew && (
            <span className="bg-white/95 backdrop-blur-md text-primary-950 border border-white/50 text-[9px] uppercase font-semibold px-3 py-1 tracking-[1px] rounded-md shadow-[0_2px_10px_rgba(0,0,0,0.05)] w-max">
              NEW
            </span>
          )}
          {product.isTrending && (
            <span className="bg-white/95 backdrop-blur-md text-primary-950 border border-white/50 text-[9px] uppercase font-semibold px-3 py-1 tracking-[1px] rounded-md shadow-[0_2px_10px_rgba(0,0,0,0.05)] w-max">
              TRENDING
            </span>
          )}
          {product.isBestSelling && (
            <span className="bg-white/95 backdrop-blur-md text-primary-950 border border-white/50 text-[9px] uppercase font-semibold px-3 py-1 tracking-[1px] rounded-md shadow-[0_2px_10px_rgba(0,0,0,0.05)] w-max">
              BEST SELLER
            </span>
          )}
        </div>

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
          <h3 className="font-serif text-[#2C241B] tracking-wide group-hover:text-gold-600 transition-colors w-full truncate text-[14px] md:text-[15px] leading-[1.35] font-medium px-1 mb-2.5">
            <Link to={`/product/${product.slug}`} title={product.name}>
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
