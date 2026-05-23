import { Link } from "react-router";
import { useState, useRef, useEffect } from "react";
import { ProductCard } from "./components/ProductCard";
import { ProductCardSkeleton } from "./components/ProductCardSkeleton";
import { SEO } from "./components/SEO";
import { LookReelCard } from "./components/LookReelCard";
import { CONFIG } from "./config";
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
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";
import { products } from "./mockData";
import { type Product } from "./store";
import { formatPrice, optimizeImage } from "./utils";
import { OptimizedImage } from "./components/OptimizedImage";
import { TrustBadges } from "./components/TrustBadges";
import { CustomerReviews } from "./components/CustomerReviews";

const LOOK_REELS = [
  {
    id: "look-1",
    youtubeId: "LU0RQIkZJIo",
    title: "Imperial Crimson",
    category: "PURE GEORGETTE BRASSO",
    subtitle: "Swarovski & Foil Details",
    badge: "🔥 Trending",
    poster: "https://img.youtube.com/vi/LU0RQIkZJIo/sddefault.jpg"
  },
  {
    id: "look-2",
    youtubeId: "PeA9Wo0na0M",
    title: "Golden Shimmer",
    category: "FOIL PRINT BRASSO",
    subtitle: "Pure Premium Zari",
    badge: "✨ Bestseller",
    poster: "https://img.youtube.com/vi/PeA9Wo0na0M/sddefault.jpg"
  },
  {
    id: "look-3",
    youtubeId: "HH2LvjF2I8A",
    title: "Midnight Swarovski",
    category: "GEORGETTE LUXURY",
    subtitle: "Intricate Stone Gracing",
    badge: "⚡ Selling Fast",
    poster: "https://img.youtube.com/vi/HH2LvjF2I8A/sddefault.jpg"
  },
  {
    id: "look-4",
    youtubeId: "xurZbnIlgzI",
    title: "Beautiful Pastel",
    category: "SWAROVSKI BRASSO",
    subtitle: "Delicate Organza Feel",
    badge: "🌟 New",
    poster: "https://img.youtube.com/vi/xurZbnIlgzI/sddefault.jpg"
  },
  {
    id: "look-5",
    youtubeId: "UAwvgHDP8lU",
    title: "Royal Blue Brasso",
    category: "PURE GEORGETTE BRASSO",
    subtitle: "Shimmering Weave borders",
    badge: "💎 Premium",
    poster: "https://img.youtube.com/vi/UAwvgHDP8lU/sddefault.jpg"
  },
  {
    id: "look-6",
    youtubeId: "p-Huv1z8MvE",
    title: "Emerald Grace",
    category: "SWAROVSKI BRACKET",
    subtitle: "Lustrous Modern Drapings",
    badge: "🔥 Hot",
    poster: "https://img.youtube.com/vi/p-Huv1z8MvE/sddefault.jpg"
  },
];

