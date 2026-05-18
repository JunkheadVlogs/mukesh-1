import React, { useMemo, useState } from 'react';
import { Product, Review } from '../store';
import { Star, ShieldCheck, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getProductReviewStats, getSeededRandom } from '../utils';

interface ProductReviewsProps {
  product: Product;
}

export interface EnhancedReview extends Review {
  city?: string;
  trustSignal?: string;
}

const firstNames = [
  "Riya", "Sneha", "Anjali", "Pooja", "Aarti", "Simran", "Meera", "Neha", "Divya", "Priya",
  "Kavya", "Nandini", "Shruti", "Swati", "Tanya", "Geeta", "Sunita", "Anita", "Roshni",
  "Vidya", "Sujata", "Pallavi", "Isha", "Ritu", "Bhavna", "Kriti", "Smriti", "Sakshi",
  "Ayesha", "Monalisa", "Zoya", "Rupali", "Shikha", "Jyoti", "Kiran", "Madhu"
];

const lastNames = [
  "Sharma", "Patel", "Verma", "Jain", "Gupta", "Singh", "Agarwal", "Mehta",
  "Reddy", "Kaur", "Joshi", "Desai", "Shah", "Kapoor", "Nair", "Iyer",
  "Chatterjee", "Roy", "Rao", "Das", "Yadav", "Rajput", "Chauhan", "Bhatia"
];

const cities = [
  "Mumbai, Maharashtra",
  "Pune, Maharashtra",
  "Bangalore, Karnataka",
  "New Delhi, Delhi",
  "Ahmedabad, Gujarat",
  "Surat, Gujarat",
  "Chennai, Tamil Nadu",
  "Hyderabad, Telangana",
  "Kolkata, West Bengal",
  "Jaipur, Rajasthan",
  "Lucknow, UP",
  "Gurugram, Haryana",
  "Indore, MP",
  "Nagpur, Maharashtra"
];

const trustSignals = [
  "Purchased for wedding",
  "Repeat Customer",
  "Bought during sale",
  "Received compliments",
  "Exactly as shown",
  "Wore it for a party"
];

const generalSareeReviews = [
  "Fabric quality is excellent and it drapes so well. Really happy with the purchase!",
  "Exactly same as shown in the picture. The color is very rich and appealing.",
  "I was quite hesistant initially but the saree turned out to be beautiful. Delivery was also fast.",
  "Bought this for my mother and she absolutely loved it. Very elegant.",
  "The unstitched blouse piece is long enough. Good saree for regular wear.",
  "Really nice product. Worth the price. 💯",
  "Got many compliments after wearing this at my cousin's function.",
  "Slight color difference but still looks very premium. Quality is top notch.",
  "Very comfortable to wear all day. The fabric feels soft against the skin.",
  "Beautiful saree but packaging could have been slightly better. 4 stars.",
  "Must buy if you are looking for something classy on a budget.",
  "Absolutely fell in love with it. Can't wait to wear it for Diwali!",
  "Good length and width. No complaints. Best buy.",
  "Received so many compliments! The design and work is just flawless.",
  "Very pretty set. I’m impressed by the fast delivery.",
  "I was looking for something exactly like this! the material is buttery soft and hugs you perfectly. definitely wearing this for upcoming functions.",
  "Quality was okayish for the price. Not too bad but not great.",
  "I rarely write reviews but omg this saree is just stunning in real life. Pictures do not do justice to the actual color n vibe.",
  "Such a gorgeous peice! My husband complimentd me all evening. Thank u team.",
  "Ammmazing quality totally worth it. go for it girls.",
  "so elegant and just beautiful.. drape is perfect.",
  "nice saree very soft fabric. thnks."
];

const linenReviews = [
  "The linen fabric is so soft and breathable. Best for summers.",
  "Very lightweight linen! Gives such an elegant corporate look.",
  "Subtle colors and premium linen texture. Loved the feel of it.",
  "Pure comfort! Drapes beautifully and doesn't feel heavy at all.",
  "Looks very sophisticated for office wear. Highly satisfied.",
  "The fall of this linen is just perfect. Needs very light ironing.",
  "Feels very luxurious. True to color and texture.",
  "I love wearing linens and this one is the best in my closet now. So chic & minimalist.",
  "Good linen blend, does not crease very easily which is a huge plus."
];

