import { useState, useEffect } from 'react';
import { useStore } from '../store';
import { safeLocalStorage, safeSessionStorage } from '../utils/safeStorage';

export interface ExitIntentPopupProps {
  onDismiss: () => void;
  onSubmit: (name: string, phone: string) => Promise<void>;
}

// Pure CSS Confetti Component
const ConfettiDot = ({ delay, color, x, y }: { delay: number; color: string; x: number; y: number }) => {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: (Math.random() * 6 + 4) + 'px',
        height: (Math.random() * 6 + 4) + 'px',
        backgroundColor: color,
        left: '50%',
        top: '40%',
        opacity: 0,
        animation: `confetti-burst 1.8s ease-out ${delay}s forwards`,
        '--target-x': `${x}px`,
        '--target-y': `${y}px`,
      } as React.CSSProperties}
    />
  );
};

const Confetti = () => {
  const colors = ['#E8B84B', '#FF3B30', '#4CD964', '#5AC8FA', '#5856D6', '#FF9500'];
  const dots = Array.from({ length: 45 }).map((_, i) => {
    const angle = Math.random() * 2 * Math.PI;
    const distance = 30 + Math.random() * 140;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance + (40 + Math.random() * 90); // gravity drift down
    const delay = Math.random() * 0.25;
    const color = colors[Math.floor(Math.random() * colors.length)];
    return <ConfettiDot key={i} delay={delay} color={color} x={x} y={y} />;
  });
  return <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[16px]">{dots}</div>;
};

