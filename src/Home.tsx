import { Link } from "react-router";
import { useState, useRef } from "react";
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
import { type Product, useStore } from "./store";
import { formatPrice, optimizeImage } from "./utils";
import { trackAddToCart } from "./tracking";

export default function Home() {
  const mainProducts = products.filter(p => !p.isVariant);
  const trendingProducts = mainProducts.filter((p) => p.isTrending).slice(0, 2);
  const trendingIds = new Set(trendingProducts.map((p) => p.id));
  const newArrivalsProductsList = [...mainProducts]
    .reverse()
    .filter((p) => p.isNew && !trendingIds.has(p.id));
  // If there are less than 2 new arrivals, fill with other non-trending products to make sure we show 2
  const newArrivals =
    newArrivalsProductsList.length >= 2
      ? newArrivalsProductsList.slice(0, 2)
      : [
          ...newArrivalsProductsList,
          ...mainProducts.filter(
            (p) =>
              !trendingIds.has(p.id) &&
              !newArrivalsProductsList.find((n) => n.id === p.id),
          ),
        ].slice(0, 2);

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
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[85vh] md:h-[90vh] min-h-[600px] md:min-h-[750px] bg-primary-50 flex items-center overflow-hidden">
        {/* Background Image - Adjusted for clarity and positioning */}
        <motion.div
          className="absolute inset-0 w-full h-full z-0 overflow-hidden"
          style={{ y: heroImageY }}
        >
          <img
            src="https://lh3.googleusercontent.com/d/1NmruXVYozTPtYyuyipddgCODomwUd2me"
            alt="Luxury Indian Fashion"
            fetchPriority="high"
            loading="eager"
            className="w-full h-full object-cover object-center lg:object-[center_20%]"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Improved overlays for higher clarity - professional luxury grade */}
        <div className="absolute inset-0 bg-black/20 z-0 pointer-events-none md:bg-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/10 to-transparent w-full md:w-[65%] z-0 pointer-events-none hidden md:block" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent md:hidden z-0 pointer-events-none" />

        {/* Content - Repositioned to cover less of the image */}
        <motion.div
          className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 w-full flex flex-col justify-end md:justify-center h-full pb-32 md:pb-0"
          style={{ opacity: heroTextOpacity, y: heroTextY }}
        >
          <div className="max-w-lg md:max-w-xl">
            {/* Main Heading - Refined size and spacing */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-[32px] md:text-[42px] lg:text-[56px] font-serif text-white mb-4 leading-[1.2] font-normal drop-shadow-lg"
            >
              Luxury Co-ord Sets <br className="hidden md:block" />& Sarees at{" "}
              <span className="text-gold-500 font-bold drop-shadow-none">50% OFF</span>
            </motion.h1>

            {/* Subheading - More compact */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-[16px] sm:text-[18px] leading-relaxed text-white/95 mb-8 max-w-sm font-sans font-medium drop-shadow-md"
            >
              Premium quality. Trusted since 1976. Limited time deal.
            </motion.p>

            {/* Buttons - Elegant styling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/shop"
                className="bg-gold-500 text-white text-[12px] tracking-[2px] uppercase px-10 py-4 text-center rounded-sm transition-all hover:bg-gold-600 font-bold shadow-xl shadow-gold-500/30"
              >
                Shop Collection
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-20"
          style={{ opacity: heroTextOpacity }}
          onClick={() => {
            const nextSection = document.getElementById("next-section");
            if (nextSection) {
              const y =
                nextSection.getBoundingClientRect().top + window.scrollY;
              window.scrollTo({
                top: y,
                behavior: "smooth",
              });
            } else {
              window.scrollTo({
                top: window.innerHeight * 0.9,
                behavior: "smooth",
              });
            }
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <span className="text-white/70 text-[9px] uppercase tracking-[3px]">
            Scroll Down
          </span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ChevronDown className="text-white/70 w-4 h-4" />
          </motion.div>
        </motion.div>
      </section>

      {/* Trust Badge Strip */}
      <section
        id="next-section"
        className="bg-primary-50 py-8 border-b border-black/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 text-center">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-gold-500" strokeWidth={1.5} />
              <span className="text-[10px] uppercase tracking-[1px] text-primary-950/70 font-medium">
                Premium Quality
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-gold-500" strokeWidth={1.5} />
              <span className="text-[10px] uppercase tracking-[1px] text-primary-950/70 font-medium">
                Fast Delivery
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck
                className="w-4 h-4 text-gold-500"
                strokeWidth={1.5}
              />
              <span className="text-[10px] uppercase tracking-[1px] text-primary-950/70 font-medium">
                COD Available
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5">
              <span className="text-[11px] uppercase tracking-[1px] text-primary-950/70 font-medium">
                Legacy Since 1976
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-24 md:py-32 bg-primary-50 border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-baseline mb-12">
            <h2 className="text-2xl md:text-3xl font-serif text-primary-950 font-normal">
              Shop by Category
            </h2>
            <Link
              to="/shop"
              className="text-[11px] uppercase text-gold-500 tracking-[1px] hover:text-gold-600 transition-colors font-medium"
            >
              View All Collection
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Co-Ord Sets - Main Focus */}
            <Link
              to="/shop?category=Co-Ord Sets"
              className="lg:col-span-7 xl:col-span-8 relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden group rounded-sm"
            >
              <div className="absolute inset-0">
                <img
                  src="https://drive.google.com/thumbnail?id=1_PdNfAScYuOrr_cA0e6TZQdAlSCvzZ8M&sz=w800"
                  alt="Co-Ord Sets"
                  loading="lazy"
                  className="w-full h-full object-cover object-center lg:object-[center_20%] group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 via-primary-950/30 to-transparent"></div>
              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                <div className="text-2xl md:text-3xl font-serif mb-3 text-white drop-shadow-md">
                  Co-Ord Sets
                </div>
                <div className="text-[12px] md:text-[14px] font-sans font-light tracking-[1px] text-white/90 mb-2 drop-shadow-md">
                  Best Sellers ✨ Flat 50% OFF
                </div>
                <div className="text-[14px] font-sans font-bold text-gold-400 mb-6 drop-shadow-md">
                  Starting at ₹995
                </div>
                <div>
                  <span className="inline-block bg-gold-500 text-white px-8 py-3 text-[11px] tracking-[2px] uppercase hover:bg-gold-600 transition-colors rounded-sm font-bold shadow-md shadow-gold-500/20">
                    Shop Now
                  </span>
                </div>
              </div>
            </Link>

            {/* Sarees - Secondary */}
            <Link
              to="/shop?category=Sarees"
              className="lg:col-span-5 xl:col-span-4 relative h-[450px] md:h-[550px] overflow-hidden group rounded-sm"
            >
              <div className="absolute inset-0">
                <img
                  src="https://drive.google.com/thumbnail?id=1u0O4RqmNHGbiS3cksJDjixD4wzwkYpfw&sz=w800"
                  alt="Sarees"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 via-primary-950/20 to-transparent"></div>
              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                <div className="text-2xl md:text-3xl font-serif mb-3 text-white">
                  Sarees
                </div>
                <div className="text-[12px] md:text-[14px] font-sans font-light tracking-[1px] text-white/90 mb-2 drop-shadow-sm">
                  Premium Quality ✨ Flat 50% OFF
                </div>
                <div className="text-[14px] font-sans font-bold text-gold-400 mb-6 drop-shadow-sm">
                  Starting at ₹649
                </div>
                <div>
                  <span className="inline-block bg-gold-500 text-white px-8 py-3 text-[11px] tracking-[2px] uppercase hover:bg-gold-600 transition-colors rounded-sm font-bold shadow-md shadow-gold-500/20">
                    Shop Now
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-16 md:py-24 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center md:text-left flex flex-col md:flex-row justify-between items-center md:items-baseline mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif text-primary-950 font-normal flex items-center justify-center md:justify-start gap-2">
                Trending Now
                <span className="text-[12px] bg-gold-500/10 text-gold-600 px-2 py-0.5 rounded-sm font-semibold tracking-wide uppercase font-sans">Selling Fast</span>
              </h2>
            </div>
            <Link
              to="/shop?sort=trending"
              className="hidden md:block text-[11px] uppercase border-b border-gold-500 text-gold-500 tracking-[1px] hover:text-gold-600 transition-colors pb-0.5 mt-4 md:mt-0"
            >
              View Collection
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 md:gap-16 max-w-3xl mx-auto">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/shop?sort=trending"
              className="inline-block bg-gold-500 text-white rounded-sm shadow-md shadow-gold-500/20 hover:bg-gold-600 hover:shadow-lg hover:shadow-gold-500/30 px-10 py-3.5 text-[11px] tracking-[2px] uppercase transition-all font-bold"
            >
              Shop Top Sellers
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-16 md:py-24 bg-primary-50 border-t border-black/5 relative">
        <div className="absolute top-0 left-0 right-0 bg-primary-700 text-white text-[10px] md:text-[11px] uppercase tracking-[2px] text-center py-2 font-bold shadow-sm">
          🔥 Limited Time deal — Stock is running out fast
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 md:mt-12">
          <div className="text-center md:text-left flex flex-col md:flex-row justify-between items-center md:items-baseline mb-10">
            <h2 className="text-2xl md:text-3xl font-serif text-primary-950 font-normal">
              Fresh Styles Just Dropped
            </h2>
            <Link
              to="/shop?sort=new"
              className="hidden md:block text-[11px] uppercase border-b border-gold-500 text-gold-500 tracking-[1px] hover:text-gold-600 transition-colors pb-0.5 mt-4 md:mt-0"
            >
              Shop New Arrivals
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 md:gap-16 max-w-3xl mx-auto">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/shop?sort=new"
              className="inline-block border border-gold-500 text-gold-600 rounded-sm hover:bg-gold-50 px-10 py-3.5 text-[11px] tracking-[2px] uppercase transition-all font-bold"
            >
              Shop New Arrivals
            </Link>
          </div>
        </div>
      </section>

      {/* Offer Banner */}
      <section className="py-20 bg-primary-100 text-primary-950 text-center border-t border-black/5 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1583391733958-d25e07fac04f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            alt="Fabric Texture"
            loading="lazy"
            className="w-full h-full object-cover opacity-20 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-50/90 to-primary-100/90"></div>
        </div>
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <div className="text-[10px] tracking-[3px] uppercase text-gold-600 mb-4 font-bold">
            Limited Time Deal
          </div>
          <h2 className="text-2xl md:text-3xl font-serif text-primary-950 mb-6 font-normal">
            Luxury Styles at Flat 50% OFF
          </h2>
          <p className="text-sm opacity-80 mb-8 font-medium max-w-lg mx-auto text-primary-700">
            Discover our curated selection of premium fabrics and silhouettes
            crafted for elegance. Don't miss out on our biggest sale of the season.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-gold-500 text-white rounded-sm shadow-md shadow-gold-500/20 hover:bg-gold-600 hover:shadow-lg hover:shadow-gold-500/30 px-10 py-3.5 text-[11px] tracking-[2px] uppercase transition-all font-bold"
          >
            Shop Collection
          </Link>
        </div>
      </section>

      {/* Experience Our Store Section */}
      <section className="py-24 md:py-32 bg-primary-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-[10px] tracking-[3px] uppercase text-gold-500 mb-4 font-medium italic">
              Visit Us
            </div>
            <h2 className="text-2xl md:text-3xl font-serif text-primary-950 mb-6 font-normal">
              Experience Luxury In-Person
            </h2>
            <p className="text-[14px] text-primary-950/60 max-w-xl mx-auto font-light leading-relaxed">
              Step into the world of Mukesh Saree Centre. Our flagship store in
              Nagpur offers an exquisite collection of handpicked sarees and
              modern ensembles in an ambiance of timeless heritage.
            </p>
          </div>

          <div className="relative group">
            {/* Navigation Buttons */}
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
                  <img
                    src={image.url}
                    alt={image.label}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2
                      size={32}
                      className="text-white drop-shadow-lg"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-all duration-300 flex flex-col justify-end p-10 transform translate-y-4 group-hover/item:translate-y-0">
                    <p className="text-gold-400 text-[10px] uppercase tracking-[3px] font-medium mb-2">
                      Exclusive Preview
                    </p>
                    <h3 className="text-white text-2xl font-serif mb-1 font-normal">
                      {image.label}
                    </h3>
                    <p className="text-white/60 text-[11px] uppercase tracking-[1px] font-light">
                      Explore our designer collections in person
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Custom Scroll Progress Bar */}
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
              <img
                src={selectedShopImage}
                alt="Store Full View"
                className="max-w-full max-h-[85vh] object-contain rounded-sm"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple Product Card Component for Home Page
