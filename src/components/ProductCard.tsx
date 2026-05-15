import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router";
import { Eye, Plus, Star } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Product, useStore } from "../store";
import { formatPrice, optimizeImage, getProductReviewStats } from "../utils";
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
    <div className="group flex flex-col h-full bg-white transition-[transform,box-shadow] duration-300 rounded-[24px] overflow-hidden border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 will-change-transform transform-gpu">
      <div
        ref={imageRef}
        className="relative aspect-[3/4] w-full overflow-hidden bg-primary-50 flex items-center justify-center p-0 flex-shrink-0"
      >
        {!isLoaded && <Skeleton className="absolute inset-0 z-10" />}
        <Link
          to={`/product/${product.slug}`}
          className="block h-full w-full"
        >
          {isInView && (
            <OptimizedImage
              src={product.image}
              width={idx < 4 ? 600 : 400}
              srcSet={`${optimizeImage(product.image, 300)} 300w, ${optimizeImage(product.image, 600)} 600w`}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              alt={product.name}
              loading={idx < 4 ? "eager" : "lazy"}
              onLoad={() => setIsLoaded(true)}
              className={`w-full h-full object-cover object-top transform-gpu will-change-transform transition-transform duration-700 ease-out group-hover:scale-105 ${isLoaded ? "opacity-100" : "opacity-0 transition-opacity"}`}
            />
          )}
        </Link>

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNew && (
            <span className="bg-[#EFE7DC] text-[#2B2B2B] text-[10px] uppercase font-semibold px-2.5 py-1 rounded-sm tracking-[2px] shadow-sm">
              New
            </span>
          )}
          {product.isTrending && (
            <span className="bg-[#C8A96B] text-white text-[10px] uppercase font-semibold px-2.5 py-1 rounded-sm tracking-[2px] shadow-sm">
              Trending
            </span>
          )}
          {product.isBestSelling && (
            <span className="bg-[#25D366] text-white text-[10px] uppercase font-semibold px-2.5 py-1 rounded-sm tracking-[2px] shadow-sm">
              Best Seller
            </span>
          )}
        </div>

        {/* Wishlist Icon Removed */}

        {/* Hover Action Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400 hidden md:flex gap-2">
          <button
            onClick={handleQuickAdd}
            className="flex-1 h-10 bg-primary-950 text-white text-[10px] uppercase tracking-[2px] font-bold hover:bg-black transition-all rounded-sm shadow-lg flex items-center justify-center"
            aria-label="Quick Add"
          >
            Quick Add
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              if (onQuickView) onQuickView(product);
            }}
            className="w-10 h-10 bg-white text-primary-950 border border-black/5 flex items-center justify-center rounded-sm hover:bg-primary-50 transition-all shadow-lg"
            title="Quick View"
            aria-label="Quick View"
          >
            <Eye size={16} />
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

      <div className="flex flex-col flex-grow bg-white items-center text-center justify-between" style={{ padding: "10px 8px 12px", gap: "2px" }}>
        <div className="flex flex-col items-center w-full" style={{ gap: "3px" }}>
          <div className="text-[8px] md:text-[9px] uppercase tracking-[3px] text-primary-950/50 font-semibold w-full whitespace-nowrap overflow-hidden text-ellipsis text-center">
            {product.category}
          </div>
          <h3 className="font-serif text-primary-950 font-medium tracking-wide group-hover:text-gold-600 transition-colors w-full text-center truncate" style={{ fontSize: "13px", lineHeight: "1.25" }}>
            <Link to={`/product/${product.slug}`} title={product.name}>{product.name}</Link>
          </h3>
          <div className="flex items-center justify-center gap-1 mt-0.5">
            <div className="flex text-amber-500">
              {[ ...Array(5)].map((_, i) => (
                <Star key={i} className={`w-2.5 h-2.5 ${stats.rating >= i + 1 ? 'fill-current' : stats.rating >= i + 0.5 ? 'fill-current opacity-50' : 'text-gray-200'}`} />
              ))}
            </div>
            <span className="text-[9px] text-primary-950/50">({product.reviewsCount || stats.reviewCount})</span>
          </div>
        </div>
        
        <div className="mt-auto pt-1.5 flex items-center justify-center gap-1.5 md:gap-2 flex-nowrap w-full overflow-hidden">
          <span className="text-[13px] md:text-[15px] font-bold text-primary-950 font-price whitespace-nowrap">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <>
              <span className="text-[10px] md:text-[11px] text-primary-900/40 line-through font-light font-price decoration-1 whitespace-nowrap flex-shrink-0">
                {formatPrice(product.originalPrice)}
              </span>
              <span className="font-sans font-bold tracking-[1px] text-[#8A6A4A] whitespace-nowrap flex-shrink-0" style={{ fontSize: "9px", textTransform: "uppercase" }}>
                {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
