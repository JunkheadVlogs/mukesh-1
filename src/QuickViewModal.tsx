import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router';
import { X, Heart, ArrowRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, useStore } from './store';
import { formatPrice } from './utils';
import { ProductDescription } from './components/ProductDescription';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isAdded, setIsAdded] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [sizeError, setSizeError] = useState(false);
  const sizeSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
      setSelectedSize('');
      setActiveImageIndex(0);
      setSizeError(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [product]);

  if (!product) return null;

  const isCoOrd = product.category === 'Co-Ord Sets';
  const sizes = product.availableSizes || ['M', 'L', 'XL', 'XXL', 'XXXL'];
  const productImages = product.images && product.images.length > 0 ? [...product.images] : [product.image];
  const isWishlisted = wishlist.includes(product.id);
  const hasDiscount = !!product.originalPrice && product.originalPrice > product.price;
  const finalPrice = product.price;

  const handleAddToCart = (): boolean => {
    if (isCoOrd && !selectedSize) {
      setSizeError(true);
      sizeSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }
    
    setSizeError(false);
    addToCart(product, isCoOrd ? selectedSize : undefined);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1500);
    return true;
  };

  const handleGoToProduct = () => {
    onClose();
    navigate(`/product/${product.slug}`);
  };

  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
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
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-primary-50 w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row rounded-sm"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 text-primary-950 hover:text-gold-500 bg-white/80 backdrop-blur-sm rounded-full transition-colors border border-black/5"
            >
              <X size={20} strokeWidth={1.5} />
            </button>

            {/* Left: Images */}
            <div className="w-full md:w-1/2 bg-transparent relative aspect-[2/3] md:aspect-auto overflow-hidden">
              <div className="w-full h-full relative">
                <img 
                  src={productImages[activeImageIndex]} 
                  alt={product.name} 
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                
                {/* Image selection bullets if more than one */}
                {productImages.length > 1 && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 px-4">
                    {productImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImageIndex(i)}
                        className={`h-1 rounded-full transition-all duration-300 ${activeImageIndex === i ? 'w-6 bg-primary-950' : 'w-2 bg-primary-950/20'}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Info */}
            <div className="w-full md:w-1/2 p-6 sm:p-10 overflow-y-auto max-h-[90vh]">
              <div className="mb-6">
                <div className="text-[10px] tracking-[2px] uppercase text-gold-500 mb-2 font-medium">{product.category}</div>
                <h2 className="text-xl md:text-2xl font-medium text-primary-950 mb-1.5 leading-tight">{product.name}</h2>
                
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-gold-500 text-[12px]">
                    ⭐⭐⭐⭐⭐
                  </div>
                  <span className="text-[12px] font-medium text-primary-950">3000+ customers</span>
                </div>
                
                {product.tagline && (
                  <p className="text-[14px] text-primary-950/70 mb-3 whitespace-pre-line">{product.tagline}</p>
                )}

                {product.sku && (
                  <p className="text-[10px] tracking-[1px] uppercase text-primary-950/40 mb-3">SKU: {product.sku}</p>
                )}

                <div className="flex flex-col gap-1 mb-5">
                  <div className="flex items-center flex-wrap gap-2 text-primary-950 mb-2">
                    {hasDiscount ? (
                      <span className="text-[10px] font-medium text-primary-700 bg-[#E53935]/10 px-1.5 py-0.5 rounded-sm tracking-[0.5px] uppercase">
                        ₹100 OFF
                      </span>
                    ) : product.originalPrice ? (
                      <span className="text-[10px] font-medium text-primary-700 bg-[#E53935]/10 px-1.5 py-0.5 rounded-sm tracking-[0.5px] uppercase">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </span>
                    ) : null}

                    {(hasDiscount || product.originalPrice) && (
                      <span className="text-[14px] font-medium text-primary-950/40 mx-1">→</span>
                    )}

                    {hasDiscount ? (
                      <>
                        <span className="text-[14px] text-primary-950/40 line-through">
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-[14px] font-medium text-primary-950/40 mx-1">→</span>
                      </>
                    ) : product.originalPrice ? (
                      <>
                        <span className="text-[14px] text-primary-950/40 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                        <span className="text-[14px] font-medium text-primary-950/40 mx-1">→</span>
                      </>
                    ) : null}

                    <span className="text-2xl font-medium">
                      {formatPrice(finalPrice)}
                    </span>
                  </div>
                  <span className="text-[12px] font-medium text-gold-600">✓ COD Available</span>
                </div>
              </div>

              {isCoOrd && (
                <motion.div 
                  className="mb-5 p-4 rounded-md transition-all duration-300 border border-black/5 bg-primary-50/30"
                  ref={sizeSectionRef}
                  animate={sizeError ? { x: [-10, 10, -10, 10, 0] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[13px] font-medium text-primary-950">
                      Select your size
                    </span>
                    <Link
                      to={`/product/${product.slug}`}
                      className="text-[10px] uppercase tracking-[1px] flex items-center text-gold-500 hover:text-gold-600 transition-colors bg-gold-500/10 px-2 py-1 rounded"
                    >
                      <Info size={12} className="mr-1" /> Size Guide
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => {
                          setSelectedSize(size);
                          setSizeError(false);
                        }}
                        className={`min-w-[44px] px-3 py-1.5 border text-[11px] font-normal tracking-[0.5px] transition-colors duration-300
                          ${selectedSize === size 
                            ? 'border-primary-950 bg-stone-50 text-primary-950' 
                            : 'border-gray-200 text-gray-600 bg-primary-50 hover:border-gray-300'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              <div className="flex flex-col gap-2 mb-6">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      if (handleAddToCart()) {
                        navigate("/checkout");
                        onClose();
                      }
                    }}
                    disabled={isAdded}
                    className={`flex-1 py-2.5 px-8 text-[12px] uppercase transition-all duration-300 border shadow-sm font-medium flex flex-col items-center justify-center rounded ${
                      isAdded 
                        ? 'bg-transparent border-primary-950 text-primary-950' 
                        : 'bg-primary-950 border-primary-950 text-white hover:bg-gold-500 hover:border-gold-500'
                    }`}
                  >
                    <span className="leading-tight">{isAdded ? 'Success!' : `Order Now - Only ${formatPrice(finalPrice)} (Limited Stock)`}</span>
                  </button>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="w-12 border border-black/5 flex items-center justify-center text-primary-950 hover:border-gold-500 hover:text-gold-500 transition-colors bg-primary-50/50 rounded"
                  >
                    <Heart size={18} strokeWidth={1.5} className={isWishlisted ? "fill-gold-500 text-gold-500" : ""} />
                  </button>
                </div>

                <div className="flex items-center text-primary-950 text-[12px] font-normal mb-1">
                  <span className="text-sm leading-none mr-2">⏳</span> Only few pieces available today
                </div>
              </div>

              {/* Offer Box */}
              {hasDiscount && (
                <div className="mb-5 flex items-center text-primary-950 text-[12px] font-normal">
                  <span className="text-sm leading-none mr-2">👉</span> Auto discount applied at checkout
                </div>
              )}

              {/* Social Proof Text Only */}
              <div className="mb-5 space-y-3">
                <div className="bg-primary-50 px-3 py-2.5 rounded-sm border border-black/5">
                  <div className="flex items-center gap-0.5 mb-1 text-gold-500 text-[10px]">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                  <p className="text-[12px] text-primary-950/80 italic mb-1.5">"Very comfortable for office wear, fabric is really soft."</p>
                  <div className="flex items-center gap-2 text-[10px]">
                     <span className="font-medium text-primary-950">Neha, Delhi</span>
                     <span className="text-gold-600 font-medium ml-auto flex items-center gap-1" title="Verified Buyer">✔ Verified</span>
                  </div>
                </div>
                <div className="bg-primary-50 px-3 py-2.5 rounded-sm border border-black/5">
                  <div className="flex items-center gap-0.5 mb-1 text-gold-500 text-[10px]">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                  <p className="text-[12px] text-primary-950/80 italic mb-1.5">"Looks incredibly premium and the fit is perfect."</p>
                  <div className="flex items-center gap-2 text-[10px]">
                     <span className="font-medium text-primary-950">Anjali, Mumbai</span>
                     <span className="text-gold-600 font-medium ml-auto flex items-center gap-1" title="Verified Buyer">✔ Verified</span>
                  </div>
                </div>
              </div>
                  
              {/* Trust Elements */}
              <div className="flex flex-col gap-2 mt-4 bg-primary-50/30 border border-black/5 rounded-sm p-3.5 text-[12px] text-primary-950 font-medium">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] leading-none">✅</span> 7 Days Easy Returns
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] leading-none">🚚</span> Cash on Delivery Available
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] leading-none">🔒</span> Secure Checkout
                </div>
              </div>

              <div className="mb-6 border-t border-black/5 pt-6 mt-6">
                <ProductDescription description={product.description} className="text-[13px] mb-4" />
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-[1px] text-primary-950/40">Color:</span>
                    <span className="text-[11px] text-primary-950">{product.color}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-[1px] text-primary-950/40">Fabric:</span>
                    <span className="text-[11px] text-primary-950">{product.fabric}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGoToProduct}
                className="w-full flex items-center justify-center gap-2 py-3 text-[10px] tracking-[2px] uppercase text-primary-950/60 hover:text-gold-500 transition-colors border-t border-black/5"
              >
                View Full Details <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
