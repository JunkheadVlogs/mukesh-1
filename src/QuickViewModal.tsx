import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { X, Heart, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, useStore } from './store';
import { formatPrice } from './utils';
import ReactMarkdown from 'react-markdown';

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
  const productImages = product.images && product.images.length > 0 ? product.images : [product.image];
  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = () => {
    if (isCoOrd && !selectedSize) {
      setSizeError(true);
      return;
    }
    
    setSizeError(false);
    addToCart(product, isCoOrd ? selectedSize : undefined);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1500);
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
            className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row rounded-sm"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 text-primary-950 hover:text-gold-500 bg-white/80 backdrop-blur-sm rounded-full transition-colors border border-black/5"
            >
              <X size={20} strokeWidth={1.5} />
            </button>

            {/* Left: Images */}
            <div className="w-full md:w-1/2 bg-transparent relative aspect-[9/16] md:aspect-auto overflow-hidden">
              <div className="w-full h-full relative">
                <img 
                  src={productImages[activeImageIndex]} 
                  alt={product.name} 
                  className="w-full h-full object-contain mix-blend-multiply object-center"
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
                <h2 className="text-2xl md:text-3xl font-serif text-primary-950 mb-3 leading-tight">{product.name}</h2>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-primary-950">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                      <>
                        <span className="text-sm text-primary-950/40 line-through mb-0.5">{formatPrice(product.originalPrice)}</span>
                        <span className="text-[10px] tracking-[1px] font-bold text-[#E53935] bg-[#E53935]/10 px-1.5 py-0.5 rounded-sm">55% OFF</span>
                      </>
                    )}
                  </div>
                  {product.originalPrice && (
                    <div className="mt-1">
                      <span className="text-[9px] uppercase tracking-[1px] font-semibold text-primary-950/70 bg-primary-50 px-2 py-0.5 rounded border border-black/5">Extra ₹100 OFF on prepaid</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-8">
                <div className="markdown-content text-[13px] text-primary-950/70 leading-relaxed font-light mb-4">
                  <ReactMarkdown>{product.description}</ReactMarkdown>
                </div>
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

              {isCoOrd && (
                <div className="mb-8">
                  <div className="text-[10px] uppercase tracking-[2px] text-primary-950/50 mb-3">Select Size {sizeError && <span className="text-red-500 ml-2 font-bold normal-case tracking-normal text-[11px]">* Required</span>}</div>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border text-[10px] tracking-[1px] transition-colors
                          ${selectedSize === size 
                            ? 'border-primary-950 bg-primary-950 text-white' 
                            : 'border-black/5 text-primary-950 hover:border-gold-500 hover:text-gold-500'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdded}
                  className={`flex-1 py-3.5 px-6 text-[10px] tracking-[2px] uppercase transition-all duration-300 border ${
                    isAdded 
                      ? 'bg-transparent border-primary-950 text-primary-950' 
                      : 'bg-primary-950 border-primary-950 text-white hover:bg-gold-500 hover:border-gold-500'
                  }`}
                >
                  {isAdded ? 'Success!' : 'Add to Cart'}
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="px-5 border border-black/5 flex items-center justify-center text-primary-950 hover:border-gold-500 hover:text-gold-500 transition-colors bg-primary-50/50"
                >
                  <Heart size={18} strokeWidth={1.5} className={isWishlisted ? "fill-gold-500 text-gold-500" : ""} />
                </button>
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
