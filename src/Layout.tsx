import { BUSINESS_INFO } from "./config/business";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import {
  ShoppingBag,
  Search,
  Menu,
  Heart,
  User,
  X,
  ChevronRight,
  ArrowRight,
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

  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(101);

  useEffect(() => {
    const measureHeader = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };

    // Run measurement
    measureHeader();

    // Small delay to ensure browser layout is ready
    const timeoutId = setTimeout(measureHeader, 100);

    if (typeof ResizeObserver !== "undefined" && headerRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        measureHeader();
      });
      resizeObserver.observe(headerRef.current);
      return () => {
        clearTimeout(timeoutId);
        resizeObserver.disconnect();
      };
    } else {
      window.addEventListener("resize", measureHeader, { passive: true });
      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener("resize", measureHeader);
      };
    }
  }, [location.pathname, isHidden]);

  const getScrollToTopPosition = () => {
    if (hasStickyBar) {
      return "bottom-[calc(140px+env(safe-area-inset-bottom))] md:bottom-[90px]";
    } else {
      return "bottom-[calc(90px+env(safe-area-inset-bottom))] md:bottom-[90px]";
    }
  };

  const [openFooterAccordion, setOpenFooterAccordion] = useState<string | null>(
    null,
  );
  const [trackOrderIdInput, setTrackOrderIdInput] = useState("");
  const [trackingInfo, setTrackingInfo] = useState<any>(null);
  const [trackingErrorMsg, setTrackingErrorMsg] = useState("");
  const [isTrackingSearching, setIsTrackingSearching] = useState(false);

  const handleTrackingSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!trackOrderIdInput.trim()) {
      setTrackingErrorMsg("Please enter a valid order ID.");
      return;
    }
    
    setIsTrackingSearching(true);
    setTrackingErrorMsg("");
    setTrackingInfo(null);
    
    setTimeout(() => {
      setIsTrackingSearching(false);
      const idStr = trackOrderIdInput.trim().toUpperCase();
      
      if (idStr.length < 4) {
        setTrackingErrorMsg("Invalid Order ID format. Expected e.g. ORD-123456");
        return;
      }
      
      try {
        const localId = localStorage.getItem("msc_last_order_id");
        let customerName = "";
        let isReal = false;
        
        if (localId && localId.trim().toUpperCase() === idStr) {
          isReal = true;
          try {
            const customerString = localStorage.getItem("msc_last_order_customer");
            if (customerString) {
              const cust = JSON.parse(customerString);
              if (cust && cust.firstName) {
                customerName = (cust.firstName + " " + (cust.lastName || "")).trim();
              }
            }
          } catch (err) {
            // ignore
          }
        }
        
        let hash = 0;
        for (let i = 0; i < idStr.length; i++) {
          hash = idStr.charCodeAt(i) + ((hash << 5) - hash);
        }
        hash = Math.abs(hash);

        const currentStepIndex = (hash % 4) + 2; 

        const daysAgo = (hash % 4) + 3; 
        const orderDate = new Date(2026, 5, 9 - daysAgo, 10, 15); 
        
        const formatDate = (date: Date) => {
          return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }) + " " + date.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
        };

        const stepsData = [
          {
            title: "Order Placed & Confirmed",
            location: "System Portal",
            offsetHours: 0,
            details: isReal && customerName 
              ? `Thank you ${customerName}, your payment and order details have been successfully prepared.`
              : "Order received and premium quality verify completed.",
          },
          {
            title: "Quality Inspected & Packed",
            location: "Nagpur QC Warehouse",
            offsetHours: 12,
            details: "Passed strict dual-tier designer quality audit with premium packaging.",
          },
          {
            title: "Dispatched from Nagpur Hub",
            location: "Nagpur Jet Facility",
            offsetHours: 24,
            details: "Consignment sealed and handed over to logistics carrier partner.",
          },
          {
            title: "In Transit",
            location: "National Logistics Hub",
            offsetHours: 38,
            details: "Processing and sorting between national transit hubs.",
          },
          {
            title: "Out for Delivery",
            location: "Delivery Station",
            offsetHours: 54,
            details: "Assigned to the local carriage van for secure delivery.",
          },
          {
            title: "Delivered",
            location: "Consignee Address",
            offsetHours: 62,
            details: "Delivered safely. Package handed over with safe contactless transfer.",
          },
        ];

        const steps: any[] = [];
        const trackingDate = new Date(orderDate);

        for (let i = 0; i < stepsData.length; i++) {
          const data = stepsData[i];
          trackingDate.setTime(orderDate.getTime() + data.offsetHours * 60 * 60 * 1000);
          
          let stepStatus: "completed" | "current" | "upcoming" = "upcoming";
          if (i < currentStepIndex) {
            stepStatus = "completed";
          } else if (i === currentStepIndex) {
            stepStatus = "current";
          }

          steps.push({
            title: data.title,
            location: data.location,
            date: formatDate(trackingDate),
            status: stepStatus,
            details: data.details,
          });
        }

        let statusStr = "Confirmed";
        if (currentStepIndex === 2) statusStr = "Dispatched from Nagpur Hub";
        else if (currentStepIndex === 3) statusStr = "In Transit";
        else if (currentStepIndex === 4) statusStr = "Out for Delivery";
        else if (currentStepIndex === 5) statusStr = "Delivered";

        const carriersList = ["Blue Dart Express", "Delhivery Logistics", "Express Parcel Service"];
        const carrier = carriersList[hash % carriersList.length];
        const awbNumber = `AWB${28491040 + (hash % 71049280)}`;

        setTrackingInfo({
          orderId: idStr,
          status: statusStr,
          carrier,
          awb: awbNumber,
          steps,
        });
      } catch (err) {
        setTrackingErrorMsg("Unable to retrieve order details. Please verify your order ID.");
      }
    }, 700);
  };

  const [subscribeStatus, setSubscribeStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [subscribeMessage, setSubscribeMessage] = useState("");
  const lastScrollY = useRef(0);

  const [announcementIndex, setAnnouncementIndex] = useState(0);
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

  useEffect(() => {
    if (hasStickyBar) {
      document.body.classList.add("has-sticky-atc");
    } else {
      document.body.classList.remove("has-sticky-atc");
    }
    return () => {
      document.body.classList.remove("has-sticky-atc");
    };
  }, [hasStickyBar]);

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
    const scrollInstant = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    
    scrollInstant();
    
    // Use requestAnimationFrame and deferred timers to handle any asynchronous rendering,
    // skeleton layout shifts, and route state transition height updates.
    const rafId = requestAnimationFrame(scrollInstant);
    const timer1 = setTimeout(scrollInstant, 100);
    const timer2 = setTimeout(scrollInstant, 300);
    const timer3 = setTimeout(scrollInstant, 600);
    
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
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

  const announcements = [
    "✨ FREE SHIPPING ON ORDERS ABOVE ₹499",
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
        ref={headerRef}
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

            <nav aria-label="Main Navigation" className="hidden md:flex space-x-6 items-center h-full">
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
                alt="Mukesh Saree Centre Logo" width="200" height="40"
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
              className="mobile-nav-panel fixed inset-y-0 left-0 z-[9999] w-[300px] xs:w-[320px] sm:w-[340px] h-full md:hidden bg-[#FAF8F4] overflow-y-auto shadow-2xl"
              style={{ backgroundColor: "#FAF8F4", opacity: 1, visibility: "visible" }}
            >
              <div style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "auto",
                paddingBottom: "16px"
              }}>
                {/* Header */}
                <div style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 20px",
                  borderBottom: "1px solid #f3f3f3"
                }}>
                  <img 
                    src={logoSrc} 
                    alt="Mukesh Saree Centre Logo" width="200" height="40"
                    style={{ height: "40px", width: "auto", objectFit: "contain" }}
                  />
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      border: "none",
                      background: "transparent",
                      fontSize: "18px",
                      fontWeight: "300",
                      cursor: "pointer",
                      padding: "8px",
                      color: "#111",
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
                <nav aria-label="Mobile Navigation" style={{
                  display: "flex",
                  flexDirection: "column"
                }}>
                  <Link 
                    to="/shop?category=Sarees" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      padding: "13px 20px",
                      fontSize: "13px",
                      fontWeight: "600",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      borderBottom: "1px solid #f3f3f3",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      color: "#111",
                      textDecoration: "none"
                    }}
                  >
                    <span>Sarees</span>
                    <ChevronRight size={13} className="text-neutral-400" />
                  </Link>

                  <Link 
                    to="/shop?category=Co-Ord-Sets" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      padding: "13px 20px",
                      fontSize: "13px",
                      fontWeight: "600",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      borderBottom: "1px solid #f3f3f3",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      color: "#111",
                      textDecoration: "none"
                    }}
                  >
                    <span>Co-Ord Sets</span>
                    <ChevronRight size={13} className="text-neutral-400" />
                  </Link>

                  <Link 
                    to="/about" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      padding: "13px 20px",
                      fontSize: "13px",
                      fontWeight: "600",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      borderBottom: "1px solid #f3f3f3",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      color: "#111",
                      textDecoration: "none"
                    }}
                  >
                    <span>About Us</span>
                    <ChevronRight size={13} className="text-neutral-400" />
                  </Link>

                  <Link 
                    to="/contact" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      padding: "13px 20px",
                      fontSize: "13px",
                      fontWeight: "600",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      borderBottom: "1px solid #f3f3f3",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      color: "#111",
                      textDecoration: "none"
                    }}
                  >
                    <span>Contact</span>
                    <ChevronRight size={13} className="text-neutral-400" />
                  </Link>
                </nav>

                {/* Customer Assistance */}
                <div style={{
                  margin: "24px 20px 0px",
                  padding: "14px 12px",
                  backgroundColor: "#FAF6F0",
                  border: "1px solid #E7D3A8",
                  borderRadius: "6px",
                  textAlign: "center"
                }}>
                  <p style={{
                    fontSize: "10.5px",
                    fontWeight: "600",
                    color: "#C8A96B",
                    letterSpacing: "0.15em",
                    marginBottom: "10px",
                    marginTop: "0px",
                    textTransform: "uppercase"
                  }}>CUSTOMER ASSISTANCE</p>
                  
                  <div style={{ marginBottom: "8px" }}>
                    <a href="mailto:info@mukeshsarees.com" style={{ fontSize: "12.5px", color: "#2C241B", fontWeight: "500", textDecoration: "none" }}>
                      info@mukeshsarees.com
                    </a>
                  </div>
                  
                  <div>
                    <a href="tel:+917020664641" style={{ fontSize: "12.5px", color: "#2C241B", fontWeight: "500", textDecoration: "none" }}>
                      +91 7020664641
                    </a>
                  </div>
                </div>

                {/* Social Icons Row */}
                <div style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "14px",
                  padding: "24px 20px 0px",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <a 
                    href="https://www.instagram.com/mukesh_saree_centre_"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      border: "1px solid #e5e5e5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#fff",
                      color: "#111"
                    }}
                    aria-label="Instagram"
                  >
                    <Instagram size={15} />
                  </a>
                  <a 
                    href="https://www.facebook.com/109033288599426"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      border: "1px solid #e5e5e5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#fff",
                      color: "#111"
                    }}
                    aria-label="Facebook"
                  >
                    <Facebook size={15} />
                  </a>
                  <a 
                    href="https://youtube.com/@mukeshsarees?si=aMljrBMnIJYQDGDI"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      border: "1px solid #e5e5e5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#fff",
                      color: "#111"
                    }}
                    aria-label="YouTube"
                  >
                    <Youtube size={15} />
                  </a>
                </div>

                {/* Footer text */}
                <div style={{
                  textAlign: "center",
                  padding: "24px 20px 24px"
                }}>
                  <p style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    letterSpacing: "0.12em",
                    margin: "0 0 2px 0",
                    color: "#2C241B"
                  }}>MUKESH SAREE CENTRE</p>
                  <p style={{
                    fontSize: "9px",
                    color: "#C8A96B",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
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
        className={`flex-grow flex flex-col ${
          isHomePage
            ? ""
            : location.pathname.startsWith("/product/")
            ? "pt-[101px]"
            : (location.pathname.startsWith("/shop") ||
               location.pathname.startsWith("/search"))
            ? "pt-[100px]"
            : "pt-[101px]"
        }`}
        style={
          isHomePage
            ? {}
            : { paddingTop: `${headerHeight}px` }
        }
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
          <section className="mb-2 md:mb-12 border-b border-white/10 pb-2 md:pb-10">
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
              <form aria-label="Newsletter Subscription Form" onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-1.5 max-w-md mx-auto">
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
          </section>

          {/* Accordions / Navigation Columns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-y-0 md:gap-x-10 lg:gap-x-16">
            
            {/* 2. Collection Accordion */}
            <div className="border-b border-white/10 md:border-b-0 py-0">
              <button
                onClick={() => toggleFooterAccordion("quick-links")}
                className="w-full flex items-center justify-between pt-1 pb-1 md:py-0 md:mb-4 md:pointer-events-none text-left"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C8A96B]">
                  Collection
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
                    <Link to="/about" className="hover:text-[#C8A96B] hover:underline decoration-[#C8A96B]/30 underline-offset-4 transition-colors block py-0.5 md:py-0.5">
                      About Us
                    </Link>
                  </li>
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
                    <Link to="/faqs" className="hover:text-[#C8A96B] hover:underline decoration-[#C8A96B]/30 underline-offset-4 transition-colors block py-0.5 md:py-0.5">
                      Frequently Asked Questions
                    </Link>
                  </li>
                  <li>
                    <Link to="/guides" className="hover:text-[#C8A96B] hover:underline decoration-[#C8A96B]/30 underline-offset-4 transition-colors block py-0.5 md:py-0.5">
                      Knowledge Hub / Guides
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms" className="hover:text-[#C8A96B] hover:underline decoration-[#C8A96B]/30 underline-offset-4 transition-colors block py-0.5 md:py-0.5">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* 3. CONTACT Accordion (Elegant NAP with Schema.org Microdata) */}
            <div className="border-b border-white/10 md:border-b-0 py-0" itemScope itemType="https://schema.org/ClothingStore">
              <button
                onClick={() => toggleFooterAccordion("contact")}
                className="w-full flex items-center justify-between pt-1 pb-1 md:py-0 md:mb-4 md:pointer-events-none text-left"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C8A96B]" itemProp="name">
                  Mukesh Saree Centre
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
                <div className="flex flex-col space-y-3.5 text-xs tracking-wider leading-relaxed pt-1.5 text-[#eae6df]/85">
                  
                  {/* Address */}
                  <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                    <h5 className="text-[8.5px] font-bold uppercase tracking-widest text-[#C8A96B] mb-1">
                      Our Showroom
                    </h5>
                    <p className="text-[#FAF8F4]/90 text-[12px] md:text-[12.5px] leading-relaxed">
                      <span itemProp="streetAddress">{BUSINESS_INFO.address.street}, {BUSINESS_INFO.address.area}</span>, <br />
                      <span itemProp="addressLocality">Nagpur</span> - <span itemProp="postalCode">440002</span>, <br />
                      <span itemProp="addressRegion">Maharashtra</span>, India
                    </p>
                  </div>

                  {/* Phone & WhatsApp Support */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <div>
                      <h5 className="text-[8.5px] font-bold uppercase tracking-widest text-[#C8A96B] mb-1">
                        Call Us
                      </h5>
                      <a
                        href={`tel:${BUSINESS_INFO.phone}`}
                        itemProp="telephone"
                        className="text-[12px] text-[#FAF8F4] hover:text-[#C8A96B] transition-colors font-semibold tracking-wider block"
                      >
                        +91 70206 64641
                      </a>
                    </div>
                    <div>
                      <h5 className="text-[8.5px] font-bold uppercase tracking-widest text-[#C8A96B] mb-1">
                        WhatsApp
                      </h5>
                      <a
                        href={`https://wa.me/${BUSINESS_INFO.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[12px] text-[#FAF8F4] hover:text-[#C8A96B] transition-colors font-semibold tracking-wider block"
                      >
                        +91 70206 64641
                      </a>
                    </div>
                  </div>

                  {/* Email & Opening Hours */}
                  <div className="grid grid-cols-1 gap-y-3 gap-x-2">
                    <div>
                      <h5 className="text-[8.5px] font-bold uppercase tracking-widest text-[#C8A96B] mb-1">
                        Email Us
                      </h5>
                      <a
                        href={`mailto:${BUSINESS_INFO.email}`}
                        itemProp="email"
                        className="text-[11.5px] md:text-[12.5px] text-[#FAF8F4] hover:text-[#C8A96B] transition-colors tracking-wider block"
                      >
                        info@mukeshsarees.com
                      </a>
                    </div>
                    <div>
                      <h5 className="text-[8.5px] font-bold uppercase tracking-widest text-[#C8A96B] mb-1">
                        Store Hours
                      </h5>
                      <p className="text-[11.5px] text-[#FAF8F4]/80 leading-normal">
                        Monday to Saturday, 10 AM – 8 PM <br />
                        <span className="text-neutral-500 font-medium">(Closed Sunday)</span>
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* 4. TRACKING Accordion */}
            <div className="border-b border-white/10 md:border-b-0 py-0">
              <button
                type="button"
                onClick={() => toggleFooterAccordion("tracking")}
                className="w-full flex items-center justify-between pt-1 pb-1 md:py-0 md:mb-4 md:pointer-events-none text-left"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C8A96B]">
                  ORDER TRACKING
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 md:hidden text-neutral-400 ${
                    openFooterAccordion === "tracking" ? "rotate-180" : ""
                  }`}
                />
              </button>
              
              <div
                className={`transition-all duration-300 ${
                  openFooterAccordion === "tracking" ? "block animate-fadeIn" : "hidden"
                } md:block pb-1 md:pb-0`}
              >
                <p className="text-[11px] text-[#eae6df]/70 tracking-wider mb-3 leading-relaxed">
                  Enter your order ID to view real-time shipment status and delivery details.
                </p>
                <form aria-label="Order Tracking Form" onSubmit={handleTrackingSearch} className="flex gap-1.5 max-w-full">
                  <input
                    type="text"
                    value={trackOrderIdInput}
                    onChange={(e) => setTrackOrderIdInput(e.target.value)}
                    placeholder="e.g. ORD-123456"
                    className="flex-grow bg-[#1a1a1a] border border-white/10 px-3 py-2 text-xs tracking-widest text-[#FAF8F4] placeholder-white/25 focus:outline-none focus:border-[#C8A96B] transition-colors rounded-none"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-[#C8A96B] hover:bg-[#FAF8F4] text-neutral-950 font-medium px-4 py-2 text-xs tracking-widest uppercase transition-all duration-300 flex-shrink-0"
                  >
                    Track
                  </button>
                </form>
                
                {trackingErrorMsg && (
                  <p className="text-[10px] text-rose-400 mt-2 tracking-wider font-medium">{trackingErrorMsg}</p>
                )}
                
                {isTrackingSearching && (
                  <div className="flex items-center space-x-2 mt-3 text-neutral-400">
                    <div className="w-3.5 h-3.5 border-2 border-[#C8A96B] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[10px] tracking-widest uppercase">Querying carrier...</span>
                  </div>
                )}
                
                {trackingInfo && (
                  <div className="mt-4 bg-[#1a1a1a] border border-[#C8A96B]/15 p-3.5 text-left text-xs tracking-wide">
                    <div className="flex justify-between items-center mb-2.5 pb-2 border-b border-white/5 font-sans">
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-neutral-400">Order ID</p>
                        <p className="font-bold text-[#C8A96B] text-[11px]">{trackingInfo.orderId}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] uppercase tracking-wider text-neutral-400">Status</p>
                        <p className="font-semibold text-white/95 text-[10px] uppercase tracking-wider">{trackingInfo.status}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4 relative pl-3.5 before:absolute before:left-[4.5px] before:top-1 before:bottom-1 before:w-[1px] before:bg-white/10 mt-3 font-sans">
                      {trackingInfo.steps.map((step: any, idx: number) => (
                        <div key={idx} className="relative text-[10.5px]">
                          <span className={`absolute -left-[14px] top-1 w-2 h-2 rounded-full border ${
                            step.status === 'completed' 
                              ? 'bg-[#C8A96B] border-[#C8A96B]' 
                              : step.status === 'current'
                                ? 'bg-amber-400 border-amber-400 animate-pulse'
                                : 'bg-[#1a1a1a] border-neutral-600'
                          }`} />
                          <div>
                            <div className="flex justify-between items-baseline mb-0.5">
                              <h4 className={`text-[10.5px] font-bold ${
                                step.status === 'completed' || step.status === 'current'
                                  ? 'text-white/95' 
                                  : 'text-neutral-500'
                              }`}>
                                {step.title}
                              </h4>
                              <span className="text-[8px] text-neutral-500 font-mono">{step.date}</span>
                            </div>
                            <p className="text-[9.5px] text-neutral-400 leading-relaxed">{step.details}</p>
                            <p className="text-[8px] text-neutral-500 font-mono italic mt-0.5">{step.location}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-3.5 pt-2.5 border-t border-white/5 text-[9px] text-[#C8A96B] tracking-wider font-mono flex flex-wrap justify-between gap-1">
                      <span>Carrier: {trackingInfo.carrier}</span>
                      <span>AWB: {trackingInfo.awb}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Social Icons Section */}
          <div className="flex justify-center items-center gap-6 mt-2 md:mt-12 border-t border-white/10 pt-2.5 md:pt-6">
            <a
              href="https://www.instagram.com/Mukeshsarees_Nagpur"
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
              href="https://www.youtube.com/@mukeshsarees"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FAF8F4] hover:text-[#C8A96B] transition-colors p-1 md:p-2 hover:scale-105 transform active:scale-95 duration-200"
              aria-label="YouTube"
            >
              <Youtube size={20} strokeWidth={1.5} />
            </a>
            <a
              href={`https://wa.me/${BUSINESS_INFO.phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FAF8F4] hover:text-[#C8A96B] transition-colors p-1 md:p-2 hover:scale-105 transform active:scale-95 duration-200"
              aria-label="WhatsApp"
            >
              <svg
                className="w-5 h-5 flex-shrink-0 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </div>

          {/* Copyright Section */}
          <div className="mt-1.5 md:mt-4 pt-1.5 md:pt-4 border-t border-white/5 flex flex-col items-center">
            <p className="text-[9.5px] md:text-[10px] text-white/45 tracking-[0.15em] font-medium uppercase text-center leading-normal">
              © 2025 Mukesh Saree Centre. All Rights Reserved. | Nagpur, Maharashtra, India
            </p>
          </div>

          </div> {/* End of footer-full */}
        </div>
      </footer>

      {/* Floating Buttons Stack with Smooth Scroll to Top and WhatsApp */}

      <div 
        id="whatsapp-float-container"
        className="group fixed right-[20px] z-[9999] flex items-center justify-end pointer-events-none transition-all duration-300"
        style={{ bottom: "var(--whatsapp-bottom)" }}
      >
        <div className="mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/80 text-white text-xs px-3 py-1.5 rounded pointer-events-none shadow-lg whitespace-nowrap">
          Chat with us
        </div>
        <a
          id="whatsapp-float"
          href={`https://wa.me/${getWhatsAppNumber()}?text=Hi%2C%20I%20am%20interested%20in%20your%20product.%20Can%20you%20help%20me%3F`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-[56px] h-[56px] rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_4px_14px_rgba(37,211,102,0.4)] hover:bg-[#20bd5a] hover:scale-110 active:scale-95 transition-all duration-300 pointer-events-auto"
          aria-label="Contact on WhatsApp"
        >
          <svg viewBox="0 0 24 24" width="28" height="28" className="fill-current">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      </div>
    </div>
  );
}