const printedReviews = [
  "The print quality is exactly as shown. Colors don't bleed after washing.",
  "Lovely prints and the fabric is extremely flowy.",
  "Very modern print! It gives a very young and chic look.",
  "The colors are so vibrant and eye-catching. Perfect for day events.",
  "Beautiful floral design. Got exactly what I ordered.",
  "Was skeptical about the print looking cheap but it actually looks designer and high-end."
];

const festiveReviews = [
  "Perfect for the wedding season. The work is very intricate.",
  "Looks very grand and festive! Gives a rich look.",
  "Wore it for Diwali and everybody asked where I got it from.",
  "The zari work is beautiful and doesn't look cheap at all. Loving it.",
  "Very heavy border but still manageable. Looks like a designer piece.",
  "Stunning festive wear! Drapes like a dream and reflects light beautifully in evening functions. Truly premium.",
  "Purchased this for my brother's reception and felt like royalty. The fabric has a natural sheen."
];

const kurtiReviews = [
  "Fitting is perfect, almost like it's custom made for me.",
  "Stitching is very neat. Very comfortable for office wear.",
  "Loved the modern yet ethnic look. Fabric is of high quality.",
  "Color didn't fade after the first wash. Very happy.",
  "Great for daily wear. The material is very breathable.",
  "Looks exactly like the picture. Worth the money.",
  "Sizes run a bit small, I had to replace with a larger one. But the product is good.",
  "Such comfortable material! Perfect for hot weather.",
  "Looks extremely classy when paired with some oxidized jewellery."
];

const dates = [
  "2 days ago", "3 days ago", "5 days ago", "1 week ago", 
  "12 days ago", "15 days ago", "3 weeks ago", "1 month ago", 
  "2 months ago", "Yesterday", "4 days ago", "6 days ago", 
  "2 weeks ago", "1.5 months ago"
];

