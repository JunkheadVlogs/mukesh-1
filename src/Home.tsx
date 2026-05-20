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
import { TrustBadges } from "./components/TrustBadges";

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
        title="Mukesh Saree Centre — Buy Sarees, Lehengas & Ethnic Wear Online | Since 1978"
        description="Shop premium Indian ethnic wear at Mukesh Saree Centre, Nagpur. Authentic sarees, designer lehengas, readymade suits. COD available. Free shipping on all orders. Trusted since 1978."
        url="/"
        schema={{
          "@context": "https://schema.org",
          "@type": "ClothingStore",
          name: "Mukesh Saree Centre",
          url: "https://mukeshsarees.com",
          logo: "https://drive.google.com/thumbnail?id=1rXEc_ve9qXelBQakWWVGcm4ffvbGF4yT&sz=w1000",
          foundingDate: "1978",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Jagnath Road",
            addressLocality: "Nagpur",
            addressRegion: "Maharashtra",
            addressCountry: "IN",
          },
          telephone: "+917020664641",
          sameAs: ["https://www.facebook.com/Mukeshsareesindia"],
        }}
      />

      {/* Hero Section */}
      <section className="relative w-full h-[85vh] md:h-[90vh] bg-[#1A0A00] flex items-center overflow-hidden">
        <motion.div
          className="absolute inset-0 w-full h-full z-0 overflow-hidden"
          style={{ y: heroImageY }}
        >
          <OptimizedImage
            src="https://lh3.googleusercontent.com/d/1NmruXVYozTPtYyuyipddgCODomwUd2me"
            width={1600}
            height={1000}
            alt="Hero Exhibition"
            priority={true}
            className="w-full h-full object-cover object-[center_top] md:object-[center_top] opacity-95 transition-opacity duration-700"
          />
        </motion.div>

        {/* Cinematic gradient overlay */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(16,8,0,0.9) 0%, rgba(16,8,0,0.5) 30%, rgba(16,8,0,0.1) 60%, transparent 100%)",
          }}
        />

        <motion.div
          className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 w-full flex flex-col justify-end items-center h-full pb-20 md:pb-32"
          style={{ opacity: heroTextOpacity, y: heroTextY }}
        >
          <div className="max-w-[300px] sm:max-w-md md:max-w-xl text-center mx-auto mb-4 md:mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-[34px] sm:text-[44px] md:text-[56px] lg:text-[72px] font-serif mb-3 md:mb-4 leading-[1.1] font-normal tracking-widest uppercase"
              style={{
                textShadow: "0 2px 20px rgba(0,0,0,0.6)",
                color: "#FFFDF8",
              }}
            >
              The Luxury Edit
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-[11px] sm:text-[13px] md:text-[15px] leading-[1.8] mb-24 md:mb-36 max-w-[200px] md:max-w-[340px] font-sans font-light tracking-[0.1em] mx-auto uppercase opacity-90"
              style={{
                textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                color: "#F5EFE6",
              }}
            >
              Minimalist Styles. Timeless Elegance.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex justify-center"
            >
              <Link
                to="/shop"
                className="btn-hero-white w-[180px] md:w-[220px] tracking-[0.2em] text-[10px] md:text-[11px]"
              >
                DISCOVER STYLES
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer z-20 p-4"
          style={{ opacity: heroTextOpacity }}
          onClick={() => {
            const nextSec = document.getElementById("next-section");
            if (nextSec) {
              const rect = nextSec.getBoundingClientRect();
              window.scrollTo({
                top: rect.top + window.scrollY - 80,
                behavior: "smooth",
              });
            }
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ChevronDown className="text-white/90 w-5 h-5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" />
          </motion.div>
        </motion.div>
      </section>

      {/* Trust Badge Strip */}
      <section id="next-section">
        <TrustBadges />
      </section>

      {/* Shop by Category */}
      <section className="bg-primary-50 py-6 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-baseline mb-6 md:mb-10">
            <h2 className="text-3xl md:text-4xl font-serif text-primary-950 tracking-wide font-normal">
              Shop by Category
            </h2>
            <Link
              to="/shop"
              className="text-[12px] uppercase text-gold-500 tracking-[0.15em] hover:text-gold-600 transition-colors font-medium"
            >
              View Collection
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            <Link
              to="/shop?category=Co-Ord Sets"
              className="lg:col-span-7 xl:col-span-8 relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden group rounded-none"
            >
              <div className="absolute inset-0">
                <OptimizedImage
                  src="https://drive.google.com/thumbnail?id=1_PdNfAScYuOrr_cA0e6TZQdAlSCvzZ8M&sz=w800"
                  width={800}
                  alt="Co-Ord Sets"
                  className="w-full h-full object-cover object-center lg:object-[center_20%] group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                <h3 className="text-2xl md:text-3xl font-serif mb-2 text-white font-semibold tracking-wide" style={{ color: "#ffffff", textShadow: "0 2px 10px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,0.85), 0 0 1px rgba(0,0,0,0.95)" }}>
                  Co-Ord Sets
                </h3>
                <div className="text-[13px] md:text-[14px] font-sans font-normal tracking-wide text-white mb-1" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.85)" }}>
                  Best Sellers |{" "}
                  <span className="font-discount font-semibold">50% OFF</span>
                </div>
                <div className="text-[14px] font-sans font-semibold text-[var(--color-gold-light)] mb-4" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.85)" }}>
                  Starting at ₹995
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-widest text-white border-b border-white pb-1 group-hover:text-[var(--color-gold-light)] group-hover:border-[var(--color-gold-light)] transition-colors" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.85)" }}>
                    Explore Collection
                  </span>
                </div>
              </div>
            </Link>

            <Link
              to="/shop?category=Sarees"
              className="lg:col-span-5 xl:col-span-4 relative h-[450px] md:h-[550px] overflow-hidden group rounded-none"
            >
              <div className="absolute inset-0">
                <OptimizedImage
                  src="https://drive.google.com/thumbnail?id=1u0O4RqmNHGbiS3cksJDjixD4wzwkYpfw&sz=w800"
                  width={800}
                  alt="Sarees"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                <h3 className="text-2xl md:text-3xl font-serif mb-2 text-white font-semibold tracking-wide" style={{ color: "#ffffff", textShadow: "0 2px 10px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,0.85), 0 0 1px rgba(0,0,0,0.95)" }}>
                  Sarees
                </h3>
                <div className="text-[13px] md:text-[14px] font-sans font-normal tracking-wide text-white mb-1" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.85)" }}>
                  Premium Quality |{" "}
                  <span className="font-discount font-semibold">50% OFF</span>
                </div>
                <div className="text-[14px] font-sans font-semibold text-[var(--color-gold-light)] mb-4" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.85)" }}>
                  Starting at ₹649
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-widest text-white border-b border-white pb-1 group-hover:text-[var(--color-gold-light)] group-hover:border-[var(--color-gold-light)] transition-colors" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.85)" }}>
                    Explore Collection
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="bg-white py-6 md:py-12 border-t border-gold-200/30">
        <div className="px-2.5 sm:px-6 lg:px-8 sm:max-w-7xl mx-auto">
          <div className="text-center md:text-left flex flex-col md:flex-row justify-between items-center md:items-baseline mb-6 md:mb-10 px-1.5 sm:px-0">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-[var(--color-dark)] tracking-wide font-normal flex items-center justify-center md:justify-start gap-2">
                Trending Now
              </h2>
            </div>
            <Link
              to="/shop?sort=trending"
              className="hidden md:block text-[12px] uppercase text-[var(--color-gold)] tracking-[0.15em] hover:text-[var(--color-gold-light)] transition-colors mt-4 md:mt-0 font-medium"
            >
              View Collection
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2.5 gap-y-4 md:gap-8 w-full mx-auto">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-8 md:mt-10">
            <Link to="/shop?sort=trending" className="btn-primary">
              Shop Top Sellers
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="bg-primary-50 py-6 md:py-12 border-t border-gold-200/30">
        <div className="px-2.5 sm:px-6 lg:px-8 sm:max-w-7xl mx-auto">
          <div className="text-center md:text-left flex flex-col md:flex-row justify-between items-center md:items-baseline mb-6 md:mb-10 px-1.5 sm:px-0">
            <h2 className="text-3xl md:text-4xl font-serif text-[var(--color-dark)] font-normal tracking-wide">
              Fresh Styles Just Dropped
            </h2>
            <Link
              to="/shop?sort=new"
              className="hidden md:block text-[12px] uppercase text-[var(--color-gold)] tracking-[0.15em] hover:text-[var(--color-gold-light)] transition-colors mt-4 md:mt-0 font-medium"
            >
              Shop New Arrivals
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2.5 gap-y-4 md:gap-8 w-full mx-auto">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-8 md:mt-10">
            <Link to="/shop?sort=new" className="btn-secondary">
              Shop New Arrivals
            </Link>
          </div>
        </div>
      </section>

      {/* Offer Banner */}
      <section className="bg-[var(--color-surface)] text-[var(--color-dark)] text-center relative overflow-hidden py-6 sm:py-8 md:py-12">
        <div
          className="absolute inset-0 z-0 opacity-[0.15] mix-blend-multiply"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1583391733958-d25e07fac04f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <div className="text-[12px] tracking-[0.2em] uppercase text-[var(--color-gold)] mb-3 sm:mb-4 font-medium">
            Signature Collection
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif text-[var(--color-dark)] mb-3 sm:mb-4 font-normal tracking-wide leading-tight">
            Premium Collections
            <br className="hidden md:block" /> at 50% OFF
          </h2>
          <p className="text-[15px] opacity-90 font-light max-w-lg mx-auto text-[var(--color-dark)] leading-[1.8] mb-6 sm:mb-8">
            Discover our curated selection of premium fabrics and silhouettes
            crafted for elegance. Don't miss out on our most exclusive event of
            the season.
          </p>
          <div className="text-center mt-4 sm:mt-5 md:mt-8">
            <Link to="/shop" className="btn-primary px-10">
              Shop Luxury Edit
            </Link>
          </div>
        </div>
      </section>

      {/* Experience Store Section */}
      <section className="bg-white overflow-hidden pt-8 pb-4 md:py-12 border-t border-gold-200/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 md:mb-10">
            <div className="text-[11px] tracking-[0.2em] uppercase text-[var(--color-gold)] mb-4 font-medium">
              Visit Us
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-[var(--color-dark)] mb-6 font-normal tracking-wide">
              Experience Luxury In-Person
            </h2>
            <p className="text-[15px] text-[var(--color-dark)]/70 max-w-xl mx-auto font-light leading-[1.8]">
              Step into the world of Mukesh Saree Centre. Our flagship store in
              Nagpur offers an exquisite collection of handpicked sarees and
              modern ensembles in an ambiance of timeless heritage.
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
              className="flex gap-4 md:gap-6 overflow-x-auto pb-4 md:pb-6 snap-x snap-mandatory scrollbar-hide no-scrollbar h-[350px] md:h-[500px] touch-pan-x will-change-scroll"
            >
              {shopImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex-none w-[85%] md:w-[600px] h-full relative overflow-hidden group/item rounded-none shadow-luxury cursor-zoom-in snap-center"
                  onClick={() => setSelectedShopImage(image.url)}
                >
                  <OptimizedImage
                    src={image.url}
                    width={800}
                    alt={image.label}
                    className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2
                      size={32}
                      className="text-white drop-shadow-lg"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark)] via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-all duration-300 flex flex-col justify-end p-10 transform translate-y-4 group-hover/item:translate-y-0">
                    <p className="text-[var(--color-gold-light)] text-[11px] uppercase tracking-[0.2em] font-medium mb-3">
                      Exclusive Preview
                    </p>
                    <h3 className="text-white text-3xl font-serif mb-2 font-normal">
                      {image.label}
                    </h3>
                    <p className="text-white/80 text-[12px] font-light">
                      Explore our designer collections in person
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 h-[2px]">
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
                className="max-w-full max-h-[85vh] object-contain rounded-none shadow-luxury"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
