import { useState, useEffect } from 'react';
import { useStore } from '../store';
import { safeLocalStorage } from '../utils/safeStorage';
import { formatMobileInput, normalizeMobileNumber } from '../utils/phoneValidation';
import { recordExitPopupDismissal, detectInAppBrowser } from '../hooks/useExitIntent';

export interface ExitIntentPopupProps {
  onDismiss: () => void;
  onSubmit?: (name: string, phone: string) => Promise<void>;
}

export function ExitIntentPopup({ onDismiss, onSubmit }: ExitIntentPopupProps) {
  const applyCoupon = useStore((state) => state.applyCoupon);
  const [isVisible, setIsVisible] = useState(true);
  const [stage, setStage] = useState<'capture' | 'revealed'>('capture');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Do not show on thank you or order success pages
    if (window.location.pathname.includes('/thank-you') || window.location.pathname.includes('/success')) {
      setIsVisible(false);
      onDismiss();
      return;
    }

    if (safeLocalStorage.getItem('exitIntentSubmitted') === 'true') {
      setIsVisible(false);
      onDismiss();
      return;
    }

    const inApp = detectInAppBrowser();

    // Track impressions asynchronously
    if ((window as any).fbq) {
      (window as any).fbq('trackCustom', 'ExitIntentShown', {
        in_app_browser: inApp.name || 'None'
      });
    }
    if ((window as any).gtag) {
      (window as any).gtag('event', 'view_promotion', {
        promotions: [
          {
            promotion_id: 'VIPCLUB60',
            promotion_name: 'Exit Intent 60% Discount'
          }
        ]
      });
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
    try {
      const now = Date.now().toString();
      safeLocalStorage.setItem('exitIntentSubmittedTime', now);
      safeLocalStorage.setItem('exitIntentSubmitted', 'true');
      safeLocalStorage.setItem('hasPurchased', 'true');
    } catch {
      // Fail gracefully
    }
  };

  const handleClose = () => {
    recordExitPopupDismissal();
    setIsVisible(false);
    onDismiss();
  };

  // INSTANT REVEAL HANDLER (ZERO ARTIFICIAL DELAY, NO NETWORK BLOCKING)
  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // 1. INSTANTLY SWITCH STATE AND APPLY COUPON IN STORE
    setStage('revealed');
    applyCoupon('VIPCLUB60');
    setSuccessStorage();

    // 2. NON-BLOCKING BACKGROUND PROCESSING (AFTER REVEAL IS SHOWN)
    const trimmedName = name.trim();
    const normalizedPhone = normalizeMobileNumber(phone);

    setTimeout(() => {
      // Background onSubmit if provided
      if (onSubmit) {
        onSubmit(trimmedName || 'VIP Guest', normalizedPhone || '').catch(() => {});
      }

      // Background Google Sheets logging
      try {
        const sheetsUrl = import.meta.env.VITE_GOOGLE_SHEETS_URL || import.meta.env.VITE_SHEETS_WEBHOOK_URL;
        if (sheetsUrl && (trimmedName || normalizedPhone)) {
          const inApp = detectInAppBrowser();
          const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
          fetch(sheetsUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'exit_lead',
              name: trimmedName || 'VIP Guest',
              phone: normalizedPhone,
              page: window.location.pathname,
              device: isMobile ? (inApp.isInApp ? `Mobile (${inApp.name})` : 'Mobile') : 'Desktop',
              request: 'Exit Intent Discount Coupon VIPCLUB60',
              requestId: 'REQ-' + Math.floor(100000 + Math.random() * 900000),
              source: inApp.isInApp ? `Exit Intent Popup (${inApp.name})` : 'Exit Intent Popup'
            })
          }).catch(() => {});
        }
      } catch (err) {
        // Silent fail in background
      }

      // Background analytics
      try {
        if ((window as any).fbq) {
          (window as any).fbq('trackCustom', 'ExitIntentUnlocked', { coupon: 'VIPCLUB60' });
        }
        if ((window as any).gtag) {
          (window as any).gtag('event', 'select_promotion', {
            promotions: [
              {
                promotion_id: 'VIPCLUB60',
                promotion_name: 'Exit Intent 60% Discount'
              }
            ]
          });
        }
      } catch (err) {
        // Silent fail
      }
    }, 0);
  };

  // CLIPBOARD COPY HANDLER
  const handleCopyCode = () => {
    const codeToCopy = 'VIPCLUB60';
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(codeToCopy).then(() => {
        setCopied(true);
      }).catch(() => {
        fallbackCopy(codeToCopy);
      });
    } else {
      fallbackCopy(codeToCopy);
    }

    // Background analytics
    try {
      if ((window as any).fbq) {
        (window as any).fbq('trackCustom', 'ExitIntentCouponCopy', { coupon: 'VIPCLUB60' });
      }
      if ((window as any).gtag) {
        (window as any).gtag('event', 'select_promotion', {
          promotions: [
            {
              promotion_id: 'VIPCLUB60',
              promotion_name: 'Exit Intent 60% Discount'
            }
          ]
        });
      }
    } catch (err) {}

    setTimeout(() => setCopied(false), 2500);
  };

  const fallbackCopy = (text: string) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
    } catch (e) {
      setCopied(true);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      {/* Local keyframe definitions */}
      <style>{`
        @keyframes exitSlideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes couponPop {
          0% { transform: scale(0.92); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* Dimmed backdrop area for clicking to close */}
      <div className="absolute inset-0 bg-transparent" onClick={handleClose} />

      {/* MODAL CARD: Dark Luxury Boutique Aesthetic */}
      <div 
        className="relative w-full max-w-[440px] bg-[#0F0A00] border border-[#E8B84B] rounded-[16px] overflow-hidden shadow-2xl z-10"
        style={{ animation: 'exitSlideUp 0.35s cubic-bezier(0.25, 1, 0.5, 1.1) forwards' }}
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
          /* ================= STAGE 1: Lead Capture / Offer ================= */
          <div className="flex flex-col text-center w-full">
            {/* Top red banner */}
            <div className="bg-[#FF3B30] text-white font-sans font-extrabold text-[11px] sm:text-xs py-2 px-4 uppercase tracking-widest text-center shadow-inner select-none">
              ⚡ Exclusive 60% Off VIP Pass
            </div>

            <div className="p-6 sm:p-8 flex flex-col items-center">
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A1200] border border-[#E8B84B]/30 text-[#E8B84B] text-[11px] sm:text-xs font-serif font-medium tracking-wide mb-3 select-none">
                <span>✨</span>
                <span>46 Years of Trust · Est. 1978 · Nagpur</span>
              </div>

              {/* Headline: High Contrast Bright White with font styling */}
              <h2 
                className="text-2xl sm:text-[26px] font-serif font-semibold !text-white mb-2 leading-snug tracking-wide max-w-[360px]"
                style={{ color: '#FFFFFF' }}
              >
                Wait! Before You Go...
              </h2>

              {/* Sub-headline: High contrast light off-white */}
              <p 
                className="font-sans text-xs sm:text-[13px] mb-5 leading-relaxed max-w-[320px]"
                style={{ color: '#E0DCD5' }}
              >
                Enter your details to instantly reveal your exclusive 60% discount code:
              </p>

              <form onSubmit={handleUnlock} className="w-full flex flex-col text-left space-y-3">
                {/* Name Input */}
                <div>
                  <label className="sr-only">Full Name</label>
                  <input
                    type="text"
                    placeholder="Your Name (Optional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#1A1200] border border-[#E8B84B]/20 focus:border-[#E8B84B] focus:ring-1 focus:ring-[#E8B84B] outline-none transition-all placeholder:text-white/30 rounded-[10px] font-sans text-xs sm:text-sm text-white"
                  />
                </div>

                {/* WhatsApp Phone Input */}
                <div>
                  <label className="sr-only">WhatsApp Number</label>
                  <div className="flex border border-[#E8B84B]/20 focus-within:border-[#E8B84B] focus-within:ring-1 focus-within:ring-[#E8B84B] rounded-[10px] overflow-hidden bg-[#1A1200] transition-all">
                    <span className="bg-[#150E00] px-4 py-3 text-[#E8B84B] text-xs sm:text-sm border-r border-[#E8B84B]/10 flex items-center font-sans font-medium select-none">+91</span>
                    <input
                      type="tel"
                      placeholder="WhatsApp Number (Optional)"
                      value={phone}
                      onChange={(e) => setPhone(formatMobileInput(e.target.value))}
                      className="flex-grow bg-transparent px-4 py-3 text-white outline-none font-sans text-xs sm:text-sm placeholder:text-white/30"
                    />
                  </div>
                </div>

                {/* Instant Reveal CTA Button */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-[#E8B84B] hover:bg-[#F2C968] text-black font-extrabold text-sm sm:text-base tracking-wide uppercase rounded-[10px] py-3.5 px-6 transition-all shadow-lg active:scale-[0.99] cursor-pointer mt-1"
                >
                  UNLOCK MY 60% OFF →
                </button>
              </form>

              {/* Secondary dismiss */}
              <button
                type="button"
                onClick={handleClose}
                className="mt-3.5 text-xs sm:text-[13px] text-neutral-400 hover:text-[#E8B84B] transition-colors font-sans underline underline-offset-4 cursor-pointer bg-transparent border-0 py-1"
              >
                No thanks, continue browsing
              </button>

              {/* Trust strip */}
              <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap text-[10px] sm:text-[11px] text-[#E8B84B]/80 font-medium mt-5 pt-3.5 border-t border-[#E8B84B]/10 w-full select-none font-sans">
                <span>⭐ 4.8/5 Rating</span>
                <span className="text-neutral-500">•</span>
                <span>📦 Free Shipping ₹499+</span>
                <span className="text-neutral-500">•</span>
                <span>💵 Cash on Delivery</span>
              </div>
            </div>
          </div>
        ) : (
          /* ================= STAGE 2: Success State (Exact PART 3 UI) ================= */
          <div 
            className="flex flex-col items-center text-center w-full p-6 sm:p-8"
            style={{ animation: 'couponPop 0.3s ease-out forwards' }}
          >
            {/* Headline */}
            <h2 
              className="text-xl sm:text-2xl font-serif font-bold !text-white mb-4 leading-tight tracking-wide"
              style={{ color: '#FFFFFF' }}
            >
              🎉 YOUR 60% OFF IS UNLOCKED!
            </h2>

            {/* Label */}
            <p 
              className="font-sans text-xs sm:text-sm mb-2"
              style={{ color: '#E0DCD5' }}
            >
              Your Exclusive Coupon Code:
            </p>

            {/* THE COUPON CODE BOX */}
            <div 
              className="relative w-full my-2 p-4 sm:p-5 bg-[#1A1200] rounded-[12px] text-center border-2 border-dashed border-[#E8B84B]"
            >
              <div className="font-mono text-2xl sm:text-3xl font-black text-[#E8B84B] tracking-widest select-all">
                VIPCLUB60
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col gap-2.5 mt-4">
              {/* COPY CODE BUTTON */}
              <button
                type="button"
                onClick={handleCopyCode}
                className="w-full flex items-center justify-center gap-2 bg-[#1A1200] hover:bg-[#251b03] border border-[#E8B84B] text-[#E8B84B] hover:text-[#F2C968] font-bold text-sm sm:text-base tracking-wider uppercase rounded-[10px] py-3 px-6 transition-all shadow active:scale-[0.99] cursor-pointer"
              >
                {copied ? '✓ COPIED!' : 'COPY CODE'}
              </button>

              {/* SHOP NOW BUTTON */}
              <button
                type="button"
                onClick={handleClose}
                className="w-full flex items-center justify-center gap-2 bg-[#E8B84B] hover:bg-[#F2C968] text-black font-extrabold text-sm sm:text-base tracking-wider uppercase rounded-[10px] py-3.5 px-6 transition-all shadow-lg active:scale-[0.99] cursor-pointer"
              >
                SHOP NOW →
              </button>
            </div>

            {/* Small text below */}
            <p className="text-[11px] sm:text-xs text-neutral-400 mt-4 leading-relaxed font-sans max-w-[320px]">
              Apply VIPCLUB60 at checkout to get your discount.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
