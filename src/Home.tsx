import { Link } from "react-router";
import { useState, useRef } from "react";
import { ProductCard } from "./components/ProductCard";
import { SEO } from "./components/SEO";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  Star,
  ShieldCheck,
  Truck,
  Clock,
  Heart,
  ChevronDown,
  X,
  Maximize2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { products } from "./mockData";
import { type Product } from "./store";
import { formatPrice, optimizeImage } from "./utils";
import { OptimizedImage } from "./components/OptimizedImage";

export default function Home() {
  const mainProducts = products.filter((p) => !p.isVariant);
  const trendingProducts = mainProducts.filter((p) => p.isTrending).slice(0, 4);
  const trendingIds = new Set(trendingProducts.map((p) => p.id));
  const newArrivalsProductsList = [...mainProducts]
    .reverse()
    .filter((p) => p.isNew && !trendingIds.has(p.id));
  // If there are less than 4 new arrivals, fill with other non-trending products to make sure we show 4
  const newArrivals =
    newArrivalsProductsList.length >= 4
      ? newArrivalsProductsList.slice(0, 4)
      : [
          ...newArrivalsProductsList,
          ...mainProducts.filter(
            (p) =>
              !trendingIds.has(p.id) &&
              !newArrivalsProductsList.find((n) => n.id === p.id),
          ),
        ].slice(0, 4);

  const [selectedShopImage, setSelectedShopImage] = useState<string | null>(
    null,
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  const shopImages = [
    {
      url: "https://lh3.googleusercontent.com/d/1IFI6HR5__1CmmWFj2SOU9dRZkJL3oSRU",
      label: "Main Shop Entrance",
    },
    {
      url: "https://lh3.googleusercontent.com/d/1BkjTW2c9Lp0KUQH337w7boQtrXmrnHDl",
      label: "Billing Counter",
    },
    {
      url: "https://lh3.googleusercontent.com/d/1ANZwb_MyHYzwJE8otCzY2DiwvkU_N7T4",
      label: "Saree Section",
    },
    {
      url: "https://lh3.googleusercontent.com/d/1gjPnofLFUOXMAbD4gowCAi_3ie36HJmp",
      label: "Lehenga Section",
    },
  ];

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth > 768 ? 600 : 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const { scrollY } = useScroll();
  const heroTextOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroTextY = useTransform(scrollY, [0, 300], [0, 50]);
  const heroOverlayOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroImageY = useTransform(scrollY, [0, 800], [0, 150]);

  return (
    <div className="flex flex-col">
      <SEO
        title="Mukesh Saree Centre – Premium Silk Sarees Since 1976"
        description="Shop luxury silk sarees and co-ord sets at Mukesh Saree Centre. Premium fabrics, trusted since 1976. Hurry, limited-time offers on premium collections!"
        url="/"
      />
      
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] md:h-[75vh] min-h-[500px] md:min-h-[600px] bg-primary-50 flex items-center overflow-hidden">
        <motion.div
          className="absolute inset-0 w-full h-full z-0 overflow-hidden"
          style={{ y: heroImageY }}
        >
          <OptimizedImage
            src="https://lh3.googleusercontent.com/d/1NmruXVYozTPtYyuyipddgCODomwUd2me"
            width={1600}
            alt="Hero Exhibition"
            priority={true}
            className="w-full h-full object-cover object-center lg:object-[center_20%]"
          />
        </motion.div>
        
        <div className="absolute inset-0 bg-black/10 z-0 pointer-events-none md:bg-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950/80 via-primary-950/30 to-transparent w-full md:w-[75%] z-0 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 via-transparent to-transparent md:hidden z-0 pointer-events-none" />

        <motion.div
          className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 w-full flex flex-col justify-end md:justify-center h-full pb-20 md:pb-0"
          style={{ opacity: heroTextOpacity, y: heroTextY }}
        >
          <div className="max-w-lg md:max-w-xl text-left">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-[40px] md:text-[56px] lg:text-[72px] font-serif text-white mb-6 leading-[1.1] font-normal tracking-wide drop-shadow-sm"
            >
              The Luxury <br className="hidden md:block" /> Edit
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-[15px] sm:text-[17px] leading-[1.8] text-white/90 mb-10 max-w-md font-sans font-light tracking-wide"
            >
              Discover our exclusive collection of premium silk sarees and sophisticated co-ord sets, crafted for timeless elegance.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/shop" className="btn-primary w-fit px-12">
                Discover Styles
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-20"
          style={{ opacity: heroTextOpacity }}
          onClick={() => {
            const nextSec = document.getElementById("next-section");
            if (nextSec) {
              const rect = nextSec.getBoundingClientRect();
              window.scrollTo({ top: rect.top + window.scrollY, behavior: "smooth" });
            }
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <span className="text-white/70 text-[9px] uppercase tracking-[3px]">Scroll Down</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ChevronDown className="text-white/70 w-4 h-4" />
          </motion.div>
        </motion.div>
      </section>

      {/* Trust Badge Strip */}
      <section id="next-section" className="bg-white py-4 border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 text-center">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-gold-500" strokeWidth={1.5} />
              <span className="text-[10px] uppercase tracking-[1px] text-primary-950/70 font-medium">Premium Quality</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-gold-500" strokeWidth={1.5} />
              <span className="text-[10px] uppercase tracking-[1px] text-primary-950/70 font-medium">Fast Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold-500" strokeWidth={1.5} />
              <span className="text-[10px] uppercase tracking-[1px] text-primary-950/70 font-medium">COD Available</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5">
              <span className="text-[11px] uppercase tracking-[1px] text-primary-950/70 font-medium">Since 1976 Legacy</span>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="bg-primary-50 border-b border-black/5" style={{ paddingTop: "50px", paddingBottom: "40px" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-baseline mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-serif text-primary-950 font-semibold tracking-[1px]">Shop by Category</h2>
            <Link
              to="/shop"
              className="text-[11px] uppercase text-gold-500 tracking-[1px] hover:text-gold-600 transition-colors font-medium"
            >
              View All Collection
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <Link to="/shop?category=Co-Ord Sets" className="lg:col-span-7 xl:col-span-8 relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden group rounded-sm">
              <div className="absolute inset-0">
                <OptimizedImage
                  src="https://drive.google.com/thumbnail?id=1_PdNfAScYuOrr_cA0e6TZQdAlSCvzZ8M&sz=w800"
                  width={800}
                  alt="Co-Ord Sets"
                  className="w-full h-full object-cover object-center lg:object-[center_20%] group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 via-primary-950/30 to-transparent" />
              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                <h3 className="text-2xl md:text-3xl font-serif mb-1 text-white drop-shadow-md font-semibold tracking-[1px]">Co-Ord Sets</h3>
                <div className="text-[12px] md:text-[14px] font-sans font-light tracking-[1px] text-white/90 mb-0.5 drop-shadow-md">Best Sellers | <span className="font-discount font-black">50% OFF</span></div>
                <div className="text-[14px] font-sans font-bold text-gold-400 mb-3 drop-shadow-md">Starting at ₹995</div>
                <div>
                  <span className="btn-primary">Shop Now</span>
                </div>
              </div>
            </Link>

            <Link to="/shop?category=Sarees" className="lg:col-span-5 xl:col-span-4 relative h-[450px] md:h-[550px] overflow-hidden group rounded-sm">
              <div className="absolute inset-0">
                <OptimizedImage
                  src="https://drive.google.com/thumbnail?id=1u0O4RqmNHGbiS3cksJDjixD4wzwkYpfw&sz=w800"
                  width={800}
                  alt="Sarees"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 via-primary-950/20 to-transparent" />
              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                <h3 className="text-2xl md:text-3xl font-serif mb-1 text-white font-semibold tracking-[1px]">Sarees</h3>
                <div className="text-[12px] md:text-[14px] font-sans font-light tracking-[1px] text-white/90 mb-0.5 drop-shadow-sm">Premium Quality | <span className="font-discount font-black">50% OFF</span></div>
                <div className="text-[14px] font-sans font-bold text-gold-400 mb-3 drop-shadow-sm">Starting at ₹649</div>
                <div>
                  <span className="btn-primary">Shop Now</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="bg-primary-100/50" style={{ paddingTop: "40px", paddingBottom: "30px" }}>
        <div className="mobile-container sm:max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="text-center md:text-left flex flex-col md:flex-row justify-between items-center md:items-baseline mb-6 md:mb-8 px-4 sm:px-0">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif text-primary-950 font-semibold tracking-[1px] flex items-center justify-center md:justify-start gap-2">
                Trending Now
              </h2>
            </div>
            <Link
              to="/shop?sort=trending"
              className="hidden md:block text-[11px] uppercase border-b border-gold-500 text-gold-500 tracking-[1px] hover:text-gold-600 transition-colors pb-0.5 mt-4 md:mt-0"
            >
              View Collection
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6 w-full mx-auto">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center" style={{ marginTop: "20px" }}>
            <Link
              to="/shop?sort=trending"
              className="btn-primary"
            >
              Shop Top Sellers
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="bg-white relative" style={{ paddingTop: "40px", paddingBottom: "30px" }}>
        <div className="mobile-container sm:max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="text-center md:text-left flex flex-col md:flex-row justify-between items-center md:items-baseline mb-6 md:mb-8 px-4 sm:px-0">
            <h2 className="text-2xl md:text-3xl font-serif text-primary-950 font-semibold tracking-[1px]">Fresh Styles Just Dropped</h2>
            <Link
              to="/shop?sort=new"
              className="hidden md:block text-[11px] uppercase border-b border-gold-500 text-gold-500 tracking-[1px] hover:text-gold-600 transition-colors pb-0.5 mt-4 md:mt-0"
            >
              Shop New Arrivals
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6 w-full mx-auto">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center" style={{ marginTop: "20px" }}>
            <Link
              to="/shop?sort=new"
              className="btn-secondary"
            >
              Shop New Arrivals
            </Link>
          </div>
        </div>
      </section>

      {/* Offer Banner */}
      <section className="bg-primary-100 text-primary-950 text-center relative overflow-hidden shadow-inner" style={{ paddingTop: "40px", paddingBottom: "30px", minHeight: "auto" }}>
        <div 
          className="absolute inset-0 z-0 opacity-[0.15] mix-blend-multiply"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1583391733958-d25e07fac04f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        />
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <div className="text-[11px] tracking-[3px] uppercase text-gold-600 mb-6 font-semibold">Signature Collection</div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-primary-950 mb-6 font-normal tracking-wide leading-tight">Premium Collections<br className="hidden md:block" /> at 50% OFF</h2>
          <p className="text-[15px] opacity-80 font-light max-w-lg mx-auto text-primary-900 leading-[1.8]" style={{ marginBottom: "20px" }}>
            Discover our curated selection of premium fabrics and silhouettes crafted for elegance. Don't miss out on our most exclusive event of the season.
          </p>
          <div className="text-center" style={{ marginTop: "20px" }}>
            <Link
              to="/shop"
              className="btn-primary px-10"
            >
              Shop Luxury Edit
            </Link>
          </div>
        </div>
      </section>

      {/* Experience Store Section */}
      <section className="bg-primary-50 overflow-hidden" style={{ paddingTop: "40px", paddingBottom: "30px" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="text-[10px] tracking-[3px] uppercase text-gold-500 mb-4 font-medium italic">Visit Us</div>
            <h2 className="text-2xl md:text-3xl font-serif text-primary-950 mb-6 font-semibold tracking-[1px]">Experience Luxury In-Person</h2>
            <p className="text-[14px] text-primary-950/60 max-w-xl mx-auto font-light leading-relaxed">
              Step into the world of Mukesh Saree Centre. Our flagship store in Nagpur offers an exquisite collection of handpicked sarees and modern ensembles in an ambiance of timeless heritage.
            </p>
          </div>

          <div className="relative group">
            <div className="absolute top-1/2 -translate-y-1/2 left-2 md:-left-4 z-10">
              <button
                onClick={() => scroll("left")}
                className="bg-white/90 backdrop-blur-sm p-2 md:p-3 rounded-full shadow-lg text-primary-950 hover:bg-gold-500 hover:text-white transition-all transform hover:scale-110 active:scale-95"
                aria-label="Scroll Left"
              >
                <ChevronLeft size={window.innerWidth > 768 ? 24 : 18} />
              </button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-2 md:-right-4 z-10">
              <button
                onClick={() => scroll("right")}
                className="bg-white/90 backdrop-blur-sm p-2 md:p-3 rounded-full shadow-lg text-primary-950 hover:bg-gold-500 hover:text-white transition-all transform hover:scale-110 active:scale-95"
                aria-label="Scroll Right"
              >
                <ChevronRight size={window.innerWidth > 768 ? 24 : 18} />
              </button>
            </div>

            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto pb-12 snap-x snap-mandatory scrollbar-hide no-scrollbar h-[450px] md:h-[550px]"
            >
              {shopImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex-none w-[80%] md:w-[650px] h-full relative overflow-hidden group/item rounded-sm shadow-xl cursor-zoom-in snap-center"
                  onClick={() => setSelectedShopImage(image.url)}
                >
                  <OptimizedImage
                    src={image.url}
                    width={800}
                    alt={image.label}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2 size={32} className="text-white drop-shadow-lg" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-all duration-300 flex flex-col justify-end p-10 transform translate-y-4 group-hover/item:translate-y-0">
                    <p className="text-gold-400 text-[10px] uppercase tracking-[3px] font-medium mb-2">Exclusive Preview</p>
                    <h3 className="text-white text-2xl font-serif mb-1 font-normal">{image.label}</h3>
                    <p className="text-white/60 text-[11px] uppercase tracking-[1px] font-light">Explore our designer collections in person</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1.5 h-[2px]">
              {shopImages.map((_, i) => (
                <div
                  key={i}
                  className="flex-1 max-w-[60px] bg-primary-950/5 relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gold-500"
                    initial={{ translateX: "-100%" }}
                    whileInView={{ translateX: "0%" }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.5 + i * 0.1,
                      duration: 1.2,
                      ease: "easeOut",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedShopImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-primary-950/95 backdrop-blur-md"
            onClick={() => setSelectedShopImage(null)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-[101]"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedShopImage(null);
              }}
            >
              <X size={32} strokeWidth={1.5} />
            </motion.button>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-full max-h-full aspect-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <OptimizedImage
                src={selectedShopImage}
                width={1600}
                alt="Store View"
                className="max-w-full max-h-[85vh] object-contain rounded-sm"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