function generateReviews(product: Product): EnhancedReview[] {
  const seed = getSeededRandom(product.id + "-revs");
  const count = (seed % 10) + 15; // 15 to 24 reviews for better load more experience
  const reviews: EnhancedReview[] = [];

  const nameParts = (product.name || "").toLowerCase();
  const catParts = (product.category || "").toLowerCase();
  const fabricParts = (product.fabric || "").toLowerCase();

  const isCoOrd = catParts.includes('co-ord') || catParts.includes('kurti') || catParts.includes('suit');
  const isLinen = fabricParts.includes('linen') || nameParts.includes('linen');
  const isPrinted = nameParts.includes('print') || nameParts.includes('floral');
  const isFestive = nameParts.includes('wedding') || nameParts.includes('festive') || nameParts.includes('zari') || nameParts.includes('silk');
  
  let reviewPool = isCoOrd ? [...kurtiReviews] : [...generalSareeReviews];
  
  if (isLinen && !isCoOrd) reviewPool.push(...linenReviews);
  if (isPrinted && !isCoOrd) reviewPool.push(...printedReviews);
  if (isFestive && !isCoOrd) reviewPool.push(...festiveReviews);

  // Determine overall product rating roughly so generated reviews match
  const stats = getProductReviewStats(product);

  for (let i = 0; i < count; i++) {
    const s = Math.abs(seed + i * 997);
    
    // Name variation
    const fname = firstNames[s % firstNames.length];
    const lname = (s % 3 === 0) ? "" : " " + lastNames[(s * 5) % lastNames.length];
    const initialOnly = (s % 7 === 0);
    const author = initialOnly ? `${fname} ${lname.charAt(1) || 'K'}.` : `${fname}${lname}`;

    // Emotional/Variation texts
    let text = reviewPool[(s * 7) % reviewPool.length];
    if (s % 5 === 0) { // Add a grammatical quirk or emotional sentence
       const extra = [" Can't wait to shop again!", " Highly recommended.", " 🥰", " ❤️ Loved it.", " Thanks Mukesh Saree Centre!", " Tbh, looks better than the pics."];
       text += extra[s % extra.length];
    }
    
    // Occasional lowercase start or lack of fullstop
    if (s % 9 === 0) {
       text = text.charAt(0).toLowerCase() + text.slice(1);
    }
    if (s % 11 === 0 && text.endsWith('.')) {
       text = text.slice(0, -1);
    }

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

    // Occasional city and trust signal
    const city = s % 2 === 0 ? cities[(s * 13) % cities.length] : undefined;
    const trustSignal = s % 3 === 0 ? trustSignals[(s * 17) % trustSignals.length] : undefined;

    reviews.push({
      id: `rev-${product.id}-${i}`,
      author: author.trim(),
      rating,
      date,
      text,
      verified: s % 10 !== 0, // 90% verified
      city,
      trustSignal
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
  
  // Natural realistic distribution
  let fiveStarPct = 82;
  if (averageRating >= 4.9) fiveStarPct = 88;
  if (averageRating <= 4.7) fiveStarPct = 75;
  if (averageRating <= 4.5) fiveStarPct = 68;
  
  let threeStarPct = 4;
  if (averageRating >= 4.9) threeStarPct = 1;
  if (averageRating <= 4.6) threeStarPct = 8;
  
  let fourStarPct = 100 - fiveStarPct - threeStarPct;

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 5, reviews.length));
  };
  
  return (
    <div className="w-full py-5 md:py-8 bg-white border-t border-black/5">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between mb-4 md:mb-5">
          <h2 className="text-[17px] md:text-lg font-serif text-primary-950/90 font-medium tracking-tight">Customer Reviews</h2>
          <button 
            onClick={() => alert("Review functionality will be available after deployment.")}
            className="group flex items-center gap-1.5 text-[9.5px] md:text-[10.5px] font-bold uppercase tracking-[1px] text-[#8A6A4A] hover:text-primary-950 transition-colors py-1.5 md:py-2 px-3 md:px-4 rounded-full border border-[#8A6A4A]/20 hover:bg-[#F9F7F4] hover:border-[#8A6A4A]/40"
          >
            Write a Review
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8">
          {/* Review Stats */}
          <div className="lg:col-span-4 lg:col-start-1">
            <div className="bg-[#F9F7F4]/80 p-3.5 md:p-4 rounded-xl flex flex-col border border-black/5">
              <div className="flex items-end gap-3 mb-1">
                <span className="text-3xl md:text-4xl font-serif text-primary-950/90 leading-none">{averageRating.toFixed(1)}</span>
                <div className="flex flex-col pb-0.5">
                  <div className="flex text-amber-500 mb-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-3.5 h-3.5 md:w-4 md:h-4 ${averageRating >= s ? 'fill-current' : averageRating >= s - 0.5 ? 'fill-current opacity-50' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-primary-950/50 font-medium tracking-wide uppercase">Based on {totalReviews} reviews</span>
                </div>
              </div>
              
              <div className="w-full space-y-2 mt-4">
                {[
                  { stars: 5, pct: fiveStarPct },
                  { stars: 4, pct: fourStarPct },
                  { stars: 3, pct: threeStarPct },
                  { stars: 2, pct: 0 },
                  { stars: 1, pct: 0 }
                ].map((bar) => (
                  <div key={bar.stars} className="flex items-center gap-2.5 text-[11px] md:text-xs">
                    <span className="w-10 text-primary-950/70 font-medium whitespace-nowrap">{bar.stars} Stars</span>
                    <div className="flex-1 h-1.5 md:h-[6px] bg-black/5 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${bar.pct}%` }} />
                    </div>
                    <span className="w-7 text-right text-primary-950/50 font-medium">{bar.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Review List */}
          <div className="lg:col-span-8">
            <div className="flex flex-col">
              <AnimatePresence initial={false}>
                {reviews.slice(0, visibleCount).map((review: EnhancedReview) => {
                  // Determine profile background based on name initial to add variety
                  const initial = review.author.charAt(0).toUpperCase();
                  const colorMap: Record<string, string> = {
                    'A': 'bg-[#FDF3E1] text-[#B8860B]', 'B': 'bg-[#E6F3E6] text-[#2E8B57]',
                    'C': 'bg-[#FBE4E4] text-[#CD5C5C]', 'D': 'bg-[#E6E6FA] text-[#836FFF]',
                    'E': 'bg-[#FFF0F5] text-[#DB7093]', 'F': 'bg-[#F0FFFF] text-[#5F9EA0]',
                    'G': 'bg-[#F5F5DC] text-[#BDB76B]', 'H': 'bg-[#FFFAF0] text-[#D2B48C]',
                    'I': 'bg-[#F0F8FF] text-[#4682B4]', 'J': 'bg-[#F8F8FF] text-[#778899]',
                    'K': 'bg-[#FFFFF0] text-[#DAA520]', 'L': 'bg-[#FAF0E6] text-[#A0522D]',
                    'M': 'bg-[#FFF5EE] text-[#CD853F]', 'N': 'bg-[#FDF5E6] text-[#DEB887]',
                    'P': 'bg-[#FFEFD5] text-[#D2691E]', 'R': 'bg-[#FFE4E1] text-[#FA8072]',
                    'S': 'bg-[#E0FFFF] text-[#008B8B]', 'T': 'bg-[#F5FFFA] text-[#3CB371]',
                    'V': 'bg-[#F0FFF0] text-[#228B22]', 'Y': 'bg-[#FFFFE0] text-[#BDB76B]'
                  };
                  const colors = colorMap[initial] || 'bg-gray-100 text-gray-700';

                  return (
                    <motion.div 
                      key={review.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="p-3 md:p-4 mb-2.5 bg-white border border-primary-950/[0.04] rounded-xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.06)] transition-shadow duration-300"
                    >
                      <div className="flex items-start gap-2.5 md:gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-serif text-[12px] md:text-[14px] font-bold shadow-sm flex-shrink-0 ${colors}`}>
                          {initial}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-0.5 md:mb-1 gap-1">
                            <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                              <h4 className="font-bold text-primary-950/95 text-[12.5px] md:text-[14px] tracking-tight">{review.author}</h4>
                              {review.verified && (
                                <div className="flex items-center gap-0.5 text-[8.5px] md:text-[9px] text-emerald-700 bg-emerald-50/70 px-1 py-0.5 border border-emerald-200/50 rounded uppercase tracking-[0.5px] font-bold shadow-sm leading-none">
                                  <ShieldCheck className="w-2 h-2 md:w-2.5 md:h-2.5" strokeWidth={2.5} />
                                  <span className="mt-[1px]">Verified</span>
                                </div>
                              )}
                            </div>
                            <div className="text-[9.5px] md:text-[10.5px] text-primary-950/40 font-medium whitespace-nowrap">{review.date}</div>
                          </div>
                          
                          <div className="flex items-center flex-wrap gap-2 md:gap-2.5 mb-1.5">
                            <div className="flex text-amber-500">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} className={`w-[11px] h-[11px] md:w-[12px] md:h-[12px] ${review.rating >= s ? 'fill-current' : 'text-gray-200'}`} />
                              ))}
                            </div>
                            
                            {review.city && (
                              <div className="flex items-center gap-1.5 text-[9.5px] md:text-[10px] text-primary-950/50 font-medium">
                                <span className="hidden sm:inline text-gray-300">•</span>
                                <span className="mt-[1px]">{review.city}</span>
                              </div>
                            )}
                          </div>
                          
                          <p className="text-primary-950/80 leading-[1.5] md:leading-[1.6] text-[12px] md:text-[13px] text-pretty font-medium mb-1.5">
                            {review.text}
                          </p>

                          {review.trustSignal && (
                            <div className="inline-flex items-center text-[8.5px] md:text-[9px] bg-[#FDF3E1]/80 text-[#B8860B] border border-[#B8860B]/20 px-1.5 md:px-2 py-[2px] md:py-0.5 rounded-[3px] font-bold tracking-wide uppercase shadow-sm leading-none">
                              <span className="mt-[1px]">{review.trustSignal}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            
            {visibleCount < reviews.length && (
              <div className="mt-2 md:mt-4 flex justify-center lg:justify-start">
                <button 
                  onClick={loadMore}
                  className="group flex items-center gap-1.5 text-[9.5px] md:text-[10.5px] font-bold uppercase tracking-[1px] text-[#8A6A4A] hover:text-primary-950 transition-colors py-[7px] px-3.5 rounded-full border border-[#8A6A4A]/20 hover:bg-[#F9F7F4] hover:border-[#8A6A4A]/40"
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
