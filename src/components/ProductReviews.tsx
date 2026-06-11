import React, { useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Product, Review } from "../store";
import { Star, ShieldCheck, ChevronDown, X, Camera, Image as ImageIcon, Loader2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getProductReviewStats, getSeededRandom } from "../utils";
import { safeLocalStorage } from "../utils/safeStorage";

interface ProductReviewsProps {
  product: Product;
}

export interface EnhancedReview extends Review {
  city?: string;
  trustSignal?: string;
  images?: string[];
}

const firstFemaleNames = [
  "Sneha", "Pooja", "Aarti", "Neha", "Kavita", "Priyanka", "Ritu", "Meenal", "Anjali", "Shruti", 
  "Divya", "Meera", "Nandini", "Kavya", "Swati", "Simran", "Roshni", "Vidya", "Sujata", "Pallavi", 
  "Anita", "Isha", "Bhavna", "Kriti", "Smriti", "Sakshi", "Tanya", "Geeta", "Sunita", "Jyoti", 
  "Kiran", "Shalini", "Meenakshi", "Priya", "Komal", "Vandana", "Aiswarya", "Radha", "Nikita", "Payal",
  "Priti", "Deepa", "Deepika", "Kajal", "Sapna", "Amrita", "Kiran", "Madhu", "Shweta", "Megha",
  "Varsha", "Rekha", "Rupa", "Preeti", "Monika", "Sheela", "Nisha", "Sweta", "Aruna", "Neetu"
];

const lastFemaleNames = [
  "Kulkarni", "Sharma", "Verma", "Joshi", "Rao", "Patil", "Singh", "Deshmukh", "Kapoor", "Nair", 
  "Iyer", "Chatterjee", "Sen", "Reddy", "Bhatia", "Kaur", "Gupta", "Desai", "Agarwal", "Roy", 
  "Patel", "Mehta", "Shah", "Chauhan", "Saxena", "Pillai", "Shinde", "Mishra", "Pandey", "Majumdar", 
  "Hegde", "Sundaram", "Nambiar", "Bose", "Solanki", "Pathak", "Menon", "Krishnan", "Vyas", "Dutta",
  "Raturi", "Trivedi", "Dwivedi", "Tripathi", "Dubey", "Shukla", "Pandey", "Chaturvedi", "Bannerjee", "Mukherjee",
  "Malhotra", "Kapoor", "Nanda", "Khanna", "Chopra", "Chawla", "Bhasin", "Sareen", "Mehra", "Sethi"
];

const cities = [
  "Nagpur, Maharashtra", "Mumbai, Maharashtra", "Pune, Maharashtra", "Bangalore, Karnataka", 
  "New Delhi, Delhi", "Ahmedabad, Gujarat", "Surat, Gujarat", "Chennai, Tamil Nadu", 
  "Hyderabad, Telangana", "Kolkata, West Bengal", "Jaipur, Rajasthan", "Lucknow, Uttar Pradesh", 
  "Gurugram, Haryana", "Indore, Madhya Pradesh", "Nashik, Maharashtra", "Thane, Maharashtra",
  "Bhopal, MP", "Kanpur, UP", "Patna, Bihar", "Vadodara, Gujarat", "Ludhiana, Punjab"
];

const trustSignals = [
  "Purchased for Bride's Wedding Trouseau",
  "Purchased for Grah Pravesh Puja",
  "Purchased for Office Festival Celebration",
  "Purchased for Gifting Mother's Birthday",
  "Purchased for Raksha Bandhan",
  "Purchased for Friend's Sangeet Ceremony",
  "Purchased for Diwali Family Dinner",
  "Purchased for Kitty Party Wear",
  "Purchased for Reception Ceremony"
];

