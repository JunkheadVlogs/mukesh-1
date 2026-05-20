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
import { formatPrice, getImageAlt } from "./utils";
import { OptimizedImage } from "./components/OptimizedImage";
import { LiveTimestamp } from "./components/LiveTimestamp";

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

  useEffect(() => {
    // Scroll to top on pathname OR search change
    // This ensures that even params changes like ?category=Sarees from footer trigger top scroll
    window.scrollTo(0, 0);
  }, [location.pathname, new URLSearchParams(location.search).get("category")]);

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
            !p.isVariant &&
            (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.fabric.toLowerCase().includes(searchQuery.toLowerCase())),
        )
        .slice(0, 5)
    : [];

  const [announcementIndex, setAnnouncementIndex] = useState(0);

  const announcements = [
    "✨ FREE SHIPPING ON ALL ORDERS",
    "🚚 CASH ON DELIVERY AVAILABLE",
    "👑 THE LUXURY EDIT • 50% OFF ON ALL PRODUCTS",
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
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const isTransparent = isHomePage && !isScrolled && !isMobileMenuOpen;

  const headerStyle = {
    background: isTransparent
      ? "rgba(250, 246, 240, 0)"
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
                            <div className="w-20 aspect-[9/16] bg-transparent overflow-hidden rounded-none flex-shrink-0">
                              <OptimizedImage
                                src={product.image}
                                width={100}
                                alt={getImageAlt(product)}
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
                    <div className="text-center py-20 bg-primary-50 rounded-none">
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
                className="w-auto h-auto min-w-[160px] max-w-[180px] md:min-w-[200px] md:max-w-[230px] lg:max-w-[250px] object-contain transition-opacity group-hover:opacity-80 drop-shadow-sm m-0 p-0 block header-logo"
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

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden bg-primary-50 overflow-hidden border-t border-black/5"
            >
              <div className="px-6 py-8 flex flex-col space-y-2">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[13px] tracking-[2px] uppercase font-medium text-primary-950 flex items-center justify-between py-3"
                >
                  Home
                </Link>
                <div className="flex flex-col">
                  <div
                    className="flex items-center justify-between cursor-pointer py-3"
                    onClick={() => setIsMobileShopOpen(!isMobileShopOpen)}
                  >
                    <span className="text-[13px] tracking-[2px] uppercase font-medium text-primary-950">
                      Shop
                    </span>
                    <ChevronDown
                      size={20}
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
                        className="flex flex-col pl-4 mt-2 mb-2 border-l border-gold-500/30 overflow-hidden"
                      >
                        <div className="flex flex-col space-y-1 py-2">
                          <Link
                            to="/shop"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-[12px] tracking-[1.5px] uppercase font-medium text-primary-950/80 hover:text-gold-600 py-2"
                          >
                            All Products
                          </Link>
                          <Link
                            to="/shop?category=Sarees"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-[12px] tracking-[1.5px] uppercase font-medium text-primary-950/80 hover:text-gold-600 py-2"
                          >
                            Sarees
                          </Link>
                          <Link
                            to="/shop?category=Linen Sarees"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-[11px] tracking-[1.5px] uppercase font-medium text-primary-950/60 hover:text-gold-600 pl-4 py-2"
                          >
                            — Linen Sarees
                          </Link>
                          <Link
                            to="/shop?category=Co-Ord Sets"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-[12px] tracking-[1.5px] uppercase font-medium text-primary-950/80 hover:text-gold-600 py-2"
                          >
                            Co-Ord Sets
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <Link
                  to="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[13px] tracking-[2px] uppercase font-medium text-primary-950 flex items-center justify-between py-3"
                >
                  Contact Us
                </Link>

                <div className="border-t border-black/5 pt-4 mt-4 flex flex-col space-y-2">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsSearchOpen(true);
                    }}
                    className="flex items-center gap-4 text-[13px] tracking-[2px] uppercase font-medium text-primary-950 text-left py-3"
                  >
                    <Search size={22} strokeWidth={1.5} /> Search
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main
        className={`flex-grow flex flex-col ${!isHomePage ? "pt-[85px] md:pt-[95px]" : ""}`}
      >
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#FAF8F5] pt-4 md:pt-10 pb-1.5 md:pb-4 border-t border-gold-200/30">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
          <div className="grid grid-cols-2 gap-y-5 gap-x-6 md:gap-8 max-w-2xl">
            <div>
              <h4 className="text-[11px] font-medium text-primary-950 mb-1.5 md:mb-3 tracking-[0.12em] md:tracking-[0.15em] uppercase">
                Explore
              </h4>
              <ul className="space-y-0.5 md:space-y-1 font-light text-[13px] text-primary-950/70">
                <li>
                  <Link to="/shop?category=Sarees" className="hover:text-gold-600 transition-colors">
                    Sarees
                  </Link>
                </li>
                <li>
                  <Link to="/shop?category=Lehengas" className="hover:text-gold-600 transition-colors">
                    Lehengas
                  </Link>
                </li>
                <li>
                  <Link to="/shop?category=Co-Ord Sets" className="hover:text-gold-600 transition-colors">
                    Readymade Suits
                  </Link>
                </li>
                <li>
                  <Link to="/shop?sort=new" className="hover:text-gold-600 transition-colors">
                    New Arrivals
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-medium text-primary-950 mb-1.5 md:mb-3 tracking-[0.12em] md:tracking-[0.15em] uppercase">
                Support
              </h4>
              <ul className="space-y-0.5 md:space-y-1 font-light text-[13px] text-primary-950/70">
                <li>
                  <Link to="/shipping-policy" className="hover:text-gold-600 transition-colors">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link to="/return-policy" className="hover:text-gold-600 transition-colors">
                    Returns & Exchange
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-gold-600 transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-gold-600 transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-2.5 md:mt-10 pt-1.5 md:pt-2.5 border-t border-primary-950/10 flex flex-col items-center max-w-full">
            <p className="text-[9px] sm:text-[11px] text-primary-950/40 font-light tracking-wider uppercase text-center whitespace-nowrap">
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
