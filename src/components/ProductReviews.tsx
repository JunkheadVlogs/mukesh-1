import React, { useMemo, useState } from 'react';
import { Product, Review } from '../store';
import { Star, ShieldCheck, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getProductReviewStats, getSeededRandom } from '../utils';

interface ProductReviewsProps {
  product: Product;
}

const indianNames = [
  "Priya Sharma", "Neha Patel", "Sneha Verma", "Aarti Jain", 
  "Pooja Gupta", "Kavya Singh", "Ritu Agarwal", "Anjali Mehta",
  "Meera Reddy", "Simran Kaur", "Divya Joshi", "Pallavi Desai",
  "Nidhi Gupta", "Anushka Mehta", "Ritu Jain", "Aarti Shah",
  "Sunita R.", "Swati Kapoor", "Laxmi Nair", "Bhavna P.",
  "Roshni M.", "Vani S.", "Tanvi K.", "Geeta T.", "Vidya Balan"
];

const sareeReviews = [
  "Fabric quality is amazing and very soft.",
  "Exactly same as shown in pictures.",
  "Elegant saree for functions and daily wear.",
  "Color is beautiful and premium.",
  "Delivery was fast and packaging was good.",
  "Worth the price. Will order again.",
  "Got many compliments after wearing this.",
  "Drapes beautifully and the blouse piece is of good length.",
  "Very lightweight and easy to carry all day.",
  "Must buy! The quality exceeded my expectations.",
  "I am very happy with this purchase. Looks very luxurious.",
  "True to color and the fabric feels wonderful against the skin.",
  "Wore it for a party and everyone asked from where I bought it!"
];

const kurtiReviews = [
  "Fitting is perfect, exactly to size.",
  "Stitching is very neat and premium.",
  "Very comfortable for daily wear.",
  "The embroidery is beautiful and detailed.",
  "Fabric doesn't bleed color after wash.",
  "Loved the modern yet ethnic look.",
  "Worth the price. Great quality.",
  "Delivery was fast and packaging was good.",
  "The color is so vibrant and beautiful.",
  "Absolutely beautiful fit and pure cotton fabric."
];

const dates = [
  "2 days ago", "3 days ago", "5 days ago", "1 week ago", 
  "12 days ago", "15 days ago", "3 weeks ago", "1 month ago", 
  "2 months ago", "yesterday", "4 days ago"
];

