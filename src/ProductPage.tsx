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
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ProductDescription } from "./components/ProductDescription";
import { Link, useNavigate, useParams } from "react-router";
import { products } from "./mockData";
import { useStore } from "./store";
import { formatPrice } from "./utils";

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

  // Zoom State
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});
  const [isZoomed, setIsZoomed] = useState(false);

  const [sizeError, setSizeError] = useState(false);

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
    setActiveImageIndex(0);
    setSizeError(false);
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-3xl font-serif text-primary-950 mb-4">
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
  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];
  const hasVideo = !!product.videoUrl;
  const totalMediaLength = productImages.length + (hasVideo ? 1 : 0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 768) return;
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;

    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2.5)",
    });
  };

  const handleMouseEnter = () => !isZoomed && setIsZoomed(true);
  const handleMouseLeave = () => {
    setIsZoomed(false);
    setZoomStyle({});
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % totalMediaLength);
  };

  const prevImage = () => {
    setActiveImageIndex(
      (prev) => (prev - 1 + totalMediaLength) % totalMediaLength,
    );
  };

  const handleAddToCart = () => {
    if (isCoOrd && !selectedSize) {
      setSizeError(true);
      return;
    }

    setSizeError(false);
    addToCart(product, isCoOrd ? selectedSize : undefined, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const isWishlisted = wishlist.includes(product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-24">
        {/* Product Images Carousel */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-6 h-fit">
            {/* Main Image Carousel */}
            <div
              className="flex-1 aspect-[9/16] bg-transparent overflow-hidden relative rounded-sm group select-none cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => setIsLightboxOpen(true)}
            >
              <AnimatePresence mode="wait">
                {activeImageIndex < productImages.length ? (
                  <motion.img
                    key={activeImageIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                    src={productImages[activeImageIndex]}
                    alt={product.name}
                    className={`w-full h-full object-cover object-center transition-transform duration-300 ease-out`}
                    style={isZoomed ? zoomStyle : {}}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <motion.iframe
                    key="video"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    src={product.videoUrl}
                    className="w-full h-full border-none object-cover"
                    allow="autoplay"
                  />
                )}
              </AnimatePresence>

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
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md text-[10px] tracking-[1px] uppercase font-bold text-primary-950 flex items-center gap-2 transition-opacity hover:bg-gold-500 hover:text-white z-10"
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
                    className={`relative aspect-[9/16] flex-shrink-0 w-24 border overflow-hidden transition-all duration-500 rounded-sm ${
                      activeImageIndex === idx
                        ? "border-gold-500 ring-2 ring-gold-500/20 scale-105 z-10"
                        : "border-black/5 opacity-60 hover:opacity-100 hover:border-black/20"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
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
                    className={`relative aspect-[9/16] flex-shrink-0 w-24 border overflow-hidden transition-all duration-500 rounded-sm bg-primary-950/5 flex items-center justify-center ${
                      activeImageIndex === productImages.length
                        ? "border-gold-500 ring-2 ring-gold-500/20 scale-105 z-10"
                        : "border-black/5 opacity-60 hover:opacity-100 hover:border-black/20"
                    }`}
                  >
                    <div className="flex flex-col items-center text-primary-950/70">
                      <div className="w-8 h-8 rounded-full border border-primary-950/20 flex items-center justify-center mb-1 bg-white/50 shadow-sm">
                        <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-primary-950 border-b-[5px] border-b-transparent ml-0.5"></div>
                      </div>
                      <span className="text-[9px] uppercase tracking-[1px] font-bold text-center px-1">
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
                className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center cursor-grab active:cursor-grabbing"
                onClick={(e) => e.stopPropagation()}
              >
                {activeImageIndex < productImages.length ? (
                  <img
                    src={productImages[activeImageIndex]}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain shadow-2xl pointer-events-none"
                  />
                ) : (
                  <iframe
                    src={product.videoUrl}
                    className="w-full h-[80vh] border-none shadow-2xl bg-black"
                  ></iframe>
                )}

                <div className="absolute bottom-0 text-center w-full pb-8 pointer-events-none">
                  <h3 className="text-white text-xl font-serif mb-4 drop-shadow-md">
                    {product.name}
                  </h3>
                  <div className="flex justify-center gap-2">
                    {Array.from({ length: totalMediaLength }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-1.5 h-1.5 rounded-full transition-all shadow-sm ${activeImageIndex === idx ? "w-8 bg-white" : "bg-white/30"}`}
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
                className="bg-white w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden"
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
                        <th className="px-4 py-3 border-b border-black/5 rounded-tl-sm font-bold">
                          Size
                        </th>
                        <th className="px-4 py-3 border-b border-black/5 font-bold">
                          Bust
                        </th>
                        <th className="px-4 py-3 border-b border-black/5 font-bold">
                          Waist
                        </th>
                        <th className="px-4 py-3 border-b border-black/5 font-bold">
                          Hip
                        </th>
                        <th className="px-4 py-3 border-b border-black/5 rounded-tr-sm font-bold">
                          US Size
                        </th>
                      </tr>
                    </thead>
                    <tbody className="font-light text-primary-950/80">
                      <tr className="hover:bg-primary-50/50 transition-colors border-b border-black/5">
                        <td className="px-4 py-3 font-bold text-primary-950">
                          M
                        </td>
                        <td className="px-4 py-3">36"</td>
                        <td className="px-4 py-3">30"</td>
                        <td className="px-4 py-3">38"</td>
                        <td className="px-4 py-3">6/8</td>
                      </tr>
                      <tr className="hover:bg-primary-50/50 transition-colors border-b border-black/5">
                        <td className="px-4 py-3 font-bold text-primary-950">
                          L
                        </td>
                        <td className="px-4 py-3">38"</td>
                        <td className="px-4 py-3">32"</td>
                        <td className="px-4 py-3">40"</td>
                        <td className="px-4 py-3">10</td>
                      </tr>
                      <tr className="hover:bg-primary-50/50 transition-colors border-b border-black/5">
                        <td className="px-4 py-3 font-bold text-primary-950">
                          XL
                        </td>
                        <td className="px-4 py-3">40"</td>
                        <td className="px-4 py-3">34"</td>
                        <td className="px-4 py-3">42"</td>
                        <td className="px-4 py-3">12</td>
                      </tr>
                      <tr className="hover:bg-primary-50/50 transition-colors border-b border-black/5">
                        <td className="px-4 py-3 font-bold text-primary-950">
                          XXL
                        </td>
                        <td className="px-4 py-3">42"</td>
                        <td className="px-4 py-3">36"</td>
                        <td className="px-4 py-3">44"</td>
                        <td className="px-4 py-3">14</td>
                      </tr>
                      <tr className="hover:bg-primary-50/50 transition-colors border-b border-black/5">
                        <td className="px-4 py-3 font-bold text-primary-950">
                          XXXL
                        </td>
                        <td className="px-4 py-3">44"</td>
                        <td className="px-4 py-3">38"</td>
                        <td className="px-4 py-3">46"</td>
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
          <div className="mb-6 border-b border-black/5 pb-6">
            <h1 className="text-3xl md:text-[40px] font-serif text-primary-950 mb-3 leading-tight font-normal">
              {product.name}
            </h1>
            {product.sku && (
              <p className="text-[10px] tracking-[1px] uppercase text-primary-950/50 mb-4">
                SKU: {product.sku}
              </p>
            )}

            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center gap-3">
                {product.originalPrice && (
                  <span className="text-xl text-primary-950/40 line-through font-light">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                <span className="text-3xl font-bold text-primary-950">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-[12px] font-bold text-[#E53935] bg-[#E53935]/10 px-2 py-1 rounded-sm tracking-[1px] uppercase">
                    {Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100,
                    )}
                    % OFF
                  </span>
                )}
              </div>

              {product.originalPrice && product.category === "Co-Ord Sets" && (
                <div className="bg-[#FAF9F6] border border-gold-500/20 rounded-md p-3 mt-2 inline-block w-fit">
                  <p className="text-[12px] font-bold text-primary-950 mb-1">
                    🎉 Extra ₹100 OFF on Prepaid Orders
                  </p>
                  <p className="text-[13px] text-primary-950">
                    Pay just{" "}
                    <span className="font-bold text-gold-600">
                      ₹{product.price - 100}
                    </span>{" "}
                    (Total{" "}
                    {Math.round(
                      ((product.originalPrice - (product.price - 100)) /
                        product.originalPrice) *
                        100,
                    )}
                    % OFF)
                  </p>
                  <p className="text-[10px] text-primary-950/60 mt-2 font-medium italic">
                    Prepaid orders get faster dispatch 🚀
                  </p>
                </div>
              )}
              {product.originalPrice && product.category === "Sarees" && (
                <div className="bg-[#FAF9F6] border border-gold-500/20 rounded-md p-3 mt-2 inline-block w-fit">
                  <p className="text-[12px] font-bold text-primary-950 mb-1">
                    🎉 Flat 50% OFF
                  </p>
                  <p className="text-[13px] text-primary-950">
                    Apply coupon{" "}
                    <span className="font-bold text-gold-600">FIRST100</span> at
                    checkout to save extra ₹100
                  </p>
                </div>
              )}
            </div>

            <p className="text-[10px] tracking-[1px] uppercase text-primary-950/50">
              Inclusive of all taxes
            </p>
          </div>

          <div className="mb-8">
            <ProductDescription
              description={product.description}
              className="text-[14px]"
            />
          </div>

          {isCoOrd && (
            <div className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] uppercase tracking-[2px] text-primary-950/50">
                  Select Size{" "}
                  {sizeError && (
                    <span className="text-red-500 ml-2 font-bold normal-case tracking-normal text-[11px]">
                      * Required
                    </span>
                  )}
                </span>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-[10px] uppercase tracking-[1px] flex items-center text-gold-500 hover:text-gold-600 transition-colors"
                >
                  <Info size={12} className="mr-1" /> Size Guide
                </button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 border text-[11px] tracking-[1px] transition-colors
                      ${
                        selectedSize === size
                          ? "border-primary-950 bg-primary-950 text-white"
                          : "border-black/10 text-primary-950 hover:border-gold-500 hover:text-gold-500"
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="mb-10">
            <span className="text-[10px] uppercase tracking-[2px] text-primary-950/50 block mb-4">
              Quantity
            </span>
            <div className="flex items-center border border-black/10 w-32 h-12">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-full flex items-center justify-center text-primary-950 hover:text-gold-500 transition-colors"
              >
                -
              </button>
              <div className="flex-1 text-center text-[13px] font-bold text-primary-950">
                {quantity}
              </div>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-full flex items-center justify-center text-primary-950 hover:text-gold-500 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-4 mt-auto">
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-4 px-8 text-[11px] tracking-[2px] uppercase transition-colors border shadow-md font-bold ${
                isAdded
                  ? "bg-transparent border-primary-950 text-primary-950"
                  : "bg-primary-950 border-primary-950 text-white hover:bg-gold-600 hover:border-gold-600"
              }`}
            >
              {isAdded ? "Added to Cart" : "Add to Cart"}
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              className="px-6 border border-black/10 flex items-center justify-center text-primary-950 hover:border-gold-500 hover:text-gold-500 transition-colors"
            >
              <Heart
                size={18}
                strokeWidth={1.5}
                className={isWishlisted ? "fill-gold-500 text-gold-500" : ""}
              />
            </button>
          </div>

          <button
            onClick={() => {
              handleAddToCart();
              if (!isCoOrd || (isCoOrd && selectedSize)) {
                navigate("/checkout");
              }
            }}
            className="w-full mt-4 py-4 px-8 border border-primary-950 text-primary-950 text-[11px] tracking-[2px] uppercase hover:bg-primary-950 hover:text-white transition-colors font-bold"
          >
            Buy It Now
          </button>

          {/* Trust Elements */}
          <div className="bg-[#FAF9F6] border border-black/5 rounded-md p-4 mt-6">
            <div className="grid grid-cols-2 gap-y-3 text-[12px] text-primary-950/80 font-medium tracking-wide">
              <div className="flex items-center gap-2">
                <span className="text-green-600 text-base">✔️</span> COD
                Available
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600 text-base">✔️</span> Easy
                Returns
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600 text-base">✔️</span> Premium
                Fabric
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600 text-base">✔️</span> 1000+ Happy
                Customers
              </div>
            </div>
          </div>

          {/* Features Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 pt-8 border-t border-black/5">
            <div className="flex flex-col gap-2">
              <Truck size={18} className="text-gold-500" strokeWidth={1.5} />
              <div>
                <div className="text-[10px] tracking-[1px] uppercase text-primary-950 font-bold">
                  Fast Delivery
                </div>
                <div className="text-[9px] text-primary-950/50 mt-1 uppercase">
                  Prepaid Orders
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Shield size={18} className="text-gold-500" strokeWidth={1.5} />
              <div>
                <div className="text-[10px] tracking-[1px] uppercase text-primary-950 font-bold">
                  COD AVAILABLE
                </div>
                <div className="text-[9px] text-primary-950/50 mt-1 uppercase">
                  Pay on Delivery
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <RefreshCw
                size={18}
                className="text-gold-500"
                strokeWidth={1.5}
              />
              <div>
                <div className="text-[10px] tracking-[1px] uppercase text-primary-950 font-bold">
                  Easy Returns
                </div>
                <div className="text-[9px] text-primary-950/50 mt-1 uppercase">
                  7 Day Window
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Star size={18} className="text-gold-500" strokeWidth={1.5} />
              <div>
                <div className="text-[10px] tracking-[1px] uppercase text-primary-950 font-bold">
                  LEGACY SHOP
                </div>
                <div className="text-[9px] text-primary-950/50 mt-1 uppercase">
                  SINCE 1976
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <section className="pt-24 border-t border-black/5">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-[10px] tracking-[4px] uppercase text-gold-500 mb-3 font-bold">
              You may also like
            </h2>
            <h3 className="text-2xl md:text-3xl font-serif text-primary-950">
              Complete the Look
            </h3>
          </div>
          <Link
            to="/shop"
            className="text-[10px] tracking-[2px] uppercase text-primary-950/40 hover:text-gold-500 transition-colors font-bold border-b border-primary-950/10 pb-1"
          >
            View All Shop
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
          {products
            .filter(
              (p) =>
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
                  <div className="aspect-[9/16] bg-transparent overflow-hidden mb-4 rounded-sm">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <h4 className="text-[12px] md:text-[13px] font-sans text-primary-950/80 mb-1 group-hover:text-gold-500 transition-colors line-clamp-1">
                    {relatedProduct.name}
                  </h4>
                  <div className="flex flex-col mt-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[13px] font-bold text-primary-950">
                        {formatPrice(relatedProduct.price)}
                      </span>
                      {relatedProduct.originalPrice && (
                        <>
                          <span className="text-[11px] text-primary-950/40 line-through">
                            {formatPrice(relatedProduct.originalPrice)}
                          </span>
                          <span className="text-[9px] font-bold text-[#E53935] bg-[#E53935]/10 px-1 py-0.5 rounded-sm">
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
    </div>
  );
}
