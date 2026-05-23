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
} from "lucide-react";
import { useStore } from "./store";
import { useState, useEffect, useRef } from "react";
import type { FormEvent } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { products } from "./mockData";
import { CONFIG } from "./config";
import { formatPrice, getImageAlt } from "./utils";
import { searchProducts } from "./services/search";
import { OptimizedImage } from "./components/OptimizedImage";
import { LiveTimestamp } from "./components/LiveTimestamp";

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
  const [logoError, setLogoError] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDeepScrolled, setIsDeepScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [openFooterAccordion, setOpenFooterAccordion] = useState<string | null>(
    null,
  );
  const [subscribeStatus, setSubscribeStatus] = useState<
    "idle" | "success" | "error"
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

  const handleNewsletterSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") as string || "").trim();
    if (!email || !email.includes("@")) {
      setSubscribeStatus("error");
      setSubscribeMessage("Please enter a valid email address.");
      return;
    }
    setSubscribeStatus("success");
    setSubscribeMessage("Welcome to the Mukesh Saree Centre family!");
    e.currentTarget.reset();
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
      localStorage.setItem("msc_recent_searches", JSON.stringify(updated));
      return updated;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("msc_recent_searches");
  };

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    
    const params = new URLSearchParams(location.search);
    const qValue = params.get("q") || params.get("search") || "";
    setSearchQuery(qValue);
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
      ? "linear-gradient(to bottom, rgba(16, 8, 0, 0.45) 0%, rgba(16, 8, 0, 0.15) 60%, rgba(16, 8, 0, 0) 100%)"
      : "rgba(250, 246, 240, 0.95)",
    backdropFilter: isTransparent ? "blur(4px)" : "blur(16px)",
    WebkitBackdropFilter: isTransparent ? "blur(4px)" : "blur(16px)",
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
                              <div className="w-16 h-20 md:w-full md:h-auto md:aspect-[3/4] bg-[#F9F7F5] overflow-hidden rounded-lg flex-shrink-0 border border-black/[0.02]">
                                <OptimizedImage
                                  src={product.image}
                                  width={180}
                                  alt={getImageAlt(product)}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
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

      {/* Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-500 will-change-transform transform-gpu ${
          isHidden ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
        } ${!isTransparent && isScrolled ? "border-b border-[#2B2B2B]/5" : "border-b-0"} h-[85px] md:h-[95px] flex flex-col`}
        style={headerStyle}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={announcements[announcementIndex]}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 left-0 w-full bg-[#2B2B2B] text-[#C8A96B] text-center px-4 text-[9px] sm:text-[10px] font-medium tracking-[2px] md:tracking-[3px] uppercase flex items-center justify-center z-[60] h-[26px]"
          >
            <span>{announcements[announcementIndex]}</span>
          </motion.div>
        </AnimatePresence>

        <div className="w-full px-4 md:px-8 max-w-7xl mx-auto h-[59px] md:h-[69px] mt-[26px] flex items-center justify-between">
          {/* Left Section: Hamburger on Mobile, Nav Links on Desktop */}
          <div className="flex items-center flex-1 h-full">
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

            <nav className="hidden md:flex space-x-8 items-center h-full">
              <Link
                to="/"
                onClick={scrollToTop}
                className={`text-[11px] tracking-[2px] uppercase font-medium ${textColor} hover:text-gold-500 transition-colors py-4`}
              >
                Home
              </Link>
              <div className="relative group h-full flex items-center">
                <Link
                  to="/shop"
                  className={`text-[11px] tracking-[2px] uppercase font-medium ${textColor} group-hover:text-gold-500 transition-colors py-4 flex items-center pr-2`}
                >
                  Shop{" "}
                  <ChevronDown
                    size={14}
                    className="ml-1 opacity-70 group-hover:rotate-180 transition-transform duration-300"
                  />
                </Link>
                <div className="absolute top-full left-0 mt-0 w-48 bg-white border border-black/5 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top translate-y-2 group-hover:translate-y-0 z-50">
                  <div className="py-2 flex flex-col">
                    <Link
                      to="/shop"
                      className="px-6 py-2.5 text-[11px] tracking-[1.5px] uppercase font-medium text-primary-950 hover:bg-gold-50 hover:text-gold-600 transition-colors"
                    >
                      All Products
                    </Link>
                    <Link
                      to="/shop?category=Sarees"
                      className="px-6 py-2.5 text-[11px] tracking-[1.5px] uppercase font-medium text-primary-950 hover:bg-gold-50 hover:text-gold-600 transition-colors"
                    >
                      Sarees
                    </Link>
                    <Link
                      to="/shop?category=Linen Sarees"
                      className="px-8 py-2 text-[10px] tracking-[1.5px] uppercase font-medium text-primary-950/70 hover:bg-gold-50 hover:text-gold-600 transition-colors pl-10"
                    >
                      — Linen Sarees
                    </Link>
                    <Link
                      to="/shop?category=Co-Ord Sets"
                      className="px-6 py-2.5 text-[11px] tracking-[1.5px] uppercase font-medium text-primary-950 hover:bg-gold-50 hover:text-gold-600 transition-colors"
                    >
                      Co-Ord Sets
                    </Link>
                  </div>
                </div>
              </div>
              <Link
                to="/contact"
                className={`text-[11px] tracking-[2px] uppercase font-medium ${textColor} hover:text-gold-500 transition-colors py-4`}
              >
                Contact Us
              </Link>
            </nav>
          </div>

          {/* Center Section: Logo */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center m-0 p-0">
            <Link
              to="/"
              onClick={scrollToTop}
              className="flex items-center justify-center group transition-all duration-500 transform m-0 p-0"
            >
              <img
                src="https://drive.google.com/thumbnail?id=1rXEc_ve9qXelBQakWWVGcm4ffvbGF4yT&sz=w1000"
                alt="Mukesh Saree Centre Logo"
                style={{ filter: isTransparent ? "brightness(0) invert(1) drop-shadow(0 2px 4px rgba(0,0,0,0.5))" : "none" }}
                className="w-auto h-auto min-w-[160px] max-w-[180px] md:min-w-[200px] md:max-w-[230px] lg:max-w-[250px] object-contain transition-all duration-500 group-hover:opacity-80 drop-shadow-sm m-0 p-0 block header-logo"
                onError={(e) => {
                  (e.currentTarget as any).style.display = "none";
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    const span = document.createElement("span");
                    span.className = `text-[17px] md:text-2xl font-serif font-semibold tracking-[4px] md:tracking-[8px] uppercase text-center leading-none transition-all ${textColor} group-hover:opacity-70`;
                    span.innerText = "MUKESH";

                    const div = document.createElement("div");
                    div.className =
                      "flex items-center gap-2 md:gap-3 w-full mt-1.5 md:mt-2 px-1 opacity-90";
                    div.innerHTML = `<div class="h-[1px] flex-1 ${borderColor} transition-colors"></div><span class="text-[8px] md:text-[10px] font-sans font-medium tracking-[4px] md:tracking-[6px] uppercase ${textColor} transition-colors whitespace-nowrap">Saree Centre</span><div class="h-[1px] flex-1 ${borderColor} transition-colors"></div>`;

                    parent.appendChild(span);
                    parent.appendChild(div);
                  }
                }}
              />
            </Link>
          </div>

          <div className="flex items-center justify-end space-x-1 sm:space-x-4 md:space-x-6 flex-1">
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
        </div>
      </header>

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
              className="fixed inset-0 z-[9999] w-full h-full overflow-y-auto md:hidden shadow-none flex flex-col bg-[#FAF8F4]"
              style={{ backgroundColor: "#FAF8F4", opacity: 1, visibility: "visible" }}
            >
              {/* 1. Unifed Unified Header Area */}
              <div className="h-[60px] px-5 border-b border-[#C8A96B]/20 flex items-center justify-between flex-shrink-0 bg-[#FAF8F4]">
                <div className="flex flex-col">
                  <span className="text-xs font-serif font-extrabold tracking-[0.22em] uppercase text-neutral-950 leading-none">
                    MUKESH
                  </span>
                  <span className="text-[7.5px] font-sans font-extrabold tracking-[0.22em] uppercase text-gold-600 mt-1">
                    SAREE CENTRE
                  </span>
                </div>

                {/* Elegant Circular Close Touch Trigger */}
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full border border-black/10 hover:border-[#C8A96B]/50 flex items-center justify-center text-neutral-950 active:scale-95 transition-all cursor-pointer outline-none bg-[#FAF8F4]"
                  aria-label="Close menu"
                >
                  <X size={14} strokeWidth={2.5} className="text-neutral-950" />
                </button>
              </div>

              {/* 2. Scrollable Section with Balanced, Compact Spacing - Entire Content Flows Naturally */}
              <div className="flex-1 overflow-y-auto px-5 py-2 flex flex-col justify-start space-y-2.5 scrollbar-thin bg-[#FAF8F4]">
                <div className="space-y-2">
                  <nav className="flex flex-col space-y-1">
                    {/* SHOP (WITH PREMIUM ACCORDION DROPDOWN) */}
                    <div className="py-0">
                      <button
                        onClick={() => setIsMobileShopOpen(!isMobileShopOpen)}
                        className="w-full flex items-center justify-between py-1 text-[13px] font-sans font-extrabold tracking-[1.5px] uppercase text-neutral-950 hover:text-gold-600 transition-colors cursor-pointer outline-none"
                      >
                        <span className="text-neutral-950 font-black">Shop Collections</span>
                        <ChevronDown
                          size={15}
                          strokeWidth={2.5}
                          className={`text-neutral-950 transition-transform duration-300 ${isMobileShopOpen ? "rotate-180 text-gold-600" : ""}`}
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {isMobileShopOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="py-0.5 mt-1 flex flex-col space-y-0.5 bg-white rounded-md px-3 py-1 border border-[#C8A96B]/20 shadow-xs">
                              <Link
                                to="/shop"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-[12px] tracking-[1.2px] uppercase font-bold py-1.5 transition-colors flex items-center justify-between border-b border-neutral-100 last:border-0 text-neutral-900 hover:text-gold-600"
                              >
                                <span className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-gold-600" />
                                  <span className="text-neutral-950 font-black">All Products</span>
                                </span>
                                <ChevronRight size={10} className="text-[#C8A96B]" />
                              </Link>
                              
                              <Link
                                to="/shop?category=Sarees"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-[12px] tracking-[1.2px] uppercase font-bold py-1.5 transition-colors flex items-center justify-between border-b border-neutral-100 last:border-0 text-neutral-900 hover:text-gold-600"
                              >
                                <span className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-gold-600" />
                                  <span className="text-neutral-950 font-black">Sarees</span>
                                </span>
                                <ChevronRight size={10} className="text-[#C8A96B]" />
                              </Link>

                              <Link
                                to="/shop?category=Linen Sarees"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-[12px] tracking-[1.2px] uppercase font-bold py-1.5 transition-colors flex items-center justify-between border-b border-neutral-100 last:border-0 text-neutral-900 hover:text-gold-600"
                              >
                                <span className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-gold-600" />
                                  <span className="text-neutral-950 font-black">Linen Sarees</span>
                                </span>
                                <ChevronRight size={10} className="text-[#C8A96B]" />
                              </Link>

                              <Link
                                to="/shop?category=Co-Ord Sets"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-[12px] tracking-[1.2px] uppercase font-bold py-1.5 transition-colors flex items-center justify-between last:border-0 text-neutral-900 hover:text-gold-600"
                              >
                                <span className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-gold-600" />
                                  <span className="text-neutral-950 font-black">Co-Ord Sets</span>
                                </span>
                                <ChevronRight size={10} className="text-[#C8A96B]" />
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </nav>

                  {/* INTEGRATED PREMIUM SEARCH BAR TRIGGER */}
                  <div className="pt-0">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsSearchOpen(true);
                      }}
                      className="w-full h-10 px-3.5 rounded-md border border-[#C8A96B]/30 hover:border-gold-500 transition-all flex items-center gap-2.5 text-left active:scale-[0.98] bg-white text-neutral-950 font-extrabold"
                    >
                      <Search size={14} strokeWidth={2.5} className="text-[#C8A96B] flex-shrink-0" />
                      <span className="text-[10.5px] tracking-[1.5px] uppercase font-bold text-neutral-950">
                        Search Collections...
                      </span>
                    </button>
                  </div>
                </div>

                {/* 3. Bottom Client Support & Social Integration info panel */}
                <div className="mt-auto pt-2 border-t border-[#C8A96B]/15 space-y-2">
                  <div className="space-y-1 bg-[#F7F4EF]/80 px-3 py-2 rounded-md border border-[#C8A96B]/15 shadow-3xs">
                    <span className="text-[7.5px] font-sans font-extrabold tracking-[2px] text-amber-900 uppercase block leading-none mb-1">
                      Customer Assistance
                    </span>
                    <a
                      href={`mailto:${CONFIG.STORE_EMAIL}`}
                      className="text-[10px] tracking-wider text-neutral-950 hover:text-gold-600 font-bold transition-colors flex items-center gap-1.5 font-sans break-all"
                    >
                      <Mail size={10} className="text-[#C8A96B] flex-shrink-0" />
                      <span className="text-neutral-900">{CONFIG.STORE_EMAIL}</span>
                    </a>
                    <a
                      href={`https://wa.me/${CONFIG.STORE_PHONE.replace(/[^0-9]/g, "")}?text=Hi!%20I%20Need%20Help.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] tracking-wider text-[#111111] hover:text-gold-600 font-bold transition-colors flex items-center gap-1.5 font-sans"
                    >
                      <Phone size={10} className="text-[#C8A96B] flex-shrink-0" />
                      <span className="text-neutral-900">{CONFIG.STORE_PHONE}</span>
                    </a>
                  </div>

                  {/* Luxury Rounded Social Icons Row */}
                  <div className="flex items-center justify-start space-x-3 pt-0.5">
                    <a
                      href="https://www.instagram.com/mukeshsarees_nagpur"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-6.5 h-6.5 rounded-full bg-white border border-[#C8A96B]/20 flex items-center justify-center text-[#2b2b2b] hover:border-gold-500 hover:text-gold-500 hover:scale-105 transition-all shadow-3xs"
                      aria-label="Instagram"
                    >
                      <Instagram size={11} strokeWidth={2} />
                    </a>
                    <a
                      href="https://www.facebook.com/Mukeshsareesindia/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-6.5 h-6.5 rounded-full bg-white border border-[#C8A96B]/20 flex items-center justify-center text-[#2b2b2b] hover:border-gold-500 hover:text-gold-500 hover:scale-105 transition-all shadow-3xs"
                      aria-label="Facebook"
                    >
                      <Facebook size={11} strokeWidth={2} />
                    </a>
                    <a
                      href="https://youtube.com/@mukeshsarees"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-6.5 h-6.5 rounded-full bg-white border border-[#C8A96B]/20 flex items-center justify-center text-[#2b2b2b] hover:border-gold-500 hover:text-gold-500 hover:scale-105 transition-all shadow-3xs"
                      aria-label="YouTube"
                    >
                      <Youtube size={11} strokeWidth={2} />
                    </a>
                  </div>

                  {/* Signature Branding Stamp */}
                  <div className="pt-2 text-center border-t border-[#C8A96B]/15">
                    <span className="text-[8px] font-sans font-extrabold tracking-[2px] text-neutral-950 uppercase block">
                      Mukesh Saree Centre
                    </span>
                    <span className="text-[7px] font-sans font-bold tracking-[1.5px] text-gold-600 uppercase block mt-0.5">
                      Nagpur, India • Est. 1978
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={`flex-grow flex flex-col ${!isHomePage ? "pt-[85px] md:pt-[95px]" : ""}`}
      >
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#f5f1eb] text-[#2b2b2b] pt-3 pb-6 md:pt-12 md:pb-10 border-t border-[#C8A96B]/25">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
          
          {/* Newsletter Section */}
          <div className="mb-6 md:mb-10 border-b border-[#2b2b2b]/10 pb-6 md:pb-8">
            <div className="max-w-xl mx-auto text-center">
              <h3 className="text-xs md:text-sm uppercase tracking-[0.25em] font-semibold text-[#2b2b2b] mb-2 sm:mb-3">
                JOIN THE MUKESH SAREE CENTRE FAMILY
              </h3>
              <p className="text-[11px] md:text-xs text-[#2b2b2b]/65 tracking-wider mb-4 sm:mb-5 leading-relaxed">
                Subscribe to receive early access to new collections, exclusive previews, and ethnic styling inspiration.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  name="email"
                  placeholder="ENTER YOUR EMAIL"
                  required
                  className="flex-grow bg-[#FAF8F5] border border-[#2b2b2b]/20 px-4 py-3 text-xs tracking-widest text-[#2b2b2b] placeholder-[#2b2b2b]/40 focus:outline-none focus:border-[#C8A96B] transition-colors"
                />
                <button
                  type="submit"
                  className="bg-[#2b2b2b] hover:bg-[#C8A96B] text-white hover:text-[#2b2b2b] transition-all duration-300 font-medium px-8 py-3 text-xs tracking-widest uppercase flex-shrink-0"
                >
                  Subscribe
                </button>
              </form>
              {subscribeStatus === "success" && (
                <p className="text-xs text-emerald-700 mt-3 tracking-wider font-medium">{subscribeMessage}</p>
              )}
              {subscribeStatus === "error" && (
                <p className="text-xs text-rose-700 mt-3 tracking-wider font-medium">{subscribeMessage}</p>
              )}
              <p className="text-[10px] text-[#2b2b2b]/40 tracking-wider mt-4">
                By subscribing, you agree to our Privacy Policy and consent to receive updates.
              </p>
            </div>
          </div>

          {/* Accordions / Navigation Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-0 md:gap-x-10 lg:gap-x-16">
            
            {/* 1. QUICK LINKS Accordion */}
            <div className="border-b border-[#2b2b2b]/10 md:border-b-0 py-0.5 md:py-0">
              <button
                onClick={() => toggleFooterAccordion("quick-links")}
                className="w-full flex items-center justify-between py-2 md:py-0 md:mb-4 md:pointer-events-none text-left"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#2b2b2b]">
                  QUICK LINKS
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 md:hidden text-[#2b2b2b]/50 ${
                    openFooterAccordion === "quick-links" ? "rotate-180" : ""
                  }`}
                />
              </button>
              
              <div
                className={`transition-all duration-300 ${
                  openFooterAccordion === "quick-links" ? "block animate-fadeIn" : "hidden"
                } md:block pb-5 md:pb-0`}
              >
                <ul className="space-y-3 text-[12.5px] text-[#2b2b2b]/75 tracking-wider">
                  <li>
                    <Link to="/shop?category=Sarees" className="hover:text-[#C8A96B] transition-colors">
                      Sarees
                    </Link>
                  </li>
                  <li>
                    <Link to="/shop?category=Lehengas" className="hover:text-[#C8A96B] transition-colors">
                      Lehengas
                    </Link>
                  </li>
                  <li>
                    <Link to="/shop?category=Co-Ord Sets" className="hover:text-[#C8A96B] transition-colors">
                      Co-Ord Sets
                    </Link>
                  </li>
                  <li>
                    <Link to="/shop?sort=new" className="hover:text-[#C8A96B] transition-colors">
                      New Arrivals
                    </Link>
                  </li>
                  <li>
                    <Link to="/shop?sort=best-selling" className="hover:text-[#C8A96B] transition-colors">
                      Best Sellers
                    </Link>
                  </li>

                </ul>
              </div>
            </div>

            {/* 2. SUPPORT Accordion */}
            <div className="border-b border-[#2b2b2b]/10 md:border-b-0 py-0.5 md:py-0">
              <button
                onClick={() => toggleFooterAccordion("support")}
                className="w-full flex items-center justify-between py-2 md:py-0 md:mb-4 md:pointer-events-none text-left"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#2b2b2b]">
                  SUPPORT
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 md:hidden text-[#2b2b2b]/50 ${
                    openFooterAccordion === "support" ? "rotate-180" : ""
                  }`}
                />
              </button>
              
              <div
                className={`transition-all duration-300 ${
                  openFooterAccordion === "support" ? "block animate-fadeIn" : "hidden"
                } md:block pb-5 md:pb-0`}
              >
                <ul className="space-y-3 text-[12.5px] text-[#2b2b2b]/75 tracking-wider">
                  <li>
                    <Link to="/contact" className="hover:text-[#C8A96B] transition-colors">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/shipping-policy" className="hover:text-[#C8A96B] transition-colors">
                      Shipping Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/return-policy" className="hover:text-[#C8A96B] transition-colors">
                      Returns & Exchanges
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms" className="hover:text-[#C8A96B] transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms" className="hover:text-[#C8A96B] transition-colors">
                      Privacy Policy
                    </Link>
                  </li>

                </ul>
              </div>
            </div>

            {/* 3. CONTACT Accordion (Elegant 2-column layout inside) */}
            <div className="border-b border-[#2b2b2b]/10 md:border-b-0 py-0.5 md:py-0">
              <button
                onClick={() => toggleFooterAccordion("contact")}
                className="w-full flex items-center justify-between py-2 md:py-0 md:mb-4 md:pointer-events-none text-left"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#2b2b2b]">
                  CONTACT
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 md:hidden text-[#2b2b2b]/50 ${
                    openFooterAccordion === "contact" ? "rotate-180" : ""
                  }`}
                />
              </button>
              
              <div
                className={`transition-all duration-300 ${
                  openFooterAccordion === "contact" ? "block animate-fadeIn" : "hidden"
                } md:block pb-5 md:pb-0`}
              >
                <div className="grid grid-cols-2 gap-4 text-xs tracking-wider">
                  <div>
                    <h5 className="text-[9px] font-bold uppercase tracking-widest text-[#2b2b2b]/40 mb-1">
                      CUSTOMER CARE
                    </h5>
                    <a
                      href={`mailto:${CONFIG.STORE_EMAIL}`}
                      className="text-[11.5px] text-[#2b2b2b] hover:text-[#C8A96B] transition-colors font-medium break-all"
                    >
                      {CONFIG.STORE_EMAIL}
                    </a>
                  </div>
                  <div>
                    <h5 className="text-[9px] font-bold uppercase tracking-widest text-[#2b2b2b]/40 mb-1">
                      WHATSAPP SUPPORT
                    </h5>
                    <a
                      href={`https://wa.me/${CONFIG.STORE_PHONE.replace(/[^0-9]/g, "")}?text=Hi!%20I%20Need%20Help.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11.5px] text-[#2b2b2b] hover:text-[#C8A96B] transition-colors font-medium whitespace-nowrap"
                    >
                      {CONFIG.STORE_PHONE}
                    </a>
                  </div>

                </div>
              </div>
            </div>



          </div>

          {/* Social Icons Section */}
          <div className="flex justify-center items-center gap-7 mt-6 md:mt-10 border-t border-[#2b2b2b]/10 pt-5">
            <a
              href="https://www.instagram.com/mukeshsarees_nagpur"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2b2b2b] hover:text-[#C8A96B] transition-colors p-2 hover:scale-105 transform active:scale-95 duration-200"
              aria-label="Instagram"
            >
              <Instagram size={20} strokeWidth={1.5} />
            </a>
            <a
              href="https://www.facebook.com/Mukeshsareesindia/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2b2b2b] hover:text-[#C8A96B] transition-colors p-2 hover:scale-105 transform active:scale-95 duration-200"
              aria-label="Facebook"
            >
              <Facebook size={20} strokeWidth={1.5} />
            </a>
            <a
              href="https://www.pinterest.com/MukeshSareesdotcom/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2b2b2b] hover:text-[#C8A96B] transition-colors p-2 hover:scale-105 transform active:scale-95 duration-200"
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
              className="text-[#2b2b2b] hover:text-[#C8A96B] transition-colors p-2 hover:scale-105 transform active:scale-95 duration-200"
              aria-label="YouTube"
            >
              <Youtube size={20} strokeWidth={1.5} />
            </a>
          </div>

          {/* Copyright Section */}
          <div className="mt-4 pt-3.5 border-t border-[#2b2b2b]/5 flex flex-col items-center">
            <p className="text-[10px] text-[#2b2b2b]/50 tracking-[0.1em] font-medium uppercase text-center leading-relaxed">
              © {new Date().getFullYear()} Mukesh Saree Centre. All Rights Reserved.
            </p>
          </div>

        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a
        id="whatsapp-float"
        href={`https://wa.me/${CONFIG.STORE_PHONE.replace(/[^0-9]/g, "")}?text=Hi!%20I%20Need%20Help.`}
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed right-4 z-[997] w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:scale-105 transition-transform ${location.pathname.startsWith("/product") ? "bottom-[140px] md:bottom-[24px]" : location.pathname === "/checkout" ? "bottom-[80px] md:bottom-[24px]" : "bottom-[24px]"}`}
        aria-label="Contact on WhatsApp"
      >
        <MessageCircle size={24} strokeWidth={1.5} />
      </a>
    </div>
  );
}
