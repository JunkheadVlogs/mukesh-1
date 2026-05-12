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
} from "lucide-react";
import { useStore } from "./store";
import { useState, useEffect, useRef } from "react";
import type { FormEvent } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { products } from "./mockData";
import { CONFIG } from "./config";
import { formatPrice } from "./utils";
import { OptimizedImage } from "./components/OptimizedImage";

export default function Layout() {
  const { cart } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileShopOpen, setIsMobileShopOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [openFooterAccordion, setOpenFooterAccordion] = useState<string | null>(
    null,
  );
  const [subscribeStatus, setSubscribeStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [subscribeMessage, setSubscribeMessage] = useState("");
  const lastScrollY = useRef(0);

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

  useEffect(() => {
    // Scroll to top on pathname OR search change
    // This ensures that even params changes like ?category=Sarees from footer trigger top scroll
    window.scrollTo(0, 0);
  }, [location.pathname, new URLSearchParams(location.search).get("category")]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);

      // Hide header when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY.current && currentScrollY > 200) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setSearchQuery("");
  }, [location.pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredProducts = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.fabric.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .slice(0, 5)
    : [];

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const isTransparent = isHomePage && !isScrolled && !isMobileMenuOpen;
  const headerBg = isTransparent
    ? "bg-transparent"
    : "bg-primary-50/80 backdrop-blur-xl shadow-sm";
  const textColor = isTransparent ? "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" : "text-primary-950";
  const iconColor = isTransparent ? "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" : "text-primary-950";

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
            className="fixed inset-0 z-[100] bg-primary-50 flex flex-col text-primary-950"
          >
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-10">
              <div className="h-20 flex items-center justify-between border-b border-black/5">
                <div
                  className="text-[12px] uppercase tracking-[2px] font-medium"
                  id="search-title"
                >
                  Search
                </div>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="text-primary-950 hover:text-gold-500 transition-colors p-2"
                  aria-label="Close search"
                >
                  <X size={24} strokeWidth={1} />
                </button>
              </div>

              <div className="py-12 md:py-20">
                <form
                  onSubmit={handleSearchSubmit}
                  className="relative max-w-3xl mx-auto"
                  role="search"
                  aria-labelledby="search-title"
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for sarees, co-ords, fabrics..."
                    aria-label="Search for products"
                    className="w-full text-2xl md:text-3xl font-serif text-primary-950 border-b border-black/10 pb-4 focus:outline-none focus:border-gold-500 placeholder-primary-950/20"
                  />
                  <button
                    type="submit"
                    aria-label="Submit search"
                    className="absolute right-0 bottom-6 text-primary-950 hover:text-gold-500 transition-colors"
                  >
                    <Search size={28} strokeWidth={1} />
                  </button>
                </form>

                <div className="max-w-3xl mx-auto mt-12">
                  {searchQuery && filteredProducts.length > 0 ? (
                    <div className="space-y-6">
                      <div className="text-[10px] uppercase tracking-[2px] text-primary-950/40">
                        Results
                      </div>
                      <div className="grid grid-cols-1 gap-6">
                        {filteredProducts.map((product) => (
                          <Link
                            key={product.id}
                            to={`/product/${product.slug}`}
                            className="flex items-center gap-6 group"
                          >
                            <div className="w-20 aspect-[9/16] bg-transparent overflow-hidden rounded-sm flex-shrink-0">
                              <OptimizedImage
                                src={product.image}
                                width={100}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform transform-gpu"
                              />
                            </div>
                            <div className="flex-grow">
                              <div className="text-[10px] uppercase tracking-[1px] text-gold-500 mb-1">
                                {product.category}
                              </div>
                              <h4 className="text-lg font-serif text-primary-950 group-hover:text-gold-500 transition-colors">
                                {product.name}
                              </h4>
                              <div className="text-sm font-medium text-primary-950/60 mt-1">
                                ₹{product.price.toLocaleString()}
                              </div>
                            </div>
                            <ArrowRight
                              size={20}
                              className="text-primary-950/20 group-hover:text-gold-500 transition-colors"
                            />
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : searchQuery ? (
                    <div className="text-center py-20 bg-primary-50 rounded-sm">
                      <Search size={40} strokeWidth={1} className="mx-auto text-primary-950/20 mb-4" />
                      <p className="text-primary-950/60">
                        No products found for "{searchQuery}"
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="text-[10px] uppercase tracking-[2px] text-primary-950/40 mb-6">
                        Quick Links
                      </div>
                      <div className="flex flex-wrap gap-4">
                        {[
                          "Organza",
                          "Kanjeevaram",
                          "Co-Ord Sets",
                          "New Arrivals",
                        ].map((term) => (
                          <button
                            key={term}
                            onClick={() => setSearchQuery(term)}
                            className="px-4 py-2 border border-black/5 rounded-full text-xs uppercase tracking-[1px] hover:border-gold-500 hover:text-gold-500 transition-all font-medium"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 flex-col will-change-transform transform-gpu ${headerBg} ${
          isHidden ? "-translate-y-full" : "translate-y-0"
        } ${isScrolled ? "border-b border-black/5" : "border-b-0"} flex`}
      >
        <div className="bg-primary-950 text-gold-400 text-center py-1.5 px-4 w-full text-[10px] sm:text-[11px] font-medium tracking-[2px] md:tracking-[3px] uppercase flex items-center justify-center gap-2 relative z-[60]">
          <span>THE LUXURY EDIT • 50% OFF ON ALL PRODUCTS</span>
        </div>
        
        <div className={`transition-all duration-500 w-full px-3 md:px-4 sm:px-10 max-w-7xl mx-auto ${isScrolled ? "py-1" : "py-2 md:py-3"}`}>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`${iconColor} focus:outline-none transition-colors ml-[-4px] p-1.5`}
                aria-expanded={isMobileMenuOpen}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? (
                  <X size={20} strokeWidth={1} />
                ) : (
                  <Menu size={20} strokeWidth={1} />
                )}
              </button>
            </div>

            <div className="flex-shrink-0 flex flex-col items-center justify-center flex-1 md:flex-none">
              <Link
                to="/"
                onClick={scrollToTop}
                className="flex flex-col items-center group transition-all duration-500 transform"
              >
                <span className={`text-[16px] md:text-2xl font-serif font-medium ${textColor} tracking-[3px] md:tracking-[10px] uppercase text-center leading-none transition-all group-hover:text-gold-500`}>
                  MUKESH
                </span>
                <div className="flex items-center gap-2 md:gap-3 w-full mt-1 md:mt-1.5 px-1">
                  <div className={`h-[1px] flex-1 ${isTransparent ? "bg-white/30" : "bg-primary-950/10"} group-hover:bg-gold-500/20 transition-colors`} />
                  <span className={`text-[7px] md:text-[9px] font-sans font-medium tracking-[3px] md:tracking-[6px] uppercase ${isTransparent ? "text-white/80 drop-shadow-md" : "text-primary-950/60"} transition-colors group-hover:text-gold-600 whitespace-nowrap`}>
                    Saree Centre
                  </span>
                  <div className={`h-[1px] flex-1 ${isTransparent ? "bg-white/30" : "bg-primary-950/10"} group-hover:bg-gold-500/20 transition-colors`} />
                </div>
                <div className="h-[2px] w-0 bg-gold-400/30 group-hover:w-1/2 transition-all duration-700 mt-0.5" />
              </Link>
            </div>

            <nav className="hidden md:flex flex-1 justify-center space-x-8 items-center h-full">
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
                  Shop <ChevronDown size={14} className="ml-1 opacity-70 group-hover:rotate-180 transition-transform duration-300" />
                </Link>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-48 bg-white border border-black/5 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top translate-y-2 group-hover:translate-y-0 z-50">
                  <div className="py-2 flex flex-col">
                    <Link to="/shop" className="px-6 py-2.5 text-[11px] tracking-[1.5px] uppercase font-medium text-primary-950 hover:bg-gold-50 hover:text-gold-600 transition-colors">All Products</Link>
                    <Link to="/shop?category=Sarees" className="px-6 py-2.5 text-[11px] tracking-[1.5px] uppercase font-medium text-primary-950 hover:bg-gold-50 hover:text-gold-600 transition-colors">Sarees</Link>
                    <Link to="/shop?category=Co-Ord Sets" className="px-6 py-2.5 text-[11px] tracking-[1.5px] uppercase font-medium text-primary-950 hover:bg-gold-50 hover:text-gold-600 transition-colors">Co-Ord Sets</Link>
                  </div>
                </div>
              </div>
              <Link
                to="/about"
                className={`text-[11px] tracking-[2px] uppercase font-medium ${textColor} hover:text-gold-500 transition-colors py-4`}
              >
                Legacy
              </Link>
            </nav>

            <div className="flex items-center justify-end space-x-2 sm:space-x-4 md:space-x-6 md:flex-1">
              <button
                onClick={() => setIsSearchOpen(true)}
                className={`${iconColor} hover:text-gold-500 transition-all block p-1 md:p-1.5`}
                aria-label="Search"
              >
                <Search size={20} strokeWidth={1} />
              </button>
              {/* Wishlist Icon Removed */}
              <Link
                to="/cart"
                className={`${iconColor} hover:text-gold-500 transition-all relative flex items-center p-2`}
                aria-label="Cart"
              >
                <motion.div
                  animate={cartBadgeHighlight ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, -10, 0] } : {}}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <ShoppingBag size={20} strokeWidth={1} />
                </motion.div>
                <AnimatePresence>
                  {cartItemCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: cartBadgeHighlight ? [1, 1.3, 1] : 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className={`absolute top-0 right-0 text-white text-[8px] md:text-[9px] px-1 md:px-1.5 py-[1px] md:py-0.5 rounded-full min-w-[14px] md:min-w-[16px] text-center font-medium shadow-sm transition-colors ${cartBadgeHighlight ? 'bg-black' : 'bg-gold-600'}`}
                    >
                      {cartItemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden bg-primary-50 overflow-hidden border-t border-black/5"
            >
              <div className="px-5 py-6 flex flex-col space-y-5">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-[13px] tracking-[2px] uppercase font-medium text-primary-950 flex items-center justify-between py-1">Home</Link>
                <div className="flex flex-col">
                  <div className="flex items-center justify-between cursor-pointer py-1" onClick={() => setIsMobileShopOpen(!isMobileShopOpen)}>
                    <span className="text-[13px] tracking-[2px] uppercase font-medium text-primary-950">Shop</span>
                    <ChevronDown size={16} className={`text-primary-950/70 transition-transform duration-300 ${isMobileShopOpen ? "rotate-180" : ""}`} />
                  </div>
                  <AnimatePresence>
                    {isMobileShopOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="flex flex-col pl-4 mt-4 border-l border-gold-500/30 overflow-hidden"
                      >
                        <div className="flex flex-col space-y-5 py-2">
                          <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="text-[12px] tracking-[1.5px] uppercase font-medium text-primary-950/80 hover:text-gold-600">All Products</Link>
                          <Link to="/shop?category=Sarees" onClick={() => setIsMobileMenuOpen(false)} className="text-[12px] tracking-[1.5px] uppercase font-medium text-primary-950/80 hover:text-gold-600">Sarees</Link>
                          <Link to="/shop?category=Co-Ord Sets" onClick={() => setIsMobileMenuOpen(false)} className="text-[12px] tracking-[1.5px] uppercase font-medium text-primary-950/80 hover:text-gold-600">Co-Ord Sets</Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-[13px] tracking-[2px] uppercase font-medium text-primary-950 flex items-center justify-between py-1">Our Legacy</Link>
                
                <div className="border-t border-black/5 pt-5 mt-2 flex flex-col space-y-5">
                  {/* Wishlist Mobile Link Removed */}
                  <button onClick={() => { setIsMobileMenuOpen(false); setIsSearchOpen(true); }} className="flex items-center gap-3 text-[13px] tracking-[2px] uppercase font-medium text-primary-950 text-left py-1">
                    <Search size={18} strokeWidth={1.5} /> Search
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className={`flex-grow flex flex-col ${isHomePage ? "" : "pt-[80px] md:pt-[100px]"}`}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-primary-50 border-t border-black/5 mt-auto" style={{ paddingTop: '20px', paddingBottom: '10px', lineHeight: 1.2 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 pb-4 border-b border-black/5 gap-4 text-center md:text-left">
            <div className="text-[11px] uppercase tracking-[1px] text-primary-950/70 flex flex-wrap justify-center items-center gap-2">
              <span>Since 1976 Legacy</span>
              <span className="w-1 h-1 bg-gold-500 rounded-full mx-1" />
              <span>Premium Quality</span>
              <span className="w-1 h-1 bg-gold-500 rounded-full mx-1" />
              <span>COD AVAILABLE</span>
              <span className="w-1 h-1 bg-gold-500 rounded-full mx-1" />
              <span>Affordable Luxury</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] uppercase tracking-[1px] opacity-50">Follow Us: @MukeshSareeCentre</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-4">
            <div className="border-b border-black/5 md:border-none pb-4 md:pb-0">
              <button 
                onClick={() => toggleFooterAccordion('quickLinks')}
                className="flex items-center justify-between w-full md:cursor-default"
              >
                <h4 className="text-[11px] uppercase tracking-[2px] font-medium text-primary-950 md:mb-6">Quick Links</h4>
                <ChevronDown size={16} className={`md:hidden transition-transform duration-300 ${openFooterAccordion === 'quickLinks' ? "rotate-180" : ""}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 md:!h-auto md:!opacity-100 ${openFooterAccordion === 'quickLinks' ? "max-h-48 opacity-100 mt-4" : "max-h-0 opacity-0 md:mt-0"}`}>
                <ul className="space-y-3 text-sm text-primary-950/70 pb-4 md:pb-0">
                  <li><Link to="/shop" className="hover:text-gold-500 transition-colors">Shop All</Link></li>
                  <li><Link to="/about" className="hover:text-gold-500 transition-colors">Our Legacy</Link></li>
                  <li><Link to="/terms" className="hover:text-gold-500 transition-colors">Terms & Conditions</Link></li>
                </ul>
              </div>
            </div>

            <div className="border-b border-black/5 md:border-none pb-4 md:pb-0">
              <button 
                onClick={() => toggleFooterAccordion('categories')}
                className="flex items-center justify-between w-full md:cursor-default"
              >
                <h4 className="text-[11px] uppercase tracking-[2px] font-medium text-primary-950 md:mb-6">Categories</h4>
                <ChevronDown size={16} className={`md:hidden transition-transform duration-300 ${openFooterAccordion === 'categories' ? "rotate-180" : ""}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 md:!h-auto md:!opacity-100 ${openFooterAccordion === 'categories' ? "max-h-48 opacity-100 mt-4" : "max-h-0 opacity-0 md:mt-0"}`}>
                <ul className="space-y-3 text-sm text-primary-950/70 pb-4 md:pb-0">
                  <li><Link to="/shop?category=Sarees" className="hover:text-gold-500 transition-colors">Sarees</Link></li>
                  <li><Link to="/shop?category=Co-Ord Sets" className="hover:text-gold-500 transition-colors">Co-Ord Sets</Link></li>
                  <li><Link to="/shop?sort=new" className="hover:text-gold-500 transition-colors">New Arrivals</Link></li>
                </ul>
              </div>
            </div>

            <div className="border-b border-black/5 md:border-none pb-4 md:pb-0">
              <button 
                onClick={() => toggleFooterAccordion('contact')}
                className="flex items-center justify-between w-full md:cursor-default"
              >
                <h4 className="text-[11px] uppercase tracking-[2px] font-medium text-primary-950 md:mb-6">Contact Us</h4>
                <ChevronDown size={16} className={`md:hidden transition-transform duration-300 ${openFooterAccordion === 'contact' ? "rotate-180" : ""}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 md:!h-auto md:!opacity-100 ${openFooterAccordion === 'contact' ? "max-h-48 opacity-100 mt-4" : "max-h-0 opacity-0 md:mt-0"}`}>
                <ul className="space-y-3 text-sm text-primary-950/70 pb-4 md:pb-0 font-sans">
                  <li className="leading-relaxed">
                    {CONFIG.STORE_NAME}<br />
                    {CONFIG.STORE_ADDRESS}
                  </li>
                  <li className="pt-2">Contact Person: Mohit</li>
                  <li>WhatsApp / Call:<br /> {CONFIG.STORE_PHONE}</li>
                  <li className="pt-2 text-[11px] font-medium text-primary-950/60 uppercase tracking-[1px]">Timings: 10:30 AM - 9:00 PM (IST)</li>
                </ul>
              </div>
            </div>

            <div className="bg-primary-950 p-6 rounded-sm text-white flex flex-col justify-center mt-4 md:mt-0 shadow-xl shadow-primary-950/10">
              <h4 className="text-sm font-serif tracking-[1px] mb-3 uppercase text-gold-500">Exclusive Newsletter</h4>
              <p className="text-[11px] opacity-80 mb-5 leading-relaxed font-light">Subscribe for early access to new collections, secret sales, and styling tips.</p>
              
              {subscribeStatus === "success" ? (
                <div className="bg-primary-50/10 text-white p-3 rounded text-[11px] font-medium animate-pulse text-center tracking-[1px]">
                  {subscribeMessage}
                </div>
              ) : (
                <form className="flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); const form = e.target as any; const email = form.elements.namedItem('email').value; if(!email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) { setSubscribeStatus("error"); setSubscribeMessage("Please enter a valid email."); return; } setSubscribeStatus("success"); setSubscribeMessage("Thank you for subscribing!"); form.reset();}}>
                  <div className="relative">
                    <input 
                      type="email" 
                      name="email"
                      placeholder="Enter your email" 
                      required
                      className={`w-full bg-transparent text-white placeholder-white/40 text-[12px] px-4 py-3 border ${subscribeStatus === "error" ? "border-red-400" : "border-white/20"} outline-none focus:border-gold-500 transition-colors rounded-sm shadow-inner shadow-black/20`}
                      onChange={() => setSubscribeStatus("idle")}
                    />
                    {subscribeStatus === "error" && <p className="text-red-400 text-[10px] mt-1 absolute -bottom-4 left-0">{subscribeMessage}</p>}
                  </div>
                  <button type="submit" className="w-full bg-gold-500 text-primary-950 py-3 px-4 text-[11px] uppercase tracking-[2px] font-bold mt-1 hover:bg-white hover:text-primary-950 transition-all duration-300 shadow-md">
                    Subscribe Now
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="text-center text-[10px] uppercase tracking-[1px] text-primary-950/50 pt-4 border-t border-black/5">
            © {new Date().getFullYear()} Mukesh Saree Centre. Tradition Meets Modern Elegance Since 1976.
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a
        href={`https://wa.me/${CONFIG.STORE_PHONE.replace(/[^0-9]/g, "")}?text=Hi!%20I%20Need%20Help.`}
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed right-3 md:right-6 bg-[#6AA06E] text-white p-2.5 md:p-3 rounded-full shadow-[0_8px_20px_-6px_rgba(106,160,110,0.5)] hover:bg-[#5C8E5F] hover:-translate-y-1 transition-all z-50 flex items-center justify-center group will-change-transform transform-gpu ${location.pathname.startsWith('/product') ? "bottom-[100px] md:bottom-[20px]" : "bottom-[12px] md:bottom-[20px]"}`}
        aria-label="Contact on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 md:w-[22px] md:h-[22px]" strokeWidth={1.5} />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2.5 transition-all duration-500 whitespace-nowrap text-[11px] md:text-xs font-medium tracking-wide">
          Assistant
        </span>
      </a>

      {/* Scroll to Top */}
      <AnimatePresence>
        {isScrolled && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={scrollToTop}
            className={`fixed right-5 md:right-7 bg-white/90 border border-black/5 text-primary-950 p-2 md:p-3 rounded-full shadow-xl hover:bg-gold-500 hover:text-white transition-all z-40 flex items-center justify-center group will-change-transform transform-gpu ${location.pathname.startsWith('/product') ? "bottom-[160px] md:bottom-[90px]" : "bottom-[80px] md:bottom-[90px]"}`}
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
