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
  const [showPopup, setShowPopup] = useState(false);
  const [openFooterAccordion, setOpenFooterAccordion] = useState<string | null>(null);
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [subscribeMessage, setSubscribeMessage] = useState('');
  const lastScrollY = useRef(0);

  const toggleFooterAccordion = (section: string) => {
    setOpenFooterAccordion((prev) => (prev === section ? null : section));
  };

  useEffect(() => {
    // Scroll to top on pathname OR search change
    // This ensures that even params changes like ?category=Sarees from footer trigger top scroll
    window.scrollTo(0, 0);
  }, [location.pathname, new URLSearchParams(location.search).get('category')]);

  useEffect(() => {
    // Show popup after 3 seconds for demo purposes
    const timer = setTimeout(() => {
      const hasSeenPopup = localStorage.getItem("hasSeenPromoPopup");
      if (!hasSeenPopup) {
        setShowPopup(true);
        localStorage.setItem("hasSeenPromoPopup", "true");
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

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
    : "bg-white/95 backdrop-blur-md shadow-lg";
  const textColor = isTransparent ? "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" : "text-primary-950";
  const logoColor = isTransparent ? "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" : "text-primary-950";
  const borderColor = isTransparent ? "border-transparent" : "border-black/5";

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
                <div className="text-[12px] uppercase tracking-[2px] font-medium" id="search-title">
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
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                referrerPolicy="no-referrer"
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
                            <ChevronRight
                              size={20}
                              className="text-primary-950/20 group-hover:text-gold-500 transition-colors"
                            />
                          </Link>
                        ))}
                      </div>
                      <button
                        onClick={handleSearchSubmit}
                        className="flex items-center gap-2 text-[11px] tracking-[2px] uppercase font-medium text-primary-950 hover:text-gold-500 transition-colors pt-4 border-t border-black/5 w-full justify-between"
                      >
                        View all results <ArrowRight size={16} />
                      </button>
                    </div>
                  ) : searchQuery ? (
                    <div className="text-center py-20 bg-primary-50 rounded-sm">
                      <Search
                        size={40}
                        strokeWidth={1}
                        className="mx-auto text-primary-950/20 mb-4"
                      />
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

      {/* Promo Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-primary-950/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-primary-50 max-w-md w-full relative overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-4 right-4 text-primary-950/50 hover:text-primary-950 z-10 bg-white/80 rounded-full p-1"
              >
                <X size={20} />
              </button>

              <div className="relative h-48 bg-primary-50 overflow-hidden flex items-center justify-center">
                <img
                  src="https://drive.google.com/thumbnail?id=1_PdNfAScYuOrr_cA0e6TZQdAlSCvzZ8M&sz=w600"
                  alt="Special discount offer on Mukesh Saree Centre collection"
                  className="w-full h-full object-cover opacity-80"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 to-transparent flex items-end p-6">
                  <h3 className="text-white text-2xl font-serif leading-tight">
                    Get Your First
                    <br />
                    Co-Ord at ₹895{" "}
                    <span className="inline-block translate-y-1">💫</span>
                  </h3>
                </div>
              </div>

              <div className="p-8 text-center bg-primary-50">
                <p className="text-sm text-primary-950/80 mb-6 font-medium">
                  Flat 55% OFF + Extra ₹100 OFF on FIRST Order
                </p>
                <div className="bg-primary-50 border border-dashed border-gold-500 p-4 mb-6 relative">
                  <div className="text-[10px] uppercase tracking-[2px] text-primary-950/50 mb-1">
                    Use Code
                  </div>
                  <div className="text-2xl font-medium tracking-[2px] text-primary-950">
                    FIRST100
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowPopup(false);
                    navigate("/shop?category=Co-Ord Sets");
                  }}
                  className="w-full bg-primary-950 text-white hover:bg-gold-500 py-4 text-[11px] tracking-[2px] uppercase transition-colors font-medium shadow-lg"
                >
                  Unlock Offer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 flex flex-col ${headerBg} ${
          isHidden ? "-translate-y-full" : "translate-y-0"
        } ${isScrolled ? "border-b border-black/5" : "border-b-0"}`}
      >
        {/* Top Bar */}
        <div className="bg-primary-950 text-white text-center py-2.5 px-4 w-full text-[11px] sm:text-[12px] font-medium tracking-[1px] md:tracking-[2px] uppercase flex items-center justify-center gap-2 relative z-[60]">
          <span>
            <span>OFFER: </span> 55% OFF + Extra ₹100 OFF on FIRST Order | Use{" "}
            <span className="text-gold-400 font-bold">FIRST100</span>
          </span>
        </div>

        <div
          className={`transition-all duration-500 w-full ${isScrolled ? "py-0" : "py-1 sm:py-3"}`}
        >
          <div className="h-20 flex items-center justify-between px-4 sm:px-10 w-full max-w-7xl mx-auto">
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`${textColor} focus:outline-none transition-colors`}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              >
                {isMobileMenuOpen ? (
                  <X size={24} strokeWidth={1.5} />
                ) : (
                  <Menu size={24} strokeWidth={1.5} />
                )}
              </button>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0 flex flex-col items-center justify-center flex-1 md:flex-none">
              <Link
                to="/"
                onClick={scrollToTop}
                className="flex flex-col items-center group transition-all duration-500 transform"
              >
                <span
                  className={`text-[18px] md:text-2xl font-serif font-medium ${logoColor} tracking-[4px] md:tracking-[10px] uppercase text-center leading-none transition-all group-hover:text-gold-500`}
                >
                  MUKESH
                </span>
                <div className="flex items-center gap-3 w-full mt-1.5 px-1">
                  <div
                    className={`h-[1px] flex-1 ${isTransparent ? 'bg-white/30' : 'bg-primary-950/10'} group-hover:bg-gold-500/20 transition-colors`}
                  ></div>
                  <span
                    className={`text-[7px] md:text-[9px] font-sans font-medium tracking-[4px] md:tracking-[6px] uppercase ${isTransparent ? 'text-white/80 drop-shadow-md' : 'text-primary-950/60'} transition-colors group-hover:text-gold-600 whitespace-nowrap`}
                  >
                    Saree Centre
                  </span>
                  <div
                    className={`h-[1px] flex-1 ${isTransparent ? 'bg-white/30' : 'bg-primary-950/10'} group-hover:bg-gold-500/20 transition-colors`}
                  ></div>
                </div>
                <div className="h-[2px] w-0 bg-gold-400/30 group-hover:w-1/2 transition-all duration-700 mt-0.5"></div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex flex-1 justify-center space-x-8 items-center h-full" aria-label="Desktop Navigation">
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
                {/* Dropdown Menu */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-48 bg-white border border-black/5 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top translate-y-2 group-hover:translate-y-0 z-50">
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
                      to="/shop?category=Co-Ord Sets"
                      className="px-6 py-2.5 text-[11px] tracking-[1.5px] uppercase font-medium text-primary-950 hover:bg-gold-50 hover:text-gold-600 transition-colors"
                    >
                      Co-Ord Sets
                    </Link>
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

            {/* Icons */}
            <div className="flex items-center justify-end space-x-4 sm:space-x-6 md:flex-1">
              <button
                onClick={() => setIsSearchOpen(true)}
                className={`${textColor} hover:text-gold-500 transition-colors block`}
                aria-expanded={isSearchOpen}
                aria-controls="search-overlay"
                aria-label="Open search"
              >
                <Search size={18} strokeWidth={1.5} />
              </button>
              <Link
                to="/wishlist"
                className={`${textColor} hover:text-gold-500 transition-colors hidden sm:block`}
                aria-label="Wishlist"
              >
                <Heart size={18} strokeWidth={1.5} />
              </Link>
              <Link
                to="/cart"
                className={`${textColor} hover:text-gold-500 transition-colors relative flex items-center`}
                aria-label={`Shopping cart with ${cartItemCount} items`}
              >
                <ShoppingBag size={18} strokeWidth={1.5} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-gold-500 text-white text-[9px] px-1.5 py-0.5 rounded-full min-w-[16px] text-center font-medium">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden bg-primary-50 overflow-hidden border-t border-black/5"
            >
              <div className="px-5 py-6 flex flex-col space-y-5">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[13px] tracking-[2px] uppercase font-medium text-primary-950 flex items-center justify-between py-1"
                >
                  Home
                </Link>
                
                <div className="flex flex-col">
                  <div 
                    className="flex items-center justify-between cursor-pointer py-1"
                    onClick={() => setIsMobileShopOpen(!isMobileShopOpen)}
                  >
                    <span className="text-[13px] tracking-[2px] uppercase font-medium text-primary-950">
                      Shop
                    </span>
                    <ChevronDown 
                      size={16} 
                      className={`text-primary-950/70 transition-transform duration-300 ${isMobileShopOpen ? "rotate-180" : ""}`}
                    />
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
                          <Link
                            to="/shop"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-[12px] tracking-[1.5px] uppercase font-medium text-primary-950/80 hover:text-gold-600"
                          >
                            All Products
                          </Link>
                          <Link
                            to="/shop?category=Sarees"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-[12px] tracking-[1.5px] uppercase font-medium text-primary-950/80 hover:text-gold-600"
                          >
                            Sarees
                          </Link>
                          <Link
                            to="/shop?category=Co-Ord Sets"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-[12px] tracking-[1.5px] uppercase font-medium text-primary-950/80 hover:text-gold-600"
                          >
                            Co-Ord Sets
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link
                  to="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[13px] tracking-[2px] uppercase font-medium text-primary-950 flex items-center justify-between py-1"
                >
                  Our Legacy
                </Link>
                <div className="border-t border-black/5 pt-5 mt-2 flex flex-col space-y-5">
                  <Link
                    to="/wishlist"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-[13px] tracking-[2px] uppercase font-medium text-primary-950 py-1"
                  >
                    <Heart size={18} strokeWidth={1.5} /> Wishlist
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsSearchOpen(true);
                    }}
                    className="flex items-center gap-3 text-[13px] tracking-[2px] uppercase font-medium text-primary-950 text-left py-1"
                  >
                    <Search size={18} strokeWidth={1.5} /> Search
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main
        className={`flex-grow flex flex-col ${!isHomePage ? "pt-[140px]" : ""}`}
      >
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-primary-50 border-t border-black/5 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Trust Bar Section */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 pb-6 border-b border-black/5 gap-4 text-center md:text-left">
            <div className="text-[11px] uppercase tracking-[1px] text-primary-950/70 flex flex-wrap justify-center items-center gap-2">
              <span>Since 1976 Legacy</span>
              <span className="w-1 h-1 bg-gold-500 rounded-full mx-1"></span>
              <span>Premium Quality</span>
              <span className="w-1 h-1 bg-gold-500 rounded-full mx-1"></span>
              <span>COD AVAILABLE</span>
              <span className="w-1 h-1 bg-gold-500 rounded-full mx-1"></span>
              <span>Affordable Luxury</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] uppercase tracking-[1px] opacity-50">
                Follow Us: @MukeshSareeCentre
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6">
            <div className="border-b border-black/5 md:border-none pb-2 md:pb-0">
              <button 
                onClick={() => toggleFooterAccordion('quickLinks')}
                className="flex items-center justify-between w-full md:cursor-default"
              >
                <h4 className="text-[11px] uppercase tracking-[2px] font-medium text-primary-950 md:mb-3">
                  Quick Links
                </h4>
                <ChevronDown size={16} className={`md:hidden transition-transform duration-300 ${openFooterAccordion === 'quickLinks' ? 'rotate-180' : ''}`} />
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 md:!h-auto md:!opacity-100 ${openFooterAccordion === 'quickLinks' ? 'max-h-48 opacity-100 mt-4' : 'max-h-0 opacity-0 md:mt-4'}`}
              >
                <ul className="space-y-3 text-sm text-primary-950/70 pb-4 md:pb-0">
                  <li>
                    <Link to="/shop" className="hover:text-gold-500 transition-colors">Shop All</Link>
                  </li>
                  <li>
                    <Link to="/about" className="hover:text-gold-500 transition-colors">Our Legacy</Link>
                  </li>
                  <li>
                    <Link to="/terms" className="hover:text-gold-500 transition-colors">Terms & Conditions</Link>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="border-b border-black/5 md:border-none pb-2 md:pb-0">
              <button 
                onClick={() => toggleFooterAccordion('categories')}
                className="flex items-center justify-between w-full md:cursor-default"
              >
                <h4 className="text-[11px] uppercase tracking-[2px] font-medium text-primary-950 md:mb-3">
                  Categories
                </h4>
                <ChevronDown size={16} className={`md:hidden transition-transform duration-300 ${openFooterAccordion === 'categories' ? 'rotate-180' : ''}`} />
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 md:!h-auto md:!opacity-100 ${openFooterAccordion === 'categories' ? 'max-h-48 opacity-100 mt-4' : 'max-h-0 opacity-0 md:mt-4'}`}
              >
                <ul className="space-y-3 text-sm text-primary-950/70 pb-4 md:pb-0">
                  <li>
                    <Link to="/shop?category=Sarees" className="hover:text-gold-500 transition-colors">Sarees</Link>
                  </li>
                  <li>
                    <Link to="/shop?category=Co-Ord Sets" className="hover:text-gold-500 transition-colors">Co-Ord Sets</Link>
                  </li>
                  <li>
                    <Link to="/shop?sort=new" className="hover:text-gold-500 transition-colors">New Arrivals</Link>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="border-b border-black/5 md:border-none pb-2 md:pb-0">
              <button 
                onClick={() => toggleFooterAccordion('contact')}
                className="flex items-center justify-between w-full md:cursor-default"
              >
                <h4 className="text-[11px] uppercase tracking-[2px] font-medium text-primary-950 md:mb-3">
                  Contact Us
                </h4>
                <ChevronDown size={16} className={`md:hidden transition-transform duration-300 ${openFooterAccordion === 'contact' ? 'rotate-180' : ''}`} />
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 md:!h-auto md:!opacity-100 ${openFooterAccordion === 'contact' ? 'max-h-48 opacity-100 mt-4' : 'max-h-0 opacity-0 md:mt-4'}`}
              >
                <ul className="space-y-3 text-sm text-primary-950/70 pb-4 md:pb-0">
                  <li className="leading-relaxed">
                    {CONFIG.STORE_NAME}
                    <br />
                    {CONFIG.STORE_ADDRESS}
                  </li>
                  <li className="pt-2">Contact Person: Mohit</li>
                  <li>
                    WhatsApp / Call: <br />
                    {CONFIG.STORE_PHONE}
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-primary-950 p-5 rounded-sm text-white flex flex-col justify-center mt-2 md:mt-0 xl:p-6 shadow-md shadow-primary-950/20">
              <h4 className="text-sm font-serif tracking-[1px] mb-2 uppercase text-gold-500">Exclusive Newsletter</h4>
              <p className="text-[11px] opacity-80 mb-4 leading-relaxed font-light">
                Subscribe for early access to new collections, secret sales, and styling tips.
              </p>
              {subscribeStatus === 'success' ? (
                <div className="bg-primary-50/10 text-white p-3 rounded text-[11px] font-medium animate-pulse text-center tracking-[1px]">
                  {subscribeMessage}
                </div>
              ) : (
                <form 
                  className="flex flex-col gap-3 relative z-10"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const emailInput = form.elements.namedItem('email') as HTMLInputElement;
                    const email = emailInput.value;
                    
                    if (!email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
                      setSubscribeStatus('error');
                      setSubscribeMessage('Please enter a valid email.');
                      return;
                    }
                    
                    setSubscribeStatus('success');
                    setSubscribeMessage('Thank you for subscribing!');
                    form.reset();
                  }}
                >
                  <div className="relative">
                    <input 
                      type="email" 
                      name="email"
                      placeholder="Enter your email address" 
                      required
                      className={`w-full bg-transparent text-white placeholder-white/40 text-[12px] px-4 py-3 border ${subscribeStatus === 'error' ? 'border-red-400' : 'border-white/20'} outline-none focus:border-gold-500 transition-colors rounded-sm shadow-inner shadow-black/20`}
                      onChange={() => setSubscribeStatus('idle')}
                      aria-label="Email Address for Newsletter"
                    />
                    {subscribeStatus === 'error' && (
                      <p className="text-red-400 text-[10px] mt-1 absolute -bottom-4 left-0">
                        {subscribeMessage}
                      </p>
                    )}
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-gold-500 text-primary-950 py-3 px-4 text-[11px] uppercase tracking-[2px] font-bold mt-1 hover:bg-white hover:text-primary-950 transition-all duration-300 shadow-md transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
                  >
                    Subscribe Now
                  </button>
                </form>
              )}
            </div>
          </div>
          <div className="text-center text-[10px] uppercase tracking-[1px] text-primary-950/50 pt-4">
            &copy; {new Date().getFullYear()} Mukesh Saree Centre. Tradition
            Meets Modern Elegance Since 1976.
          </div>
        </div>
      </footer>

      {/* WhatsApp Sticky Button */}
      <a
        href={`https://wa.me/${CONFIG.STORE_PHONE.replace(/[^0-9]/g, '')}?text=Hi!%20I%20Need%20Help.`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-[80px] md:bottom-8 right-3 md:right-6 bg-[#25D366] text-white p-2.5 md:p-3.5 rounded-full shadow-2xl hover:bg-[#128C7E] hover:-translate-y-1 hover:scale-110 transition-all z-50 flex items-center justify-center group"
        aria-label="Contact us on WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
        </svg>
      </a>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {isScrolled && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-[136px] md:bottom-[92px] right-3 md:right-6 bg-gold-500 text-white p-2 md:p-2.5 rounded-full shadow-lg hover:bg-gold-600 transition-all z-40 flex items-center justify-center group"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
