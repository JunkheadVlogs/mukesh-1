import React, { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Product, Review } from "../store";
import { Star, ShieldCheck, ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getProductReviewStats, getSeededRandom } from "../utils";

interface ProductReviewsProps {
  product: Product;
}

export interface EnhancedReview extends Review {
  city?: string;
  trustSignal?: string;
}

const firstNames = [
  "Riya",
  "Sneha",
  "Anjali",
  "Pooja",
  "Aarti",
  "Simran",
  "Meera",
  "Neha",
  "Divya",
  "Priya",
  "Kavya",
  "Nandini",
  "Shruti",
  "Swati",
  "Tanya",
  "Geeta",
  "Sunita",
  "Anita",
  "Roshni",
  "Vidya",
  "Sujata",
  "Pallavi",
  "Isha",
  "Ritu",
  "Bhavna",
  "Kriti",
  "Smriti",
  "Sakshi",
  "Ayesha",
  "Monalisa",
  "Zoya",
  "Rupali",
  "Shikha",
  "Jyoti",
  "Kiran",
  "Madhu",
];

const lastNames = [
  "Sharma",
  "Patel",
  "Verma",
  "Jain",
  "Gupta",
  "Singh",
  "Agarwal",
  "Mehta",
  "Reddy",
  "Kaur",
  "Joshi",
  "Desai",
  "Shah",
  "Kapoor",
  "Nair",
  "Iyer",
  "Chatterjee",
  "Roy",
  "Rao",
  "Das",
  "Yadav",
  "Rajput",
  "Chauhan",
  "Bhatia",
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
  "Nagpur, Maharashtra",
];

const trustSignals = [
  "Purchased for Wedding",
  "Purchased for Festival",
  "Purchased for Office Wear",
  "Purchased for Gifting",
  "Purchased for Daily Wear",
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
  "nice saree very soft fabric. thnks.",
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
  "Good linen blend, does not crease very easily which is a huge plus.",
];

const printedReviews = [
  "The print quality is exactly as shown. Colors don't bleed after washing.",
  "Lovely prints and the fabric is extremely flowy.",
  "Very modern print! It gives a very young and chic look.",
  "The colors are so vibrant and eye-catching. Perfect for day events.",
  "Beautiful floral design. Got exactly what I ordered.",
  "Was skeptical about the print looking cheap but it actually looks designer and high-end.",
];

const festiveReviews = [
  "Perfect for the wedding season. The work is very intricate.",
  "Looks very grand and festive! Gives a rich look.",
  "Wore it for Diwali and everybody asked where I got it from.",
  "The zari work is beautiful and doesn't look cheap at all. Loving it.",
  "Very heavy border but still manageable. Looks like a designer piece.",
  "Stunning festive wear! Drapes like a dream and reflects light beautifully in evening functions. Truly premium.",
  "Purchased this for my brother's reception and felt like royalty. The fabric has a natural sheen.",
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
  "Looks extremely classy when paired with some oxidized jewellery.",
];

const dates = [
  "2 days ago",
  "3 days ago",
  "5 days ago",
  "1 week ago",
  "12 days ago",
  "15 days ago",
  "3 weeks ago",
  "1 month ago",
  "2 months ago",
  "Yesterday",
  "4 days ago",
  "6 days ago",
  "2 weeks ago",
  "1.5 months ago",
];

