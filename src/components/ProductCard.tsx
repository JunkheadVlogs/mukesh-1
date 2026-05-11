import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { Eye, Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Product, useStore } from "../store";
import { formatPrice, optimizeImage } from "../utils";
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
        </div>

        {/* Wishlist Icon */}
        <button 
          className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-md text-primary-950 flex items-center justify-center rounded-full hover:bg-white hover:text-red-500 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.08)] z-10"
          onClick={(e) => {
            e.preventDefault();
            // Assuming wishlist toggle functionality exists in the store or we can just leave it as UI for now
            // toggleWishlist(product.id)
          }}
          title="Add to Wishlist"
          aria-label="Add to Wishlist"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>

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
        </div>
        
        <div className="mt-auto pt-1.5 flex items-center justify-center gap-1.5 md:gap-2 flex-nowrap w-full overflow-hidden">
          <span className="text-[13px] md:text-[15px] font-bold text-primary-950 font-price whitespace-nowrap">
            {formatPrice(Math.floor(product.price * 0.5))}
          </span>
          <span className="text-[10px] md:text-[11px] text-primary-900/40 line-through font-light font-price decoration-1 whitespace-nowrap flex-shrink-0">
            {formatPrice(product.price)}
          </span>
          <span className="font-sans font-bold tracking-[1px] text-[#8A6A4A] whitespace-nowrap flex-shrink-0" style={{ fontSize: "9px", textTransform: "uppercase" }}>
            50% OFF
          </span>
        </div>
      </div>
    </div>
  );
}
