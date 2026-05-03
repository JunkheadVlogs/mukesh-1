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
  X,
  Maximize2,
  MessageCircle,
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

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.slug === slug);
  const { addToCart, toggleWishlist, wishlist } = useStore();

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [isAdded, setIsAdded] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});
  const [sizeError, setSizeError] = useState(false);
  
  // Synchronous state reset on navigation to prevent old state flashing
  const [currentSlug, setCurrentSlug] = useState(slug);
  if (slug !== currentSlug) {
    setCurrentSlug(slug);
    setActiveImageIndex(0);
    setSizeError(false);
    setIsLightboxOpen(false);
    setIsZoomed(false);
    setSelectedSize("");
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

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-serif text-primary-950 mb-4">
          Product Not Found
        </h2>
        <Link to="/shop" className="text-gold-500 hover:underline">
          Return to Shop
        </Link>
      </div>
    );
  }

  const isCoOrd = product.category === "Co-Ord Sets";
  const sizes = product.availableSizes || ["M", "L", "XL", "XXL", "XXXL"];
  
  const hasDiscount = product.category === "Co-Ord Sets" || (product.originalPrice && product.category === "Sarees");
  const finalPrice = hasDiscount ? product.price - 100 : product.price;

  const productImages =
    product.images && product.images.length > 0
      ? [...product.images]
      : [product.image];
  const hasVideo = !!product.videoUrl;
  const totalMediaLength = productImages.length + (hasVideo ? 1 : 0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 768 || !isZoomed) return;
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;

    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2.5)",
    });
  };

  const handleToggleZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 768) return;
    if (isZoomed) {
      setIsZoomed(false);
      setZoomStyle({ transform: "scale(1)" });
    } else {
      setIsZoomed(true);
      const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
      const x = ((e.pageX - left - window.scrollX) / width) * 100;
      const y = ((e.pageY - top - window.scrollY) / height) * 100;
      setZoomStyle({
        transformOrigin: `${x}% ${y}%`,
        transform: "scale(2.5)",
      });
    }
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
    setZoomStyle({ transform: "scale(1)" });
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % totalMediaLength);
  };

  const prevImage = () => {
    setActiveImageIndex(
      (prev) => (prev - 1 + totalMediaLength) % totalMediaLength,
    );
  };

  const handleAddToCart = (): boolean => {
    if (isCoOrd && !selectedSize) {
      setSizeError(true);
      sizeSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }

    setSizeError(false);
    addToCart(product, isCoOrd ? selectedSize : undefined, quantity);
    trackAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
    return true;
  };

  const isWishlisted = wishlist.includes(product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 pb-32 md:pb-24">
      {/* Breadcrumbs */}
      <nav
        className="flex text-[10px] tracking-[1px] uppercase text-primary-950/50 mb-10"
        aria-label="Breadcrumb"
      >
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/" className="hover:text-gold-500 transition-colors">
              Home
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2">/</span>
              <Link
                to={`/shop?category=${product.category}`}
                className="hover:text-gold-500 transition-colors"
              >
                {product.category}
              </Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2">/</span>
              <span
                className="text-primary-950 font-medium"
                aria-current="page"
              >
                {product.name}
              </span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 mb-32">
        {/* Product Images Carousel */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-6 h-fit">
            
            {/* Preload all gallery images for instant switching */}
            <div style={{ display: 'none' }}>
              {productImages.map((img, idx) => (
                <img key={`gallery-preload-${idx}`} src={optimizeImage(img, 800)} alt="preload" />
              ))}
            </div>

            {/* Main Image Carousel */}
            <div
              className={`flex-1 aspect-[2/3] bg-transparent overflow-hidden relative rounded-sm group select-none ${isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`}
              onMouseMove={handleMouseMove}
              onClick={handleToggleZoom}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLightboxOpen(true);
                }}
                className="absolute top-4 right-4 z-20 bg-white/80 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                aria-label="Open fullscreen"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
              </button>
              <div className="w-full h-full relative bg-primary-50">
                {activeImageIndex < productImages.length ? (
                  <img
                    src={optimizeImage(productImages[activeImageIndex], 800)}
                    srcSet={`${optimizeImage(productImages[activeImageIndex], 400)} 400w, ${optimizeImage(productImages[activeImageIndex], 800)} 800w, ${optimizeImage(productImages[activeImageIndex], 1200)} 1200w`}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    fetchPriority="high"
                    loading="eager"
                    alt={product.name}
                    className="w-full h-full object-cover object-center"
                    style={isZoomed ? zoomStyle : {}}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <iframe
                    key={`video-${product.id}`}
                    src={product.videoUrl}
                    className="w-full h-full border-none object-cover"
                    allow="autoplay"
                  />
                )}
              </div>

              {/* Navigation Arrows */}
              {totalMediaLength > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/90 backdrop-blur-sm shadow-md rounded-full text-primary-950 opacity-70 hover:opacity-100 transition-all hover:bg-gold-500 hover:text-white z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/90 backdrop-blur-sm shadow-md rounded-full text-primary-950 opacity-70 hover:opacity-100 transition-all hover:bg-gold-500 hover:text-white z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Enlarge Image Button */}
              <button
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md text-[10px] tracking-[1px] uppercase font-medium text-primary-950 flex items-center gap-2 transition-opacity hover:bg-gold-500 hover:text-white z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLightboxOpen(true);
                }}
                aria-label="Enlarge Image"
              >
                <Maximize2 size={14} /> Enlarge Image
              </button>

              {/* Progressive Load Indicator / Skeleton shim can go here */}
            </div>

            {/* Thumbnails Below Image */}
            {totalMediaLength > 1 && (
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 px-1">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative aspect-[2/3] flex-shrink-0 w-24 border overflow-hidden transition-all duration-500 rounded-sm ${
                      activeImageIndex === idx
                        ? "border-gold-500 ring-2 ring-gold-500/20 scale-105 z-10"
                        : "border-black/5 opacity-60 hover:opacity-100 hover:border-black/20"
                    }`}
                  >
                    <img
                      src={optimizeImage(img, 200)}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    {activeImageIndex === idx && (
                      <div className="absolute inset-0 bg-gold-500/5" />
                    )}
                  </button>
                ))}
                {hasVideo && (
                  <button
                    onClick={() => setActiveImageIndex(productImages.length)}
                    className={`relative aspect-[2/3] flex-shrink-0 w-24 border overflow-hidden transition-all duration-500 rounded-sm bg-primary-950/5 flex items-center justify-center ${
                      activeImageIndex === productImages.length
                        ? "border-gold-500 ring-2 ring-gold-500/20 scale-105 z-10"
                        : "border-black/5 opacity-60 hover:opacity-100 hover:border-black/20"
                    }`}
                  >
                    <div className="flex flex-col items-center text-primary-950/70">
                      <div className="w-8 h-8 rounded-full border border-primary-950/20 flex items-center justify-center mb-1 bg-white/50 shadow-sm">
                        <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-primary-950 border-b-[5px] border-b-transparent ml-0.5"></div>
                      </div>
                      <span className="text-[9px] uppercase tracking-[1px] font-medium text-center px-1">
                        Video
                      </span>
                    </div>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Lightbox for Zoom */}
        <AnimatePresence>
          {isLightboxOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-primary-950/98 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12"
              onClick={() => setIsLightboxOpen(false)}
            >
              <button
                className="fixed top-4 right-4 md:top-8 md:right-8 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-colors z-50 pointer-events-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLightboxOpen(false);
                }}
                aria-label="Close"
              >
                <X size={28} />
              </button>

              <motion.div
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={1}
                onDragEnd={(e, info) => {
                  if (Math.abs(info.offset.y) > 100) {
                    setIsLightboxOpen(false);
                  }
                }}
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 100, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative max-w-5xl w-full h-[80vh] flex flex-col items-center justify-center cursor-grab active:cursor-grabbing"
                onClick={(e) => e.stopPropagation()}
              >
                {activeImageIndex < productImages.length ? (
                  <div 
                    className={`relative w-full h-full flex items-center justify-center overflow-hidden ${isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`}
                    onMouseMove={handleMouseMove}
                    onClick={handleToggleZoom}
                    onMouseLeave={handleMouseLeave}
                  >
                    <img
                      src={optimizeImage(productImages[activeImageIndex], 1200)}
                      alt={product.name}
                      loading="lazy"
                      className="max-w-full max-h-full object-contain shadow-2xl transition-transform duration-300 pointer-events-none"
                      style={isZoomed ? zoomStyle : {}}
                    />
                  </div>
                ) : (
                  <iframe
                    src={product.videoUrl}
                    className="w-full h-full border-none shadow-2xl bg-black"
                  ></iframe>
                )}

                <div className="absolute bottom-0 text-center w-full pb-8 pointer-events-none">
                  <h3 className="text-white text-xl font-serif mb-4 drop-shadow-md">
                    {product.name.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim()}
                  </h3>
                  <div className="flex justify-center gap-2">
                    {Array.from({ length: totalMediaLength }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-1.5 h-1.5 rounded-full transition-all shadow-sm ${activeImageIndex === idx ? "w-8 bg-primary-50" : "bg-white/30"}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Navigation in Lightbox */}
              {totalMediaLength > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-colors pointer-events-auto"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={28} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-colors pointer-events-auto"
                    aria-label="Next image"
                  >
                    <ChevronRight size={28} />
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Size Guide Modal */}
        <AnimatePresence>
          {isSizeGuideOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-primary-950/80 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setIsSizeGuideOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-primary-50 w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden"
              >
                <div className="flex justify-between items-center p-6 border-b border-black/5 bg-primary-50/50">
                  <h3 className="text-xl font-serif text-primary-950">
                    Size Reference Guide
                  </h3>
                  <button
                    onClick={() => setIsSizeGuideOpen(false)}
                    className="text-primary-950/40 hover:text-primary-950 transition-colors"
                  >
                    <ChevronDown size={24} className="rotate-45" />
                  </button>
                </div>
                <div className="p-6 md:p-8 overflow-x-auto">
                  <p className="text-sm text-primary-950/80 mb-6 font-light">
                    Measurements are provided in inches. For co-ord sets, the
                    top and bottom pieces are designed to fit the corresponding
                    body measurements.
                  </p>
                  <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="text-[10px] uppercase tracking-[2px] text-primary-950/50 bg-primary-50">
                      <tr>
                        <th className="px-4 py-3 border-b border-black/5 rounded-tl-sm font-medium">
                          Size
                        </th>
                        <th className="px-4 py-3 border-b border-black/5 font-medium">
                          Bust
                        </th>
                        <th className="px-4 py-3 border-b border-black/5 font-medium">
                          Waist
                        </th>
                        <th className="px-4 py-3 border-b border-black/5 font-medium">
                          Hip
                        </th>
                        <th className="px-4 py-3 border-b border-black/5 font-medium">
                          Pant Length
                        </th>
                        <th className="px-4 py-3 border-b border-black/5 rounded-tr-sm font-medium">
                          US Size
                        </th>
                      </tr>
                    </thead>
                    <tbody className="font-light text-primary-950/80">
                      <tr className="hover:bg-primary-50/50 transition-colors border-b border-black/5">
                        <td className="px-4 py-3 font-medium text-primary-950">
                          M
                        </td>
                        <td className="px-4 py-3">36"</td>
                        <td className="px-4 py-3">30"</td>
                        <td className="px-4 py-3">38"</td>
                        <td className="px-4 py-3">38"</td>
                        <td className="px-4 py-3">6/8</td>
                      </tr>
                      <tr className="hover:bg-primary-50/50 transition-colors border-b border-black/5">
                        <td className="px-4 py-3 font-medium text-primary-950">
                          L
                        </td>
                        <td className="px-4 py-3">38"</td>
                        <td className="px-4 py-3">32"</td>
                        <td className="px-4 py-3">40"</td>
                        <td className="px-4 py-3">38.5"</td>
                        <td className="px-4 py-3">10</td>
                      </tr>
                      <tr className="hover:bg-primary-50/50 transition-colors border-b border-black/5">
                        <td className="px-4 py-3 font-medium text-primary-950">
                          XL
                        </td>
                        <td className="px-4 py-3">40"</td>
                        <td className="px-4 py-3">34"</td>
                        <td className="px-4 py-3">42"</td>
                        <td className="px-4 py-3">39"</td>
                        <td className="px-4 py-3">12</td>
                      </tr>
                      <tr className="hover:bg-primary-50/50 transition-colors border-b border-black/5">
                        <td className="px-4 py-3 font-medium text-primary-950">
                          XXL
                        </td>
                        <td className="px-4 py-3">42"</td>
                        <td className="px-4 py-3">36"</td>
                        <td className="px-4 py-3">44"</td>
                        <td className="px-4 py-3">39.5"</td>
                        <td className="px-4 py-3">14</td>
                      </tr>
                      <tr className="hover:bg-primary-50/50 transition-colors border-b border-black/5">
                        <td className="px-4 py-3 font-medium text-primary-950">
                          XXXL
                        </td>
                        <td className="px-4 py-3">44"</td>
                        <td className="px-4 py-3">38"</td>
                        <td className="px-4 py-3">46"</td>
                        <td className="px-4 py-3">40"</td>
                        <td className="px-4 py-3">16</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Details */}
        <div className="flex flex-col pt-4">
          <div className="mb-6">
            <div className="text-[10px] md:text-[11px] uppercase tracking-[3px] text-gold-500 mb-2 font-bold bg-gold-50 inline-block px-2 py-1.5 rounded-sm border border-gold-100">
               {product.category === 'Co-Ord Sets' ? 'Signature Collection' : 'Premium Handpicked'}
            </div>

            {/* 1. Title */}
            <h1 className="text-[28px] md:text-[36px] font-serif text-primary-950 mt-1 mb-2 leading-[1.15] tracking-wide font-normal">
              {product.name.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim()}
            </h1>

            {product.sku && (
              <p className="text-[12px] text-primary-950/50 mb-3 font-mono uppercase tracking-wider">
                SKU: {product.sku}
              </p>
            )}

            <div className="text-[12px] uppercase tracking-[2px] text-primary-950/60 font-bold mb-4 flex items-center gap-2">
               <span>{product.fabric || "Premium Fabric"}</span>
               <span className="w-1 h-1 rounded-full bg-gold-400"></span>
               <span>{product.color || "Exclusive Hue"}</span>
            </div>
            
            {product.tagline && (
              <p className="text-[15px] text-primary-950/70 mb-4 whitespace-pre-line">{product.tagline}</p>
            )}
            
            {/* 3. Price & COD */}
            <div className="flex flex-col gap-2 mb-6">
              <div className="flex items-center flex-wrap gap-2 text-primary-900">
                {product.originalPrice && (
                  <span className="text-[10px] font-medium text-gold-600 bg-gold-600/10 px-1.5 py-0.5 rounded-sm tracking-[1px] uppercase">
                    {Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100,
                    )}
                    % OFF
                  </span>
                )}
                
                {hasDiscount && (
                  <span className="text-[10px] font-medium text-gold-600 bg-gold-600/10 px-1.5 py-0.5 rounded-sm tracking-[1px] uppercase">
                    EXTRA ₹100 OFF ON PREPAID
                  </span>
                )}
                
                {(hasDiscount || product.originalPrice) && (
                  <span className="text-[15px] font-medium text-primary-950/40 mx-1">→</span>
                )}
                
                {product.originalPrice ? (
                  <>
                    <span className="text-[15px] text-primary-950/40 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="text-[15px] font-medium text-primary-950/40 mx-1">→</span>
                    {hasDiscount && (
                      <>
                        <span className="text-[15px] text-primary-950/40 line-through">
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-[15px] font-medium text-primary-950/40 mx-1">→</span>
                      </>
                    )}
                  </>
                ) : hasDiscount ? (
                  <>
                    <span className="text-[15px] text-primary-950/40 line-through">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-[15px] font-medium text-primary-950/40 mx-1">→</span>
                  </>
                ) : null}

                <span className="text-[22px] font-medium">
                  {formatPrice(finalPrice)}
                </span>
              </div>
              <span className="text-[13px] font-medium text-gold-600">✓ COD Available</span>
            </div>

            {/* Color Variations */}
            {product.colorVariants && product.colorVariants.length > 0 && (
              <div className="mb-8">
                {/* Preload variant images silently in background for instant navigation */}
                <div style={{ display: 'none' }}>
                  {product.colorVariants.map((variant) => (
                    <img key={`preload-${variant.slug}`} src={optimizeImage(variant.image, 800)} alt="preload" />
                  ))}
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[13px] font-bold tracking-[0.5px] text-primary-950 uppercase">
                    Color: <span className="text-primary-950/50 font-medium ml-1">{(product.color || "Variant").split(' ')[0]}</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.colorVariants.map((variant) => (
                    <Link
                      key={variant.slug}
                      to={`/product/${variant.slug}`}
                      className={`group flex rounded-md p-0.5 border transition-all duration-300 ${
                        variant.slug === slug
                          ? "border-primary-950 bg-white shadow-sm"
                          : "border-transparent hover:border-black/20"
                      }`}
                      title={variant.color}
                    >
                      <div className="w-10 h-14 sm:w-12 sm:h-16 overflow-hidden rounded-sm bg-primary-50 border border-black/5">
                        <img
                          src={optimizeImage(variant.image, 100)}
                          alt={variant.color}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Size Selection */}
            {isCoOrd && (
              <motion.div 
                className="mb-6 p-5 rounded-md transition-all duration-300 border border-black/5 bg-primary-50/30"
                ref={sizeSectionRef}
                animate={sizeError ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[14px] font-medium text-primary-950">
                    Select your size
                  </span>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-[10px] uppercase tracking-[1px] flex items-center text-gold-500 hover:text-gold-600 transition-colors bg-gold-500/10 px-2 py-1 rounded"
                  >
                    <Info size={12} className="mr-1" /> Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                     <button
                       key={size}
                       onClick={() => {
                         setSelectedSize(size);
                         setSizeError(false);
                       }}
                       className={`min-w-[48px] px-4 py-2 border text-[12px] font-normal tracking-[0.5px] transition-colors duration-300
                         ${
                           selectedSize === size
                             ? "border-primary-950 bg-stone-50 text-primary-950"
                             : "border-gray-200 text-gray-600 bg-primary-50 hover:border-gray-300"
                         }`}
                     >
                       {size}
                     </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 5. CTA Button & Quantity */}
            <div className="flex flex-col gap-2 mb-8">
              <div className="flex gap-3 h-12">
                <div className="hidden sm:flex items-center border border-black/10 w-28 h-full bg-primary-50 rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-full flex items-center justify-center text-primary-950 hover:text-gold-500 transition-colors"
                  >
                    -
                  </button>
                  <div className="flex-1 text-center text-[13px] font-medium text-primary-950">
                    {quantity}
                  </div>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-full flex items-center justify-center text-primary-950 hover:text-gold-500 transition-colors"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => {
                    if (handleAddToCart()) {
                      navigate("/checkout");
                    }
                  }}
                  className={`flex-1 h-full px-8 text-[12px] uppercase transition-colors border shadow-sm font-medium flex flex-col items-center justify-center rounded ${
                    isAdded
                      ? "bg-transparent border-primary-950 text-primary-950"
                      : "bg-primary-950 border-primary-950 text-white hover:bg-gold-600 hover:border-gold-600"
                  }`}
                >
                  <span className="leading-tight">{isAdded ? "Added to Cart" : `Order Now - Only ${formatPrice(finalPrice)} (Limited Stock)`}</span>
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="w-14 h-full border border-black/10 flex items-center justify-center text-primary-950 hover:border-gold-500 hover:text-gold-500 transition-colors bg-primary-50 rounded"
                  title="Add to Wishlist"
                >
                  <Heart
                    size={18}
                    strokeWidth={1.5}
                    className={isWishlisted ? "fill-gold-500 text-gold-500" : ""}
                  />
                </button>
              </div>
            </div>

            {/* 6. Urgency */}
            <div className="mb-6 flex items-center text-primary-950 text-[13px] font-normal">
              <span className="text-base leading-none mr-2">⏳</span> Only few pieces available today
            </div>

            {/* 7. Offer Box */}
            {hasDiscount && (
              <div className="mb-6 flex items-center text-primary-950 text-[13px] font-normal">
                <span className="text-base leading-none mr-2">👉</span> Auto discount applied at checkout
              </div>
            )}
          </div>

          {/* Trust Elements */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-5 text-[13px] text-primary-950 font-normal">
            <span className="flex items-center gap-1.5">✅ 7 Days Easy Returns</span>
            <span className="flex items-center gap-1.5">🚚 Cash on Delivery Available</span>
            <span className="flex items-center gap-1.5">🔒 Secure Checkout</span>
          </div>

            {/* 9 & 10. Bullet Points & Description */}
            <div className="pt-8 border-t border-black/5 mt-8">
              <ProductDescription
                description={product.description}
                className="text-[14px]"
              />
            </div>
        </div>
      </div>

      {/* Related Products Section */}
      <section className="pt-24 border-t border-black/5">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-[10px] tracking-[4px] uppercase text-gold-500 mb-3 font-medium">
              You may also like
            </h2>
            <h3 className="text-2xl md:text-3xl font-serif text-primary-950">
              Complete the Look
            </h3>
          </div>
          <Link
            to="/shop"
            className="text-[10px] tracking-[2px] uppercase text-primary-950/40 hover:text-gold-500 transition-colors font-medium border-b border-primary-950/10 pb-1"
          >
            View All Shop
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
          {products
            .filter(
              (p) =>
                !p.isVariant &&
                p.id !== product.id &&
                (p.category === product.category ||
                  p.fabric === product.fabric),
            )
            .slice(0, 4)
            .map((relatedProduct) => (
              <motion.div
                key={relatedProduct.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link to={`/product/${relatedProduct.slug}`} className="block">
                  <div className="aspect-[2/3] bg-transparent overflow-hidden mb-4 rounded-sm">
                    <img
                      src={optimizeImage(relatedProduct.image, 400)}
                      srcSet={`${optimizeImage(relatedProduct.image, 300)} 300w, ${optimizeImage(relatedProduct.image, 600)} 600w, ${optimizeImage(relatedProduct.image, 900)} 900w`}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      alt={relatedProduct.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                  </div>
                  <h4 className="text-[12px] md:text-[13px] font-sans text-primary-950/80 mb-1 group-hover:text-gold-500 transition-colors line-clamp-1">
                    {relatedProduct.name}
                  </h4>
                  <div className="flex flex-col mt-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[13px] font-medium text-primary-950">
                        {formatPrice(relatedProduct.price)}
                      </span>
                      {relatedProduct.originalPrice && (
                        <>
                          <span className="text-[11px] text-primary-950/40 line-through">
                            {formatPrice(relatedProduct.originalPrice)}
                          </span>
                          <span className="text-[9px] font-medium text-gold-600 bg-gold-600/10 px-1 py-0.5 rounded-sm">
                            {Math.round(
                              ((relatedProduct.originalPrice -
                                relatedProduct.price) /
                                relatedProduct.originalPrice) *
                                100,
                            )}
                            % OFF
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
        </div>
      </section>

      {/* Sticky Mobile Buy Button */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-2.5 px-4 bg-primary-50 border-t border-black/10 z-50 pb-[env(safe-area-inset-bottom,12px)] shadow-[0_-4px_15px_-5px_rgba(0,0,0,0.1)]">
        <button
          onClick={() => {
            if (handleAddToCart()) {
              navigate("/checkout");
            }
          }}
          className="w-full bg-primary-950 text-white py-2.5 px-8 shadow-sm hover:bg-gold-600 transition-colors flex flex-col items-center justify-center tracking-wide leading-tight rounded"
        >
          <span className="text-[12px] font-medium">Order Now - Only {formatPrice(finalPrice)} (Limited Stock)</span>
        </button>
      </div>
    </div>
  );
}