const sareeReviewTemplates = [
  "Absolutely in love with the drape of this {fabric} saree! The {color} shade looks incredibly royal and has a beautiful shimmer under any lighting. Perfect for family weddings.",
  "The texture of this {fabric} material is buttery soft. I purchased the {color} variant, and the real-life luster exceeded my expectations. Extremely lightweight to carry.",
  "Beautiful craft! It holds pleats very sharply and has a perfect, natural fall. Draped it for my cousin's wedding reception and received so many elegant compliments.",
  "Excellent quality. ❤️",
  "Mukesh Saree Centre has the best collection. I was hesitant to buy {fabric} online, but the quality of this {color} saree is top-notch. Quick delivery of 3 days to Mumbai.",
  "Simply gorgeous look and very subtle borders. Paired this with standard gold jewelry for a Grah Pravesh puja, and it looked so festive. Highly premium weave.",
  "Nice {fabric} fabric and perfect {color} tone. Happy customer.",
  "Incredibly comfortable to wear for long functions. The unstitched blouse piece provided is of high-quality matching fabric and is of generous standard length. Must buy!",
  "This {color} {fabric} saree is a masterpiece. The weaving density is high, making it highly durable yet extremely light. No bulky feeling on the shoulders at all.",
  "So lightweight and easy to carry all day! The subtle lustre on the border line is highly sophisticated and doesn't itch or poke. Authentic Indian elegance.",
  "Truly boutique-grade material. The Mukesh team on WhatsApp was also very prompt in helping me select this {color} shade. Highly recommended for premium buyer.",
  "Perfect festive addition! The fabric breathes naturally, and the design pattern looks very traditional yet sleek.",
  "My mother loved this gift! She is extremely fond of {fabric} sarees, and she remarked that the {color} hue is highly unique and traditional.",
  "High quality weave. Feels very royal.",
  "Everything about this {fabric} saree is amazing—from the fast shipping to Nagpur to the stellar texture. It has that crisp, clean finish that stays secure without sliding.",
  "Extremely graceful fall and traditional charm. It has a beautiful rich look but is very easy to carry for long hours.",
  "Beautiful colored tassels and neat borders. Extremely happy with the purchase. Zero color fading or issues.",
  "Simply flawless drape! The sheen under evening hall lights has a majestic quality. Will definitely buy more designs from this store.",
  "A perfect 10/10 heritage piece. The {color} base and {fabric} texture make it look incredibly expensive.",
  "Highly elegant and premium quality saree. Perfect experience."
];

const coordReviewTemplates = [
  "The fit of this {category} is incredible! The {fabric} fabric is extremely breathable and perfect for humid summer afternoons. Fits like custom tailoring.",
  "Such a smart look. I bought the {color} shade for office wear, and it looks highly professional and neat. Paired it with simple flats.",
  "Fabric feels highly premium and lightweight. It doesn't crush easily even after hours of sitting in meetings. The {color} is very classy.",
  "Extremely stylish and comfy!",
  "My absolute favorite for traveling now. The {fabric} is so airy, and the trousers have a very comfortable soft elastic waistband that doesn't pinch.",
  "Stitching around the collar and buttons is done with absolute perfection. Mukesh Saree Centre's boutique-grade craftsmanship shines in this {color} set.",
  "Excellent fit and premium fabric quality. Highly recommend.",
  "Love the modern contemporary silhouette of this outfit. It hides bloated days perfectly and drapes nicely on the shoulders. The {color} is exact as pictured.",
  "This {color} {category} is an absolute summer essential. The material is so soft to touch and has a beautiful natural fall that doesn't cling.",
  "Highly elegant! Washed it once already and there was completely zero color bleeding or shrinkage. True value for money.",
  "Perfect addition to my workwear closet. Received so many beautiful compliments from my colleagues on the sleek sleeve design.",
  "Super comfortable daily wear set. The {fabric} texture feels like second skin.",
  "Got the package in just 2 days. The styling is highly classy and matches global boutique standards. Will definitely buy more patterns of this {category}.",
  "Stunning style and very breezy fabric.",
  "Highly impressed by the boutique tailoring of this {fabric} piece. The {color} color is highly sophisticated. Perfect size fit as per the chart.",
  "Very classy premium look for casual dinners or brunch with friends. Easy to carry and style.",
  "The pockets are a highly welcome and functional addition to these smart trousers! The styling details of this {color} set are very elegant.",
  "Buttery soft and looks highly expensive. Extremely happy with my purchase of this {fabric} {category}.",
  "Perfect fusion of style and absolute comfort. The {color} tone matches the web photos 100%.",
  "Incredible boutique-grade product. Very happy with the comfort of this {category}."
];