export default function Home() {
  const mainProducts = products.filter((p) => !p.isVariant);
  const trendingProductsList = mainProducts.filter((p) => p.isTrending);
  const trendingProducts =
    trendingProductsList.length >= 8
      ? trendingProductsList.slice(0, 8)
      : [
          ...trendingProductsList,
          ...mainProducts.filter((p) => !p.isTrending),
        ].slice(0, 8);

  const trendingIds = new Set(trendingProducts.map((p) => p.id));
  const newArrivalsProductsList = [...mainProducts]
    .reverse()
    .filter((p) => p.isNew && !trendingIds.has(p.id));
  // If there are less than 8 new arrivals, fill with other non-trending products to make sure we show 8
  const newArrivals =
    newArrivalsProductsList.length >= 8
      ? newArrivalsProductsList.slice(0, 8)
      : [
          ...newArrivalsProductsList,
          ...mainProducts.filter(
            (p) =>
              !trendingIds.has(p.id) &&
              !newArrivalsProductsList.find((n) => n.id === p.id),
          ),
        ].slice(0, 8);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const [selectedShopImage, setSelectedShopImage] = useState<string | null>(
    null,
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  const [reelsScrollProgress, setReelsScrollProgress] = useState(0);
  const reelsScrollRef = useRef<HTMLDivElement>(null);
  const [activeReelId, setActiveReelId] = useState<string>("look-1");

  const [visibleReelIds, setVisibleReelIds] = useState<Record<string, boolean>>({});

  const handleReelVisibilityChange = (id: string, isVisible: boolean) => {
    setVisibleReelIds((prev) => {
      if (prev[id] === isVisible) return prev;
      return { ...prev, [id]: isVisible };
    });
  };

  const visibleIndices = LOOK_REELS.map((reel, index) => visibleReelIds[reel.id] ? index : -1).filter((idx) => idx !== -1);

  const reelsScrollTick = useRef<boolean>(false);

  const handleReelsScroll = () => {
    if (!reelsScrollTick.current) {
      window.requestAnimationFrame(() => {
        performReelsScrollCalculation();
        reelsScrollTick.current = false;
      });
      reelsScrollTick.current = true;
    }
  };

  const performReelsScrollCalculation = () => {
    if (reelsScrollRef.current) {
      const container = reelsScrollRef.current;
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const totalScrollable = scrollWidth - clientWidth;
      if (totalScrollable > 0) {
        setReelsScrollProgress(scrollLeft / totalScrollable);
      }

      // Detect the card closest to the horizontal center of the viewport
      const children = container.children;
      let closestId = "look-1";
      let minDistance = Infinity;
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement;
        const reelId = child.getAttribute("data-reel-id");
        if (reelId) {
          const childRect = child.getBoundingClientRect();
          const childCenter = childRect.left + childRect.width / 2;
          const distance = Math.abs(childCenter - containerCenter);
          if (distance < minDistance) {
            minDistance = distance;
            closestId = reelId;
          }
        }
      }

      if (closestId) {
        setActiveReelId(closestId);
      }
    }
  };

  // Perform alignment calculation on window loading/resizing
  useEffect(() => {
    // Small timeout to let elements lay out properly
    const timer = setTimeout(() => {
      handleReelsScroll();
    }, 100);

    window.addEventListener("resize", handleReelsScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleReelsScroll);
    };
  }, []);

  const shopImages = [
    {
      url: "/images/main_shop_entrance.webp",
      label: "Main Shop Entrance",
    },
    {
      url: "/images/billing_counter.webp",
      label: "Billing Counter",
    },
    {
      url: "/images/saree_section.webp",
      label: "Saree Section",
    },
    {
      url: "/images/lehenga_section.webp",
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
          logo: "https://mukeshsarees.com/images/logo.webp",
          foundingDate: "1978",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Jagnath Road",
            addressLocality: "Nagpur",
            addressRegion: "Maharashtra",
            addressCountry: "IN",
          },
          telephone: CONFIG.STORE_PHONE,
          sameAs: [
            "https://www.facebook.com/Mukeshsareesindia/",
            "https://www.instagram.com/mukeshsarees_nagpur",
            "https://www.pinterest.com/MukeshSareesdotcom/",
            "https://youtube.com/@mukeshsarees?si=aMljrBMnIJYQDGDI"
          ],
        }}
      />

      {/* Hero Section */}
      <section className="relative w-full h-[85vh] md:h-[90vh] bg-[#1A0A00] flex items-center overflow-hidden">
        <motion.div
          className="absolute inset-0 w-full h-full z-0 overflow-hidden"
          style={{ y: heroImageY }}
        >
          <OptimizedImage
            src="/images/hero_exhibition.webp"
            width={1600}
            height={1000}
            alt="Hero Exhibition"
            priority={true}
            className="w-full h-full object-cover object-[72%_bottom] md:object-bottom opacity-100 transition-opacity duration-700"
          />
        </motion.div>

        {/* Cinematic gradient overlay */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(16,8,0,0.22) 0%, rgba(16,8,0,0.06) 45%, transparent 80%), linear-gradient(to top, rgba(16,8,0,0.12) 0%, transparent 30%)",
          }}
        />

        <motion.div
          className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 w-full flex flex-col justify-start items-start h-full pt-[105px] xs:pt-[115px] sm:pt-36 md:pt-40 lg:pt-44 pb-12"
          style={{ opacity: heroTextOpacity, y: heroTextY }}
        >
          <div className="max-w-[160px] xs:max-w-[185px] sm:max-w-[340px] md:max-w-[420px] lg:max-w-[500px] text-left mb-4 md:mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-[17px] xs:text-[19px] sm:text-[30px] md:text-[38px] lg:text-[45px] font-serif mb-3 md:mb-4 leading-[1.3] sm:leading-[1.2] font-normal tracking-[0.14em] sm:tracking-[0.12em] uppercase"
              style={{
                textShadow: "0 2px 20px rgba(0,0,0,0.6)",
                color: "#FFFDF8",
              }}
            >
              Explore Our <br className="block sm:hidden" />Premium Sarees
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-[9.5px] xs:text-[10px] sm:text-[13px] md:text-[15px] leading-[1.8] mb-10 md:mb-12 max-w-[150px] xs:max-w-[175px] sm:max-w-[300px] md:max-w-[360px] lg:max-w-[420px] font-sans font-light tracking-[0.12em] uppercase opacity-90"
              style={{
                textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                color: "#F5EFE6",
              }}
            >
              Beautiful Designs. Trusted Quality.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex justify-start"
            >
              <Link
                to="/shop"
                className="btn-hero-white w-[145px] xs:w-[160px] sm:w-[220px] tracking-[0.2em] text-[9.5px] md:text-[11px]"
              >
                SHOP NOW
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

      {/* Shop by Category */}
      <section id="next-section" className="bg-primary-50 py-4 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-baseline mb-3 md:mb-6">
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
              className="lg:col-span-7 xl:col-span-8 relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden group rounded-2xl"
            >
              <div className="absolute inset-0">
                <OptimizedImage
                  src="/images/category_coord_sets.webp"
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
              className="lg:col-span-5 xl:col-span-4 relative h-[450px] md:h-[550px] overflow-hidden group rounded-2xl"
            >
              <div className="absolute inset-0">
                <OptimizedImage
                  src="/images/category_sarees.webp"
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
      <section className="bg-white pt-4 md:pt-6 pb-2.5 md:pb-3 border-t border-gold-200/30">
        <div className="px-2.5 sm:px-6 lg:px-8 sm:max-w-7xl mx-auto">
          <div className="text-center md:text-left flex flex-col md:flex-row justify-between items-center md:items-baseline mb-3.5 md:mb-6 px-1.5 sm:px-0">
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
            {isLoading
              ? [...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)
              : trendingProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
          <div className="text-center mt-3 md:mt-4">
            <Link to="/shop?sort=trending" className="btn-primary">
              Shop Top Sellers
            </Link>
          </div>
        </div>
      </section>

      {/* Shop The Look Cinematic Reels Section (Temporarily Hidden) */}
      {false && (
        <section className="bg-[#FAF8F5] py-1.5 md:py-3 border-y border-[#C8A96B]/10">
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Header with improved, elegant, slightly compact premium luxury typography */}
            <div className="text-center mb-1.5 md:mb-3 animate-fade-in animate-duration-500">
              <div className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-[#C8A96B] mb-1 font-bold font-sans">
                REELS COLLECTION
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-serif text-[var(--color-dark)] mb-1 font-normal tracking-wide">
                Shop Our Latest Video Styles
              </h2>
              <p className="text-[11px] sm:text-[12px] text-[var(--color-dark)]/70 max-w-xl mx-auto font-sans font-light">
                Discover trending sarees through elegant short videos curated for modern fashion lovers.
              </p>
            </div>

            {/* Reels Carousel/Grid Wrapper with Ambient Luxury Overlays */}
            <div className="relative w-full">
              {/* Ambient edge fades for mobile immersion */}
              <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-[#FAF8F5] to-transparent z-10 pointer-events-none md:hidden" />
              <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-[#FAF8F5] to-transparent z-10 pointer-events-none md:hidden" />

              {/* Reels Carousel/Grid with snap pads */}
              <div 
                ref={reelsScrollRef}
                onScroll={handleReelsScroll}
                style={{ touchAction: 'pan-x pan-y pinch-zoom' }}
                className="flex lg:grid lg:grid-cols-3 xl:grid-cols-6 gap-5 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 snap-x snap-mandatory scroll-smooth no-scrollbar scrollbar-hide w-full tracking-wide px-10 md:px-0 scroll-px-10 md:scroll-px-0 touch-pan-x touch-pan-y"
              >
                {LOOK_REELS.map((reel, index) => {
                  return (
                    <LookReelCard
                      key={reel.id}
                      reel={reel}
                      onVisibilityChange={handleReelVisibilityChange}
                      shouldRenderIframe={true}
                      isActive={activeReelId === reel.id}
                    />
                  );
                })}
              </div>

              {/* Elegant premium swipe cue & pagination indicator underneath (mobile-only) */}
              <div className="flex items-center justify-between px-6 mt-3.5 select-none md:hidden gap-4">
                <div className="flex items-center gap-1.5 text-[8.5px] tracking-[0.18em] text-[#C8A96B]/80 font-sans uppercase font-semibold">
                  <span>Swipe to Explore</span>
                  <span className="text-[10px] animate-bounce-horizontal">→</span>
                </div>
                
                {/* Premium Slim Horizontal Progress Tracker */}
                <div className="w-16 h-[1.5px] bg-[#C8A96B]/15 rounded-full relative overflow-hidden">
                  <div 
                    className="absolute top-0 bottom-0 left-0 bg-[#C8A96B] rounded-full transition-all duration-100 ease-out"
                    style={{ 
                      width: '35%', 
                      left: `${reelsScrollProgress * 65}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals Section */}
      <section className="bg-primary-50 py-3 md:py-6 border-t border-gold-200/30">
        <div className="px-2.5 sm:px-6 lg:px-8 sm:max-w-7xl mx-auto">
          <div className="text-center md:text-left flex flex-col md:flex-row justify-between items-center md:items-baseline mb-3.5 md:mb-6 px-1.5 sm:px-0">
            <h2 className="text-3xl md:text-4xl font-serif text-[var(--color-dark)] font-normal tracking-wide">
              New Arrivals
            </h2>
            <Link
              to="/shop?sort=new"
              className="hidden md:block text-[12px] uppercase text-[var(--color-gold)] tracking-[0.15em] hover:text-[var(--color-gold-light)] transition-colors mt-4 md:mt-0 font-medium"
            >
              Shop New Arrivals
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2.5 gap-y-4 md:gap-8 w-full mx-auto">
            {isLoading
              ? [...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)
              : newArrivals.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
          <div className="text-center mt-4 md:mt-6">
            <Link to="/shop?sort=new" className="btn-secondary">
              Shop New Arrivals
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badge Strip */}
      <section className="bg-white border-t border-gold-200/30">
        <TrustBadges />
      </section>

      {/* Offer Banner */}
      <section className="bg-[var(--color-surface)] text-[var(--color-dark)] text-center relative overflow-hidden py-4 sm:py-6 md:py-10 border-t border-gold-200/30">
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
        <div className="max-w-3xl mx-auto px-4 relative z-10 w-full">
          <div className="text-[11px] tracking-[0.2em] uppercase text-[var(--color-gold)] mb-1.5 sm:mb-2 font-medium">
            Special Collection
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif text-[var(--color-dark)] mb-1.5 sm:mb-2 font-normal tracking-wide leading-tight">
            Premium Collections at 50% OFF
          </h2>
          <p className="text-[14px] sm:text-[15px] opacity-90 font-light max-w-lg mx-auto text-[var(--color-dark)] leading-normal mb-3 sm:mb-4">
            Discover our selection of beautiful fabrics and sarees made with love. Don't miss out on our special sale of the season.
          </p>
          <div className="text-center mt-3 sm:mt-4 md:mt-6">
            <Link to="/shop" className="btn-primary px-10">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Subtle Divider Before Section */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-10 lg:px-16 my-1.5 md:my-3">
        <div className="h-[1px] bg-[#C8A96B]/20" />
      </div>

      {/* Experience Store Section */}
      <section className="bg-white overflow-hidden py-2 md:py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Gallery Slider with slightly reduced height and rounded corners (Image section first) */}
          <div className="relative group">
            {/* Arrows (Hidden on mobile for pure swipe-only navigation) */}
            <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-2 md:left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none md:pointer-events-auto">
              <button
                onClick={() => scroll("left")}
                className="pointer-events-auto bg-white/95 backdrop-blur-sm p-3 rounded-full shadow-md text-primary-950 hover:bg-[#C8A96B] hover:text-white transition-all transform hover:scale-105 active:scale-95"
                aria-label="Scroll Left"
              >
                <ChevronLeft size={20} />
              </button>
            </div>
            <div className="hidden md:block absolute top-1/2 -translate-y-1/2 right-2 md:right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none md:pointer-events-auto">
              <button
                onClick={() => scroll("right")}
                className="pointer-events-auto bg-white/95 backdrop-blur-sm p-3 rounded-full shadow-md text-primary-950 hover:bg-[#C8A96B] hover:text-white transition-all transform hover:scale-105 active:scale-95"
                aria-label="Scroll Right"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Gallery Slider content */}
            <div
              ref={scrollRef}
              style={{ touchAction: 'pan-x pan-y pinch-zoom' }}
              className="flex gap-4 md:gap-6 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide no-scrollbar h-[270px] sm:h-[340px] md:h-[450px] lg:h-[480px] touch-pan-x touch-pan-y will-change-scroll"
            >
              {shopImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.5 }}
                  className="flex-none w-[82%] sm:w-[500px] md:w-[600px] h-full relative overflow-hidden group/item rounded-xl md:rounded-2xl shadow-md border border-[#C8A96B]/10 cursor-zoom-in snap-center"
                  onClick={() => setSelectedShopImage(image.url)}
                >
                  <OptimizedImage
                    src={image.url}
                    width={800}
                    alt={image.label}
                    className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-1000 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Maximize2
                      size={28}
                      className="text-white drop-shadow-md"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark)]/90 via-transparent to-transparent opacity-90 sm:opacity-0 sm:group-hover/item:opacity-100 transition-all duration-300 flex flex-col justify-end p-5 sm:p-8 transform sm:translate-y-3 sm:group-hover/item:translate-y-0">
                    <p className="text-[var(--color-gold-light)] text-[10px] uppercase tracking-[0.2em] font-medium mb-1.5">
                      Exclusive Preview
                    </p>
                    <h3 className="text-white text-xl sm:text-2xl font-serif mb-1 font-normal">
                      {image.label}
                    </h3>
                    <p className="text-white/80 text-[11px] font-light">
                      Explore our designer collections in person
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Premium Indicator Track */}
            <div className="flex justify-center gap-1.5 mt-2">
              {shopImages.map((_, i) => (
                <div
                  key={i}
                  className="w-8 sm:w-12 h-[2px] bg-primary-950/5 rounded-full overflow-hidden"
                >
                  <motion.div
                    className="h-full bg-[#C8A96B]"
                    initial={{ translateX: "-100%" }}
                    whileInView={{ translateX: "0%" }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.3 + i * 0.08,
                      duration: 0.8,
                      ease: "easeOut",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Text block (Placed after the Image/Gallery with tight spacing) */}
          <div className="text-center mt-2.5">
            <div className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-gold)] mb-0.5 font-semibold">
              Visit Us
            </div>
            <h2 className="text-2xl md:text-3xl font-serif text-[var(--color-dark)] mb-1 font-normal tracking-wide leading-tight">
              Visit Our Store In-Person
            </h2>
            <p className="text-[13.5px] sm:text-[14px] text-[var(--color-dark)]/75 max-w-2xl mx-auto font-light leading-relaxed px-2">
              Step into the world of Mukesh Saree Centre. Visit our popular Nagpur store and see our beautiful sarees, premium designs, and traditional styles since 1978.
            </p>
          </div>

          {/* Elegant Small Labels Row / Bullet list */}
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 mt-2.5 px-4 text-center text-[10px] sm:text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-dark)]/50 font-medium font-sans">
            <span className="flex items-center gap-1 whitespace-nowrap">
              <span className="w-1 h-1 rounded-full bg-[#C8A96B]" />
              Trusted Since 1978
            </span>
            <span className="flex items-center gap-1 whitespace-nowrap">
              <span className="w-1 h-1 rounded-full bg-[#C8A96B]" />
              Flagship Store • Nagpur
            </span>
            <span className="flex items-center gap-1 whitespace-nowrap">
              <span className="w-1 h-1 rounded-full bg-[#C8A96B]" />
              Luxury Shopping Experience
            </span>
          </div>

          {/* Premium Call to Action Button (Single button, tightly connected) */}
          <div className="flex justify-center mt-2.5 w-full px-4">
            <a
              href="https://g.page/r/CScAZL7hsuWjEBE/review"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full sm:w-56 inline-flex items-center justify-center text-center py-3 transform active:scale-95 transition-all duration-300"
            >
              Visit Our Store
            </a>
          </div>

        </div>
      </section>

      {/* Subtle Divider After Section */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-10 lg:px-16 my-1.5 md:my-3">
        <div className="h-[1px] bg-[#C8A96B]/20" />
      </div>

      <CustomerReviews />

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