function ProductCard({ product }: { product: Product; key?: string }) {
  const { addToCart } = useStore();
  const [isAdded, setIsAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, product.category === 'Co-Ord Sets' ? 'M' : undefined, 1);
    
    trackAddToCart(product);

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 3000);
  };

  // Generate random stats for social proof based on product id
  const idHash = product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const rating = 4.5 + (idHash % 5) * 0.1;
  const soldCount = 50 + (idHash % 100);
  const stockLeft = 2 + (idHash % 8);

  return (
    <Link 
      to={`/product/${product.slug}`} 
      className="group flex flex-col h-full"
      onMouseEnter={() => {
        const img = new Image();
        img.src = optimizeImage(product.image, 800);
      }}
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-transparent mb-3 flex items-center justify-center rounded-sm">
        <img
          src={optimizeImage(product.image, 600)}
          srcSet={`${optimizeImage(product.image, 300)} 300w, ${optimizeImage(product.image, 600)} 600w, ${optimizeImage(product.image, 900)} 900w`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isTrending && (
            <span className="bg-gold-500 text-white text-[9px] px-2 py-1 tracking-[1px] uppercase rounded-sm font-bold shadow-sm">
              Bestseller
            </span>
          )}
          {product.isNew && !product.isTrending && (
            <span className="bg-primary-50 border border-black/5 text-primary-950 text-[9px] px-2 py-1 tracking-[2px] uppercase rounded-sm font-bold shadow-sm">
              New Arrival
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10 w-[90%] md:w-auto justify-center pointer-events-none">
           <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full whitespace-nowrap flex items-center shadow-md">
             <span className="text-[10px] font-bold text-primary-700 uppercase tracking-[0.5px]">🔥 Only {stockLeft} left - Selling Fast</span>
           </div>
        </div>
        
        <AnimatePresence>
          {isAdded && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-20 left-4 right-4 bg-primary-950 text-white text-[10px] text-center py-2.5 rounded-sm uppercase tracking-wider shadow-xl z-20 pointer-events-none font-medium"
            >
              Added to cart
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Add Button removed from overlay */}
      </div>
      <div className="text-center px-1 flex-grow flex flex-col mt-2">
        <h3 className="font-serif text-[15px] sm:text-[16px] text-primary-950 mb-1 line-clamp-1 font-medium tracking-wide group-hover:text-gold-500 transition-colors">
          {product.name}
        </h3>
        {product.sku && (
          <p className="text-[10px] text-primary-950/50 mb-2 font-mono uppercase tracking-wider">
            SKU: {product.sku}
          </p>
        )}
        
        <div className="flex flex-col items-center justify-center mt-auto gap-1.5">
          <div className="flex items-center justify-center space-x-2">
            <span className="font-bold text-[18px] text-primary-950 leading-none">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-[13px] text-primary-950/40 line-through leading-none decoration-primary-950/30">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          {product.originalPrice && (
             <div className="inline-flex items-center text-[11px] tracking-[1px] font-bold text-gold-600 bg-gold-600/5 border border-gold-600/20 px-2 py-0.5 rounded-sm uppercase">
               FLAT {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
             </div>
          )}
          
          {product.colorVariants && product.colorVariants.length > 0 && (
            <div className="flex justify-center gap-1.5 mt-2">
              {product.colorVariants.map((variant) => (
                <div 
                  key={variant.slug} 
                  title={variant.color}
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = `/product/${variant.slug}`;
                  }}
                  className={`w-4 h-4 rounded-full overflow-hidden border transition-colors hover:scale-110 ${variant.slug === product.slug ? 'border-primary-950' : 'border-black/20 hover:border-gold-500'}`}
                >
                  <img src={optimizeImage(variant.image, 50)} alt={variant.color} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={handleQuickAdd}
          className={`w-full mt-3 py-2 text-[11px] uppercase tracking-[1px] font-bold transition-colors border rounded-sm ${
            isAdded ? 'bg-primary-950 text-white border-primary-950' : 'bg-transparent text-primary-950 border-primary-900/20 hover:bg-gold-500 hover:text-white hover:border-gold-500'
          }`}
        >
          {isAdded ? 'Added ✓' : 'Add to Bag'}
        </button>
      </div>
    </Link>
  );
}
