import { Link, Outlet, useLocation, useNavigate } from "react-router";
import {
  ShoppingBag,
  Search,
  Menu,
  Heart,
  User,
  X,
  MessageCircle,
  ChevronRight,
  ArrowRight,
  ArrowUp,
  ChevronDown,
  Instagram,
  Facebook,
  Youtube,
  Clock,
  Sparkles,
  Mail,
  Phone,
  Home,
  MapPin,
} from "lucide-react";
import { useStore } from "./store";
import { useState, useEffect, useRef, Suspense } from "react";
import type { FormEvent } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { products } from "./mockData";
import { CONFIG, getWhatsAppNumber } from "./config";
import { formatPrice, getImageAlt } from "./utils";
import { searchProducts } from "./services/search";
import { OptimizedImage } from "./components/OptimizedImage";
import { LiveTimestamp } from "./components/LiveTimestamp";
import { trackPageView } from "./tracking";

export default function Layout() {
  const { cart } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileShopOpen, setIsMobileShopOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get("q") || params.get("search") || "";
    } catch {
      return "";
    }
  });
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const { scrollY } = useScroll();
  const [logoSrc, setLogoSrc] = useState("https://ik.imagekit.io/tus1loev9/homepage/IMG_20260530_201904.png");
  const [logoRetryStep, setLogoRetryStep] = useState(0);
  const [logoError, setLogoError] = useState(false);

  const handleLogoError = () => {
    if (logoRetryStep === 0) {
      setLogoSrc("https://ik.imagekit.io/tus1loev9/homepage/IMG_20260530_201904.png");
      setLogoRetryStep(1);
    } else if (logoRetryStep === 1) {
      setLogoSrc("https://ik.imagekit.io/tus1loev9/homepage/IMG_20260530_201904.png");
      setLogoRetryStep(2);
    } else {
      setLogoError(true);
    }
  };

  const [isScrolled, setIsScrolled] = useState(false);
  const [isDeepScrolled, setIsDeepScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const hasStickyBar = location.pathname.startsWith("/product") || location.pathname === "/checkout";

  // Determine positions of both buttons dynamically to prevent overlapping with sticky bars on mobile
  const getWhatsAppPosition = () => {
    if (hasStickyBar) {
      if (isDeepScrolled) {
        return "bottom-[calc(115px+env(safe-area-inset-bottom))] md:bottom-[84px]";
      } else {
        return "bottom-[calc(65px+env(safe-area-inset-bottom))] md:bottom-[24px]";
      }
    } else {
      if (isDeepScrolled) {
        return "bottom-[calc(70px+env(safe-area-inset-bottom))] md:bottom-[84px]";
      } else {
        return "bottom-[calc(20px+env(safe-area-inset-bottom))] md:bottom-[24px]";
      }
    }
  };

  const getScrollToTopPosition = () => {
    if (hasStickyBar) {
      return "bottom-[calc(65px+env(safe-area-inset-bottom))] md:bottom-[24px]";
    } else {
      return "bottom-[calc(20px+env(safe-area-inset-bottom))] md:bottom-[24px]";
    }
  };

  const [openFooterAccordion, setOpenFooterAccordion] = useState<string | null>(
    null,
  );
  const [subscribeStatus, setSubscribeStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [subscribeMessage, setSubscribeMessage] = useState("");
  const lastScrollY = useRef(0);

  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [cartBadgeHighlight, setCartBadgeHighlight] = useState(false);
  const prevCartCountRef = useRef(cartItemCount);

  useEffect(() => {
    if (cartItemCount > prevCartCountRef.current) {
      setCartBadgeHighlight(true);
      const timer = setTimeout(() => setCartBadgeHighlight(false), 2000); // 2 seconds
      return () => clearTimeout(timer);
    }
    prevCartCountRef.current = cartItemCount;
  }, [cartItemCount]);

  const toggleFooterAccordion = (section: string) => {
    setOpenFooterAccordion((prev) => (prev === section ? null : section));
  };

  const handleNewsletterSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = (formData.get("email") as string || "").trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setSubscribeStatus("error");
      setSubscribeMessage("Please enter a valid email address.");
      return;
    }
    
    setSubscribeStatus("submitting");
    setSubscribeMessage("");

    // Simulate network submission delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSubscribeStatus("success");
    setSubscribeMessage("Welcome to the Mukesh Saree Centre family!");
    form.reset();
  };

  useEffect(() => {
    // Scroll to top on pathname OR search change
    // This ensures that even params changes like ?category=Sarees from footer trigger top scroll
    window.scrollTo(0, 0);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);
      setIsDeepScrolled(currentScrollY > 400);

      // Disable hiding header so it smoothly fades to solid and stays visible
      // if (currentScrollY > lastScrollY.current && currentScrollY > 200) {
      //   setIsHidden(true);
      // } else {
      //   setIsHidden(false);
      // }
      setIsHidden(false);

      lastScrollY.current = currentScrollY;
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleScroll();
    handleResize();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Lock body scroll when mobile menu is active for a professional native experience
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Load and save recent searches cleanly
  useEffect(() => {
    try {
      const saved = localStorage.getItem("msc_recent_searches");
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (e) {
      // Ignore
    }
  }, []);

  const addRecentSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 6);
      try {
        localStorage.setItem("msc_recent_searches", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem("msc_recent_searches");
    } catch (e) {}
  };

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    
    const params = new URLSearchParams(location.search);
    const qValue = params.get("q") || params.get("search") || "";
    setSearchQuery(qValue);

    // Track dynamic PageView for dynamic SPA transitions
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredProducts = searchQuery.trim()
    ? searchProducts(searchQuery).slice(0, 5)
    : [];

  const [announcementIndex, setAnnouncementIndex] = useState(0);

  const announcements = [
    "✨ FREE SHIPPING ON ALL ORDERS",
    "🚚 CASH ON DELIVERY AVAILABLE",
    "👑 THE SPECIAL SALE • 50% OFF ON ALL PRODUCTS",
    "🏛️ TRUSTED SINCE 1978 · NAGPUR",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      addRecentSearch(query);
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setIsSearchOpen(false);
    }
  };

  const isTransparent = isHomePage && !isScrolled && !isMobileMenuOpen;

  const headerStyle = {
    background: isTransparent
      ? "transparent"
      : "rgba(250, 246, 240, 0.95)",
    backdropFilter: isTransparent ? "none" : "blur(16px)",
    WebkitBackdropFilter: isTransparent ? "none" : "blur(16px)",
    boxShadow: isTransparent ? "none" : "0 4px 20px rgba(0,0,0,0.05)",
  };

  const textColor = isTransparent
    ? "text-white drop-shadow-md"
    : "text-[#3D2C23]";
  const iconColor = isTransparent ? "text-white" : "text-[#3D2C23]";
  const borderColor = isTransparent ? "bg-white/30" : "bg-[#3D2C23]/20";

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            id="search-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Search Shop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-[#FAF8F4]/98 backdrop-blur-md flex flex-col text-primary-950 overflow-y-auto no-scrollbar scrollbar-hide"
          >
            {/* Smooth-sliding inner container */}
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-4xl mx-auto px-5 sm:px-8 flex flex-col h-full min-h-screen py-4"
            >
              {/* Top area - Elegant Close button, Centered logo branding and centered alignment */}
              <div className="h-[75px] flex items-center justify-between border-b border-[#C8A96B]/10 mb-6 flex-shrink-0">
                {/* Left decorative label */}
                <div className="hidden sm:flex flex-col">
                  <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-gold-600">
                    Discover 
                  </span>
                  <span className="text-[8px] uppercase tracking-[0.15em] font-medium text-primary-950/40 mt-0.5">
                    Our Curations
                  </span>
                </div>

                {/* Centered Boutique Identity */}
                <div className="flex flex-col items-center mx-auto sm:absolute sm:left-1/2 sm:-translate-x-1/2">
                  <span className="text-sm font-serif font-bold tracking-[0.25em] uppercase text-primary-950 leading-none">
                    MUKESH
                  </span>
                  <span className="text-[7.5px] font-sans font-semibold tracking-[0.25em] uppercase text-gold-600 mt-1">
                    SAREE CENTRE
                  </span>
                </div>

                {/* Elegant Close Button */}
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="w-10 h-10 rounded-full border border-black/[0.06] hover:border-[#C8A96B]/40 flex items-center justify-center text-primary-950 active:scale-95 transition-all outline-none cursor-pointer"
                  aria-label="Close search"
                >
                  <X size={16} strokeWidth={1.5} />
                </button>
              </div>

              {/* Scrollable Search Content */}
              <div className="flex-1 pb-16 no-scrollbar scrollbar-hide">
                <form
                  onSubmit={handleSearchSubmit}
                  className="w-full max-w-3xl mx-auto mb-8 relative"
                  role="search"
                  aria-labelledby="search-title"
                >
                  {/* Premium Styled Search Input Bar */}
                  <div className="relative w-full flex items-center rounded-2xl bg-white border border-[#C8A96B]/20 focus-within:border-[#C8A96B]/60 focus-within:shadow-[0_8px_24px_rgba(200,169,107,0.06)] focus-within:ring-2 focus-within:ring-[#C8A96B]/10 transition-all duration-300">
                    <Search size={18} strokeWidth={1.5} className="absolute left-5 text-primary-950/45" />
                    
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Discover Banarasi, Linen, Co-Ords, Silk, Sarees..."
                      aria-label="Search for products"
                      className="w-full h-14 sm:h-16 pl-12 pr-28 text-[13.5px] sm:text-[15px] font-sans bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-primary-950 placeholder-primary-950/35"
                    />

                    {/* Quick Clean input trigger & Submit search button action */}
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery("");
                            searchInputRef.current?.focus();
                          }}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-primary-950/40 hover:text-gold-600 transition-colors cursor-pointer"
                          aria-label="Clear term"
                        >
                          <X size={15} strokeWidth={1.5} />
                        </button>
                      )}
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary-950 text-white font-sans text-[10px] tracking-[2px] uppercase font-semibold rounded-lg hover:bg-gold-600 transition-all duration-300 active:scale-95 select-none"
                      >
                        Search
                      </button>
                    </div>
                  </div>
                </form>

                <div className="max-w-3xl mx-auto">
                  {searchQuery && filteredProducts.length > 0 ? (
                    <div className="space-y-6 animate-fade-in animate-gpu">
                      <div className="flex justify-between items-center border-b border-[#C8A96B]/10 pb-2">
                        <span className="text-[9.5px] uppercase tracking-[2.5px] text-gold-600 font-bold">
                          Matching Curations ({filteredProducts.length})
                        </span>
                        <span className="text-[8.5px] tracking-[1px] text-primary-950/40 uppercase">
                          Boutique Results
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                        {filteredProducts.map((product, idx) => (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: idx * 0.05, ease: "easeOut" }}
                          >
                            <Link
                              to={`/product/${product.slug}`}
                              onClick={() => {
                                addRecentSearch(searchQuery);
                                setIsSearchOpen(false);
                              }}
                              className="group flex flex-row md:flex-col items-center md:items-stretch gap-4 md:gap-3 p-3 md:p-2 bg-white hover:bg-[#FAF6F0]/40 border border-[#C8A96B]/10 hover:border-gold-500 rounded-xl transition-all duration-300 shadow-[0_2px_8px_rgba(200,169,107,0.02)] hover:shadow-[0_6px_18px_rgba(200,169,107,0.06)]"
                            >
                              {/* Product Crop Frame */}
                              <div className="w-16 h-20 md:w-full md:h-auto md:aspect-[3/4] overflow-hidden rounded-lg flex-shrink-0 border border-black/[0.02] flex items-center justify-center p-0" style={{ backgroundColor: '#FAF8F5' }}>
                                <OptimizedImage
                                  src={product.image}
                                  width={180}
                                  alt={getImageAlt(product)}
                                  className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                              </div>
                              
                              <div className="flex-grow flex flex-col justify-center md:px-1.5 md:pb-1 text-left">
                                <span className="text-[8.5px] uppercase tracking-[1.5px] text-gold-600 font-bold mb-0.5 block">
                                  {product.category}
                                </span>
                                <h4 className="text-[11.5px] sm:text-xs font-serif text-primary-950 group-hover:text-gold-600 transition-colors font-semibold line-clamp-1 pb-0.5">
                                  {product.name}
                                </h4>
                                <span className="text-xs font-sans font-bold text-primary-950/70 block mt-1">
                                  ₹{product.price.toLocaleString()}
                                </span>
                              </div>
                              <ChevronRight
                                size={14}
                                className="text-primary-950/20 group-hover:text-gold-600 group-hover:translate-x-0.5 transition-all md:hidden pr-1"
                              />
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ) : searchQuery ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12 md:py-16 bg-white border border-[#C8A96B]/15 rounded-2xl p-6 shadow-sm"
                    >
                      <Search
                        size={32}
                        strokeWidth={1}
                        className="mx-auto text-[#C8A96B] mb-4 opacity-75"
                      />
                      <h4 className="font-serif text-sm font-semibold text-primary-950 mb-1">
                        No Collections Match
                      </h4>
                      <p className="text-primary-950/45 font-light text-[12.5px] max-w-sm mx-auto">
                        We couldn't find matches for "{searchQuery}". Try browsing beautiful Banarasi, Linen, or Co-Ord selections instead.
                      </p>
                      <button
                        onClick={() => setSearchQuery("")}
                        className="mt-5 text-[10px] font-semibold text-gold-600 uppercase tracking-[2px] border-b border-gold-500 hover:text-primary-950 hover:border-primary-950 transition-colors duration-200 pb-0.5"
                      >
                        Reset Search
                      </button>
                    </motion.div>
                  ) : (
                    <div className="space-y-7 animate-fade-in animate-gpu">
                      {/* Recent Search Section */}
                      {recentSearches.length > 0 && (
                        <div className="border-b border-[#C8A96B]/10 pb-5">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-[8.5px] uppercase tracking-[2.5px] text-gold-600 font-bold flex items-center gap-1.5">
                              <Clock size={11} className="text-gold-600/60" />
                              Recent Searches
                            </span>
                            <button
                              onClick={clearRecentSearches}
                              type="button"
                              className="text-[8px] uppercase tracking-[1.5px] text-primary-950/40 hover:text-gold-600 font-bold transition-colors"
                            >
                              Clear All
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {recentSearches.map((term, i) => (
                              <motion.button
                                key={`${term}-${i}`}
                                whileTap={{ scale: 0.97 }}
                                type="button"
                                onClick={() => {
                                  setSearchQuery(term);
                                  navigate(`/search?q=${encodeURIComponent(term)}`);
                                  setIsSearchOpen(false);
                                }}
                                className="inline-flex items-center bg-white border border-[#C8A96B]/10 rounded-full py-1.5 px-3.5 text-[11px] tracking-wide text-primary-950/85 hover:border-gold-500 hover:text-gold-600 transition-all font-medium whitespace-nowrap active:scale-[0.98]"
                              >
                                {term}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Prominent High-End Collection Suggestions */}
                      <div>
                        <div className="text-[9px] uppercase tracking-[2.5px] text-gold-600 font-bold mb-3 flex items-center gap-1.5">
                          <Sparkles size={11} className="text-[#C8A96B]" />
                          Boutique Suggestions
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 md:gap-3">
                          {[
                            { title: "Banarasi", tag: "Banarasi" },
                            { title: "Linen", tag: "Linen" },
                            { title: "Co-Ord Sets", tag: "Co-Ord" },
                            { title: "Soft Silk", tag: "Silk" },
                            { title: "Wedding", tag: "Wedding" },
                          ].map((item) => (
                            <motion.button
                              key={item.title}
                              whileTap={{ scale: 0.96 }}
                              type="button"
                              onClick={() => {
                                setSearchQuery(item.tag);
                                addRecentSearch(item.tag);
                                navigate(`/search?q=${encodeURIComponent(item.tag)}`);
                                setIsSearchOpen(false);
                              }}
                              className="w-full py-2.5 px-3 bg-white border border-[#C8A96B]/15 hover:border-gold-500 hover:text-gold-600 transition-all font-medium text-left rounded-xl flex flex-col justify-between group active:scale-[0.98]"
                            >
                              <span className="text-[12px] font-sans font-medium text-primary-950 group-hover:text-gold-600 transition-colors">
                                {item.title}
                              </span>
                              <span className="text-[8px] tracking-[1.5px] uppercase font-light text-primary-950/40 mt-1 block">
                                Collection →
                              </span>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Seasonal Curations / Style Edits */}
                      <div className="border-t border-[#C8A96B]/10 pt-5">
                        <div className="text-[8.5px] uppercase tracking-[2px] text-gold-600 font-bold mb-3">
                          Seasonal Style Edits
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { name: "Organza Sarees", query: "Organza" },
                            { name: "Best Sellers", query: "Best" },
                            { name: "New Arrivals", query: "New" },
                            { name: "Summer Wear", query: "Summer" },
                            { name: "Cotton Sarees", query: "Cotton" },
                            { name: "Party Collection", query: "Party" },
                          ].map((item) => (
                            <motion.button
                              key={item.name}
                              whileTap={{ scale: 0.96 }}
                              type="button"
                              onClick={() => {
                                setSearchQuery(item.query);
                                addRecentSearch(item.query);
                                navigate(`/search?q=${encodeURIComponent(item.query)}`);
                                setIsSearchOpen(false);
                              }}
                              className="px-3.5 py-1.5 bg-[#F7F4EF] hover:bg-white border border-[#C8A96B]/10 hover:border-gold-500 rounded-full text-[10.5px] tracking-[1px] hover:text-gold-600 transition-all font-medium text-primary-950/80 active:scale-[0.98]"
                            >
                              {item.name}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Wrapper */}
      <div
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ease-in-out will-change-transform transform-gpu ${
          isHidden ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        {/* Dynamic Announcement Bar */}
        <div className="announcement-bar bg-[#2B2B2B] text-[#C8A96B] w-full flex items-center justify-center z-50">
          <AnimatePresence mode="wait">
            <motion.div
              key={announcements[announcementIndex]}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.5 }}
            >
              <span>{announcements[announcementIndex]}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Site Header */}
        <header
          className={`site-header w-full relative transition-all duration-300 ${
            !isTransparent && isScrolled ? "border-b border-[#2B2B2B]/5" : "border-b-0"
          } flex items-center justify-between`}
          style={headerStyle}
        >

        {/* Left Section: Hamburger on Mobile, Nav Links on Desktop */}
        <div className="flex items-center flex-1 h-full z-10 px-4 md:pl-8">
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`${iconColor} focus:outline-none transition-colors h-11 w-11 flex items-center justify-start`}
                aria-expanded={isMobileMenuOpen}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? (
                  <X size={24} strokeWidth={1.5} />
                ) : (
                  <Menu size={24} strokeWidth={1.5} />
                )}
              </button>
            </div>

            <nav className="hidden md:flex space-x-6 items-center h-full">
              <Link
                to="/shop"
                className={`text-[13px] tracking-[1.5px] uppercase font-medium ${textColor} hover:text-gold-500 transition-colors py-4`}
              >
                Shop
              </Link>
              <Link
                to="/shop?category=Sarees"
                className={`text-[13px] tracking-[1.5px] uppercase font-medium ${textColor} hover:text-gold-500 transition-colors py-4`}
              >
                Sarees
              </Link>
              <Link
                to="/shop?category=Co-Ord-Sets"
                className={`text-[13px] tracking-[1.5px] uppercase font-medium ${textColor} hover:text-gold-500 transition-colors py-4`}
              >
                Co-Ord Sets
              </Link>
              <Link
                to="/contact"
                className={`text-[13px] tracking-[1.5px] uppercase font-medium ${textColor} hover:text-gold-500 transition-colors py-4`}
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Center Section: Logo */}
          <div className="header-logo z-50 pointer-events-auto">
            <Link
              to="/"
              onClick={scrollToTop}
              className="z-50 cursor-pointer flex items-center justify-center flex-col group transition-all duration-500 transform m-0 p-0"
            >
              <img
                src="https://ik.imagekit.io/tus1loev9/homepage/IMG_20260530_201904.png"
                alt="Mukesh Saree Centre Logo"
                style={{ filter: isTransparent ? "brightness(0) invert(1) drop-shadow(0 2px 4px rgba(0,0,0,0.5))" : "none" }}
                className="transition-all duration-500 group-hover:opacity-80 m-0 p-0 h-[48px] md:h-[52px] w-auto object-contain"
              />
            </Link>
          </div>

          <div className="flex items-center justify-end space-x-1 sm:space-x-4 md:space-x-6 flex-1 z-10 px-4 md:pr-8">
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`${iconColor} hover:text-gold-200 transition-all h-11 w-11 flex items-center justify-center`}
              aria-label="Search"
            >
              <Search size={22} strokeWidth={1.5} />
            </button>
            {/* Wishlist Icon Removed */}
            <Link
              to="/cart"
              className={`${iconColor} hover:text-gold-500 transition-all relative h-11 w-11 flex items-center justify-end md:justify-center`}
              aria-label="Cart"
            >
              <motion.div
                animate={
                  cartBadgeHighlight
                    ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, -10, 0] }
                    : {}
                }
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <ShoppingBag size={22} strokeWidth={1.5} />
              </motion.div>
              <AnimatePresence>
                {cartItemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: cartBadgeHighlight ? [1, 1.3, 1] : 1,
                      opacity: 1,
                    }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className={`absolute top-1 right-1 text-white text-[9px] px-1 md:px-1.5 py-[1px] md:py-0.5 rounded-full min-w-[16px] text-center font-medium shadow-sm transition-colors ${cartBadgeHighlight ? "bg-black" : "bg-gold-600"}`}
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>
        </header>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Solid Dark Backdrop Overlay to completely block out Home/homepage behind it */}
            <motion.div
              key="mobile-menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 w-full h-full bg-black/95 z-[9998] md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Premium Solid Slide-out Sidebar Panel */}
            <motion.div
              key="mobile-menu-panel"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-[9999] w-full h-full md:hidden bg-[#FAF8F4] overflow-y-auto"
              style={{ backgroundColor: "#FAF8F4", opacity: 1, visibility: "visible" }}
            >
              <div style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "auto",
                paddingBottom: "24px"
              }}>
                {/* Header */}
                <div style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 20px",
                  borderBottom: "1px solid #eee"
                }}>
                  <img 
                    src={logoSrc} 
                    alt="Mukesh Saree Centre Logo"
                    style={{ height: "44px", width: "auto", objectFit: "contain" }}
                  />
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      border: "none",
                      background: "transparent",
                      fontSize: "20px",
                      fontWeight: "300",
                      cursor: "pointer",
                      padding: "8px",
                      color: "#000",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    aria-label="Close menu"
                  >
                    ✕
                  </button>
                </div>

                {/* Nav Links */}
                <div style={{
                  display: "flex",
                  flexDirection: "column"
                }}>
                  <Link 
                    to="/" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      padding: "16px 20px",
                      fontSize: "16px",
                      fontWeight: "700",
                      borderBottom: "1px solid #eee",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      color: "#000",
                      textDecoration: "none"
                    }}
                  >
                    <span>Home</span> <span>›</span>
                  </Link>

                  <Link 
                    to="/shop" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      padding: "16px 20px",
                      fontSize: "16px",
                      fontWeight: "700",
                      borderBottom: "1px solid #eee",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      color: "#000",
                      textDecoration: "none"
                    }}
                  >
                    <span>Shop</span> <span>›</span>
                  </Link>

                  <Link 
                    to="/shop?category=Sarees" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      padding: "16px 20px",
                      fontSize: "16px",
                      fontWeight: "700",
                      borderBottom: "1px solid #eee",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      color: "#000",
                      textDecoration: "none"
                    }}
                  >
                    <span>Sarees</span> <span>›</span>
                  </Link>

                  <Link 
                    to="/shop?category=Co-Ord-Sets" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      padding: "16px 20px",
                      fontSize: "16px",
                      fontWeight: "700",
                      borderBottom: "1px solid #eee",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      color: "#000",
                      textDecoration: "none"
                    }}
                  >
                    <span>Co-Ord Sets</span> <span>›</span>
                  </Link>

                  <Link 
                    to="/contact" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      padding: "16px 20px",
                      fontSize: "16px",
                      fontWeight: "700",
                      borderBottom: "1px solid #eee",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      color: "#000",
                      textDecoration: "none"
                    }}
                  >
                    <span>Contact</span> <span>›</span>
                  </Link>
                </div>

                {/* Customer Assistance */}
                <div style={{
                  margin: "16px",
                  padding: "16px",
                  backgroundColor: "#FAF0E6",
                  borderRadius: "8px"
                }}>
                  <p style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#c8963e",
                    letterSpacing: "0.1em",
                    marginBottom: "12px",
                    marginTop: "0px"
                  }}>CUSTOMER ASSISTANCE</p>
                  <div className="contact-row">
                    <Mail size={18} />
                    <a href="mailto:info@mukeshsarees.com">info@mukeshsarees.com</a>
                  </div>
                  <div className="contact-row">
                    <Phone size={18} />
                    <a href="tel:+917020664641">+91 7020664641</a>
                  </div>
                </div>

                {/* Social Icons Row */}
                <div style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "12px",
                  padding: "8px 20px 16px",
                  alignItems: "center"
                }}>
                  <a 
                    href="https://www.instagram.com/mukeshsarees_nagpur"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      border: "1px solid #eee",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#fff"
                    }}
                    aria-label="Instagram"
                  >
                    <Instagram size={18} className="text-neutral-800" />
                  </a>
                  <a 
                    href="https://www.facebook.com/Mukeshsareesindia/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      border: "1px solid #eee",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#fff"
                    }}
                    aria-label="Facebook"
                  >
                    <Facebook size={18} className="text-neutral-800" />
                  </a>
                  <a 
                    href="https://youtube.com/@mukeshsarees"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      border: "1px solid #eee",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#fff"
                    }}
                    aria-label="YouTube"
                  >
                    <Youtube size={18} className="text-neutral-800" />
                  </a>
                </div>

                {/* Footer text */}
                <div style={{
                  textAlign: "center",
                  padding: "8px 20px 24px"
                }}>
                  <p style={{
                    fontSize: "13px",
                    fontWeight: "700",
                    letterSpacing: "0.1em",
                    margin: "0 0 4px 0",
                    color: "#000"
                  }}>MUKESH SAREE CENTRE</p>
                  <p style={{
                    fontSize: "11px",
                    color: "#c8963e",
                    letterSpacing: "0.08em",
                    margin: "0"
                  }}>NAGPUR, INDIA • EST. 1978</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={`flex-grow flex flex-col ${!isHomePage ? "pt-[84px]" : ""}`}
      >
        <Suspense fallback={
          <div className="flex-grow min-h-[50vh] flex flex-col items-center justify-center bg-[#FAF8F4] space-y-4">
            <div className="w-8 h-8 border-2 border-[#C8A96B] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] uppercase tracking-[4px] text-primary-950/40 font-bold italic animate-pulse text-center">Loading Collection...</p>
          </div>
        }>
          <Outlet />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="bg-[#111111] text-neutral-300 pt-8 pb-8 md:pt-14 md:pb-12 border-t border-[#C8A96B]/25">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
          
          {/* Full Footer Content */}
          <div className="footer-full">
            
            {/* Newsletter Section */}
          <div className="mb-2 md:mb-12 border-b border-white/10 pb-2 md:pb-10">
            <div className="max-w-xl mx-auto text-center">
              <h3 
                className="text-xs md:text-sm uppercase tracking-[0.25em] font-semibold mb-1.5 sm:mb-3"
                style={{
                  color: "rgba(250, 246, 240, 0.95)",
                  textShadow: "0 1px 8px rgba(0,0,0,0.35)"
                }}
              >
                JOIN THE MUKESH SAREE CENTRE FAMILY
              </h3>
              <p className="text-[11px] md:text-sm text-[#eae6df]/75 tracking-wider mb-3 md:mb-5 leading-normal">
                Subscribe to receive early access to new collections, exclusive previews, and ethnic styling inspiration.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-1.5 max-w-md mx-auto">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Your Email"
                  defaultValue=""
                  autoComplete="off"
                  required
                  disabled={subscribeStatus === "submitting"}
                  className="flex-grow bg-[#1a1a1a] border border-white/10 px-4 py-2.5 md:py-3 text-xs tracking-widest text-white placeholder-white/35 focus:outline-none focus:border-[#C8A96B] transition-colors disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={subscribeStatus === "submitting"}
                  className="bg-[#C8A96B] hover:bg-[#FAF8F4] text-neutral-950 hover:text-neutral-950 transition-all duration-300 font-medium px-8 py-2.5 md:py-3 text-xs tracking-widest uppercase flex-shrink-0 disabled:bg-neutral-800 disabled:cursor-not-allowed"
                >
                  {subscribeStatus === "submitting" ? "Submitting..." : "Subscribe"}
                </button>
              </form>
              {subscribeStatus === "success" && (
                <p className="text-xs text-emerald-400 mt-2 tracking-wider font-medium">{subscribeMessage}</p>
              )}
              {subscribeStatus === "error" && (
                <p className="text-xs text-rose-400 mt-2 tracking-wider font-medium">{subscribeMessage}</p>
              )}
              <p className="text-[9.5px] text-white/35 tracking-wider mt-2 md:mt-4">
                By subscribing, you agree to our Privacy Policy and consent to receive updates.
              </p>
            </div>
          </div>

          {/* Accordions / Navigation Columns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-y-0 md:gap-x-10 lg:gap-x-16">
            
            {/* 1. MUKESH SAREE CENTRE (Contact Info) */}
            <div className="border-b border-white/10 md:border-b-0 py-0">
               <button
                onClick={() => toggleFooterAccordion("contact-info")}
                className="w-full flex items-center justify-between pt-1 pb-1 md:py-0 md:mb-4 md:pointer-events-none text-left"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C8A96B]">
                  MUKESH SAREES
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 md:hidden text-neutral-400 ${
                    openFooterAccordion === "contact-info" ? "rotate-180" : ""
                  }`}
                />
              </button>
              
              <div
                className={`transition-all duration-300 ${
                  openFooterAccordion === "contact-info" ? "block animate-fadeIn" : "hidden"
                } md:block pb-1 md:pb-0`}
              >
                <ul className="space-y-3 text-[12px] md:text-[13px] text-[#eae6df]/85 tracking-wider leading-[1.6] pb-1">
                  <li className="flex items-start gap-2">
                    <MapPin size={16} className="text-[#C8A96B] shrink-0 mt-0.5" />
                    <span>{CONFIG.STORE_ADDRESS}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Phone size={16} className="text-[#C8A96B] shrink-0" />
                    <a href={`tel:${CONFIG.STORE_PHONE.replace(/[^0-9+]/g, '')}`} className="hover:text-[#C8A96B] transition-colors">{CONFIG.STORE_PHONE}</a>
                  </li>
                  <li className="flex items-center gap-2">
                    <Mail size={16} className="text-[#C8A96B] shrink-0" />
                    <a href={`mailto:${CONFIG.STORE_EMAIL}`} className="hover:text-[#C8A96B] transition-colors">{CONFIG.STORE_EMAIL}</a>
                  </li>
                </ul>
              </div>
            </div>

            {/* 2. QUICK LINKS Accordion */}
            <div className="border-b border-white/10 md:border-b-0 py-0">
              <button
                onClick={() => toggleFooterAccordion("quick-links")}
                className="w-full flex items-center justify-between pt-1 pb-1 md:py-0 md:mb-4 md:pointer-events-none text-left"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C8A96B]">
                  QUICK LINKS
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 md:hidden text-neutral-400 ${
                    openFooterAccordion === "quick-links" ? "rotate-180" : ""
                  }`}
                />
              </button>
              
              <div
                className={`transition-all duration-300 ${
                  openFooterAccordion === "quick-links" ? "block animate-fadeIn" : "hidden"
                } md:block pb-1 md:pb-0`}
              >
                <ul className="space-y-0 md:space-y-4 text-[12.5px] md:text-[13px] text-[#eae6df]/85 tracking-wider leading-none pb-1">
                  <li>
                    <Link to="/shop?category=Sarees" className="hover:text-[#C8A96B] hover:underline decoration-[#C8A96B]/30 underline-offset-4 transition-colors block py-0.5 md:py-0.5">
                      Sarees
                    </Link>
                  </li>
                  <li>
                    <Link to="/shop?category=Lehengas" className="hover:text-[#C8A96B] hover:underline decoration-[#C8A96B]/30 underline-offset-4 transition-colors block py-0.5 md:py-0.5">
                      Lehengas
                    </Link>
                  </li>
                  <li>
                    <Link to="/shop?category=Co-Ord-Sets" className="hover:text-[#C8A96B] hover:underline decoration-[#C8A96B]/30 underline-offset-4 transition-colors block py-0.5 md:py-0.5">
                      Co-Ord Sets
                    </Link>
                  </li>
                  <li>
                    <Link to="/shop?sort=new" className="hover:text-[#C8A96B] hover:underline decoration-[#C8A96B]/30 underline-offset-4 transition-colors block py-0.5 md:py-0.5">
                      New Arrivals
                    </Link>
                  </li>
                  <li>
                    <Link to="/shop?sort=best-selling" className="hover:text-[#C8A96B] hover:underline decoration-[#C8A96B]/30 underline-offset-4 transition-colors block py-0.5 md:py-0.5">
                      Best Sellers
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* 2. SUPPORT Accordion */}
            <div className="border-b border-white/10 md:border-b-0 py-0">
              <button
                onClick={() => toggleFooterAccordion("support")}
                className="w-full flex items-center justify-between pt-1 pb-1 md:py-0 md:mb-4 md:pointer-events-none text-left"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C8A96B]">
                  SUPPORT
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 md:hidden text-neutral-400 ${
                    openFooterAccordion === "support" ? "rotate-180" : ""
                  }`}
                />
              </button>
              
              <div
                className={`transition-all duration-300 ${
                  openFooterAccordion === "support" ? "block animate-fadeIn" : "hidden"
                } md:block pb-1 md:pb-0`}
              >
                <ul className="space-y-0 md:space-y-4 text-[12.5px] md:text-[13px] text-[#eae6df]/85 tracking-wider leading-none pb-1">
                  <li>
                    <Link to="/contact" className="hover:text-[#C8A96B] hover:underline decoration-[#C8A96B]/30 underline-offset-4 transition-colors block py-0.5 md:py-0.5">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/shipping-policy" className="hover:text-[#C8A96B] hover:underline decoration-[#C8A96B]/30 underline-offset-4 transition-colors block py-0.5 md:py-0.5">
                      Shipping Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/return-policy" className="hover:text-[#C8A96B] hover:underline decoration-[#C8A96B]/30 underline-offset-4 transition-colors block py-0.5 md:py-0.5">
                      Returns & Exchanges
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms" className="hover:text-[#C8A96B] hover:underline decoration-[#C8A96B]/30 underline-offset-4 transition-colors block py-0.5 md:py-0.5">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms" className="hover:text-[#C8A96B] hover:underline decoration-[#C8A96B]/30 underline-offset-4 transition-colors block py-0.5 md:py-0.5">
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* 3. CONTACT Accordion (Elegant 2-column layout inside) */}
            <div className="border-b border-white/10 md:border-b-0 py-0">
              <button
                onClick={() => toggleFooterAccordion("contact")}
                className="w-full flex items-center justify-between pt-1 pb-1 md:py-0 md:mb-4 md:pointer-events-none text-left"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C8A96B]">
                  CONTACT
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 md:hidden text-neutral-400 ${
                    openFooterAccordion === "contact" ? "rotate-180" : ""
                  }`}
                />
              </button>
              
              <div
                className={`transition-all duration-300 ${
                  openFooterAccordion === "contact" ? "block animate-fadeIn" : "hidden"
                } md:block pb-1 md:pb-0`}
              >
                <div className="grid grid-cols-[1.25fr_0.75fr] md:grid-cols-2 gap-y-1 gap-x-2 md:gap-4 text-xs tracking-wider leading-none pt-0.5">
                  <div>
                    <h5 className="text-[8.5px] font-bold uppercase tracking-widest text-neutral-500 mb-0.5 md:mb-1">
                      CUSTOMER CARE
                    </h5>
                    <a
                      href={`mailto:${CONFIG.STORE_EMAIL}`}
                      className="text-[11.5px] min-[370px]:text-[12px] md:text-[12.5px] text-[#FAF8F4] hover:text-[#C8A96B] transition-colors font-semibold tracking-wider whitespace-nowrap block py-0.5 md:py-0.5"
                    >
                      {CONFIG.STORE_EMAIL}
                    </a>
                  </div>
                  <div>
                    <h5 className="text-[8.5px] font-bold uppercase tracking-widest text-neutral-500 mb-0.5 md:mb-1">
                      WHATSAPP SUPPORT
                    </h5>
                    <a
                      href={`https://wa.me/${getWhatsAppNumber()}?text=Hi!%20I%20Need%20Help.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11.5px] min-[370px]:text-[12px] md:text-[12.5px] text-[#FAF8F4] hover:text-[#C8A96B] transition-colors font-semibold tracking-wider whitespace-nowrap block py-0.5 md:py-0.5"
                    >
                      {CONFIG.STORE_PHONE}
                    </a>
                  </div>

                </div>
              </div>
            </div>

          </div>

          {/* Social Icons Section */}
          <div className="flex justify-center items-center gap-6 mt-2 md:mt-12 border-t border-white/10 pt-2.5 md:pt-6">
            <a
              href="https://www.instagram.com/mukeshsarees_nagpur"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FAF8F4] hover:text-[#C8A96B] transition-colors p-1 md:p-2 hover:scale-105 transform active:scale-95 duration-200"
              aria-label="Instagram"
            >
              <Instagram size={20} strokeWidth={1.5} />
            </a>
            <a
              href="https://www.facebook.com/Mukeshsareesindia/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FAF8F4] hover:text-[#C8A96B] transition-colors p-1 md:p-2 hover:scale-105 transform active:scale-95 duration-200"
              aria-label="Facebook"
            >
              <Facebook size={20} strokeWidth={1.5} />
            </a>
            <a
              href="https://www.pinterest.com/MukeshSareesdotcom/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FAF8F4] hover:text-[#C8A96B] transition-colors p-1.5 md:p-2 hover:scale-105 transform active:scale-95 duration-200"
              aria-label="Pinterest"
            >
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 0a12 12 0 0 0-4.37 23.17c-.07-.63-.13-1.61.03-2.3l1.41-5.96s-.36-.72-.36-1.78c0-1.66.97-2.91 2.17-2.91 1.02 0 1.52.77 1.52 1.69 0 1.03-.66 2.56-.99 3.99-.28 1.19.6 2.16 1.77 2.16 2.12 0 3.76-2.24 3.76-5.47 0-2.86-2.06-4.86-5-4.86-3.4 0-5.4 2.56-5.4 5.2 0 1.03.4 2.14.9 2.74.1.12.11.23.08.35l-.34 1.39c-.05.23-.18.28-.41.17-1.53-.71-2.48-2.93-2.48-4.73 0-3.85 2.8-7.38 8.06-7.38 4.23 0 7.52 3.01 7.52 7.04 0 4.2-2.65 7.59-6.32 7.59-1.24 0-2.4-.64-2.8-1.4l-.76 2.91c-.28 1.06-1.02 2.39-1.52 3.2A12 12 0 1 0 12 0z"/>
              </svg>
            </a>
            <a
              href="https://youtube.com/@mukeshsarees?si=aMljrBMnIJYQDGDI"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FAF8F4] hover:text-[#C8A96B] transition-colors p-1 md:p-2 hover:scale-105 transform active:scale-95 duration-200"
              aria-label="YouTube"
            >
              <Youtube size={20} strokeWidth={1.5} />
            </a>
          </div>

          {/* Copyright Section */}
          <div className="mt-1.5 md:mt-4 pt-1.5 md:pt-4 border-t border-white/5 flex flex-col items-center">
            <p className="text-[9.5px] md:text-[10px] text-white/45 tracking-[0.15em] font-medium uppercase text-center leading-normal">
              © {new Date().getFullYear()} Mukesh Saree Centre. All Rights Reserved.
            </p>
          </div>

          </div> {/* End of footer-full */}
        </div>
      </footer>

      {/* Floating Buttons Stack with Smooth Scroll to Top and WhatsApp */}
      <AnimatePresence>
        {isDeepScrolled && (
          <motion.button
            key="scroll-top"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={scrollToTop}
            className={`fixed right-4 z-[997] w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FAF8F4] text-[#2b2b2b] border border-[#C8A96B]/35 flex items-center justify-center shadow-[0_6px_20px_rgba(0,0,0,0.12)] hover:border-[#C8A96B] hover:text-[#C8A96B] hover:scale-110 active:scale-95 transition-all duration-300 pointer-events-auto cursor-pointer ${getScrollToTopPosition()}`}
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
          </motion.button>
        )}
      </AnimatePresence>

      <a
        id="whatsapp-float"
        href={`https://wa.me/${getWhatsAppNumber()}?text=Hi!%20I%20Need%20Help.`}
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed right-4 z-[997] w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_6px_20px_rgba(37,211,102,0.3)] hover:shadow-[0_8px_25px_rgba(37,211,102,0.4)] hover:scale-110 active:scale-95 transition-all duration-300 ${getWhatsAppPosition()}`}
        aria-label="Contact on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
      </a>
    </div>
  );
}