function generateReviews(product: Product): EnhancedReview[] {
  const seed = getSeededRandom(product.id + "-revs");
  const count = (seed % 10) + 15; // 15 to 24 reviews for better load more experience
  const reviews: EnhancedReview[] = [];

  const nameParts = (product.name || "").toLowerCase();
  const catParts = (product.category || "").toLowerCase();
  const fabricParts = (product.fabric || "").toLowerCase();

  const isCoOrd =
    catParts.includes("co-ord") ||
    catParts.includes("kurti") ||
    catParts.includes("suit");
  const isLinen = fabricParts.includes("linen") || nameParts.includes("linen");
  const isPrinted = nameParts.includes("print") || nameParts.includes("floral");
  const isFestive =
    nameParts.includes("wedding") ||
    nameParts.includes("festive") ||
    nameParts.includes("zari") ||
    nameParts.includes("silk");

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
    const lname =
      s % 3 === 0 ? "" : " " + lastNames[(s * 5) % lastNames.length];
    const initialOnly = s % 7 === 0;
    const author = initialOnly
      ? `${fname} ${lname.charAt(1) || "K"}.`
      : `${fname}${lname}`;

    // Emotional/Variation texts
    let text = reviewPool[(s * 7) % reviewPool.length];
    if (s % 5 === 0) {
      // Add a grammatical quirk or emotional sentence
      const extra = [
        " Can't wait to shop again!",
        " Highly recommended.",
        " 🥰",
        " ❤️ Loved it.",
        " Thanks Mukesh Saree Centre!",
        " Tbh, looks better than the pics.",
      ];
      text += extra[s % extra.length];
    }

    // Occasional lowercase start or lack of fullstop
    if (s % 9 === 0) {
      text = text.charAt(0).toLowerCase() + text.slice(1);
    }
    if (s % 11 === 0 && text.endsWith(".")) {
      text = text.slice(0, -1);
    }

    const date = dates[(s * 11) % dates.length];

    // Most should be 5 stars, some 4 stars, rarely 3 based on average
    let rating = 5;
    if (stats.rating < 4.8) {
      rating = s % 10 > 6 ? 4 : 5;
    } else {
      rating = s % 10 > 8 ? 4 : 5;
    }

    // Add rare 3 star if rating is really low
    if (stats.rating < 4.6 && s % 15 === 0) {
      rating = 3;
    }

    // Occasional city and trust signal
    const city = s % 2 === 0 ? cities[(s * 13) % cities.length] : undefined;
    const trustSignal =
      s % 3 === 0 ? trustSignals[(s * 17) % trustSignals.length] : undefined;

    reviews.push({
      id: `rev-${product.id}-${i}`,
      author: author.trim(),
      rating,
      date,
      text,
      verified: s % 10 !== 0, // 90% verified
      city,
      trustSignal,
    });
  }

  return reviews;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ product }) => {
  const [visibleCount, setVisibleCount] = useState(3);
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    name: "",
    rating: 5,
    comment: "",
  });
  const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);

  const [localReviews, setLocalReviews] = useState<EnhancedReview[]>([]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsReviewSubmitted(true);

    // Add new review
    const newReview: EnhancedReview = {
      id: Math.random().toString(36).substring(7),
      author: reviewForm.name || "Anonymous",
      rating: reviewForm.rating,
      text: reviewForm.comment,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      verified: true,
    };

    setLocalReviews((prev) => [newReview, ...prev]);

    setTimeout(() => {
      setIsWritingReview(false);
      setIsReviewSubmitted(false);
      setReviewForm({ name: "", rating: 5, comment: "" });
    }, 2000);
  };

  const reviews = useMemo(() => {
    const defaultReviews =
      product.reviews && product.reviews.length > 0
        ? product.reviews
        : generateReviews(product);

    // Combine local user reviews at the top
    return [...localReviews, ...defaultReviews];
  }, [product, localReviews]);

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
    setVisibleCount((prev) => Math.min(prev + 5, reviews.length));
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-4 sm:gap-6 mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-serif text-[var(--color-dark)] font-normal tracking-wide">
          Customer Reviews
        </h2>
        <button
          onClick={() => setIsWritingReview(true)}
          className="text-[10px] md:text-[11px] uppercase tracking-[0.1em] font-medium text-[var(--color-dark)] underline decoration-[var(--color-border)] underline-offset-4 hover:decoration-[var(--color-dark)] transition-colors flex-shrink-0"
        >
          Write a Review
        </button>
      </div>

      {createPortal(
        <AnimatePresence>
          {isWritingReview && (
            <div className="fixed inset-0 z-[1005] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-[2px]">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2 }}
                className="bg-white w-full max-w-[420px] max-h-[85vh] overflow-y-auto rounded-[18px] shadow-2xl relative"
              >
                <div className="sticky top-0 bg-white z-10 px-6 py-5 border-b border-black/5 flex justify-between items-center">
                  <h3 className="text-[17px] font-serif text-[var(--color-dark)] m-0">
                    Write a Review
                  </h3>
                  <button
                    onClick={() => setIsWritingReview(false)}
                    className="text-black/40 hover:text-black transition-colors p-1.5 bg-black/5 rounded-full"
                  >
                    <X size={18} strokeWidth={1.5} />
                  </button>
                </div>

                <div className="p-6">
                  {isReviewSubmitted ? (
                    <div className="text-center py-8">
                      <div className="w-14 h-14 bg-green-50 text-[#25D366] rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck size={28} strokeWidth={1.5} />
                      </div>
                      <h3 className="text-xl font-serif text-[var(--color-dark)] mb-2">
                        Thank you!
                      </h3>
                      <p className="text-black/60 text-[13px] font-light">
                        Your review has been successfully added.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleReviewSubmit} className="space-y-6">
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.1em] font-bold text-[var(--color-dark)] mb-3">
                          Rating
                        </label>
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() =>
                                setReviewForm({ ...reviewForm, rating: s })
                              }
                              className="focus:outline-none focus:scale-110 active:scale-95 transition-transform"
                            >
                              <Star
                                className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${s <= reviewForm.rating ? "fill-[#F4B63D] text-[#F4B63D]" : "text-black/10"}`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.1em] font-bold text-[var(--color-dark)] mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          required
                          value={reviewForm.name}
                          onChange={(e) =>
                            setReviewForm({
                              ...reviewForm,
                              name: e.target.value,
                            })
                          }
                          className="w-full h-11 px-4 border border-black/10 rounded-md focus:outline-none focus:border-black/30 focus:ring-1 focus:ring-black/30 bg-transparent text-[13px] transition-all font-light"
                          placeholder="Your name"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.1em] font-bold text-[var(--color-dark)] mb-2">
                          Review
                        </label>
                        <textarea
                          required
                          value={reviewForm.comment}
                          onChange={(e) =>
                            setReviewForm({
                              ...reviewForm,
                              comment: e.target.value,
                            })
                          }
                          className="w-full p-4 border border-black/10 rounded-md focus:outline-none focus:border-black/30 focus:ring-1 focus:ring-black/30 bg-transparent text-[13px] min-h-[100px] resize-none transition-all font-light"
                          placeholder="Share your experience with this product..."
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full h-12 bg-[#1A0A00] text-white text-[11px] uppercase tracking-[0.1em] font-bold rounded-md hover:bg-[#331400] transition-colors shadow-lg shadow-black/10"
                      >
                        Submit Review
                      </button>
                    </form>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body,
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16">
        {/* Review Stats */}
        <div className="lg:col-span-4 lg:col-start-1">
          <div className="bg-[var(--color-surface)] p-4 md:p-8 rounded-lg flex flex-col">
            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-4xl md:text-5xl font-serif text-[var(--color-dark)] font-light leading-none">
                {averageRating.toFixed(1)}
              </span>
              <div className="flex flex-col">
                <div className="flex items-center gap-[2px] mb-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-[11px] h-[11px] sm:w-[12px] sm:h-[12px] ${
                        averageRating >= s
                          ? "fill-[#F4B63D] text-[#F4B63D]"
                          : averageRating >= s - 0.5
                            ? "fill-[#F4B63D] text-[#F4B63D] opacity-50"
                            : "fill-[#E6DEC8] text-[#E6DEC8]"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] md:text-[11px] text-[var(--color-muted)] tracking-[0.15em] uppercase">
                  Based on {totalReviews} reviews
                </span>
              </div>
            </div>

            <div className="w-full space-y-1">
              {[
                { stars: 5, pct: fiveStarPct },
                { stars: 4, pct: fourStarPct },
                { stars: 3, pct: threeStarPct },
                { stars: 2, pct: 0 },
                { stars: 1, pct: 0 },
              ].map((bar) => (
                <div
                  key={bar.stars}
                  className="flex items-center gap-4 text-[10px] md:text-[11px] uppercase tracking-widest text-[var(--color-muted)]"
                >
                  <span className="w-12 whitespace-nowrap">
                    {bar.stars} Stars
                  </span>
                  <div className="flex-1 h-[2px] bg-[var(--color-border)] relative">
                    <div
                      className="absolute top-0 left-0 h-full bg-[var(--color-dark)]"
                      style={{ width: `${bar.pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right">{bar.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Review List */}
        <div className="lg:col-span-8">
          <div className="flex flex-col gap-3">
            <AnimatePresence initial={false}>
              {reviews.slice(0, visibleCount).map((review: EnhancedReview) => {
                const initial = review.author.charAt(0).toUpperCase();

                return (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="pb-3 border-b border-[var(--color-border)] last:border-0"
                  >
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center font-serif text-[13px] md:text-[14px] bg-[var(--color-bg)] text-[var(--color-dark)] border border-[var(--color-border)] flex-shrink-0">
                        {initial}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-0.5 gap-0.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-medium text-[var(--color-dark)] text-[13px] tracking-wide">
                              {review.author}
                            </h4>
                            {review.verified && (
                              <div className="flex items-center gap-1 text-[8.5px] md:text-[9px] text-[var(--color-muted)] uppercase tracking-[0.1em]">
                                <ShieldCheck
                                  className="w-2.5 h-2.5 md:w-3 md:h-3"
                                  strokeWidth={1.5}
                                />
                                <span className="mt-[0.5px]">Verified Buyer</span>
                              </div>
                            )}
                          </div>
                          <div className="text-[9px] md:text-[10px] text-[var(--color-muted)] uppercase tracking-widest">
                            {review.date}
                          </div>
                        </div>

                        <div className="flex items-center flex-wrap gap-2 mb-1.5">
                          <div className="flex items-center gap-[2px]">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-[11px] h-[11px] sm:w-[12px] sm:h-[12px] ${
                                  review.rating >= s
                                    ? "fill-[#F4B63D] text-[#F4B63D]"
                                    : "fill-[#E6DEC8] text-[#E6DEC8]"
                                }`}
                              />
                            ))}
                          </div>

                          {review.city && (
                            <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] text-[var(--color-muted)] uppercase tracking-widest">
                              <span className="hidden sm:inline">|</span>
                              <span className="mt-[1px]">{review.city}</span>
                            </div>
                          )}
                        </div>

                        <p className="text-[13px] md:text-[14px] leading-relaxed text-[var(--color-dark)]/80 font-light mb-1.5">
                          {review.text}
                        </p>

                        {review.trustSignal && (
                          <div className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-1 bg-[var(--color-surface)]/70 border border-[var(--color-border)] rounded-full text-[8.5px] md:text-[9px] uppercase tracking-wider text-[var(--color-gold-dark)] font-medium">
                            <Star className="w-2 h-2 md:w-2.5 md:h-2.5 fill-[var(--color-gold-dark)] text-[var(--color-gold-dark)]" />
                            {review.trustSignal}
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
            <div className="mt-4 flex justify-center lg:justify-start">
              <button
                onClick={loadMore}
                className="flex items-center justify-center gap-2 px-8 h-[40px] text-[10px] uppercase tracking-widest font-medium text-[var(--color-dark)] border border-[var(--color-border)] hover:border-[var(--color-dark)] transition-colors bg-transparent"
              >
                Load More
                <ChevronDown
                  size={14}
                  className="group-hover:translate-y-0.5 transition-transform"
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