function generateReviews(product: Product): Review[] {
  const seed = getSeededRandom(product.id + "-revs");
  const count = (seed % 10) + 15; // 15 to 24 reviews for better load more experience
  const reviews: Review[] = [];

  const isCoOrd = product.category && product.category.toLowerCase().includes('co-ord');
  const isLinen = product.fabric && product.fabric.toLowerCase().includes('linen');
  
  let reviewPool = isCoOrd ? kurtiReviews : sareeReviews;
  
  if (isLinen) {
    reviewPool = [
      ...reviewPool,
      "Loved the breathable linen fabric.",
      "The linen texture is very soft and premium.",
      "Lightweight linen, perfect for summers.",
      "The linen fabric feels very premium and breathable.",
      "Perfect saree for summer, very lightweight.",
      "Soft texture and elegant fall.",
      "Looks even better in real."
    ];
  }

  // Determine overall product rating roughly so generated reviews match
  const stats = getProductReviewStats(product);

  for (let i = 0; i < count; i++) {
    const s = Math.abs(seed + i * 997);
    const name = indianNames[s % indianNames.length];
    const text = reviewPool[(s * 7) % reviewPool.length];
    const date = dates[(s * 11) % dates.length];
    
    // Most should be 5 stars, some 4 stars, rarely 3 based on average
    let rating = 5;
    if (stats.rating < 4.8) {
       rating = (s % 10) > 6 ? 4 : 5;
    } else {
       rating = (s % 10) > 8 ? 4 : 5;
    }
    
    // Add rare 3 star if rating is really low
    if (stats.rating < 4.6 && s % 15 === 0) {
      rating = 3;
    }

    reviews.push({
      id: `rev-${product.id}-${i}`,
      author: name,
      rating,
      date,
      text,
      verified: true
    });
  }

  return reviews;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ product }) => {
  const [visibleCount, setVisibleCount] = useState(3);

  const reviews = useMemo(() => {
    if (product.reviews && product.reviews.length > 0) return product.reviews;
    return generateReviews(product);
  }, [product]);

  const stats = useMemo(() => getProductReviewStats(product), [product.id]);
  
  const totalReviews = product.reviewsCount || stats.reviewCount;
  const averageRating = product.rating || stats.rating;
  
  // Calculate artificial review breakdown matching the average
  let fiveStarPct = Math.round((averageRating - 4.0) * 100); 
  if (averageRating >= 5.0) fiveStarPct = 98;
  const fourStarPct = 100 - fiveStarPct - (averageRating === 5.0 ? 2 : 2 - (averageRating < 4.6 ? 2 : 0)); // math logic
  const threeStarPct = 100 - fiveStarPct - fourStarPct;

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 5, reviews.length));
  };
  
  return (
    <div className="w-full py-8 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl md:text-2xl font-serif text-primary-950/90 mb-6 md:mb-8 font-medium">Customer Reviews</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Review Stats */}
          <div className="lg:col-span-4">
            <div className="bg-[#F9F7F4] p-5 md:p-6 rounded-xl flex flex-col border border-black/5">
              <div className="flex items-end gap-3 mb-1">
                <span className="text-4xl md:text-5xl font-serif text-primary-950/90 leading-none">{averageRating.toFixed(1)}</span>
                <div className="flex flex-col pb-1">
                  <div className="flex text-amber-500 mb-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-4 h-4 md:w-4.5 md:h-4.5 ${averageRating >= s ? 'fill-current' : averageRating >= s - 0.5 ? 'fill-current opacity-50' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-primary-950/50 font-medium tracking-wide uppercase">Based on {totalReviews} reviews</span>
                </div>
              </div>
              
              <div className="w-full space-y-2.5 mt-6">
                {[
                  { stars: 5, pct: fiveStarPct },
                  { stars: 4, pct: fourStarPct },
                  { stars: 3, pct: threeStarPct },
                  { stars: 2, pct: 0 },
                  { stars: 1, pct: 0 }
                ].map((bar) => (
                  <div key={bar.stars} className="flex items-center gap-3 text-xs md:text-sm">
                    <span className="w-12 text-primary-950/70 font-medium whitespace-nowrap">{bar.stars} Stars</span>
                    <div className="flex-1 h-1.5 md:h-2 bg-black/5 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${bar.pct}%` }} />
                    </div>
                    <span className="w-8 text-right text-primary-950/50 font-medium">{bar.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Review List */}
          <div className="lg:col-span-8">
            <div className="flex flex-col">
              <AnimatePresence initial={false}>
                {reviews.slice(0, visibleCount).map((review) => (
                  <motion.div 
                    key={review.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="py-4 md:py-6 border-b border-black/5 last:border-0"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between mb-3 gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C8A96B] to-[#b39556] text-white flex items-center justify-center font-serif text-sm shadow-sm flex-shrink-0">
                          {review.author.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-primary-950/90 text-[13px] md:text-[14px] tracking-tight">{review.author}</h4>
                            {review.verified && (
                              <div className="flex items-center gap-1 text-[9px] md:text-[10px] text-green-700 bg-green-50 px-1.5 py-0.5 rounded-[4px] border border-green-200 uppercase tracking-widest font-bold">
                                <ShieldCheck className="w-3 h-3" strokeWidth={2.5} />
                                Verified
                              </div>
                            )}
                          </div>
                          <div className="text-[11px] text-primary-950/40 mt-0.5 font-medium">{review.date}</div>
                        </div>
                      </div>
                      <div className="flex text-amber-500 mt-1 md:mt-0 pl-12 md:pl-0">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-3.5 h-3.5 md:w-4 md:h-4 ${review.rating >= s ? 'fill-current' : 'text-gray-200'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-primary-950/70 leading-relaxed text-[13px] md:text-sm pl-0 md:pl-12 text-pretty font-medium">
                      "{review.text}"
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {visibleCount < reviews.length && (
              <div className="mt-4 md:mt-6 flex justify-center lg:justify-start">
                <button 
                  onClick={loadMore}
                  className="group flex items-center gap-2 text-[11px] md:text-xs font-bold uppercase tracking-[1.5px] text-[#8A6A4A] hover:text-primary-950 transition-colors py-2 px-4 rounded-full border border-[#8A6A4A]/20 hover:bg-[#F9F7F4] hover:border-[#8A6A4A]/40"
                >
                  Load More Reviews
                  <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
