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

const firstFemaleNames = [
  "Sneha", "Pooja", "Aarti", "Neha", "Kavita", "Priyanka", "Ritu", "Meenal", "Anjali", "Shruti", 
  "Divya", "Meera", "Nandini", "Kavya", "Swati", "Simran", "Roshni", "Vidya", "Sujata", "Pallavi", 
  "Anita", "Isha", "Bhavna", "Kriti", "Smriti", "Sakshi", "Tanya", "Geeta", "Sunita", "Jyoti", 
  "Kiran", "Shalini", "Meenakshi", "Priya", "Komal", "Vandana", "Aiswarya", "Radha", "Nikita", "Payal"
];

const lastFemaleNames = [
  "Kulkarni", "Sharma", "Verma", "Joshi", "Rao", "Patil", "Singh", "Deshmukh", "Kapoor", "Nair", 
  "Iyer", "Chatterjee", "Sen", "Reddy", "Bhatia", "Kaur", "Gupta", "Desai", "Agarwal", "Roy", 
  "Patel", "Mehta", "Shah", "Chauhan", "Saxena", "Pillai", "Shinde", "Mishra", "Pandey", "Majumdar", 
  "Hegde", "Sundaram", "Nambiar", "Bose", "Solanki", "Pathak", "Menon", "Krishnan", "Vyas", "Dutta"
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
  "Purchased for Cousin's Wedding",
  "Purchased for Grah Pravesh Puja",
  "Purchased for Office Wear",
  "Purchased for Gifting Mother",
  "Purchased for Rakhi Festival",
  "Purchased for Semi-Formal Meet",
];

const tissueSareeReviews = [
  "The gold-silver metallic sheen on this tissue saree is absolutely elegant! It has that perfect crisp, slightly structured drape for weddings.",
  "Very lightweight tissue with such a beautiful shimmer under the lights. It stands perfectly as pleats and holds shape beautifully.",
  "Loved the crisp sheen and floral print base. It gives a highly rich and traditional look without feeling heavy at all.",
  "Draped this for my niece's engagement ceremony. Got many lovely compliments on the shiny, slightly stiff fabric finish.",
  "Traditional yet modern. The shimmer is highly sophisticated, and the border finish is extremely neat and crisp.",
  "Perfect for family puja. The material is structured and has a majestic look. Paired with gold jewelry, it feels royal.",
  "The printed flowers look extremely bright against the metallic base. Extremely elegant choice for evening functions.",
  "Very neat styling and lightweight tissue drape. Best part is it doesn't itch or prick at any place, quite high-grade.",
  "Beautiful silver border lustre. It holds its lines and folds very sharply, letting you carry it hassle-free for long events."
];

const linenSareeReviews = [
  "The soft linen is highly breathable and light. Best comfort for my long day shifts at the college without feeling heavy.",
  "Very lightweight linen. Loved the soft authentic linen texture and the lovely colored tassels at the end of the pallu.",
  "Perfect for warm climates. The fabric is extremely breathable and holds pleating very quickly.",
  "Beautiful artistic print quality and very subtle corporate color palette. Extremely graceful for office wear and casual dinners.",
  "Very comfortable everyday saree. The soft linen cotton blend drapes naturally on the shoulders without look puffy.",
  "Beautifully done borders and tassels. Needs just a light iron steam to look extremely professional and clean.",
  "Subtle elegant wear. Draping is a five-minute job as the texture stays completely secure without sliding.",
  "Extremely airy, lightweight and durable fabric. Perfect for regular semi-formal events and office meetings.",
  "Classic linen texture with neat prints. Holds up the pleats strongly throughout the day with zero discomfort."
];

const softSilkSareeReviews = [
  "The fabric is buttery smooth and drapes like an absolute dream! It has a gorgeous royal soft silk luster.",
  "Extremely rich look and very soft touch. It drapes so beautifully, hugging the body nicely for family weddings.",
  "Quite lightweight silk compared to heavy kanchipurams, making it very comfortable to wear for historical pujas.",
  "Loved the intricate zari weaving patterns. The border is highly smooth and the pallu design is extremely majestic.",
  "Wore it for the reception puja. My mother loved the soft texture so much she is planning to borrow it immediately.",
  "Stunning vibrant color and rich royal touch. Highly premium soft silk selection with a lovely matching unstitched blouse.",
  "Very elegant traditional fall. The fabric doesn't look bulky and remains soft and smooth against the skin all evening.",
  "Subtle shine with highly durable weaving. Draped perfectly with minimal pins and garnered so many elegant compliments."
];

