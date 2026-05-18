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
  Share2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, useMemo } from "react";
import { ProductDescription } from "./components/ProductDescription";
import { Link, useNavigate, useParams } from "react-router";
import { products } from "./mockData";
import { useStore } from "./store";
import { trackViewContent, trackAddToCart } from "./tracking";
import { formatPrice, optimizeImage, getProductReviewStats, getImageAlt } from "./utils";
import { CONFIG } from "./config";
import { OptimizedImage } from "./components/OptimizedImage";
import { ProductCard } from "./components/ProductCard";
import { SEO } from "./components/SEO";
import { UrgencyWidget } from "./components/UrgencyWidget";
import { ProductReviews } from "./components/ProductReviews";
import { TrustBadges } from "./components/TrustBadges";

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.slug === slug);
  const { addToCart, toggleWishlist, wishlist } = useStore();

  const stats = useMemo(() => product ? getProductReviewStats(product) : { rating: 4.8, reviewCount: 150 }, [product?.id]);

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
  const mainAtcRef = useRef<HTMLButtonElement>(null);
  const [showStickyAtc, setShowStickyAtc] = useState(false);

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
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]) {
          setShowStickyAtc(!entries[0].isIntersecting);
        }
      },
      { threshold: 0 }
    );

    if (mainAtcRef.current) {
      observer.observe(mainAtcRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const handleBuyNow = () => {
    if (handleAddToCart() !== false) {
      if (!isOutOfStock) {
          navigate('/checkout');
      }
    }
  };

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

  const handleShare = async () => {
    // Determine the share URL. If we are in the development environment, 
    // it will share the current URL. When deployed to production, it will be the real domain.
    // We clean up any AI Studio specific workarounds for production readiness.
    const shareUrl = window.location.href;
    
    const shareData = {
      title: `${product.name} | Mukesh Saree Centre`,
      text: "Check out this beautiful product at Mukesh Saree Centre!",
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error("Error sharing:", err);
      }
    }
  };

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
    "sku": product.sku || product.id,
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
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": "Mukesh Saree Centre"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": stats.rating.toString(),
      "reviewCount": stats.reviewCount.toString()
    }
  };

  return (
    <div className="bg-primary-50 product-page-content">
      <SEO
        title={`${product.color} ${product.fabric} ${product.category} — Buy Online at ₹${product.price} | Mukesh Saree Centre`}
        description={`Shop ${product.name} at Mukesh Saree Centre. ${product.description.replace(/<[^>]*>?/gm, "").substring(0, 100)}. COD available. Free delivery on all orders. Easy returns.`}
        image={product.image}
        url={`/product/${product.slug}`}
        type="og:product"
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
           <Link to={`/shop?category=${product.category === 'Linen Sarees' ? 'Sarees' : product.category}`} className="hover:text-discount transition-colors">{product.category === 'Linen Sarees' ? 'Sarees' : product.category}</Link>
           {product.category === 'Linen Sarees' && (
             <>
               <span className="opacity-20 text-[14px]">/</span>
               <Link to="/shop?category=Linen Sarees" className="hover:text-discount transition-colors">Linen Sarees</Link>
             </>
           )}
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
                alt={getImageAlt(product)}
                priority={true}
                className="product-image-main group-hover:scale-105 transition-transform duration-700 transform-gpu will-change-transform"
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
                    className={`gallery-thumb transition-all flex items-center justify-center p-0 relative ${activeImageIndex === idx ? "active shadow-sm transform scale-[1.02]" : "opacity-60 hover:opacity-100"}`}
              >
                <OptimizedImage src={img} width={150} alt={`${getImageAlt(product)} - Thumbnail ${idx + 1}`} className="product-thumbnail" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details Section */}
          <div className="px-4 md:px-0 pt-1 md:pt-0">
            <div className="lg:sticky lg:top-32">
              <header className="flex flex-col items-center justify-center text-center mt-0 mb-1.5 md:mb-3">
                <div className="flex flex-wrap items-center justify-center gap-1.5 mb-2">
                  <span className="text-[10px] uppercase tracking-[3px] font-bold text-[#8A6A4A]/70">
                    {product.category}
                  </span>
                  {product.sku && (
                    <>
                      <span className="opacity-20 text-[10px]">|</span>
                      <span className="text-[10px] uppercase tracking-[1.5px] font-bold text-primary-950/40">
                        SKU: {product.sku}
                      </span>
                    </>
                  )}
                  {product.isNew && (
                    <span className="text-[8px] uppercase tracking-[1px] font-semibold flex-shrink-0 bg-white/80 border border-primary-100/50 text-primary-950 px-1.5 py-0.5 rounded-[1px] shadow-sm">
                      NEW
                    </span>
                  )}
                  {product.isTrending && (
                    <span className="text-[8px] uppercase tracking-[1px] font-semibold flex-shrink-0 bg-[#f0e6d2] border border-[#C8A96B]/20 text-[#6b5a41] px-1.5 py-0.5 rounded-[1px] shadow-sm">
                      TRENDING
                    </span>
                  )}
                  {product.isBestSelling && (
                    <span className="text-[8px] uppercase tracking-[1px] font-semibold flex-shrink-0 bg-[#e2eadc] border border-[#a2c095] text-[#30402b] px-1.5 py-0.5 rounded-[1px] shadow-sm">
                      BEST SELLER
                    </span>
                  )}
                </div>
                
                {(() => {
                  const parts = product.name.split(/ with /i);
                  const mainTitle = parts[0].trim();
                  
                  return (
                    <h1 className="font-serif text-primary-950 font-medium product-title truncate w-full px-2" style={{ fontSize: "clamp(20px, 5vw, 26px)", lineHeight: 1.15, letterSpacing: "-0.01em", maxWidth: "100%" }}>
                      {mainTitle}
                    </h1>
                  );
                })()}

                {/* Rating Summary Snippet */}
                <a href="#reviews" className="flex items-center gap-1.5 mt-2 hover:opacity-80 transition-opacity">
                  <div className="flex text-amber-500">
                    {[ ...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 md:w-4 md:h-4 ${stats.rating >= i + 1 ? 'fill-current' : stats.rating >= i + 0.5 ? 'fill-current opacity-50' : 'text-gray-200'}`} />
                    ))}
                  </div>
                  <span className="text-[11px] md:text-sm font-medium text-primary-950/70 border-b border-primary-950/20 pb-[1px]">
                    {stats.rating} ({product.reviewsCount || stats.reviewCount} Reviews)
                  </span>
                </a>
              </header>
              
              {/* Product Pricing and Share */}
              <div className="flex items-center justify-center gap-4 w-full mb-3 relative">
                <div className="flex items-center gap-2 md:gap-3 flex-nowrap overflow-hidden">
                  <span className="text-[20px] md:text-2xl font-bold text-primary-950 font-price whitespace-nowrap leading-none">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-[14px] md:text-lg text-primary-900/40 line-through font-light font-price decoration-1 whitespace-nowrap flex-shrink-0 leading-none">
                      MRP {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-1.5 w-[34px] h-[34px] rounded-full bg-[#F9F7F4] border border-black/5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:bg-[#F0EEEB] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all text-[#8A6A4A] ml-2"
                  aria-label="Share product"
                >
                  <Share2 size={15} strokeWidth={2} className="ml-[-1px]" />
                </button>
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
                      <span className="text-[12px] font-semibold text-primary-950">5.50 Meters</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] uppercase tracking-[1px] text-primary-950/50 font-bold">Blouse:</span>
                      <span className="text-[12px] font-semibold text-primary-950">1 Meter</span>
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

              {/* Urgency Widget */}
              {(product.enableUrgency !== false) && (
                <div className="mb-4">
                  <UrgencyWidget productId={product.id} />
                </div>
              )}

              {/* Stock Urgency */}
              {product.stock && product.stock <= 15 && (
                <div className="flex items-center gap-1.5 mb-2 mt-4 px-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                  <span className="text-[11px] font-bold text-red-600 uppercase tracking-[1px]">Only {product.stock} left in stock - selling fast!</span>
                </div>
              )}

              {/* Actions */}
              <section className="w-full mt-6 md:mt-8 relative will-change-transform transform-gpu">
                <div className="flex flex-col gap-3 max-w-7xl mx-auto w-full">
                  <div className="flex flex-row gap-2 w-full items-center">
                    <div className="flex gap-2 w-full">
                      <div className="flex items-center border border-black/10 bg-white shadow-sm flex-shrink-0" style={{ height: "42px", borderRadius: "8px", padding: "0 4px" }}>
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-full text-primary-950/50 hover:text-primary-950 transition-colors font-sans text-xl flex items-center justify-center">-</button>
                        <span className="w-5 text-center font-bold text-primary-950 text-[14px]">{quantity}</span>
                        <button onClick={() => setQuantity(Math.min(maxStock, quantity + 1))} className="w-8 h-full text-primary-950/50 hover:text-primary-950 transition-colors font-sans text-xl flex items-center justify-center">+</button>
                      </div>
                      <button
                        ref={mainAtcRef}
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        className="flex-1 btn-primary disabled:opacity-50 text-[11px] tracking-[2px] uppercase shadow-[0_4px_16px_rgba(200,169,107,0.4)] hover:shadow-[0_6px_20px_rgba(200,169,107,0.4)] flex items-center justify-center rounded-[6px] h-[38px] md:h-[42px]"
                        style={{ fontWeight: 700 }}
                      >
                        {isOutOfStock ? "SOLD OUT" : isAdded ? "✓ ADDED TO CART" : "ADD TO CART"}
                      </button>
                    </div>
                  </div>
                  
                  <a
                    href={`https://wa.me/917020664641?text=${encodeURIComponent(`Hi! I want to order ${product.name} (₹${product.price}). Please confirm availability.`)}`}
                    target="_blank"
                    rel="noopener"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      width: "100%",
                      background: "#25D366",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "14px 20px",
                      fontSize: "15px",
                      fontWeight: 600,
                      textDecoration: "none",
                      marginTop: "2px",
                      minHeight: "52px",
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Order on WhatsApp
                  </a>
                </div>
              </section>

              {/* Support & Trust Badges - Clean Unified Section */}
              <section className="pt-5 md:pt-6 pb-2">
                <TrustBadges compact={true} />

                {/* Customer Support Line */}
                <div className="need-help-bar mt-4">
                  <span className="help-label">Need Help?</span>
                  <div className="help-divider" />
                  <a href="https://wa.me/917020664641" target="_blank" rel="noopener noreferrer" className="group">
                    <svg className="w-5 h-5 text-[#25D366] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.878-.788-1.473-1.761-1.643-2.062-.17-.3-.018-.463.13-.611.134-.135.298-.348.446-.522.148-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                    </svg>
                    <span>WhatsApp</span>
                  </a>
                  <div className="help-divider" />
                  <a href="tel:+917020664641" className="group">
                    <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" strokeWidth={2} />
                    <span>Call Us</span>
                  </a>
                </div>
              </section>
              
              {/* Description */}
              <section className="pt-4 md:pt-6 border-t border-black/5 mt-4">
                <ProductDescription description={product.description} />
              </section>
            </div>
          </div>
        </div>

        {/* Product Reviews */}
        <div id="reviews">
          <ProductReviews product={product} />
        </div>

        {/* Related Section */}
        <section className="mt-8 md:mt-20 border-t border-black/5 pt-8 md:pt-16 pb-8 md:pb-[40px] px-4 md:px-0">
          <div className="flex justify-between items-baseline mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-serif text-primary-950 font-medium tracking-wide">You May Also Like</h2>
            <Link to="/shop" className="text-[10px] uppercase font-bold text-[#8A6A4A] hover:text-primary-950 underline underline-offset-4 tracking-[2px] transition-colors">See All</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6">
             {products
              .filter((p) => {
                if (p.isVariant || p.id === product.id) return false;
                const isSareeFamily = (cat: string) => cat === 'Sarees' || cat === 'Linen Sarees';
                if (isSareeFamily(product.category)) {
                  return isSareeFamily(p.category);
                }
                return p.category === product.category;
              })
              .sort((a, b) => {
                // Prioritize exact same category
                if (a.category === product.category && b.category !== product.category) return -1;
                if (b.category === product.category && a.category !== product.category) return 1;
                return 0;
              })
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
              <OptimizedImage src={productImages[activeImageIndex]} width={1200} alt={getImageAlt(product)} className="w-full h-full md:w-auto md:h-auto md:max-h-[90vh] object-contain md:rounded-sm md:shadow-2xl pointer-events-auto will-change-transform transform-gpu" onClick={(e: any) => e.stopPropagation()} />
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
                <OptimizedImage src={product.image} width={100} alt={getImageAlt(product)} className="w-full h-full object-cover object-top will-change-transform transform-gpu" />
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

      {/* Sticky Mobile ATC Bar */}
      {showStickyAtc && (
        <div id="sticky-atc" className="sticky-atc-bar md:hidden">
          <div className="sticky-product-info">
            <div className="sticky-product-name">
              {product.name}
            </div>
            <div className="sticky-product-price">
              {formatPrice(product.price)}
            </div>
          </div>
          <div className="flex gap-2 flex-1 justify-end ml-2">
            <button 
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="sticky-atc-btn disabled:opacity-50 disabled:cursor-not-allowed flex-1 max-w-[120px]"
            >
              {isOutOfStock ? "Sold Out" : "Cart"}
            </button>
            {!isOutOfStock && (
              <button 
                onClick={handleBuyNow}
                className="sticky-buynow-btn flex-1 max-w-[120px]"
              >
                Buy Now
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