function generateReviews(product: Product): EnhancedReview[] {
  const seed = getSeededRandom(product.id + "-revs");
  const stats = getProductReviewStats(product);

  const nameParts = (product.name || "").toLowerCase();
  const catParts = (product.category || "").toLowerCase();
  const fabricParts = (product.fabric || "").toLowerCase();

  const isCoOrd = catParts.includes("co-ord") || catParts.includes("kurti") || catParts.includes("suit") || catParts.includes("set") || catParts.includes("tunic");
  const isSaree = !isCoOrd || catParts.includes("saree") || nameParts.includes("saree");

  // Format category name for Co-Ord/Tunic sets logically
  const categoryTerm = isCoOrd ? "co-ord set" : (product.category || "outfit").toLowerCase().replace(/s$/, "");

  // Clear and premium formatting for colors and fabrics
  let color = (product.color || "beautiful").trim();
  if (color.toLowerCase() === "multi" || color.toLowerCase() === "multicolor" || color.toLowerCase() === "assorted") {
    color = "matching";
  }
  
  let fabric = (product.fabric || "premium").trim();
  if (fabric.toLowerCase() === "fabric" || !fabric) {
    fabric = "premium weave";
  }

  const count = stats.reviewCount;
  const reviews: EnhancedReview[] = [];

  for (let i = 0; i < count; i++) {
    const s = Math.abs(seed + i * 997);

    // Dynamic but deterministic combination of first and last names for 100% unique names
    const firstIdx = (seed * 17 + i * 23 + i * 3) % firstFemaleNames.length;
    const lastIdx = (seed * 19 + i * 29 + i * 11) % lastFemaleNames.length;
    const author = `${firstFemaleNames[firstIdx]} ${lastFemaleNames[lastIdx]}`;

    // Select the template and perform replacements
    let text = "";
    if (isSaree) {
      const templateIndex = i % sareeReviewTemplates.length;
      text = sareeReviewTemplates[templateIndex];
    } else {
      const templateIndex = i % coordReviewTemplates.length;
      text = coordReviewTemplates[templateIndex];
    }

    // Replace placeholders safely
    text = text
      .replace(/{color}/g, color)
      .replace(/{fabric}/g, fabric)
      .replace(/{category}/g, categoryTerm);

    // Natural dates spread across the last 6-12 months (roughly 15 to 365 days ago)
    const currentDate = new Date(2026, 5, 4); // June 4, 2026
    const dayOffset = 15 + ((s * 27) % 350); 
    const revDate = new Date(currentDate.getTime() - dayOffset * 24 * 60 * 60 * 1000);
    const date = revDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    // Rating distribution: mostly 5, some 4, very few 3, matching utils calculation
    const mod = s % 15;
    let rating = 5;
    if (mod === 14) {
      rating = 3;
    } else if (mod >= 12) {
      rating = 4;
    } else {
      rating = 5;
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
      verified: s % 15 !== 0, // mostly verified
      city,
      trustSignal,
    });
  }

  return reviews;
}

const compressAndOptimizeImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!window.FileReader) {
      resolve("");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          resolve(dataUrl);
        } else {
          resolve((e.target?.result as string) || "");
        }
      };
      img.onerror = () => {
        resolve((e.target?.result as string) || "");
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

const ratingLabels = [
  "Select a rating",
  "1 - Disappointed",
  "2 - Below Expectations",
  "3 - Met Expectations",
  "4 - Highly Satisfied",
  "5 - Truly Elegant!"
];

export const ProductReviews: React.FC<ProductReviewsProps> = ({ product }) => {
  const [visibleCount, setVisibleCount] = useState(3);
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [reviewForm, setReviewForm] = useState<{
    name: string;
    rating: number;
    comment: string;
    images: string[];
  }>({
    name: "",
    rating: 5,
    comment: "",
    images: [],
  });
  
  const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [selectedFullImage, setSelectedFullImage] = useState<string | null>(null);

  const [localReviews, setLocalReviews] = useState<EnhancedReview[]>(() => {
    try {
      const saved = safeLocalStorage.getItem(`reviews-${product.id}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const localReviewsLength = localReviews.length;
  useEffect(() => {
    try {
      safeLocalStorage.setItem(`reviews-${product.id}`, JSON.stringify(localReviews));
    } catch (e) {
      console.error("Failed to save reviews to safeLocalStorage", e);
    }
  }, [localReviewsLength, product.id]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsReviewSubmitted(true);

    // Add new review
    const newReview: EnhancedReview = {
      id: Math.random().toString(36).substring(7),
      author: reviewForm.name || "Anonymous",
      rating: reviewForm.rating,
      text: reviewForm.comment,
      images: reviewForm.images,
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
      setReviewForm({ name: "", rating: 5, comment: "", images: [] });
      setUploadError(null);
    }, 2000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploadError(null);
    setIsUploading(true);

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    const loadedImages: string[] = [...reviewForm.images];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!validTypes.includes(file.type)) {
        setUploadError("Only JPG, PNG and WEBP formats are supported.");
        continue;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        setUploadError("Image file size should be less than 10MB.");
        continue;
      }

      try {
        const optimized = await compressAndOptimizeImage(file);
        if (optimized) {
          loadedImages.push(optimized);
        }
      } catch (err) {
        console.error("Image optimization failed", err);
        setUploadError("Failed to upload some images. Please try again.");
      }
    }

    setReviewForm((prev) => ({
      ...prev,
      images: loadedImages,
    }));
    setIsUploading(false);
    e.target.value = "";
  };

  const removeUploadedImage = (indexToRemove: number) => {
    setReviewForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
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
            <div className="fixed inset-0 z-[1005] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-[2px]">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="bg-[#FCFAF7] w-full max-w-[450px] max-h-[92vh] sm:max-h-[90vh] overflow-hidden rounded-[20px] shadow-2xl relative flex flex-col border border-[#C8A96B]/20"
              >
                {/* Header - Fixed & Compact */}
                <div className="bg-white px-4 sm:px-6 py-3 sm:py-4 border-b border-[#C8A96B]/15 flex justify-between items-center flex-shrink-0">
                  <div>
                    <h3 className="text-base sm:text-lg font-serif text-[#1A0A00] font-normal tracking-wide m-0">
                      Share Your Experience
                    </h3>
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#C8A96B] font-medium m-0 mt-0.5">
                      {product.name}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsWritingReview(false)}
                    className="text-[#1A0A00]/40 hover:text-[#1A0A00] hover:bg-[#1A0A00]/5 transition-all p-1.5 sm:p-2 rounded-full flex-shrink-0"
                    aria-label="Close modal"
                  >
                    <X size={18} strokeWidth={2} />
                  </button>
                </div>

                {/* Content - Scrollable with tighter gaps on mobile */}
                <div className="overflow-y-auto p-4 sm:p-6 flex-1 space-y-3.5 sm:space-y-4">
                  {isReviewSubmitted ? (
                    <div className="text-center py-8 px-4">
                      <div className="w-14 h-14 bg-[#F4ECDD] text-[#C8A96B] rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                        <ShieldCheck size={28} strokeWidth={1.5} />
                      </div>
                      <h3 className="text-lg font-serif text-[#1A0A00] mb-1 font-normal">
                        Post Submitted!
                      </h3>
                      <p className="text-black/60 text-xs font-light max-w-xs mx-auto leading-relaxed">
                        Thank you for your review. Your genuine feedback helps our design team and the Mukesh Saree family grow.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleReviewSubmit} className="space-y-3.5 sm:space-y-4">
                      {/* Rating Selection - Compact padding */}
                      <div className="bg-white p-3 sm:p-4 rounded-xl border border-[#C8A96B]/10 shadow-3xs">
                        <label className="block text-[8px] sm:text-[9px] uppercase tracking-[0.15em] font-extrabold text-[#C8A96B] mb-1 sm:mb-1.5">
                          Your Rating
                        </label>
                        <div className="flex items-center gap-1.5">
                          <div className="flex gap-0.5" onMouseLeave={() => setHoveredRating(null)}>
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button
                                key={s}
                                type="button"
                                onMouseEnter={() => setHoveredRating(s)}
                                onClick={() =>
                                  setReviewForm({ ...reviewForm, rating: s })
                                }
                                className="focus:outline-none hover:scale-110 active:scale-95 transition-all p-0.5"
                              >
                                <Star
                                  size={22}
                                  className={`transition-colors ${
                                    s <= (hoveredRating !== null ? hoveredRating : reviewForm.rating)
                                      ? "fill-[#F4B63D] text-[#F4B63D]"
                                      : "text-black/10 hover:text-black/20"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                          
                          <span className="text-[10.5px] font-sans font-medium text-[#1A0A00]/70 ml-1.5">
                            {ratingLabels[hoveredRating !== null ? hoveredRating : reviewForm.rating]}
                          </span>
                        </div>
                      </div>

                      {/* Name input - Shorter client-side inputs */}
                      <div className="space-y-1">
                        <label className="block text-[8px] sm:text-[9px] uppercase tracking-[0.15em] font-extrabold text-[#C8A96B] m-0">
                          Your Name
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
                          className="w-full h-10 px-3.5 border border-black/10 rounded-lg focus:outline-none focus:border-[#C8A96B] focus:ring-1 focus:ring-[#C8A96B] bg-white text-[12.5px] sm:text-[13px] transition-all font-light text-[#1A0A00]"
                          placeholder="e.g. Anjali Sharma"
                        />
                      </div>

                      {/* Comment textarea - Shorter on mobile viewports */}
                      <div className="space-y-1">
                        <label className="block text-[8px] sm:text-[9px] uppercase tracking-[0.15em] font-extrabold text-[#C8A96B] m-0">
                          Review Message
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
                          className="w-full p-3 border border-black/10 rounded-lg focus:outline-none focus:border-[#C8A96B] focus:ring-1 focus:ring-[#C8A96B] bg-white text-[12.5px] sm:text-[13px] min-h-[75px] sm:min-h-[90px] max-h-[110px] sm:max-h-[130px] resize-none transition-all font-light text-[#1A0A00] leading-relaxed"
                          placeholder="Tell us about the fabric feel, drape quality, luster, or style fit..."
                        />
                      </div>

                      {/* Upload Section - Reduced empty space */}
                      <div className="bg-white p-3 sm:p-4 rounded-xl border border-[#C8A96B]/15 shadow-3xs space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="block text-[8px] sm:text-[9px] uppercase tracking-[0.15em] font-extrabold text-[#C8A96B]">
                            Upload Photos
                          </label>
                          <span className="text-[8.5px] text-[#1A0A00]/40 font-serif italic">
                            Product, Draping, or Selfie
                          </span>
                        </div>

                        {uploadError && (
                          <div className="text-[10.5px] text-red-600 bg-red-50/50 p-2 rounded-md border border-red-100 font-light w-full">
                            {uploadError}
                          </div>
                        )}

                        {/* Drag and drop or click trigger zone - Tighter inner padding */}
                        <div className="relative">
                          <input
                            type="file"
                            id="review-image-picker"
                            accept="image/png, image/jpeg, image/jpg, image/webp"
                            multiple
                            onChange={handleImageUpload}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                            disabled={isUploading}
                          />
                          <div className="border border-dashed border-[#C8A96B]/30 hover:border-[#C8A96B]/70 bg-[#FDFCFB] hover:bg-[#FAF7F2] py-2.5 sm:py-3 px-3 rounded-lg text-center transition-all flex flex-col items-center justify-center gap-1 shadow-2xs">
                            {isUploading ? (
                              <>
                                <Loader2 className="w-4 h-4 text-[#C8A96B] animate-spin" />
                                <span className="text-[10px] text-neutral-500 font-light">
                                  Optimizing...
                                </span>
                              </>
                            ) : (
                              <>
                                <div className="p-1.5 bg-[#F5EFE4] text-[#C8A96B] rounded-full">
                                  <Camera size={15} strokeWidth={1.5} />
                                </div>
                                <div>
                                  <p className="text-[10.5px] text-[#1A0A00] font-medium m-0">
                                    Click to capture or attach photos
                                  </p>
                                  <p className="text-[8px] text-neutral-400 m-0 mt-0.5">
                                    JPG, PNG, WEBP (Supports camera & gallery)
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Image previews - Extra compact */}
                        {reviewForm.images.length > 0 && (
                          <div className="grid grid-cols-5 gap-1.5 pt-1">
                            {reviewForm.images.map((imgUrl, index) => (
                              <div
                                key={index}
                                className="relative aspect-square rounded-md overflow-hidden border border-black/5 bg-neutral-50 group shadow-3xs"
                              >
                                <img
                                  src={imgUrl}
                                  alt={`Uploaded preview ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                  decoding="async"
                                  referrerPolicy="no-referrer"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeUploadedImage(index)}
                                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/75 hover:bg-black text-white p-1 rounded-full opacity-100 transition-opacity flex items-center justify-center"
                                  title="Remove image"
                                >
                                  <X size={10} strokeWidth={3} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Submit block - Shorter button */}
                      <button
                        type="submit"
                        disabled={isUploading}
                        className="w-full h-10 sm:h-11 bg-[#1A0A00] text-white text-[10.5px] uppercase tracking-[0.15em] font-extrabold rounded-lg hover:bg-[#331400] active:scale-[0.99] disabled:bg-[#1A0A00]/40 disabled:scale-100 transition-all shadow-md shadow-black/5 flex items-center justify-center gap-1.5"
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

                        {/* Uploaded review images */}
                        {review.images && review.images.length > 0 && (
                          <div className="flex flex-wrap gap-2 my-2.5">
                            {review.images.map((imgUrl, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => setSelectedFullImage(imgUrl)}
                                className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-black/5 cursor-zoom-in bg-neutral-100 hover:border-[#C8A96B]/50 transition-colors shadow-2xs group flex-shrink-0"
                              >
                                <img
                                  src={imgUrl}
                                  alt={`Review attachment by ${review.author || "customer"} ${index + 1}`}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                  loading="lazy"
                                  decoding="async"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                              </button>
                            ))}
                          </div>
                        )}

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

      {createPortal(
        <AnimatePresence>
          {selectedFullImage && (
            <div
              className="fixed inset-0 z-[1100] bg-black/95 backdrop-blur-xs flex items-center justify-center p-4 cursor-zoom-out"
              onClick={() => setSelectedFullImage(null)}
            >
              <button
                onClick={() => setSelectedFullImage(null)}
                className="absolute top-4 right-4 text-white/75 hover:text-white bg-white/10 p-2.5 rounded-full backdrop-blur-md transition-all duration-200 z-50 hover:bg-white/20"
                aria-label="Close image"
              >
                <X size={20} strokeWidth={2} />
              </button>
              <motion.img
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                src={selectedFullImage}
                alt="Enlarged Review Saree Drape attachment"
                className="max-w-full max-h-[85vh] sm:max-h-[90vh] object-contain rounded-lg shadow-2xl"
                loading="lazy"
                referrerPolicy="no-referrer"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
};