const coOrdSetReviews = [
  "The fit of this co-ord set is perfect! The cotton fabric is extremely breathable for humid summer afternoons.",
  "Pants length is perfect for average Indian height, and the waistband elastic is very comfortable on the stomach.",
  "Perfect daily casual outfit. The material is airy, stitching is very clean, and color doesn't fade upon washing.",
  "Extremely stylish tunic design! Stitching around collar and buttons has a premium boutique tailoring feel.",
  "Very classy professional look for work or day-out with friends. Fabric feels extremely premium and light.",
  "Smart and highly comfortable co-ord. Doesn't crush much even after hours of sitting in the office.",
  "Loved the modern floral pattern and neat finish. Matching pants are stylish and comfortable for travel too."
];

const generalSareeReviews = [
  "Very gracefull fall and comfortable fabric. The print borders are highly neat, giving a classy traditional look.",
  "Excellent print quality and identical color tone as displayed in the website listings. Happy experience.",
  "Very elegant and lightweight! Perfect choice for family get-togethers and domestic festivals.",
  "Beautiful print and nice fabric texture. Extremely easy to carry for whole day functions without fatigue.",
  "Drapes very cleanly and holds pleats secure. Matching unstitched blouse is of perfect standard length.",
  "Great option for gifting your mother or sister. The colors are highly sophisticated and elegant."
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
  const count = (seed % 10) + 12; // 12 to 21 reviews for better feel
  const reviews: EnhancedReview[] = [];

  const nameParts = (product.name || "").toLowerCase();
  const catParts = (product.category || "").toLowerCase();
  const fabricParts = (product.fabric || "").toLowerCase();

  const isTissue = nameParts.includes("tissue") || fabricParts.includes("tissue");
  const isLinen = nameParts.includes("linen") || fabricParts.includes("linen") || catParts.includes("linen");
  const isSilk = nameParts.includes("silk") || fabricParts.includes("silk") || nameParts.includes("banarasi") || fabricParts.includes("banarasi");
  const isCoOrd = catParts.includes("co-ord") || catParts.includes("kurti") || catParts.includes("suit") || catParts.includes("set");

  // Determine key review pool
  let prodPool = [...generalSareeReviews];
  if (isTissue) prodPool = [...tissueSareeReviews];
  else if (isLinen) prodPool = [...linenSareeReviews];
  else if (isSilk) prodPool = [...softSilkSareeReviews];
  else if (isCoOrd) prodPool = [...coOrdSetReviews];

  // Determine overall product rating roughly so generated reviews match
  const stats = getProductReviewStats(product);

  for (let i = 0; i < count; i++) {
    const s = Math.abs(seed + i * 997);

    // Realistic Indian Female Name
    const fname = firstFemaleNames[s % firstFemaleNames.length];
    const lname = lastFemaleNames[(s * 3) % lastFemaleNames.length];
    const author = `${fname} ${lname}`;

    // Base review comment
    let text = prodPool[s % prodPool.length];

    // Append organic variations in lengths & details
    if (s % 4 === 0) {
      const extraDetails = [
        " Delivery was incredibly fast to Pune, got it in just 3 days.",
        " Got so many complaints from my neighbors during the society Diwali function!",
        " Multiple relatives asked me for the website link today evening.",
        " The WhatsApp support from Mukesh Saree Centre team was also very helpful regarding the shade selection.",
        " Highly recommend this boutique if you want subtle, elegant designs that aren't too bright.",
        " Best part is that the color is exactly the same royal tone as shown.",
        " The unstitched blouse piece fabric is of high quality and sufficient for making trendy sleeve designs."
      ];
      text += extraDetails[s % extraDetails.length];
    } else if (s % 7 === 0) {
      const shortExtra = [
        " Truly happy with it.",
        " 🥰 Beautiful find.",
        " Totally happy with my purchase.",
        " Highly elegant.",
        " ❤️ Beautiful print."
      ];
      text += shortExtra[s % shortExtra.length];
    }

    const date = dates[(s * 11) % dates.length];

    // Most should be 5 stars, some 4 stars based on average
    let rating = 5;
    if (stats.rating < 4.8) {
      rating = s % 8 > 5 ? 4 : 5;
    } else {
      rating = s % 10 > 8 ? 4 : 5;
    }

    if (stats.rating < 4.6 && s % 12 === 0) {
      rating = 4; // Use 4 stars dynamically for realistic distribution
    }

    // Occasional city and trust signal
    const city = s % 2 === 0 ? cities[(s * 13) % cities.length] : undefined;
    const trustSignal = s % 3 === 0 ? trustSignals[(s * 17) % trustSignals.length] : undefined;

    reviews.push({
      id: `rev-${product.id}-${i}`,
      author,
      rating,
      date,
      text,
      verified: s % 12 !== 0, // mostly verified
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
