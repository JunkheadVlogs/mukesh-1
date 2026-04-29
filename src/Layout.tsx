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
} from "lucide-react";
import { useStore } from "./store";
import { useState, useEffect, useRef } from "react";
import type { FormEvent } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { products } from "./mockData";

export default function Layout() {
  const { cart } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
  const lastScrollY = useRef(0);

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

  const isTransparent = isHomePage && !isScrolled;
  const headerBg = isTransparent
    ? "bg-transparent"
    : "bg-white/90 backdrop-blur-md shadow-sm";
  const textColor = "text-primary-950";
  const logoColor = "text-primary-950";
  const borderColor = isTransparent ? "border-transparent" : "border-black/5";

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col text-primary-950"
          >
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-10">
              <div className="h-20 flex items-center justify-between border-b border-black/5">
                <div className="text-[12px] uppercase tracking-[2px] font-medium">
                  Search
                </div>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="text-primary-950 hover:text-gold-500 transition-colors p-2"
                >
                  <X size={24} strokeWidth={1} />
                </button>
              </div>

              <div className="py-12 md:py-20">
                <form
                  onSubmit={handleSearchSubmit}
                  className="relative max-w-3xl mx-auto"
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for sarees, co-ords, fabrics..."
                    className="w-full text-2xl md:text-4xl font-serif text-primary-950 border-b border-black/10 pb-4 focus:outline-none focus:border-gold-500 placeholder-primary-950/20"
                  />
                  <button
                    type="submit"
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
                                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
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
                        className="flex items-center gap-2 text-[11px] tracking-[2px] uppercase font-bold text-primary-950 hover:text-gold-500 transition-colors pt-4 border-t border-black/5 w-full justify-between"
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
              className="bg-white max-w-md w-full relative overflow-hidden flex flex-col"
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
                  alt="Special Offer"
                  className="w-full h-full object-cover opacity-80"
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

              <div className="p-8 text-center bg-[#FAF9F6]">
                <p className="text-sm text-primary-950/80 mb-6 font-medium">
                  Flat 55% OFF + Extra ₹100 OFF on prepaid orders
                </p>
                <div className="bg-white border border-dashed border-gold-500 p-4 mb-6 relative">
                  <div className="text-[10px] uppercase tracking-[2px] text-primary-950/50 mb-1">
                    Use Code
                  </div>
                  <div className="text-2xl font-bold tracking-[2px] text-primary-950">
                    FIRST100
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowPopup(false);
                    navigate("/shop?category=Co-Ord Sets");
                  }}
                  className="w-full bg-primary-950 text-white hover:bg-gold-500 py-4 text-[11px] tracking-[2px] uppercase transition-colors font-bold shadow-lg"
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
        className={`fixed top-0 w-full z-50 transition-all duration-500 border-b flex flex-col ${headerBg} ${borderColor} ${
          isHidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        {/* Top Bar */}
        <div className="bg-primary-950 text-white text-center py-2.5 px-4 w-full text-[11px] sm:text-[12px] font-medium tracking-[1px] md:tracking-[2px] uppercase flex items-center justify-center gap-2 relative z-[60]">
          <span>
            🎉 55% OFF + Extra ₹100 OFF on Prepaid Orders | Use{" "}
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
                className="flex flex-col items-center group transition-all duration-500 transform"
              >
                <span
                  className={`text-[18px] md:text-3xl font-serif font-bold ${logoColor} tracking-[4px] md:tracking-[10px] uppercase text-center leading-none transition-all group-hover:text-gold-500`}
                >
                  MUKESH
                </span>
                <div className="flex items-center gap-3 w-full mt-1.5 px-1">
                  <div
                    className={`h-[1px] flex-1 bg-primary-950/10 group-hover:bg-gold-500/20 transition-colors`}
                  ></div>
                  <span
                    className={`text-[7px] md:text-[9px] font-sans font-medium tracking-[4px] md:tracking-[6px] uppercase text-primary-950/60 transition-colors group-hover:text-gold-600 whitespace-nowrap`}
                  >
                    Saree Centre
                  </span>
                  <div
                    className={`h-[1px] flex-1 bg-primary-950/10 group-hover:bg-gold-500/20 transition-colors`}
                  ></div>
                </div>
                <div className="h-[2px] w-0 bg-gold-400/30 group-hover:w-1/2 transition-all duration-700 mt-0.5"></div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex flex-1 justify-center space-x-8">
              <Link
                to="/shop"
                className={`text-[11px] tracking-[2px] uppercase font-medium ${textColor} hover:text-gold-500 transition-colors`}
              >
                Shop
              </Link>
              <Link
                to="/shop?category=Sarees"
                className={`text-[11px] tracking-[2px] uppercase font-medium ${textColor} hover:text-gold-500 transition-colors`}
              >
                Sarees
              </Link>
              <Link
                to="/shop?category=Co-Ord Sets"
                className={`text-[11px] tracking-[2px] uppercase font-medium ${textColor} hover:text-gold-500 transition-colors`}
              >
                Co-Ords
              </Link>
              <Link
                to="/about"
                className={`text-[11px] tracking-[2px] uppercase font-medium ${textColor} hover:text-gold-500 transition-colors`}
              >
                Legacy
              </Link>
            </nav>

            {/* Icons */}
            <div className="flex items-center justify-end space-x-4 sm:space-x-6 md:flex-1">
              <button
                onClick={() => setIsSearchOpen(true)}
                className={`${textColor} hover:text-gold-500 transition-colors block`}
              >
                <Search size={18} strokeWidth={1.5} />
              </button>
              <Link
                to="/wishlist"
                className={`${textColor} hover:text-gold-500 transition-colors hidden sm:block`}
              >
                <Heart size={18} strokeWidth={1.5} />
              </Link>
              <Link
                to="/account"
                className={`${textColor} hover:text-gold-500 transition-colors hidden sm:block`}
              >
                <User size={18} strokeWidth={1.5} />
              </Link>
              <Link
                to="/cart"
                className={`${textColor} hover:text-gold-500 transition-colors relative flex items-center`}
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
        <div
          className={`md:hidden bg-white overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "max-h-96 border-t border-black/5" : "max-h-0"}`}
        >
          <div className="px-4 py-4 flex flex-col space-y-4">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-[12px] tracking-[2px] uppercase font-medium text-primary-950"
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-[12px] tracking-[2px] uppercase font-medium text-primary-950"
            >
              Shop All
            </Link>
            <Link
              to="/shop?category=Sarees"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-[12px] tracking-[2px] uppercase font-medium text-primary-950"
            >
              Sarees
            </Link>
            <Link
              to="/shop?category=Co-Ord Sets"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-[12px] tracking-[2px] uppercase font-medium text-primary-950"
            >
              Co-Ord Sets
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-[12px] tracking-[2px] uppercase font-medium text-primary-950"
            >
              Our Legacy
            </Link>
            <div className="border-t border-black/5 pt-4 mt-2 flex flex-col space-y-4">
              <Link
                to="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 text-[12px] tracking-[2px] uppercase font-medium text-primary-950"
              >
                <User size={16} strokeWidth={1.5} /> Account
              </Link>
              <Link
                to="/wishlist"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 text-[12px] tracking-[2px] uppercase font-medium text-primary-950"
              >
                <Heart size={16} strokeWidth={1.5} /> Wishlist
              </Link>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsSearchOpen(true);
                }}
                className="flex items-center gap-3 text-[12px] tracking-[2px] uppercase font-medium text-primary-950 text-left"
              >
                <Search size={16} strokeWidth={1.5} /> Search
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        className={`flex-grow flex flex-col ${!isHomePage ? "pt-[140px]" : ""}`}
      >
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-black/5 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Trust Bar Section */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 pb-10 border-b border-black/5 gap-6 text-center md:text-left">
            <div className="text-[11px] uppercase tracking-[1px] text-primary-950/70 flex flex-wrap justify-center items-center gap-2">
              <span>Since 1976 Legacy</span>
              <span className="w-1 h-1 bg-gold-500 rounded-full mx-1"></span>
              <span>Premium Quality</span>
              <span className="w-1 h-1 bg-gold-500 rounded-full mx-1"></span>
              <span>COD AVAILABLE</span>
              <span className="w-1 h-1 bg-gold-500 rounded-full mx-1"></span>
              <span>Affordable Luxury</span>
              <span className="w-1 h-1 bg-gold-500 rounded-full mx-1"></span>
              <span>Trusted by 30,000+</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] uppercase tracking-[1px] opacity-50">
                Follow Us: @MukeshSareeCentre
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <h4 className="text-[11px] uppercase tracking-[2px] font-medium mb-4 text-primary-950">
                Quick Links
              </h4>
              <ul className="space-y-3 text-sm text-primary-950/70">
                <li>
                  <Link
                    to="/shop"
                    className="hover:text-gold-500 transition-colors"
                  >
                    Shop All
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="hover:text-gold-500 transition-colors"
                  >
                    Our Legacy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="hover:text-gold-500 transition-colors"
                  >
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] uppercase tracking-[2px] font-medium mb-4 text-primary-950">
                Categories
              </h4>
              <ul className="space-y-3 text-sm text-primary-950/70">
                <li>
                  <Link
                    to="/shop?category=Sarees"
                    className="hover:text-gold-500 transition-colors"
                  >
                    Sarees
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop?category=Co-Ord Sets"
                    className="hover:text-gold-500 transition-colors"
                  >
                    Co-Ord Sets
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop?sort=new"
                    className="hover:text-gold-500 transition-colors"
                  >
                    New Arrivals
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] uppercase tracking-[2px] font-medium mb-4 text-primary-950">
                Contact Us
              </h4>
              <ul className="space-y-3 text-sm text-primary-950/70">
                <li className="leading-relaxed">
                  Mukesh Saree Centre
                  <br />
                  Jaganth Road, Gandibagh
                  <br />
                  Nagpur 440002
                </li>
                <li className="pt-2">Contact Person: Mohit</li>
                <li>
                  WhatsApp / Call: <br />
                  +91 7020664641
                </li>
              </ul>
            </div>
            <div className="bg-primary-950 p-6 rounded-sm text-white flex flex-col justify-center">
              <h4 className="text-sm tracking-[1px] mb-1">Exclusive Offers</h4>
              <p className="text-[10px] opacity-70 mb-4">
                Join our club for updates and early access.
              </p>
              <form className="flex" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Your Email"
                  className="bg-transparent border-b border-white/30 text-white px-2 py-2 flex-grow focus:outline-none focus:border-gold-500 text-sm w-full placeholder-white/50"
                />
                <button
                  type="submit"
                  className="text-[10px] uppercase tracking-[1px] text-gold-500 hover:text-white px-3 py-2 transition-colors"
                >
                  Join
                </button>
              </form>
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
        href="https://wa.me/917020664641?text=Hi!%20I%20Need%20Help."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-3.5 rounded-full shadow-2xl hover:bg-[#128C7E] hover:-translate-y-1 hover:scale-110 transition-all z-50 flex items-center justify-center group"
        aria-label="Contact us on WhatsApp"
      >
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 ease-in-out pl-0 group-hover:pl-2 group-hover:pr-3 text-xs tracking-wider uppercase font-semibold">
          Support
        </span>
        <MessageCircle size={24} fill="currentColor" strokeWidth={1} />
      </a>
    </div>
  );
}
