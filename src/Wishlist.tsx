import { ChevronRight, Copy, Heart, Mail, MessageCircle, Plus, Share2, ShoppingBag, Trash2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import { products } from './mockData';
import { useStore } from './store';

export default function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const { shareId } = useParams();
  const [searchParams] = useSearchParams();
  
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sortBy, setSortBy] = useState('default'); // 'default', 'price-low', 'price-high', 'name-az', 'name-za'
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Shared items can come from URL path or query params
  const sharedItemsRaw = searchParams.get('items') || (shareId && shareId !== 'shared' ? shareId : null);
  const sharedItemIds = sharedItemsRaw ? sharedItemsRaw.split(',') : [];
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
    showToast(`${product.name} added to cart`);
  };

  const displayProducts = useMemo(() => {
    const baseItems = isSharedView 
      ? products.filter((p) => sharedItemIds.includes(p.id))
      : products.filter((p) => wishlist.includes(p.id));

    // For 'default', we want to respect the order
    const sorted = [...baseItems];
    
    if (sortBy === 'default') {
      const idSource = isSharedView ? sharedItemIds : wishlist;
      return sorted.sort((a, b) => idSource.indexOf(a.id) - idSource.indexOf(b.id));
    }

    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name-az':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-za':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return sorted;
    }
  }, [isSharedView, sharedItemIds, wishlist, sortBy]);

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/wishlist/${wishlist.join(',')}` 
    : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    showToast('Share link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent('My Mukesh Saree Centre Wishlist');
    const body = encodeURIComponent(`I've curated a collection of my favorites from Mukesh Saree Centre. Take a look: ${shareUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const addSharedToMyWishlist = () => {
    let addedCount = 0;
    sharedItemIds.forEach(id => {
      if (!wishlist.includes(id)) {
        toggleWishlist(id);
        addedCount++;
      }
    });
    if (addedCount > 0) {
      showToast(`Added ${addedCount} item${addedCount > 1 ? 's' : ''} to your wishlist!`);
    } else {
      showToast('Items are already in your wishlist!');
    }
  };

  return (
    <div className="bg-primary-50 min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-2xl md:text-3xl font-serif text-primary-950 mb-4">
              {isSharedView ? "Shared Wishlist" : "My Wishlist"}
            </h1>
            <p className="text-primary-950/60 font-sans tracking-wide uppercase text-[11px]">
              {isSharedView ? "A Curated Selection for You" : "Your Curated Collection"}
            </p>
          </motion.div>
        </div>

        {isSharedView && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 bg-primary-50 p-6 rounded-sm border border-gold-500/20 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="bg-gold-50 p-3 rounded-full">
                <Heart className="text-gold-500" size={24} fill="currentColor" />
              </div>
              <div>
                <h3 className="text-lg font-serif text-primary-950">Viewing a shared wishlist</h3>
                <p className="text-sm text-primary-950/60 font-light">Someone shared their favorite pieces with you.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={addSharedToMyWishlist}
                className="bg-primary-950 text-white px-6 py-3 text-[10px] tracking-[1px] uppercase hover:bg-gold-500 transition-all rounded-sm font-medium flex items-center gap-2"
              >
                <Plus size={14} /> Add All to My Wishlist
              </button>
              <Link 
                to="/wishlist" 
                className="border border-primary-950 text-primary-950 px-6 py-3 text-[10px] tracking-[1px] uppercase hover:bg-primary-950 hover:text-white transition-all rounded-sm font-medium flex items-center gap-2"
              >
                Go to My Wishlist <ChevronRight size={14} />
              </Link>
            </div>
          </motion.div>
        )}

        {displayProducts.length === 0 ? (
          <div className="text-center py-24 bg-primary-50 rounded-sm border border-black/5 shadow-sm px-6">
            <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <Heart className="text-primary-200" size={32} strokeWidth={1} />
            </div>
            <h2 className="text-2xl font-serif text-primary-950 mb-4 font-normal">
              {isSharedView ? "This wishlist is empty" : "Wait, Your wishlist is empty!"}
            </h2>
            <p className="text-primary-950/60 mb-10 max-w-sm mx-auto font-light leading-relaxed">
              {isSharedView 
                ? "The shared link doesn't contain any active products or the items are no longer available."
                : "Explore our collection of heritage sarees and modern co-ord sets to find your perfect match."
              }
            </p>
            <Link 
              to="/shop" 
              className="inline-block bg-primary-950 text-white px-10 py-4 text-[11px] tracking-[2px] uppercase hover:bg-gold-500 transition-colors rounded-sm font-medium shadow-lg shadow-primary-950/10"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-6">
              <div className="flex items-center gap-4 bg-primary-50 px-4 py-2 rounded-full border border-black/5 shadow-sm">
                <label htmlFor="sortBy" className="text-[10px] uppercase tracking-[1.5px] text-primary-950/40 font-medium">Sort By:</label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none text-[11px] tracking-[1px] uppercase font-medium text-primary-950 focus:ring-0 cursor-pointer hover:text-gold-500 transition-colors py-0 pr-8"
                >
                  <option value="default">Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-az">Name: A-Z</option>
                  <option value="name-za">Name: Z-A</option>
                </select>
              </div>

              {!isSharedView && (
                <button 
                  onClick={() => setIsShareModalOpen(true)}
                  className="flex items-center gap-3 bg-primary-950 text-white px-6 py-3 rounded-sm text-[11px] tracking-[1.5px] uppercase font-medium hover:bg-gold-500 transition-all shadow-md group"
                >
                  <Share2 size={16} className="text-gold-300 group-hover:text-white transition-colors" /> Share My Collection
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
              <AnimatePresence mode="popLayout">
                {displayProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-primary-50 group border border-black/5 rounded-sm overflow-hidden flex flex-col h-full shadow-sm hover:shadow-xl transition-all duration-500"
                  >
                    <Link to={`/product/${product.slug}`} className="relative aspect-[2/3] overflow-hidden block">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                      <div className="absolute inset-0 bg-primary-950/0 group-hover:bg-primary-950/10 transition-colors duration-500" />
                      
                      {/* Price Badge over image */}
                      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-sm shadow-sm">
                        <span className="text-[13px] font-medium text-primary-950">₹{product.price.toLocaleString()}</span>
                      </div>
                    </Link>
                    
                    <div className="p-6 md:p-8 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="text-[10px] uppercase tracking-[2px] text-gold-500 font-medium">{product.fabric}</div>
                        {!isSharedView && (
                          <button 
                            onClick={() => toggleWishlist(product.id)}
                            className="text-primary-950/20 hover:text-primary-600 transition-colors p-1"
                            title="Remove from favorites"
                          >
                            <Trash2 size={18} strokeWidth={1.5} />
                          </button>
                        )}
                      </div>
                      
                      <Link to={`/product/${product.slug}`}>
                        <h3 className="text-xl font-serif text-primary-950 mb-1 group-hover:text-gold-500 transition-colors leading-tight">{product.name}</h3>
                      </Link>
                      
                      {product.sku && (
                        <p className="text-[10px] text-primary-950/50 mb-3 font-mono uppercase tracking-wider">
                          SKU: {product.sku}
                        </p>
                      )}
                      
                      <div className="text-[12px] text-primary-950/50 mb-8 font-light line-clamp-2">
                        Elegant {product.color} {product.category.toLowerCase()} that defines sophistication.
                      </div>
                      
                      <div className="mt-auto">
                        <button 
                          onClick={() => handleAddToCart(product)}
                          className="w-full flex items-center justify-center gap-3 bg-primary-950 text-white py-4 text-[11px] tracking-[2px] uppercase hover:bg-gold-500 transition-all rounded-sm font-medium shadow-lg shadow-primary-950/5"
                        >
                          <ShoppingBag size={14} /> Add to Bag
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>

      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[150]">
          <div className="bg-primary-950 text-white px-6 py-3 rounded-full text-sm font-medium flex items-center shadow-2xl">
            {toastMessage}
          </div>
        </div>
      )}

      {/* Share Modal */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShareModalOpen(false)}
              className="absolute inset-0 bg-primary-950/60 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-primary-50 w-full max-w-md p-8 md:p-10 rounded-sm shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => setIsShareModalOpen(false)}
                className="absolute top-6 right-6 text-primary-950/30 hover:text-primary-950 transition-colors"
                aria-label="Close modal"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
              
              <div className="w-16 h-16 bg-gold-50 rounded-full flex items-center justify-center mb-6">
                <Share2 className="text-gold-500" size={28} />
              </div>
              
              <h3 className="text-2xl md:text-3xl font-serif text-primary-950 mb-4 font-normal">Share Wishlist</h3>
              <p className="text-sm text-primary-950/60 mb-8 font-light leading-relaxed">Share your curated collection of favorites with your loved ones and get their thoughts.</p>
              
              <div className="space-y-6">
                <div className="relative">
                  <div className="flex items-center gap-3 p-4 bg-primary-50 border border-black/5 rounded-sm overflow-hidden">
                    <div className="flex-grow truncate text-[11px] font-mono text-primary-950/70">{shareUrl}</div>
                  </div>
                  <button 
                    onClick={copyToClipboard}
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-primary-50 px-4 py-2 rounded-sm border border-black/5 text-[10px] uppercase tracking-[1px] font-medium text-primary-950 hover:bg-gold-500 hover:text-white transition-all shadow-sm"
                  >
                    {copied ? 'Copied!' : <><Copy size={12} /> Copy</>}
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={shareViaEmail}
                    className="flex flex-col items-center justify-center gap-3 p-6 border border-black/5 rounded-sm hover:border-gold-500 hover:bg-gold-50/30 transition-all group"
                  >
                    <div className="w-10 h-10 bg-gold-50 text-gold-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Mail size={18} />
                    </div>
                    <span className="text-[10px] uppercase tracking-[1.5px] font-medium text-primary-950">Email</span>
                  </button>
                  <a 
                    href={`https://wa.me/?text=${encodeURIComponent('Check out my favorite items from Mukesh Saree Centre: ' + shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-3 p-6 border border-black/5 rounded-sm hover:border-[#25D366] hover:bg-[#25D366]/5 transition-all group"
                  >
                    <div className="w-10 h-10 bg-[#25D366]/10 text-[#25D366] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MessageCircle size={18} />
                    </div>
                    <span className="text-[10px] uppercase tracking-[1.5px] font-medium text-primary-950">WhatsApp</span>
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
