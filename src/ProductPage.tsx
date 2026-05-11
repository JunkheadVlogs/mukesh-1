import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Info,
  RefreshCw,
  Shield,
  Star,
  ThumbsDown,
  ThumbsUp,
  Truck,
  RotateCcw,
  ShieldCheck,
  X,
  Maximize2,
  MessageCircle,
  Phone,
  CheckCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ProductDescription } from "./components/ProductDescription";
import { Link, useNavigate, useParams } from "react-router";
import { products } from "./mockData";
import { useStore } from "./store";
import { trackViewContent, trackAddToCart } from "./tracking";
import { formatPrice, optimizeImage } from "./utils";
import { CONFIG } from "./config";
import { OptimizedImage } from "./components/OptimizedImage";
import { ProductCard } from "./components/ProductCard";
import { SEO } from "./components/SEO";

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.slug === slug);
  const { addToCart, toggleWishlist, wishlist } = useStore();

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [isAdded, setIsAdded] = useState(false);
  const [showAddedToast, setShowAddedToast] = useState<{visible: boolean, quantity: number, size?: string}>({visible: false, quantity: 1});
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) {
      setActiveImageIndex((prev) => (prev + 1) % productImages.length);
    }
    if (isRightSwipe) {
      setActiveImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
    }
  };
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});
  const [sizeError, setSizeError] = useState(false);
  const [stockError, setStockError] = useState(false);

  // Synchronous state reset on navigation
  const [currentSlug, setCurrentSlug] = useState(slug);
  if (slug !== currentSlug) {
    setCurrentSlug(slug);
    setActiveImageIndex(0);
    setSizeError(false);
    setStockError(false);
    setIsLightboxOpen(false);
    setIsZoomed(false);
    setSelectedSize("");
    setQuantity(1);
  }

  const sizeSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLightboxOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isLightboxOpen]);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (product) {
      trackViewContent(product);
    }
  }, [slug, product]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-primary-50">
        <h2 className="mb-4 text-2xl font-serif">Product Not Found</h2>
        <Link to="/shop" className="text-gold-500 hover:underline font-bold uppercase tracking-widest text-xs">
          Return to Shop
        </Link>
      </div>
    );
  }

  const isCoOrd = product.category === "Co-Ord Sets";
  const sizes = product.availableSizes || ["M", "L", "XL", "XXL", "XXXL"];

  const productImages =
    product.images && product.images.length > 0
      ? [...product.images]
      : [product.image];
  const totalMediaLength = productImages.length;

  const handleAddToCart = (): boolean => {
    if (isCoOrd && !selectedSize) {
      setSizeError(true);
      sizeSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return false;
    }

    setSizeError(false);
    addToCart(product, isCoOrd ? selectedSize : undefined, quantity);
    trackAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
    
    setShowAddedToast({ visible: true, quantity, size: isCoOrd ? selectedSize : undefined });
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = setTimeout(() => {
      setShowAddedToast(prev => ({ ...prev, visible: false }));
    }, 4000);

    return true;
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const isWishlisted = wishlist.includes(product.id);
  const isOutOfStock = product.stock === 0;
  const maxStock = product.stock !== undefined ? product.stock : Infinity;

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": productImages,
    "description": product.description.replace(/<[^>]*>?/gm, ""),
    "brand": {
      "@type": "Brand",
      "name": "Mukesh Saree Centre"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://mukeshsarees.com/product/${product.slug}`,
      "priceCurrency": "INR",
      "price": product.price,
      "availability": isOutOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  return (
    <div className="bg-primary-50">
      <SEO
        title={`${product.name} | Mukesh Saree Centre`}
        description={product.description.replace(/<[^>]*>?/gm, "").substring(0, 160)}
        image={product.image}
        url={`/product/${product.slug}`}
        type="product"
        product={{
          price: product.price,
          currency: "INR",
          availability: "in stock",
          condition: "new",
        }}
        schema={productSchema}
      />
      
      <div className="max-w-7xl mx-auto px-0 md:px-4 sm:px-6 lg:px-8 pb-8 md:pb-12 product-page-top pt-0 md:pt-3">
        <nav className="hidden md:flex mb-2 md:mb-4 px-4 md:px-0 pt-2 md:pt-0 items-center gap-2 text-[9px] md:text-[10px] uppercase tracking-[2px] text-primary-950/60 font-bold overflow-x-auto whitespace-nowrap pb-1 md:pb-0 scrollbar-hide">
           <Link to="/" className="hover:text-discount transition-colors">Home</Link>
           <span className="opacity-20 text-[14px]">/</span>
           <Link to="/shop" className="hover:text-discount transition-colors">Shop</Link>
           <span className="opacity-20 text-[14px]">/</span>
           <span className="text-primary-950/90">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6 lg:gap-16">
          {/* Gallery Section */}
          <div className="space-y-2 md:space-y-4">
            <div 
              className="bg-[#F9F7F4] md:rounded-[12px] overflow-hidden border-y md:border border-black/5 shadow-[0_4px_24px_rgba(0,0,0,0.04)] aspect-[4/5] md:aspect-[3/4] relative cursor-zoom-in group flex items-center justify-center p-0"
              onClick={() => setIsLightboxOpen(true)}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <OptimizedImage
                src={productImages[activeImageIndex]}
                width={800}
                alt={product.name}
                priority={true}
                className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-700 mix-blend-multiply transform-gpu will-change-transform"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-primary-950 text-[10px] uppercase font-bold tracking-[1px] px-3 py-1.5 rounded-[8px] shadow-sm z-10">
                50% OFF
              </div>
              <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm p-2 rounded-full shadow-sm text-primary-950 opacity-0 group-hover:opacity-100 transition-opacity z-10 hidden md:block">
                <Maximize2 size={18} />
              </div>

              {/* Slider Arrows */}
              {productImages.length > 1 && (
                <>
                  <button 
                    onClick={(e) => { e.stopPropagation(); prevImage(e); }}
                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white/50 md:bg-white/80 backdrop-blur-md text-primary-950 rounded-full shadow-sm hover:bg-white/90 transition-all z-10 border border-black/5"
                    aria-label="Previous Image"
                  >
                    <ChevronLeft size={16} className="md:w-5 md:h-5 ml-[-1px] md:ml-[-2px]" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); nextImage(e); }}
                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white/50 md:bg-white/80 backdrop-blur-md text-primary-950 rounded-full shadow-sm hover:bg-white/90 transition-all z-10 border border-black/5"
                    aria-label="Next Image"
                  >
                    <ChevronRight size={16} className="md:w-5 md:h-5 mr-[-1px] md:mr-[-2px]" />
                  </button>
                </>
              )}
              
              {/* Image Indicators */}
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 md:hidden z-10">
                {productImages.map((_, idx) => (
                  <div key={idx} className={`h-1 rounded-full transition-all ${activeImageIndex === idx ? "w-4 bg-primary-950" : "w-1.5 bg-primary-950/30"}`} />
                ))}
              </div>
            </div>
            
            {productImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide snap-x px-4 md:px-0 md:grid md:grid-cols-4 md:gap-3 py-1 mb-2 md:mb-0">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`aspect-[3/4] w-14 md:w-auto flex-shrink-0 snap-center bg-[#F9F7F4] rounded-[6px] overflow-hidden transition-all flex items-center justify-center p-0 relative ${activeImageIndex === idx ? "border-[1.5px] border-solid border-[#C8A96B] shadow-sm transform scale-[1.02]" : "border-[1.5px] border-solid border-transparent opacity-60 hover:opacity-100"}`}
              >
                <OptimizedImage src={img} width={150} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover mix-blend-multiply" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details Section */}
          <div className="px-4 md:px-0 pt-1 md:pt-0">
            <div className="lg:sticky lg:top-32">
              <header className="flex flex-col items-center justify-center text-center mt-0 mb-1.5 md:mb-3">
                <span className="text-[10px] uppercase tracking-[3px] font-bold text-[#8A6A4A]/70 mb-0.5 md:mb-1.5">
                  {product.category}
                </span>
                
                {(() => {
                  const parts = product.name.split(/ with /i);
                  const mainTitle = parts[0].trim();
                  
                  return (
                    <h1 className="font-serif text-primary-950 font-medium product-title truncate w-full px-2" style={{ fontSize: "clamp(20px, 5vw, 26px)", lineHeight: 1.15, letterSpacing: "-0.01em", maxWidth: "100%" }}>
                      {mainTitle}
                    </h1>
                  );
                })()}
              </header>
              
              {/* Product Pricing */}
              <div className="flex items-center justify-center gap-2 md:gap-3 flex-nowrap w-full overflow-hidden mb-3">
                <span className="text-[20px] md:text-2xl font-bold text-primary-950 font-price whitespace-nowrap leading-none">
                  {formatPrice(Math.floor(product.price * 0.5))}
                </span>
                <span className="text-[14px] md:text-lg text-primary-900/40 line-through font-light font-price decoration-1 whitespace-nowrap flex-shrink-0 leading-none">
                  MRP {formatPrice(product.price)}
                </span>
              </div>

              {/* Product Specifications - Inline Compact Layout */}
              <section className="flex flex-wrap justify-center items-center gap-x-3 md:gap-x-4 gap-y-1 py-2 md:py-3 border-y border-black/5 mt-0 mb-3 md:mb-6">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] uppercase tracking-[1px] text-primary-950/50 font-bold">Fabric:</span>
                  <span className="text-[12px] font-semibold text-primary-950">{product.fabric}</span>
                </div>
                
                {product.category.toLowerCase().includes("saree") && (
                  <>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] uppercase tracking-[1px] text-primary-950/50 font-bold">Dimensions:</span>
                      <span className="text-[12px] font-semibold text-primary-950">5.5m</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] uppercase tracking-[1px] text-primary-950/50 font-bold">Blouse:</span>
                      <span className="text-[12px] font-semibold text-primary-950">1m Included</span>
                    </div>
                  </>
                )}
                
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] uppercase tracking-[1px] text-primary-950/50 font-bold">Color:</span>
                  <span className="text-[12px] font-semibold text-primary-950">{product.color}</span>
                </div>

                {!product.category.toLowerCase().includes("saree") && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] uppercase tracking-[1px] text-primary-950/50 font-bold">Style:</span>
                    <span className="text-[12px] font-semibold text-primary-950">Premium</span>
                  </div>
                )}
              </section>

              {/* Color Variants */}
              {product.colorVariants && product.colorVariants.length > 0 && (
                <section className="pb-2">
                   <h3 className="text-[10px] uppercase tracking-[2px] text-primary-950/60 font-bold mb-2">Color Options</h3>
                   <div className="flex flex-wrap" style={{ gap: "8px" }}>
                     {product.colorVariants.map((v) => (
                       <Link
                        key={v.slug}
                        to={`/product/${v.slug}`}
                        className={`group transition-all overflow-hidden ${v.slug === slug ? "border-[#C8A96B] shadow-[0_2px_8px_rgba(200,169,107,0.2)]" : "border-transparent hover:border-black/10"}`}
                        style={{ borderRadius: "8px", border: v.slug === slug ? "1.5px solid #C8A96B" : "1.5px solid transparent" }}
                       >
                         <div className="w-12 h-[60px] overflow-hidden bg-primary-50 relative">
                           <OptimizedImage src={v.image} alt={v.color} width={200} className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity will-change-transform transform-gpu" />
                           {v.slug === slug && <div className="absolute inset-0 bg-[#C8A96B]/10 mix-blend-multiply pointer-events-none" />}
                         </div>
                       </Link>
                     ))}
                   </div>
                </section>
              )}

              {/* Size Selection */}
              {isCoOrd && (
                <section ref={sizeSectionRef} className="pb-3 pt-1">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-[10px] uppercase tracking-[2px] text-primary-950/60 font-bold">Select Size</h3>
                    <button onClick={() => setIsSizeGuideOpen(true)} className="text-[10px] uppercase font-bold text-[#8A6A4A] hover:text-primary-950 transition-colors tracking-[1px]">Size Guide</button>
                  </div>
                  <div className="flex flex-wrap gap-2 md:gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => { setSelectedSize(size); setSizeError(false); }}
                        className={`h-[38px] min-w-[44px] px-2 border border-solid text-[12px] font-bold tracking-widest transition-all rounded-[8px] ${selectedSize === size ? "border-[#C8A96B] bg-[#F9F7F4] text-primary-950 shadow-sm" : "border-black/5 text-primary-950/60 hover:border-black/15 hover:text-primary-950 bg-white"}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {sizeError && <p className="text-[#C8A96B] text-[11px] font-bold uppercase tracking-[1px] mt-2">Please select your size</p>}
                </section>
              )}

              {/* Actions */}
              <section className="fixed bottom-0 left-0 w-full px-4 pb-[calc(10px+env(safe-area-inset-bottom))] md:pb-0 pt-6 bg-gradient-to-t from-primary-50 via-primary-50/80 to-transparent pointer-events-none md:pointer-events-auto md:bg-none md:relative z-50 md:mt-8 will-change-transform transform-gpu">
                <div className="flex flex-row gap-2 max-w-7xl mx-auto pointer-events-auto items-center">
                  <div className="flex gap-2 w-full">
                    <div className="hidden md:flex items-center border border-black/10 bg-white shadow-sm flex-shrink-0" style={{ height: "42px", borderRadius: "8px", padding: "0 4px" }}>
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-full text-primary-950/50 hover:text-primary-950 transition-colors font-sans text-xl flex items-center justify-center">-</button>
                      <span className="w-5 text-center font-bold text-primary-950 text-[14px]">{quantity}</span>
                      <button onClick={() => setQuantity(Math.min(maxStock, quantity + 1))} className="w-8 h-full text-primary-950/50 hover:text-primary-950 transition-colors font-sans text-xl flex items-center justify-center">+</button>
                    </div>
                    <button
                      onClick={handleAddToCart}
                      disabled={isOutOfStock}
                      className="flex-1 btn-primary disabled:opacity-50 text-[11px] tracking-[2px] uppercase shadow-[0_4px_16px_rgba(200,169,107,0.4)] hover:shadow-[0_6px_20px_rgba(200,169,107,0.4)] flex items-center justify-center rounded-[6px] h-[38px] md:h-[42px]"
                      style={{ fontWeight: 700 }}
                    >
                      {isOutOfStock ? "SOLD OUT" : isAdded ? "✓ ADDED TO CART" : "ADD TO CART"}
                    </button>
                  </div>
                  
                  <div className="flex flex-shrink-0">
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="w-[38px] h-[38px] md:w-[42px] md:h-[42px] bg-white border border-black/10 flex items-center justify-center transition-all hover:bg-black/5 rounded-[6px] shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
                      aria-label="Wishlist"
                    >
                      <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} className={isWishlisted ? "text-[#C8A96B]" : "text-primary-950/50"} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </section>

              {/* Delivery Info Banner */}
              <section className="pt-2 md:pt-4">
                <div className="flex items-center gap-3 bg-[#F9F7F4] p-3 py-2.5 rounded-[12px] border border-black/5 mt-1">
                  <Truck size={20} className="text-[#8A6A4A] flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-primary-950 uppercase tracking-[1px]">Free Shipping</span>
                    <span className="text-[12px] text-primary-950/70 font-medium">Delivery Time 3 - 5 Working Days</span>
                  </div>
                </div>
              </section>

              {/* Guarantees - Compact */}
              <section className="pt-2 md:pt-4 pb-1 md:pb-2 grid grid-cols-3 gap-2 border-none">
                 <div className="flex flex-col items-center text-center gap-1.5 text-[8.5px] uppercase tracking-[1px] font-bold text-primary-950/60 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-black/[0.03] rounded-[10px] p-2">
                   <Truck size={16} strokeWidth={1.5} className="text-[#8A6A4A]" />
                   <span>Free<br/>Shipping</span>
                 </div>
                 <div className="flex flex-col items-center text-center gap-1.5 text-[8.5px] uppercase tracking-[1px] font-bold text-primary-950/60 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-black/[0.03] rounded-[10px] p-2">
                   <RotateCcw size={16} strokeWidth={1.5} className="text-[#8A6A4A]" />
                   <span>Easy<br/>Returns</span>
                 </div>
                 <div className="flex flex-col items-center text-center gap-1.5 text-[8.5px] uppercase tracking-[1px] font-bold text-primary-950/60 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-black/[0.03] rounded-[10px] p-2">
                   <ShieldCheck size={16} strokeWidth={1.5} className="text-[#8A6A4A]" />
                   <span>Quality<br/>Check</span>
                 </div>
              </section>

              {/* Customer Support Section */}
              <section className="pt-2 md:pt-3 pb-3 md:pb-4">
                <div className="flex items-center gap-2 md:gap-3 w-full px-1 md:px-0">
                  <a href="https://wa.me/917020664641" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 md:gap-2 bg-white py-2.5 px-3 rounded-full border border-black/10 hover:border-[#C8A96B]/50 hover:bg-[#F9F7F4] shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all group">
                    <div className="flex items-center justify-center text-[#25D366]">
                      <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.878-.788-1.473-1.761-1.643-2.062-.17-.3-.018-.463.13-.611.134-.135.298-.348.446-.522.148-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                      </svg>
                    </div>
                    <span className="text-[12px] md:text-[13px] text-primary-950 font-medium group-hover:text-[#8A6A4A] transition-colors leading-none tracking-[0.2px]">Chat With Us</span>
                  </a>

                  <a href="tel:+917020664641" className="flex-1 flex items-center justify-center gap-1.5 md:gap-2 bg-white py-2.5 px-3 rounded-full border border-black/10 hover:border-[#C8A96B]/50 hover:bg-[#F9F7F4] shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all group">
                    <Phone className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary-950/70 group-hover:text-[#8A6A4A] transition-colors" strokeWidth={1.5} />
                    <span className="text-[12px] md:text-[13px] text-primary-950 font-medium group-hover:text-[#8A6A4A] transition-colors leading-none tracking-[0.5px]">+91 7020664641</span>
                  </a>
                </div>
              </section>
              
              {/* Description */}
              <section className="pt-4 md:pt-6 border-t border-black/5">
                <ProductDescription description={product.description} />
              </section>
            </div>
          </div>
        </div>

        {/* Related Section */}
        <section className="mt-8 md:mt-20 border-t border-black/5 pt-8 md:pt-16 pb-8 md:pb-[40px] px-4 md:px-0">
          <div className="flex justify-between items-baseline mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-serif text-primary-950 font-medium tracking-wide">You May Also Like</h2>
            <Link to="/shop" className="text-[10px] uppercase font-bold text-[#8A6A4A] hover:text-primary-950 underline underline-offset-4 tracking-[2px] transition-colors">See All</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6">
             {products
              .filter((p) => !p.isVariant && p.id !== product.id && (p.category === product.category))
              .slice(0, 4)
              .map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
          </div>
        </section>
      </div>

      {/* Lightbox Component Here... (I will keep it simple relying on motion) */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-primary-950/95 backdrop-blur-md flex flex-col items-center justify-center p-0 md:p-6"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button className="absolute top-4 right-4 md:top-6 md:right-6 text-white/50 hover:text-white transition-colors z-[110] bg-black/20 p-2 rounded-full backdrop-blur-md" onClick={() => setIsLightboxOpen(false)}>
              <X size={28} />
            </button>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full h-full md:w-auto md:h-auto md:max-w-5xl md:max-h-full relative flex items-center justify-center pointer-events-none"
            >
              <OptimizedImage src={productImages[activeImageIndex]} width={1200} alt={product.name} className="w-full h-full md:w-auto md:h-auto md:max-h-[90vh] object-contain md:rounded-sm md:shadow-2xl pointer-events-auto will-change-transform transform-gpu" onClick={(e: any) => e.stopPropagation()} />
              <div className="absolute inset-y-0 left-2 md:-left-20 flex items-center pointer-events-auto">
                 <button onClick={(e) => { e.stopPropagation(); prevImage(e); }} className="p-2 text-white/70 hover:text-white bg-black/20 rounded-full backdrop-blur-sm transition-all"><ChevronLeft className="w-8 h-8 md:w-12 md:h-12" /></button>
              </div>
              <div className="absolute inset-y-0 right-2 md:-right-20 flex items-center pointer-events-auto">
                 <button onClick={(e) => { e.stopPropagation(); nextImage(e); }} className="p-2 text-white/70 hover:text-white bg-black/20 rounded-full backdrop-blur-sm transition-all"><ChevronRight className="w-8 h-8 md:w-12 md:h-12" /></button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Toast Notification */}
      <AnimatePresence>
        {showAddedToast.visible && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-[90px] md:top-28 right-4 md:right-8 z-[100] w-[calc(100%-32px)] sm:w-96 bg-white border border-black/10 shadow-[0_12px_40px_rgb(0,0,0,0.12)] rounded-md overflow-hidden flex flex-col pointer-events-auto mx-auto sm:mx-0 left-0 right-0 sm:left-auto"
          >
            <div className="bg-gold-500/10 px-4 py-2.5 flex items-center justify-between border-b border-gold-500/20">
              <div className="flex items-center gap-2 text-gold-700">
                <CheckCircle size={16} strokeWidth={2.5} />
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">Added to Cart Successfully</span>
              </div>
              <button
                onClick={() => setShowAddedToast(prev => ({ ...prev, visible: false }))}
                className="text-primary-950/40 hover:text-primary-950 transition-colors p-1"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-4 flex gap-4 bg-white/50">
              <div className="w-[60px] h-[75px] bg-primary-50 rounded-[4px] relative overflow-hidden flex-shrink-0 border border-black/5 shadow-sm">
                <OptimizedImage src={product.image} width={100} alt={product.name} className="w-full h-full object-cover object-top will-change-transform transform-gpu" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h4 className="text-sm font-serif text-primary-950 line-clamp-2 leading-snug font-medium mb-1.5">{product.name}</h4>
                <div className="flex items-center justify-between text-[11px] font-bold text-primary-950/60 uppercase tracking-widest mt-auto pb-1">
                  <span>Qty: {showAddedToast.quantity}</span>
                  {showAddedToast.size && <span>Size: {showAddedToast.size}</span>}
                </div>
              </div>
            </div>
            <div className="px-4 pb-4 pt-1 flex gap-3 bg-white/50 justify-between items-center">
              <button
                onClick={() => setShowAddedToast(prev => ({ ...prev, visible: false }))}
                className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-primary-950/50 hover:text-primary-950 underline underline-offset-4 transition-colors"
              >
                Continue
              </button>
              <Link
                to="/cart"
                className="btn-primary text-[10px] md:text-[11px] px-6 py-2.5 rounded-[4px] shadow-sm hover:shadow-md transition-all"
              >
                View Cart
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
