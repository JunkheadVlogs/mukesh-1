import { SEO } from "./components/SEO";
import {
  ChevronRight,
  Copy,
  Heart,
  Mail,
  MessageCircle,
  Plus,
  Share2,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import { products } from "./mockData";
import { useStore } from "./store";
import { formatPrice, getImageAlt } from "./utils";
import { OptimizedImage } from "./components/OptimizedImage";
import { ProductCard } from "./components/ProductCard";

import { trackAddToCart } from "./tracking";

export default function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const { shareId } = useParams();
  const [searchParams] = useSearchParams();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const sharedItemsRaw =
    searchParams.get("items") ||
    (shareId && shareId !== "shared" ? shareId : null);
  const sharedItemIds = sharedItemsRaw ? sharedItemsRaw.split(",") : [];
  const isSharedView = sharedItemIds.length > 0;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddToCart = (product: any) => {
    addToCart(product);
    trackAddToCart(product, 1);
    showToast(`${product.name} added to bag successfully.`);
  };

  const displayProducts = useMemo(() => {
    const baseItems = isSharedView
      ? products.filter((p) => sharedItemIds.includes(p.id))
      : products.filter((p) => wishlist.includes(p.id));

    const sorted = [...baseItems];

    if (sortBy === "default") {
      const idSource = isSharedView ? sharedItemIds : wishlist;
      return sorted.sort(
        (a, b) => idSource.indexOf(a.id) - idSource.indexOf(b.id),
      );
    }

    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "name-az":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "name-za":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return sorted;
    }
  }, [isSharedView, sharedItemIds, wishlist, sortBy]);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/wishlist/${wishlist.join(",")}`
      : "";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    showToast("The link is now in your clipboard.");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent("My Wishlist | Mukesh Saree Centre");
    const body = encodeURIComponent(
      `I've created a list of my favorites from Mukesh Saree Centre. Take a look: ${shareUrl}`,
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const addSharedToMyWishlist = () => {
    let addedCount = 0;
    sharedItemIds.forEach((id) => {
      if (!wishlist.includes(id)) {
        toggleWishlist(id);
        addedCount++;
      }
    });
    if (addedCount > 0) {
      showToast(
        `Added ${addedCount} item${addedCount > 1 ? "s" : ""} to your wishlist.`,
      );
    } else {
      showToast("These items are already in your wishlist.");
    }
  };

  return (
    <div className="bg-ivory">
      <SEO
        title={`${isSharedView ? "Shared Selection" : "My Wishlist"} | Mukesh Saree Centre`}
        description={
          isSharedView
            ? "Discover a list of favorite sarees from Mukesh Saree Centre shared with you. Shop these elegant sarees and co-ord sets directly from this list."
            : "View and manage your favorite picks from Mukesh Saree Centre. Create your dream wishlist of elegant sarees and designer co-ord sets."
        }
        url="/wishlist"
      />
      
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 pt-32 md:pt-48 pb-32">
        <header className="mb-24 flex flex-col md:flex-row justify-between items-end gap-12">
          <div className="max-w-3xl">
            <h4 className="text-gold-500 mb-6 drop-shadow-sm uppercase tracking-[4px] font-bold text-[11px]">
              {isSharedView ? "Shared Selection" : "My Favorites"}
            </h4>
            <h1 className="text-5xl md:text-7xl font-serif leading-tight text-onyx">
              {isSharedView ? "Shared Favorites" : "My Wishlist"}
            </h1>
          </div>
          
          {!isSharedView && displayProducts.length > 0 && (
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="text-[10px] uppercase tracking-[4px] border-b border-onyx/20 text-onyx/60 hover:text-onyx transition-all pb-1 font-bold flex items-center gap-4 group"
            >
              <Share2 size={12} className="group-hover:rotate-12 transition-transform" />
              Share Collection
            </button>
          )}
        </header>

        {isSharedView && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-32 p-12 border border-onyx/5 bg-white shadow-luxury rounded-sm flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden group"
          >
            <div className="space-y-4">
              <h3 className="text-3xl font-serif text-onyx">Shared by a friend</h3>
              <p className="text-onyx/40 font-light italic font-serif text-lg">"A selection of beautiful sarees picked out for you."</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6">
              <button
                onClick={addSharedToMyWishlist}
                className="btn-primary px-12 h-16 min-w-[240px] !py-0 flex items-center justify-center gap-4"
              >
                <Plus size={16} /> Add to My Wishlist
              </button>
              <Link
                to="/wishlist"
                className="btn-secondary px-12 h-16 !py-0 flex items-center justify-center"
              >
                My Wishlist
              </Link>
            </div>
          </motion.div>
        )}

        {displayProducts.length === 0 ? (
          <div className="py-48 text-center border border-dashed border-onyx/10 rounded-sm">
             <Heart className="text-onyx/5 mx-auto mb-10" size={64} strokeWidth={0.5} />
             <h2 className="mb-6 font-serif opacity-60 italic text-onyx">Your vault stands empty, awaiting beauty.</h2>
             <Link to="/shop" className="text-[11px] uppercase tracking-[3px] font-bold text-gold-500 underline underline-offset-8">Discover our masterpieces</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <AnimatePresence mode="popLayout">
              {displayProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: idx * 0.05 }}
                  className="group"
                >
                  <div className="relative group" key={product.id}>
                    <ProductCard product={product} />
                    {!isSharedView && (
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="absolute top-2 right-2 p-2 bg-white/40 hover:bg-white text-onyx/40 hover:text-red-500 transition-all rounded-full border border-onyx/5 backdrop-blur-sm shadow-luxury z-20 group-hover:opacity-100 lg:opacity-0"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {toastMessage && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[150]">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gold-500 text-white px-10 py-5 rounded-sm text-[13px] font-bold uppercase tracking-[2px] flex items-center shadow-luxury"
          >
            {toastMessage}
          </motion.div>
        </div>
      )}

      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShareModalOpen(false)}
              className="absolute inset-0 bg-onyx/60 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative bg-ivory w-full max-w-lg p-10 md:p-14 rounded-sm shadow-luxury overflow-hidden border border-onyx/10"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-gold-500/5 rounded-full blur-3xl"></div>
              
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="absolute top-8 right-8 text-onyx/30 hover:text-onyx transition-all p-2"
                aria-label="Close modal"
              >
                <X size={28} strokeWidth={1} />
              </button>

              <div className="w-20 h-20 bg-gold-500/10 rounded-full flex items-center justify-center mb-10 border border-gold-500/20 shadow-luxury">
                <Share2 className="text-gold-500" size={32} />
              </div>

              <h3 className="text-3xl font-serif text-onyx mb-6">Share Your Wishlist</h3>
              <p className="text-[15px] text-onyx/50 mb-10 font-medium leading-relaxed tracking-wide">
                Share your favorite saree collection with your friends and family.
              </p>

              <div className="space-y-10">
                <div className="relative group">
                  <div className="flex items-center gap-4 p-6 bg-white border border-onyx/10 rounded-sm group-hover:border-gold-500/50 transition-all shadow-sm">
                    <div className="flex-grow truncate text-[13px] font-bold text-onyx/40">
                      {shareUrl}
                    </div>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-3 bg-onyx text-white px-6 py-3 rounded-sm text-[11px] uppercase tracking-[2px] font-bold hover:bg-gold-500 transition-all shadow-xl"
                  >
                    {copied ? "Copied" : "Copy Link"}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <button
                    onClick={shareViaEmail}
                    className="flex flex-col items-center justify-center gap-6 p-8 border border-onyx/10 rounded-sm hover:border-gold-500 hover:bg-gold-500/5 transition-all group relative overflow-hidden bg-white shadow-sm"
                  >
                    <div className="w-14 h-14 bg-onyx/5 text-onyx/50 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:text-gold-500 transition-all border border-onyx/10">
                      <Mail size={24} />
                    </div>
                    <span className="text-[11px] uppercase tracking-[3px] font-bold text-onyx/40 group-hover:text-onyx">
                      Direct Mail
                    </span>
                  </button>
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent("Check out my favorite items from Mukesh Saree Centre: " + shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-6 p-8 border border-onyx/10 rounded-sm hover:border-[#25D366] hover:bg-[#25D366]/5 transition-all group relative overflow-hidden bg-white shadow-sm"
                  >
                    <div className="w-14 h-14 bg-[#25D366]/5 text-[#25D366]/60 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:text-[#25D366] transition-all border border-[#25D366]/20">
                      <MessageCircle size={24} />
                    </div>
                    <span className="text-[11px] uppercase tracking-[3px] font-bold text-onyx/40 group-hover:text-[#25D366]">
                      WhatsApp
                    </span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
