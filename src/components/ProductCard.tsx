import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, useStore } from '../store';
import { formatPrice, optimizeImage } from '../utils';
import { trackAddToCart } from '../tracking';
import { Skeleton } from './Skeleton';

interface ProductCardProps {
  product: Product;
  idx: number;
  onQuickView: (product: Product) => void;
}

export function ProductCard({ product, idx, onQuickView }: ProductCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const { addToCart } = useStore();

  useEffect(() => {
    // Eagerly load the first few images
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
        rootMargin: '200px 0px', // Load before it comes into view
        threshold: 0.1,
      }
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
    addToCart(product, product.category === 'Co-Ord Sets' ? 'M' : undefined, 1);
    trackAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 3000);
  };

  return (
    <div className="group flex flex-col h-full">
      <div className="relative aspect-[2/3] overflow-hidden bg-transparent mb-4 flex items-center justify-center rounded-sm text-primary-950/10">
        {!isLoaded && (
          <Skeleton className="absolute inset-0 z-10" />
        )}
        <Link 
          to={`/product/${product.slug}`} 
          className="block h-full w-full"
          onMouseEnter={() => {
            const img = new Image();
            img.src = optimizeImage(product.image, 800);
          }}
        >
          {isInView && (
            <img 
              ref={imageRef}
              src={optimizeImage(product.image, idx < 4 ? 600 : 400)} 
              srcSet={`${optimizeImage(product.image, 300)} 300w, ${optimizeImage(product.image, 600)} 600w, ${optimizeImage(product.image, 900)} 900w`}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              alt={product.name} 
              loading={idx < 4 ? "eager" : "lazy"}
              fetchPriority={idx < 4 ? "high" : "auto"}
              onLoad={() => setIsLoaded(true)}
              className={`w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
              referrerPolicy="no-referrer"
            />
          )}
          {!isInView && (
            <img ref={imageRef} className="w-full h-full object-cover opacity-0" alt="placeholder" />
          )}
        </Link>
        
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center pointer-events-none">
          <button 
            onClick={(e) => {
              e.preventDefault();
              onQuickView(product);
            }}
            className="bg-white/90 backdrop-blur-sm text-primary-950 h-10 w-10 flex items-center justify-center rounded-full shadow-2xl transition-all duration-500 transform translate-y-8 group-hover:translate-y-0 pointer-events-auto hover:bg-gold-500 hover:text-white"
            title="Quick View"
          >
            <Eye size={18} strokeWidth={1} />
          </button>
        </div>

        {product.isNew && (
          <span className="absolute top-3 left-3 bg-primary-50 border border-black/5 text-primary-950 text-[9px] px-2 py-1 tracking-[2px] uppercase shadow-sm rounded-sm font-medium z-20">New</span>
        )}

        <AnimatePresence>
          {isAdded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 bg-primary-950/20 backdrop-blur-sm flex items-center justify-center z-20 pointer-events-none"
            >
               <span className="bg-primary-950 text-white px-4 py-2 text-[11px] font-bold tracking-[1px] uppercase rounded-sm shadow-xl">
                 Added To Cart
               </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="text-center flex-grow flex flex-col mt-2">
        <div className="text-[10px] uppercase tracking-[1px] text-gold-500 mb-1.5 font-medium">{product.fabric || product.category}</div>
        <h3 className="font-serif text-[15px] text-primary-950 mb-1.5 truncate font-normal tracking-wide">
          <Link to={`/product/${product.slug}`} className="hover:text-gold-500 transition-colors">
            {product.name}
          </Link>
        </h3>
        <div className="flex flex-col items-center justify-center mt-auto pt-2">
          <div className="flex items-center space-x-2 text-[14px]">
            <span className="font-medium text-primary-950">{formatPrice(product.price)}</span>
            {product.originalPrice && (
               <>
                 <span className="text-[12px] text-primary-950/40 line-through">{formatPrice(product.originalPrice)}</span>
                 <span className="text-[10px] tracking-[1px] font-medium text-gold-600 bg-gold-600/10 px-1.5 py-0.5 rounded-sm">{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF</span>
               </>
            )}
          </div>
          
          {product.colorVariants && product.colorVariants.length > 0 && (
            <div className="flex justify-center gap-1.5 mt-3">
              {product.colorVariants.map((variant) => (
                <Link 
                  key={variant.slug} 
                  to={`/product/${variant.slug}`}
                  title={variant.color}
                  className={`w-4 h-4 rounded-full overflow-hidden border transition-colors hover:scale-110 ${variant.slug === product.slug ? 'border-primary-950' : 'border-black/20 hover:border-gold-500'}`}
                >
                  <img src={optimizeImage(variant.image, 50)} alt={variant.color} className="w-full h-full object-cover" />
                </Link>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={handleQuickAdd}
          className={`w-full mt-4 py-2 px-4 text-[11px] uppercase tracking-[1px] font-bold rounded-sm border transition-colors ${
            isAdded ? 'bg-gold-600 text-white border-gold-600' : 'bg-gold-600 text-white border-gold-600 hover:bg-gold-500 hover:border-gold-500 shadow-sm shadow-gold-600/20'
          }`}
        >
          {isAdded ? 'Added ✓' : 'Add to Bag'}
        </button>
      </div>
    </div>
  );
}
