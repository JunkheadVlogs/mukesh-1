import { useRef, useState } from "react";
import { motion } from "motion/react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const REVIEWS = [
  {
    id: 1,
    name: "Meera Deshmukh",
    location: "Nagpur",
    verified: true,
    text: "Visited their Nagpur flagship showroom for my bridal shopping. The collection of luxury Kanjeevarams and handwoven Banarasi Sarees is unmatched. Excellent personalized assistance!",
  },
  {
    id: 2,
    name: "Anjali Joshi",
    location: "Nagpur",
    verified: true,
    text: "Mukesh Saree Centre has been our family's trusted destination since my grandmother's wedding in 1980. Their beautiful designer Co-Ord sets and Readymade suits are modern yet elegant.",
  },
  {
    id: 3,
    name: "Priya Sharma",
    location: "Mumbai",
    verified: true,
    text: "Absolutely beautiful fabric and premium craftsmanship. Ordered a Banarasi saree online to Mumbai and received it in 3 days with premium and beautiful packaging. Highly professional!",
  },
  {
    id: 4,
    name: "Roshni Patel",
    location: "Pune",
    verified: true,
    text: "I was looking for something unique for my sister's wedding and found the perfect designer lehenga here. The quality of the intricate embroidery and the fit was just flawless. Amazing experience!",
  },
  {
    id: 5,
    name: "Kavita Rao",
    location: "Hyderabad",
    verified: true,
    text: "Ordered two pure Georgette suits online. The colors are exactly as shown in the pictures, and the material is so soft and flowy. Quick delivery and beautiful presentation. Totally worth it.",
  }
];

export function CustomerReviews() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth > 768 ? 400 : 280;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollPosition = container.scrollLeft;
    const cardWidth = container.scrollWidth / REVIEWS.length;
    const index = Math.round(scrollPosition / cardWidth);
    if (index >= 0 && index < REVIEWS.length) {
      setActiveIndex(index);
    }
  };

  const scrollToReview = (index: number) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const children = container.children;
      if (children[index]) {
        children[index].scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
        setActiveIndex(index);
      }
    }
  };

  return (
    <section className="bg-[#FAF6F0]/40 pt-6 pb-4 md:pt-10 md:pb-6 border-t border-[#C8A96B]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4 md:mb-8">
          <div className="text-[11px] tracking-[0.25em] uppercase text-[var(--color-gold)] mb-1.5 font-semibold">
            What Our Customers Say
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light tracking-[0.06em] text-[var(--color-dark)] mb-2 md:mb-4">
            Loved By Our <span className="italic">Customers</span>
          </h2>
          <div className="flex justify-center items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={15} className="fill-[#C8A96B] text-[#C8A96B] stroke-[1.5]" />
            ))}
            <span className="text-[11px] tracking-[0.1em] text-[var(--color-dark)]/60 uppercase font-medium ml-2">
              4.9/5 Rating (1,200+ Reviews)
            </span>
          </div>
        </div>

        <div className="relative group">
          {/* Left Arrow (Hidden on mobile) */}
          <div className="hidden md:block absolute top-1/2 -translate-y-1/2 -left-4 lg:-left-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none md:pointer-events-auto">
            <button
              onClick={() => scroll("left")}
              className="pointer-events-auto bg-white/95 backdrop-blur-sm p-3 rounded-full shadow-md text-primary-950 hover:bg-[#C8A96B] hover:text-white transition-all transform hover:scale-105 active:scale-95"
              aria-label="Scroll Left"
            >
              <ChevronLeft size={20} />
            </button>
          </div>

          {/* Right Arrow (Hidden on mobile) */}
          <div className="hidden md:block absolute top-1/2 -translate-y-1/2 -right-4 lg:-right-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none md:pointer-events-auto">
            <button
              onClick={() => scroll("right")}
              className="pointer-events-auto bg-white/95 backdrop-blur-sm p-3 rounded-full shadow-md text-primary-950 hover:bg-[#C8A96B] hover:text-white transition-all transform hover:scale-105 active:scale-95"
              aria-label="Scroll Right"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Carousel */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            style={{ touchAction: "pan-x pan-y pinch-zoom" }}
            className="-mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 flex gap-4 md:gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scrollbar-hide no-scrollbar touch-pan-x touch-pan-y"
          >
            {REVIEWS.map((review, index) => (
              <motion.article
                key={review.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex-none w-[78vw] sm:w-[350px] md:w-[400px] snap-center bg-white p-4 sm:p-5 md:p-6 border border-[#C8A96B]/10 shadow-[0_2px_12px_rgba(200,169,107,0.03)] rounded-xl relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-0.5 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} className="fill-[#C8A96B] text-[#C8A96B] stroke-[1.5]" />
                    ))}
                  </div>
                  <p className="text-[13px] md:text-[14px] text-[var(--color-dark)]/85 font-light italic leading-relaxed mb-3.5">
                    "{review.text}"
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-[var(--color-gold)]/10 pt-4">
                  <div>
                    <h4 className="text-[11px] uppercase tracking-wider font-semibold text-[var(--color-dark)]">
                      {review.name}
                    </h4>
                    <p className="text-[10px] text-[var(--color-dark)]/50 tracking-wide font-medium mt-0.5">
                      {review.location} • {review.verified ? 'Verified Buyer' : 'Customer'}
                    </p>
                  </div>
                  {review.verified && (
                    <span className="text-[10px] uppercase tracking-widest text-[#C8A96B] font-bold">
                      Verified
                    </span>
                  )}
                </div>
              </motion.article>
            ))}
          </div>

          {/* Swipe Indicators */}
          <div className="flex flex-col items-center justify-center gap-2 mt-1 md:hidden">
            {/* Swipe Instruction Text */}
            <div className="flex items-center gap-1 text-[9px] tracking-[0.2em] uppercase text-[#C8A96B] font-semibold opacity-70 animate-pulse mt-0.5">
              <span>← swipe to view more →</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
