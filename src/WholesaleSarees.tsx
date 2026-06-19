import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SEO } from "./components/SEO";

export default function WholesaleSarees() {
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  
  // High-fidelity Multi-Step Star Review flow state variables
  const [googleClicked, setGoogleClicked] = useState(false);
  const [submittedReview, setSubmittedReview] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [ratingError, setRatingError] = useState(false);
  
  const ratingSectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load unlocked state from localStorage on mount
  useEffect(() => {
    const savedUnlocked = localStorage.getItem("wholesale_vip_unlocked");
    if (savedUnlocked === "true") {
      setIsUnlocked(true);
      setRating(5);
      setGoogleClicked(true);
      setSubmittedReview(true);
    }
  }, []);

  // Smooth scroll handler
  const scrollToRatingSection = () => {
    if (ratingSectionRef.current) {
      ratingSectionRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Ultra high-performance particle-mesh celebration engine (Confetti)
  const triggerConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set pixel density correctly to avoid blurry particles
    const resizeCanvas = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resizeCanvas();

    interface Particle {
      x: number;
      y: number;
      size: number;
      color: string;
      speedX: number;
      speedY: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
    }

    const particles: Particle[] = [];
    const colors = ["#D4AF37", "#C5A059", "#8C1D2F", "#5C0612", "#FAF6F0", "#FFEAA7"];

    // Spawn rich particles
    for (let i = 0; i < 180; i++) {
      const fromLeft = Math.random() < 0.5;
      particles.push({
        x: fromLeft ? window.innerWidth * 0.15 : window.innerWidth * 0.85,
        y: window.innerHeight * 0.85,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (fromLeft ? 1 : -1) * (Math.random() * 11 + 6),
        speedY: -(Math.random() * 18 + 12),
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        opacity: 1
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let activeCount = 0;
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.speedY += 0.42; // Soft gravity
        p.speedX *= 0.985; // Medium resistance
        p.rotation += p.rotationSpeed;
        
        if (p.speedY > 0) {
          p.opacity -= 0.012; // Slow elegant fade out
        }

        if (p.opacity > 0 && p.y < window.innerHeight && p.x > 0 && p.x < window.innerWidth) {
          activeCount++;
          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (activeCount > 0) {
        animationId = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    animate();
  };

  const handleStarSelection = (selectedStars: number) => {
    setRating(selectedStars);
    
    if (selectedStars === 5) {
      setRatingError(false);
      // Let's fire the confetti celebration!
      setTimeout(() => {
        triggerConfetti();
      }, 50);
    } else {
      setRatingError(true);
      // Clear downstream states to match strict requirement logic
      setGoogleClicked(false);
      setSubmittedReview(false);
      setIsUnlocked(false);
      localStorage.removeItem("wholesale_vip_unlocked");
    }
  };

  const handleGoogleClick = () => {
    setGoogleClicked(true);
    // Open Google Review Link in a pristine, safe, new browser tab
    window.open("https://g.page/r/CScAZL7hsuWjEBM/review", "_blank", "noopener,noreferrer");
  };

  const handleSubmittedReviewClick = () => {
    setSubmittedReview(true);
    setIsUnlocked(true);
    // Persist unlocked access in local storage for subsequent repeat boutique visits
    localStorage.setItem("wholesale_vip_unlocked", "true");
    setTimeout(() => {
      triggerConfetti();
    }, 50);
  };

  // Reset helper for testing/debugging or changing rating safely
  const handleReset = () => {
    setRating(null);
    setHoverRating(null);
    setGoogleClicked(false);
    setSubmittedReview(false);
    setIsUnlocked(false);
    setRatingError(false);
    localStorage.removeItem("wholesale_vip_unlocked");
  };

  return (
    <div className="relative min-h-screen bg-[#FAF6F0] text-[#1A0A00] font-sans overflow-x-hidden pb-16">
      <SEO 
        title="Mukesh Saree Centre Wholesale VIP Club" 
        description="Join Mukesh Saree Centre Wholesale VIP Club for daily new arrivals, wholesale saree prices, stock updates and exclusive dealer offers." 
        url="/wholesale-sarees"
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Wholesale Sarees VIP Club",
            "description": "Join Mukesh Saree Centre Wholesale VIP Club for daily new arrivals, wholesale saree prices, stock updates and exclusive dealer offers.",
            "url": "https://mukeshsarees.com/wholesale-sarees"
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://mukeshsarees.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Wholesale VIP Club",
                "item": "https://mukeshsarees.com/wholesale-sarees"
              }
            ]
          }
        ]}
      />
      {/* High-accuracy overlay container canvas for confetti physics particle system */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 w-full h-full pointer-events-none z-[100]"
      />

      {/* Aesthetic Maroon Top Branding Accent Bar */}
      <div className="w-full bg-[#5C0612] h-[5px] sticky top-0 z-50 shadow-sm" />

      {/* Elegant Header Area with Brand Assets */}
      <header className="py-4 px-4 flex flex-col items-center bg-[#FAF6F0] border-b border-[#5C0612]/5">
        <div className="flex flex-col items-center">
          <img 
            src="https://ik.imagekit.io/tus1loev9/homepage/IMG_20260530_201904.png" 
            alt="Mukesh Saree Centre Premium Logo" 
            className="h-14 sm:h-16 w-auto max-w-full object-contain drop-shadow-sm select-none" 
          />
          <div className="w-16 h-[1px] bg-[#D4AF37] mt-2.5 opacity-80"></div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative px-4 pt-12 pb-14 text-center overflow-hidden bg-gradient-to-b from-white to-[#FAF6F0]">
        <div className="max-w-2xl mx-auto">
          {/* Authentic Minimal VIP club tag */}
          <span className="inline-block px-4 py-1.5 bg-[#5C0612]/5 text-[#5C0612] text-[10px] tracking-[4px] uppercase font-bold rounded-full mb-5 border border-[#5C0612]/10">
            Wholesale Dealer Portal
          </span>
          
          <h1 id="landing-main-heading" className="text-3xl md:text-5xl font-serif font-light tracking-[0.03em] leading-tight text-[#1A0A00] mb-4">
            Mukesh Saree Centre <span className="block mt-1 font-serif italic text-[#5C0612] font-semibold">Wholesale VIP Club</span>
          </h1>

          <p className="text-xs uppercase tracking-[3px] font-bold text-[#C5A059] mb-5">
            Exclusive Community For Saree Shop Owners
          </p>

          <p className="text-xs md:text-sm text-[#1A0A00]/70 leading-relaxed font-light mb-8 max-w-xl mx-auto">
            Get Daily New Arrivals, Wholesale Prices, Fast-Selling Collections and Special Dealer Offers Directly On WhatsApp. Keep your store ahead with daily fresh stocks and unmatched margins from Nagpur's premium saree pioneer.
          </p>

          <div className="flex justify-center">
            <button 
              id="hero-unlock-vip-btn"
              onClick={scrollToRatingSection}
              className="px-8 py-3.5 bg-[#5C0612] text-white hover:bg-[#4A020D] tracking-[2px] text-xs uppercase font-semibold rounded-md shadow-lg shadow-[#5C0612]/15 hover:shadow-[#5C0612]/25 transition-all outline-none focus:ring-2 focus:ring-[#5C0612]/20 active:scale-[0.98] duration-200"
            >
              Unlock VIP Access
            </button>
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="px-4 py-16 bg-white max-w-5xl mx-auto rounded-3xl shadow-sm border border-neutral-100">
        <div className="text-center mb-12">
          <div className="text-[10px] tracking-[5px] font-bold text-[#5C0612]/45 uppercase mb-2">Exclusives</div>
          <h2 className="text-2xl md:text-3xl font-serif font-light tracking-[0.05em] text-[#1A0A00]">
            Dealer Community <span className="italic">Privileges</span>
          </h2>
          <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto mt-3"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: "Daily New Arrival Photos", desc: "Instantly share premium high-def design catalog uploads with your personal retail clients." },
            { title: "Wholesale Price Updates", desc: "Enjoy Nagpur's true manufacture-scale pricing updates published directly." },
            { title: "Fast Selling Collections", desc: "Curated collection designs proven to clear out of your display hangers immediately." },
            { title: "Trending Saree Designs", desc: "Direct stock updates on dynamic trends, digital foil prints, Bollywood space silks." },
            { title: "Festival Collections", desc: "Secure highest-demand inventories ahead of Diwali, Karwa Chauth, Eid, Weddings." },
            { title: "Premium Sarees", desc: "Traditional Banarasis, lightweight linens, delicate kora organza weave sets." },
            { title: "Fancy Sarees", desc: "Modern georgettes with jacquard borders, sequin works, and elegant drapes." },
            { title: "Co-Ord Sets", desc: "Contemporary silhouettes in breathable linens and high-fashion comfort wear." },
            { title: "Suits & Dress Materials", desc: "High-margin options of unstitched salwar kameez sets, matching pieces." },
            { title: "Limited Stock Alerts", desc: "Never miss out on fast-moving restocks with priority real-time stock indicators." },
            { title: "Early Access To New Collections", desc: "Place preorder requests 48 hours before collections open to secondary wholesalers." },
            { title: "Special Dealer Offers", desc: "Exclusive bulk billing discounts, reduced shipping rates, and special COD plans." },
          ].map((benefit, i) => (
            <div 
              key={i} 
              id={`wholesale-benefit-card-${i}`}
              className="p-5 bg-[#FAF6F0]/40 rounded-xl border border-[#C5A059]/10 hover:border-[#D4AF37]/35 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-2.5 mb-2.5">
                  <span className="text-[#5C0612] font-semibold text-lg leading-none mt-0.5 select-none font-sans">✓</span>
                  <h3 className="text-xs md:text-sm font-semibold text-[#1A0A00] leading-tight">
                    {benefit.title}
                  </h3>
                </div>
                <p className="text-[11px] md:text-xs text-[#1A0A00]/65 leading-relaxed font-light pl-5">
                  {benefit.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INTERACTIVE RATING SECTION */}
      <section 
        ref={ratingSectionRef} 
        id="rating-and-verification-hub"
        className="px-4 py-16 max-w-xl mx-auto text-center scroll-mt-6"
      >
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-[#5C0612]/5 border border-[#C5A059]/15">
          <div className="text-[10px] tracking-[4px] font-bold text-[#5C0612]/40 uppercase mb-2">Access Portal</div>
          <h2 className="text-xl md:text-2xl font-serif font-light tracking-[0.05em] text-[#1A0A00]">
            Give Us a <span className="font-serif italic text-[#5C0612] font-semibold">5-Star Review</span> to Join Our VIP Group
          </h2>
          <p className="text-xs text-[#1A0A00]/60 mt-3 mb-6 max-w-sm mx-auto leading-relaxed">
            Please give us a 5-star experience rating below, then leave a Google review to immediately unlock the exclusive Wholesale VIP WhatsApp Group.
          </p>

          {/* Interactive Golden Stars row */}
          <div className="flex justify-center items-center gap-3.5 mb-6">
            {[1, 2, 3, 4, 5].map((starValue) => {
              const isActive = (hoverRating !== null ? hoverRating : rating || 0) >= starValue;
              return (
                <button
                  key={starValue}
                  id={`rating-star-btn-${starValue}`}
                  onMouseEnter={() => setHoverRating(starValue)}
                  onMouseLeave={() => setHoverRating(null)}
                  onClick={() => handleStarSelection(starValue)}
                  className="p-1 focus:outline-none focus:scale-110 active:scale-95 transition-all duration-150 transform"
                  aria-label={`Select ${starValue} Stars`}
                >
                  <svg
                    className={`w-10 h-10 transition-colors duration-300 ${isActive ? "text-[#D4AF37] fill-[#D4AF37]" : "text-neutral-200 fill-none"}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.25"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499c.195-.395.74-.395.935 0l2.793 5.656 6.241.908c.436.064.609.591.294.908l-4.516 4.402 1.066 6.216c.075.438-.387.773-.778.567L12 19.349l-5.594 2.94a.78 0 01-1.171-.85l1.066-6.216-4.516-4.402c-.315-.317-.142-.844.294-.908l6.241-.908 2.793-5.656z"
                    />
                  </svg>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {/* 1-4 Stars Error Message Area */}
            {rating !== null && rating < 5 && ratingError && (
              <motion.div
                key="rating-error-msg"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="p-4 bg-red-50 rounded-xl text-red-800 text-xs text-center border border-red-150 flex flex-col items-center gap-1"
              >
                <div className="font-bold text-sm text-[#8C1D2F]">Verification Flag</div>
                <p className="leading-relaxed">Wholesale VIP Group Access Is Available Only After Selecting 5 Stars.</p>
              </motion.div>
            )}

            {/* 5 Stars Dynamic Access Unlock Steps */}
            {rating === 5 && (
              <motion.div
                key="success-portal-steps"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-2 space-y-5"
              >
                {/* success affirmation */}
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-xs leading-relaxed border border-emerald-150 font-medium">
                  🎉 Thank You For Supporting Mukesh Saree Centre!
                </div>

                <div className="flex flex-col gap-4">
                  {/* Step 1: Leave Google Review Button */}
                  <div className="text-left bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                    <span className="inline-block px-2.5 py-0.5 bg-[#D4AF37]/10 text-[#C5A059] text-[9px] tracking-wider font-bold rounded-md uppercase mb-2">
                      Step 1
                    </span>
                    <h4 className="text-xs font-semibold text-[#1A0A00] mb-1">Invaluable Support Needed</h4>
                    <p className="text-[11px] text-[#1A0A00]/60 mb-3 leading-normal font-light">
                      Please leave a positive Google review to help Nagpur's local weavers.
                    </p>
                    <button
                      id="leave-google-review-btn"
                      onClick={handleGoogleClick}
                      className="w-full py-3.5 px-5 bg-[#5C0612] hover:bg-[#4A020D] text-white tracking-[2.5px] text-xs uppercase font-bold rounded-lg shadow-md transition-all active:scale-[0.99] duration-150"
                    >
                      Leave Google Review ⭐⭐⭐⭐⭐
                    </button>
                  </div>

                  {/* Step 2: Have You Submitted Your Review? Confirmed step flow */}
                  {googleClicked && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-left bg-gradient-to-br from-[#FAF6F0] to-white rounded-xl p-4 border border-[#C5A059]/20"
                    >
                      <span className="inline-block px-2.5 py-0.5 bg-[#5C0612]/10 text-[#5C0612] text-[9px] tracking-wider font-bold rounded-md uppercase mb-2">
                        Step 2
                      </span>
                      <h4 className="text-xs font-bold text-[#1A0A00] mb-1">Have You Submitted Your Review?</h4>
                      <p className="text-[11px] text-[#1A0A00]/70 mb-3.5 leading-normal font-light">
                        After submitting your Google review, click the button below to access the Wholesale VIP Group.
                      </p>
                      
                      {!submittedReview ? (
                        <button
                          id="confirm-submitted-review-btn"
                          onClick={handleSubmittedReviewClick}
                          className="w-full py-3 px-5 bg-gradient-to-r from-[#D4AF37] to-[#C5A059] text-white tracking-[1.5px] text-xs uppercase font-bold rounded-lg shadow-md hover:opacity-95 transition-all text-center"
                        >
                          I Have Submitted My Review
                        </button>
                      ) : (
                        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-medium rounded-lg text-center border border-emerald-150">
                          ✓ Review submission confirmed by user!
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Step 3: Revel VIP Wholesale WhatsApp Join Group Button */}
                  {submittedReview && isUnlocked && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center bg-[#25D366]/5 rounded-xl p-4 border border-[#25D366]/20"
                    >
                      <div className="mb-2.5 text-[10px] text-emerald-800 font-bold uppercase tracking-[2px] block">
                        Final VIP Link Unlocked!
                      </div>
                      
                      <a
                        id="join-vip-whatsapp-group-btn"
                        href="https://chat.whatsapp.com/E6fFzDNThPB7oLHpUU7ZGi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full py-4 px-6 bg-[#25D366] text-white tracking-[2px] text-xs uppercase font-bold rounded-lg shadow-lg shadow-[#25D366]/20 hover:bg-[#20ba56] text-center transition-all animate-pulse"
                      >
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.1 1.452 4.强 1.453 5.4 0 9.79-4.4 9.793-9.8.002-2.614-1.01-5.071-2.854-6.918C15.736 2.08 13.292.052 10.15 1.05c-5.4 0-9.79 4.4-9.793 9.8-.001 2.01.528 3.971 1.532 5.714L.911 20.3l3.86-.9c1.54.912 3.12 1.34 4.1.34z" />
                        </svg>
                        Join Wholesale VIP WhatsApp Group
                      </a>
                      
                      <div className="text-[10px] text-emerald-800/80 leading-normal italic text-center mt-2.5 max-w-xs mx-auto">
                        "By clicking this button, you confirm that you have submitted your Google review."
                      </div>
                    </motion.div>
                  )}

                  {/* Dev / User Reset trigger */}
                  {submittedReview && (
                    <button
                      onClick={handleReset}
                      className="text-[10px] text-[#1A0A00]/40 uppercase tracking-widest hover:text-[#5C0612] transition-colors mt-2"
                    >
                      [ Reset rating / Test again ]
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* WHY JOIN / TRUST DETAILS SECTION */}
      <section className="px-4 py-14 bg-white max-w-2xl mx-auto rounded-3xl shadow-sm border border-neutral-100 mb-12">
        <h2 className="text-xl md:text-2xl font-serif font-light tracking-[0.05em] text-[#1A0A00] text-center mb-5">
          Why Shop Owners Join <span className="block mt-1 font-serif italic text-[#5C0612] font-semibold">Our VIP Group</span>
        </h2>
        <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto mb-8"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 pl-4">
          {[
            "Daily Product Launches",
            "Wholesale Pricing",
            "Trending Collections",
            "Stock Availability Updates",
            "Priority Access To New Collections",
            "Special Dealer Offers",
            "Business Growth Support"
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#C5A059] flex-shrink-0"></span>
              <span className="text-xs tracking-wide text-[#1A0A00]/85 font-medium leading-relaxed">
                {item}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="px-4 py-16 text-center max-w-4xl mx-auto">
        <div className="text-[10px] tracking-[4px] font-bold text-[#5C0612]/45 uppercase mb-2">Nagpur's Pride</div>
        <h2 className="text-2xl md:text-3xl font-serif font-light tracking-[0.05em] text-[#1A0A00] mb-4">
          Trusted By Saree Shop Owners
        </h2>
        <div className="w-12 h-[1.5px] bg-[#D4AF37] mx-auto mt-2 mb-8"></div>
        
        <p className="text-xs md:text-sm font-light text-[#1A0A00]/70 max-w-2xl mx-auto leading-relaxed mb-10">
          Serving premium showrooms, luxury boutiques, and active high-fashion retailers globally with zero broker margins, fully assured courier logistics, and curated stock updates.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-7 rounded-2xl shadow-sm border border-neutral-100">
            <h3 className="text-xs uppercase tracking-wider font-bold text-[#C5A059] mb-3">100% Reliability</h3>
            <p className="text-[11px] text-[#1A0A00]/65 leading-relaxed font-light">
              Thousands of merchant owners rely on our constant supply chains to scale retail sales seamlessly.
            </p>
          </div>
          <div className="bg-white p-7 rounded-2xl shadow-sm border border-neutral-100">
            <h3 className="text-xs uppercase tracking-wider font-bold text-[#C5A059] mb-3">Quality Uncompromised</h3>
            <p className="text-[11px] text-[#1A0A00]/65 leading-relaxed font-light">
              We check every linen thread, digital print, and handloom border to guard the boutique's branding credentials.
            </p>
          </div>
          <div className="bg-white p-7 rounded-2xl shadow-sm border border-neutral-100">
            <h3 className="text-xs uppercase tracking-wider font-bold text-[#C5A059] mb-3">Regular Stock Deliveries</h3>
            <p className="text-[11px] text-[#1A0A00]/65 leading-relaxed font-light">
              We compile and push catalogs daily. Never suffer from stale inventory seasons again.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="px-4 py-12 text-center max-w-xl mx-auto">
        <div className="bg-gradient-to-br from-[#5C0612] to-[#4A020D] text-white p-8 md:p-10 rounded-3xl shadow-xl shadow-[#5C0612]/20">
          <h2 className="text-xl md:text-2xl font-serif font-light tracking-[0.05em] leading-normal mb-3 text-white">
            Ready To Accelerate <span className="block font-serif italic text-[#D4AF37] font-semibold">Your Store Sales?</span>
          </h2>
          <p className="text-[11px] text-white/75 leading-relaxed font-light max-w-sm mx-auto mb-7">
            Secure prime margins with Nagpur's premium direct wholesale network community access today.
          </p>
          <button 
            id="final-unlock-wholesale-vip-access-btn"
            onClick={scrollToRatingSection}
            className="w-full sm:w-auto px-10 py-4 bg-[#FAF6F0] text-[#5C0612] hover:bg-white tracking-[2px] text-xs uppercase font-bold rounded-lg shadow-lg hover:shadow-xl transition-all transform active:scale-95 duration-200"
          >
            Unlock Wholesale VIP Access
          </button>
        </div>
      </section>

      {/* Footer Area */}
      <footer className="mt-14 border-t border-[#5C0612]/10 pt-10 text-center px-4 max-w-4xl mx-auto">
        <h3 className="font-serif text-lg tracking-[0.05em] text-[#1A0A00] mb-2 font-light">
          Mukesh Saree Centre
        </h3>
        <p className="text-[10px] md:text-xs text-neutral-500 max-w-lg mx-auto leading-relaxed mb-4 uppercase tracking-[1.5px] font-medium">
          Wholesale Sarees | Daily New Arrivals | Wholesale Pricing | Dealer Offers
        </p>
        <p className="text-xs text-[#C5A059] font-medium italic mt-2.5">
          Thank You For Being A Valued Business Partner.
        </p>
      </footer>
    </div>
  );
}