export function ExitIntentPopup({ onDismiss, onSubmit }: ExitIntentPopupProps) {
  const applyCoupon = useStore((state) => state.applyCoupon);
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(() => {
    return safeSessionStorage.getItem('exitPopupShown') === 'true' || safeSessionStorage.getItem('exit_intent_shown') === '1';
  });

  const [stage, setStage] = useState<'capture' | 'revealed'>('capture');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const checkShouldShow = () => {
    if (hasShown) return false;
    if (safeSessionStorage.getItem('exitPopupShown') === 'true' || safeSessionStorage.getItem('exit_intent_shown') === '1') return false;
    
    const hasPurchased = safeLocalStorage.getItem('hasPurchased');
    if (hasPurchased === 'true') return false;

    // Do not show on thank you pages
    if (window.location.pathname.includes('/thank-you') || window.location.pathname.includes('/success')) {
      return false;
    }
    
    const isDevOrPreview = window.location.hostname.includes('localhost') || 
                          window.location.hostname.includes('127.0.0.1') || 
                          window.location.hostname.includes('.run.app') ||
                          window.location.search.includes('test_exit=true');

    if (isDevOrPreview) {
      return true;
    }

    const submitted = safeLocalStorage.getItem('exitIntentSubmittedTime');
    const now = Date.now();
    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
    
    if (submitted && (now - parseInt(submitted)) < SEVEN_DAYS) return false;
    
    return true;
  };

  useEffect(() => {
    if (checkShouldShow()) {
      setIsVisible(true);
      setHasShown(true);
      safeSessionStorage.setItem('exitPopupShown', 'true');
      safeSessionStorage.setItem('exit_intent_shown', '1');
      
      // Track impressions
      if ((window as any).fbq) {
        (window as any).fbq('trackCustom', 'ExitIntentShown');
      }
      if ((window as any).gtag) {
        (window as any).gtag('event', 'view_promotion', {
          promotions: [
            {
              promotion_id: 'VIP50',
              promotion_name: 'Exit Intent Discount'
            }
          ]
        });
      }
    } else {
      // If we shouldn't show, let the parent know immediately so it can unrender us.
      onDismiss();
    }
  }, [onDismiss]);

  // Lock body scroll when popup is open
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '15px'; 
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0';
    };
  }, [isVisible]);

  const setSuccessStorage = () => {
    safeLocalStorage.setItem('exitIntentSubmittedTime', Date.now().toString());
    safeLocalStorage.setItem('exitIntentSubmitted', 'true');
  };

  const handleClose = () => {
    setIsVisible(false);
    onDismiss();
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    // 1. Validate name (min 2 characters)
    if (trimmedName.length < 2) {
      setError('Please enter a valid name and 10-digit WhatsApp number');
      return;
    }

    // 2. Validate WhatsApp Number starts with 6,7,8,9 and has 10 digits
    const phonePattern = /^[6-9]\d{9}$/;
    if (!phonePattern.test(trimmedPhone)) {
      setError('Please enter a valid name and 10-digit WhatsApp number');
      return;
    }

    setLoading(true);

    try {
      const sheetsUrl = import.meta.env.VITE_GOOGLE_SHEETS_URL || import.meta.env.VITE_SHEETS_WEBHOOK_URL;
      if (sheetsUrl) {
        const isMobile = window.innerWidth <= 768;
        try {
          await fetch(sheetsUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              type: 'exit_lead',
              name: trimmedName,
              phone: trimmedPhone,
              page: window.location.pathname,
              device: isMobile ? 'Mobile' : 'Desktop'
            })
          });
        } catch (fetchErr) {
          console.warn('Silent exit intent sheet capture error:', fetchErr);
        }
      }

      await onSubmit(trimmedName, trimmedPhone);
      applyCoupon('VIP50');
      setSuccessStorage();
      setStage('revealed');
    } catch (err: any) {
      console.error("Popup submission error:", err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText('VIP50').then(() => {
        setCopied(true);
      }).catch(() => {
        // Fallback
        const textArea = document.createElement("textarea");
        textArea.value = 'VIP50';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
      });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = 'VIP50';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
    }

    if ((window as any).fbq) {
      (window as any).fbq('trackCustom', 'ExitIntentCouponCopy');
    }
    if ((window as any).gtag) {
      (window as any).gtag('event', 'select_promotion', {
        promotions: [
          {
            promotion_id: 'VIP50',
            promotion_name: 'Exit Intent Discount'
          }
        ]
      });
    }
    
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      {/* Local custom keyframe definitions */}
      <style>{`
        @keyframes exitFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes exitSlideUp {
          from { transform: translateY(60px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes coupon-bounce-in {
          0% { transform: scale(0.5); opacity: 0; }
          75% { transform: scale(1.07); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes confetti-burst {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(var(--target-x), var(--target-y)) scale(0.3);
            opacity: 0;
          }
        }
        .stage-transition-enter {
          animation: exitFadeIn 0.35s ease-out forwards;
        }
      `}</style>

      {/* Dimmed backdrop area for clicking to close */}
      <div className="absolute inset-0 bg-transparent" onClick={handleClose} />

      {/* MODAL: Dark Luxury Theme */}
      <div 
        className="relative w-full max-w-[440px] bg-[#0F0A00] border border-[#E8B84B] rounded-[16px] overflow-hidden shadow-2xl z-10"
        style={{ animation: 'exitSlideUp 0.4s cubic-bezier(0.25, 1, 0.5, 1.1) forwards' }}
      >
        {/* Close Button top right */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-[#E8B84B]/60 hover:text-[#E8B84B] transition-colors font-sans text-2xl z-20 cursor-pointer w-8 h-8 flex items-center justify-center rounded-full bg-black/30 border border-white/5"
          aria-label="Close popup"
        >
          &times;
        </button>

        {stage === 'capture' ? (
          /* ================= STAGE 1: Lead Capture ================= */
          <div className="flex flex-col text-center w-full">
            {/* Red urgency banner at top */}
            <div className="bg-[#FF3B30] text-white font-sans font-extrabold text-[11px] sm:text-xs py-2 px-4 uppercase tracking-widest text-center shadow-inner select-none">
              ⚡ You're about to miss 50% OFF!
            </div>

            <div className="p-6 sm:p-8 flex flex-col items-center">
              {/* Headline */}
              <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-white mb-2.5 tracking-wide">
                Wait! Before You Go...
              </h2>

              {/* Sub-headline */}
              <p className="text-neutral-350 font-sans text-xs sm:text-[13px] mb-5 leading-relaxed max-w-[320px]">
                Enter your details below to unlock an exclusive 50% discount
              </p>

              <form onSubmit={handleUnlock} className="w-full flex flex-col text-left space-y-3.5">
                {/* Name Input */}
                <div>
                  <label className="sr-only">Full Name</label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#1A1200] border border-[#E8B84B]/20 focus:border-[#E8B84B] focus:ring-1 focus:ring-[#E8B84B] outline-none transition-all placeholder:text-white/30 rounded-[10px] font-sans text-xs sm:text-sm text-white"
                    required
                  />
                </div>

                {/* WhatsApp Phone Input */}
                <div>
                  <label className="sr-only">WhatsApp Number</label>
                  <div className="flex border border-[#E8B84B]/20 focus-within:border-[#E8B84B] focus-within:ring-1 focus-within:ring-[#E8B84B] rounded-[10px] overflow-hidden bg-[#1A1200] transition-all">
                    <span className="bg-[#150E00] px-4 py-3 text-[#E8B84B] text-xs sm:text-sm border-r border-[#E8B84B]/10 flex items-center font-sans font-medium select-none">+91</span>
                    <input
                      type="tel"
                      placeholder="WhatsApp Number (10 digits)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      maxLength={10}
                      className="flex-grow bg-transparent px-4 py-3 text-white outline-none font-sans text-xs sm:text-sm placeholder:text-white/30"
                      required
                    />
                  </div>
                </div>

                {/* Error Banner */}
                {error && (
                  <p className="text-[#FF3B30] text-center text-xs font-semibold mt-1 font-sans">
                    {error}
                  </p>
                )}

                {/* Primary CTA */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#E8B84B] hover:bg-[#F2C968] disabled:opacity-75 disabled:cursor-not-allowed text-black font-extrabold text-sm sm:text-base tracking-wide uppercase rounded-[10px] py-3.5 transition-all shadow-lg active:scale-[0.99] cursor-pointer mt-1"
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    '🎁 Unlock My 50% Off Code'
                  )}
                </button>
              </form>

              {/* Spam note */}
              <p className="text-[10px] text-neutral-400 mt-3 font-sans">
                ✅ Free to unlock. No spam, ever.
              </p>

              {/* Trust strip */}
              <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap text-[10px] sm:text-[11px] text-[#E8B84B]/80 font-medium mt-6 pt-4 border-t border-[#E8B84B]/10 w-full select-none font-sans">
                <span>⭐ 4.8/5 Rating</span>
                <span className="text-neutral-500">•</span>
                <span>📦 Free Shipping ₹999+</span>
                <span className="text-neutral-500">•</span>
                <span>💵 Cash on Delivery</span>
              </div>
            </div>
          </div>
        ) : (
          /* ================= STAGE 2: Coupon Reveal ================= */
          <div className="flex flex-col items-center text-center w-full p-6 sm:p-8 stage-transition-enter relative">
            {/* Confetti Explosion Component */}
            <Confetti />

            {/* Success emoji */}
            <div className="text-5xl mt-3 animate-bounce select-none">🎊</div>

            {/* Headline */}
            <h2 className="text-xl sm:text-2xl font-serif font-semibold text-[#E8B84B] mt-4 mb-1.5 leading-tight tracking-wide">
              Your Exclusive Code is Unlocked!
            </h2>

            {/* Sub-text */}
            <p className="text-neutral-350 font-sans text-xs sm:text-[13px] mb-4 leading-relaxed">
              Use this code at checkout to get 50% OFF on original MRP:
            </p>

            {/* THE COUPON BOX */}
            <div 
              className="relative w-full mt-1 mb-4 p-4 sm:p-5 bg-[#1A1200] rounded-[10px] text-center overflow-hidden"
              style={{ 
                border: '2px dashed #E8B84B',
                animation: 'coupon-bounce-in 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
              }}
            >
              {/* Semi-circle ticket notches */}
              <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#0F0A00] rounded-full border-r border-[#E8B84B]/30" />
              <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#0F0A00] rounded-full border-l border-[#E8B84B]/30" />
              
              <div className="flex justify-between items-center px-2.5">
                <span className="font-mono text-lg sm:text-xl font-black text-[#E8B84B] tracking-wider select-all">
                  🎁 VIP50
                </span>
                <span className="bg-[#FF3B30] text-white font-extrabold text-[9px] sm:text-xs px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                  50% OFF
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#E8B84B]/60 tracking-widest font-serif font-medium uppercase mt-2">
                Valid on ALL Products
              </p>
            </div>

            {/* Copy Code button side-by-side or styled elegantly */}
            <button
              onClick={handleCopyCode}
              className="w-full max-w-[220px] bg-neutral-900 hover:bg-neutral-850 border border-[#E8B84B]/30 text-[#E8B84B] hover:text-white font-semibold py-2 px-4 rounded-lg text-xs sm:text-sm tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 mb-4 shadow"
            >
              {copied ? '✓ Copied!' : '📋 Copy Coupon'}
            </button>

            {/* Expiry text */}
            <p className="text-xs text-[#FF3B30] font-bold mb-4 font-sans uppercase tracking-[0.1em]">
              ⏰ Valid for 24 hours only
            </p>

            {/* CTA Button */}
            <button
              onClick={handleClose}
              className="w-full bg-[#E8B84B] hover:bg-[#F2C968] text-black font-extrabold py-3.5 px-6 rounded-[10px] text-sm sm:text-base tracking-wide uppercase transition-all active:scale-[0.98] cursor-pointer shadow-lg"
            >
              Shop Now & Save 50% →
            </button>

            {/* WhatsApp confirmation note */}
            <p className="text-[10px] sm:text-xs text-neutral-400 mt-4 leading-relaxed font-sans max-w-[300px]">
              📱 We've also sent this code to your WhatsApp for safekeeping
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
