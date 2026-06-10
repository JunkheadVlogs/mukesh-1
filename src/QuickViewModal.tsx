import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router";
import {
  X,
  Heart,
  ArrowRight,
  Info,
  RotateCcw,
  Truck,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Product, useStore } from "./store";
import { formatPrice, optimizeImage, getImageAlt } from "./utils";
import { ProductDescription } from "./components/ProductDescription";
import { OptimizedImage } from "./components/OptimizedImage";
import { trackAddToCart } from "./tracking";

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({
  product,
  onClose,
}: QuickViewModalProps) {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [isAdded, setIsAdded] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [sizeError, setSizeError] = useState(false);
  const sizeSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
      setSelectedSize("");
      setActiveImageIndex(0);
      setSizeError(false);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [product]);

  if (!product) return null;

  const isCoOrd = product.category === "Co-Ord Sets" || product.category.toLowerCase().includes("co-ord");
  const sizes = (product.availableSizes || ["M", "L", "XL", "XXL", "XXXL"]).filter(s => s !== "Free Size");
  const productImages =
    product.images && product.images.length > 0
      ? [...product.images]
      : [product.image];
  const isWishlisted = wishlist.includes(product.id);
  const finalPrice = product.price;

  const handleAddToCart = (): boolean => {
    if (isCoOrd && !selectedSize) {
      setSizeError(true);
      return false;
    }

    setSizeError(false);
    addToCart(product, isCoOrd ? selectedSize : undefined, 1);
    trackAddToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1500);
    return true;
  };

  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-primary-950/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row rounded-sm border border-black/5"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 text-primary-950/20 hover:text-primary-950 transition-all"
            >
              <X size={24} />
            </button>

            {/* Gallery Left */}
            <div className="w-full md:w-1/2 relative aspect-square md:aspect-auto overflow-hidden flex items-center justify-center p-0" style={{ backgroundColor: '#FAF8F5' }}>
               <OptimizedImage
                  src={productImages[activeImageIndex]}
                  width={800}
                  alt={getImageAlt(product)}
                  className="w-full h-full object-contain object-center"
                />
                
                {productImages.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center justify-center bg-white/70 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-black/[0.03] shadow-[0_2px_10px_rgba(0,0,0,0.02)] z-10">
                    <div className="flex items-center gap-1.2">
                      {productImages.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveImageIndex(i)}
                          className={`h-1.25 rounded-full transition-all duration-300 ${
                            activeImageIndex === i
                              ? "w-3.5 bg-[#C8A96B] shadow-[0_0_6px_rgba(200,169,107,0.30)]"
                              : "w-1.25 bg-[#2B2B2B]/20 hover:bg-[#2B2B2B]/40"
                          }`}
                          aria-label={`Go to slide ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="absolute top-6 left-6 bg-discount text-white text-[10px] uppercase font-discount font-black px-3 py-1 rounded-sm shadow-sm">
                  50% OFF
                </div>
            </div>

            {/* Info Right */}
            <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 overflow-y-auto max-h-[90vh] bg-white">
              <header className="mb-6 md:mb-8 text-center">
                 <div className="text-[10px] uppercase tracking-[2px] font-bold text-discount mb-2 text-center w-full">{product.category}</div>
                 <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-primary-950 mb-4 font-semibold tracking-[1px] text-center overflow-visible break-words whitespace-normal leading-snug">{product.name}</h2>
                 <div className="flex items-center justify-center gap-3 mb-5 flex-wrap w-full">
                    <span className="text-[24px] font-bold text-price font-price whitespace-nowrap">{formatPrice(product.price)}</span>
                    <span className="text-[15px] md:text-xl text-primary-950/40 line-through font-medium font-price whitespace-nowrap">MRP {formatPrice(product.originalPrice || product.price * 2)}</span>
                    <span className="text-[10px] font-sans font-bold text-[#8A6A4A] bg-[#F7F3EE] px-[8px] py-[4px] rounded-[8px] uppercase tracking-[1px] whitespace-nowrap">
                      {Math.round((1 - product.price / (product.originalPrice || product.price * 2)) * 100)}% OFF
                    </span>
                 </div>
              </header>

              <div className="space-y-8 mb-10">
                <div className="grid grid-cols-2 gap-4 py-6 border-y border-black/5">
                  <div className="space-y-0.5">
                    <span className="text-[8px] uppercase tracking-wider text-primary-950/40 font-bold">Fabric</span>
                    <p className="text-[12px] font-semibold text-primary-950">{product.fabric}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[8px] uppercase tracking-wider text-primary-950/40 font-bold">SKU</span>
                    <p className="text-[12px] font-semibold text-primary-950">{product.sku}</p>
                  </div>
                </div>

                {isCoOrd && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs uppercase tracking-wider text-primary-950/40 font-bold">Size</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => { setSelectedSize(size); setSizeError(false); }}
                          className={`h-[32px] sm:h-[34px] min-w-[34px] sm:min-w-[36px] px-2.5 border text-[11px] font-semibold tracking-wider transition-all rounded-sm
                            ${selectedSize === size ? "border-primary-950 bg-primary-950 text-white" : "border-black/5 text-primary-950/60 hover:border-black/20"}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    {sizeError && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-2 ml-1">Please select size</p>}
                  </div>
                )}

                <div className="space-y-4">
                   <button
                      onClick={handleAddToCart}
                      disabled={isAdded}
                      className="w-full bg-gold-500 text-white shadow-lg flex items-center justify-center gap-3 text-[12px] md:text-[13px] tracking-[2px] uppercase transition-all font-bold hover:bg-gold-600 disabled:opacity-50"
                      style={{ height: "58px", borderRadius: "18px", fontWeight: 600 }}
                    >
                      {isAdded ? "✓ ADDED TO CART" : `ADD TO CART`}
                    </button>
                    <div className="flex gap-4">
                      <Link
                        to={`/product/${product.slug}`}
                        onClick={onClose}
                        className="flex-1 border-2 border-primary-950 bg-primary-950 text-white flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all"
                        style={{ height: "44px", borderRadius: "12px" }}
                      >
                         Details <ArrowRight size={16} />
                      </Link>
                    </div>
                </div>
              </div>

              <footer className="pt-6 mt-6 border-t border-black/5 flex flex-col space-y-3">
                 <div className="flex items-center gap-2 group cursor-default">
                    <Truck size={14} className="text-[var(--color-gold-dark)] opacity-70 group-hover:opacity-100 transition-opacity" />
                    <span className="text-[10px] md:text-[11px] uppercase tracking-[0.1em] font-medium text-[var(--color-dark)] opacity-80 group-hover:opacity-100 transition-opacity">Free Delivery Global</span>
                 </div>
                 <div className="flex items-center gap-2 group cursor-default">
                    <ShieldCheck size={14} className="text-[var(--color-gold-dark)] opacity-70 group-hover:opacity-100 transition-opacity" />
                    <span className="text-[10px] md:text-[11px] uppercase tracking-[0.1em] font-medium text-[var(--color-dark)] opacity-80 group-hover:opacity-100 transition-opacity">Quality Verified</span>
                 </div>
              </footer>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
