import { useState, useEffect } from 'react';
import { submitToGoogleSheets } from '../config';
import { useStore } from '../store';

export function ExitIntentPopup() {
  const applyCoupon = useStore((state) => state.applyCoupon);
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(() => {
    return sessionStorage.getItem('exitPopupShown') === 'true';
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [formData, setFormData] = useState({
    name: '',
    mobile: ''
  });

  useEffect(() => {
    const checkShouldShow = () => {
      if (hasShown) return false;
      if (sessionStorage.getItem('exitPopupShown') === 'true') return false;
      
      const hasPurchased = localStorage.getItem('hasPurchased');
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

      const submitted = localStorage.getItem('exitIntentSubmittedTime');
      const now = Date.now();
      const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
      
      if (submitted && (now - parseInt(submitted)) < SEVEN_DAYS) return false;
      
      return true;
    };

    if (!checkShouldShow()) return;

    // ===== MOBILE + DESKTOP EXIT INTENT FIX =====

    // Prevent popup from showing multiple times
    let exitPopupShown = sessionStorage.getItem('exitPopupShown') === 'true' || hasShown;

    const showPopup = () => {
      setIsVisible(true);
      setHasShown(true);
      
      // Tracking: popup impressions
      if ((window as any).fbq) {
        (window as any).fbq('trackCustom', 'ExitIntentShown');
      }
      if ((window as any).gtag) {
        (window as any).gtag('event', 'view_promotion', {
          promotions: [
            {
              promotion_id: 'VIPCLUB60',
              promotion_name: 'Exit Intent Discount'
            }
          ]
        });
      }
    };

    const triggerExitPopup = () => {
      if (exitPopupShown) return;
      if (!checkShouldShow()) return;

      exitPopupShown = true;
      sessionStorage.setItem('exitPopupShown', 'true');
      setHasShown(true);
      showPopup();
    };

    // Restore session protection
    if (sessionStorage.getItem('exitPopupShown')) {
      exitPopupShown = true;
    }

    // ===============================
    // TRIGGER 1: Fast scroll upward near top
    // ===============================
    let lastY = window.scrollY;
    let upCount = 0;

    const handleScroll = () => {
      const currentY = window.scrollY;

      // Detect upward scroll
      if (currentY < lastY) {
        upCount++;
      } else {
        upCount = 0;
      }

      // User aggressively scrolling upward near top
      if (
        upCount >= 5 &&
        currentY < 200 &&
        !exitPopupShown
      ) {
        triggerExitPopup();
      }

      lastY = currentY;
    };

    // ===============================
    // TRIGGER 2: Time on page
    // ===============================
    const timerId = setTimeout(() => {
      if (!exitPopupShown) {
        triggerExitPopup();
      }
    }, 45000);

    // ===============================
    // TRIGGER 3: Browser back button
    // ===============================

    // Push fake history state
    history.pushState({ page: 1 }, "", "");

    const handlePopState = () => {
      if (!exitPopupShown) {
        triggerExitPopup();

        // Push state again so user doesn't instantly leave
        history.pushState({ page: 1 }, "", "");
      }
    };

    // ===============================
    // DESKTOP EXIT INTENT
    // ===============================
    const handleMouseLeave = (e: MouseEvent) => {
      if (
        e.clientY <= 10 &&
        !exitPopupShown
      ) {
        triggerExitPopup();
      }
    };

    // Delay activation to avoid showing immediately on load (fast-track in dev/preview)
    const activationDelay = (window.location.hostname.includes('localhost') || 
                             window.location.hostname.includes('127.0.0.1') || 
                             window.location.hostname.includes('.run.app')) ? 2000 : 10000;

    const activateTriggers = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('popstate', handlePopState);
    }, activationDelay);

    return () => {
      clearTimeout(activateTriggers);
      clearTimeout(timerId);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasShown]);

  // Lock body scroll when popup is open
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
      // Prevent slight layout shift when scrollbar disappears
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
    localStorage.setItem('exitIntentSubmittedTime', Date.now().toString());
    localStorage.setItem('exitIntentSubmitted', 'true');
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('exitIntentDismissedTime', Date.now().toString());
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
    document.body.removeChild(textArea);
  };

  const copyText = (text: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
      }).catch((err) => {
        fallbackCopyTextToClipboard(text);
        setCopied(true);
      });
    } else {
      fallbackCopyTextToClipboard(text);
      setCopied(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    
    const name = formData.name.trim();
    const mobile = formData.mobile.trim();

    if (!name || !mobile) {
      setErrorMsg("Please fill all fields");
      return;
    }

    // Mobile validation: 10 digits (handling optional 91 prefix)
    let mobileValue = mobile.replace(/\D/g, '');
    
    if (mobileValue.length === 12 && mobileValue.startsWith('91')) {
      mobileValue = mobileValue.substring(2);
    }
    
    if (mobileValue.length !== 10) {
      setErrorMsg("Please enter a valid 10-digit WhatsApp number");
      return;
    }

    setIsSubmitting(true);

    try {
      const isMobileDevice = window.innerWidth <= 768;
      const deviceType = isMobileDevice ? 'Mobile' : 'Desktop';
      const viewedProduct = window.location.pathname.includes('/product/') 
        ? window.location.pathname.split('/').pop() || 'N/A' 
        : 'N/A';

      const payload = {
        firstName: name,
        mobileNumber: mobileValue,
        productViewed: viewedProduct,
        pageUrl: window.location.href,
        date: new Date().toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" }),
        time: new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" }),
        deviceType: deviceType,
        source: "Popup",
        leadSource: "Exit Intent Popup"
      };

      // Also fire Meta & GA4 Events
      if ((window as any).fbq) {
        (window as any).fbq('track', 'Lead', {
          content_name: 'Exit Intent Coupon',
          currency: 'INR',
          value: 60
        });
        (window as any).fbq('track', 'CompleteRegistration', {
          content_name: 'VIP Coupon Signup'
        });
      }
      
      if ((window as any).gtag) {
        (window as any).gtag('event', 'generate_lead', {
          currency: 'INR',
          value: 60,
          lead_type: 'Exit Intent'
        });
      }

      const result = await submitToGoogleSheets(payload);

      if (result && (result.status === "success" || result.status === 200 || result.fallback)) {
        setIsSuccess(true);
        setSuccessStorage();
        // Automatically copy the coupon code to clipboard and apply to store
        copyText('VIPCLUB60');
        applyCoupon('VIPCLUB60');
        
        setTimeout(() => isVisible && handleClose(), 25000);
      } else {
        setIsSuccess(true);
        setSuccessStorage();
        copyText('VIPCLUB60');
        applyCoupon('VIPCLUB60');
        setTimeout(() => isVisible && handleClose(), 25000);
      }
    } catch (error) {
      console.error("Popup Error:", error);
      setIsSuccess(true);
      setSuccessStorage();
      copyText('VIPCLUB60');
      applyCoupon('VIPCLUB60');
      setTimeout(() => isVisible && handleClose(), 25000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    copyText('VIPCLUB60');
    
    // Track Coupon copy
    if ((window as any).fbq) {
      (window as any).fbq('trackCustom', 'ExitIntentCouponCopy');
    }
    if ((window as any).gtag) {
      (window as any).gtag('event', 'select_promotion', {
        promotions: [
          {
            promotion_id: 'VIPCLUB60',
            promotion_name: 'Exit Intent Discount'
          }
        ]
      });
    }
    
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[2147483647] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Popup Container (Dark premium e-commerce design) */}
      <div
        className="relative w-full max-w-[92vw] sm:max-w-[400px] bg-[#111111] text-white shadow-2xl rounded-2xl border border-neutral-800/85 z-10 flex flex-col max-h-[96vh] md:max-h-[92vh] overflow-y-auto animate-in slide-in-from-bottom-6 md:slide-in-from-bottom-0 md:zoom-in-95 fade-in duration-300 ease-out p-5 sm:p-8 scrollbar-none"
      >
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 w-8 h-8 flex items-center justify-center text-[#F2E6C9]/80 hover:text-[#F2E6C9] bg-white/10 hover:bg-white/15 rounded-full transition-colors focus:outline-none"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <div className="flex flex-col items-center text-center">
          {isSuccess ? (
            <div className="flex flex-col items-center py-1 w-full animate-in fade-in duration-500">
              <div className="w-10 h-10 bg-green-950/45 rounded-full flex items-center justify-center mb-2.5 border border-green-800/40">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 
                className="text-lg sm:text-[21px] font-serif font-bold mb-1 leading-tight tracking-wide"
                style={{ 
                  color: '#F2E6C9', 
                  textShadow: '0px 1px 2px rgba(0,0,0,0.25)' 
                }}
              >
                🎉 Coupon Unlocked!
              </h3>
              <p className="text-[#E7D3A8]/95 font-sans text-xs sm:text-[13px] mb-3 leading-relaxed">
                Use Code: <span className="text-[#D4AF37] font-semibold font-mono tracking-wider">VIPCLUB60</span> at Checkout
              </p>

              <div className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl p-4 sm:p-5 mb-3.5 shadow-inner relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-bl-[100px] -z-0"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-[#D4AF37]/5 rounded-tr-[80px] -z-0"></div>
                
                <div id="couponCode" className="relative z-10 font-sans font-bold text-2xl sm:text-3xl tracking-widest text-[#D4AF37] mb-2 bg-[#111111]/90 py-2 rounded-lg border border-neutral-800 shadow-sm select-all">
                  VIPCLUB60
                </div>
                <p className="text-[10px] sm:text-xs font-semibold text-[#E7D3A8] mb-3 uppercase tracking-wider">
                  Get 60% OFF Instantly on Your Order
                </p>
                
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={handleCopyCode}
                    className="w-full bg-[#D4AF37] hover:bg-[#E5C158] text-neutral-950 font-bold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 text-xs sm:text-sm active:scale-[0.98] cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <svg className="w-4 h-4 flex-shrink-0 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Code Copied
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                        </svg>
                        COPY CODE
                      </>
                    )}
                  </button>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent("Hey! Check out Mukesh Saree Centre! Use VIP coupon 'VIPCLUB60' to get an instant discount on premium luxury sarees! Website: https://mukeshsarees.com")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full border border-[#25D366]/30 bg-[#25D366]/5 hover:bg-[#25D366]/15 text-[#25D366] font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm active:scale-[0.98]"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Share on WhatsApp
                  </a>
                </div>
              </div>

              <p className="text-[10px] text-neutral-400 font-sans text-center leading-relaxed">
                Copy code or share to apply your VIP offer.
              </p>
              
              <button 
                onClick={handleClose}
                className="mt-3 text-xs text-[#E7D3A8] hover:text-[#F2E6C9] underline underline-offset-4 tracking-wider uppercase font-semibold transition-colors p-1"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500 w-full flex flex-col items-center pt-1">
              <h2 
                className="text-[19px] sm:text-[23px] font-serif font-bold mb-1.5 leading-tight tracking-wide"
                style={{ 
                  color: '#F2E6C9', 
                  textShadow: '0px 1px 2px rgba(0,0,0,0.25)' 
                }}
              >
                <span className="inline-block mr-1 sm:mr-1.5">🎉</span>Wait! Get <span className="text-[#D4AF37]" style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.25)' }}>60% OFF</span> Instantly
              </h2>
              <p className="text-neutral-300 font-sans text-xs sm:text-[13px] mb-3.5 leading-relaxed">
                Enter your details to unlock your exclusive VIP discount coupon:
              </p>

              {/* Trust badges row with enhanced spacing and legibility */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full mb-4 bg-neutral-950/80 p-2 sm:p-2.5 px-3 rounded-xl border border-neutral-800/60 text-center">
                <div className="flex flex-col items-center justify-center text-neutral-200 text-[9.5px] font-semibold leading-tight">
                  <span className="text-[#D4AF37] mb-0.5 font-bold text-[12px]">✓</span> Instant Discount
                </div>
                <div className="flex flex-col items-center justify-center text-neutral-200 text-[9.5px] font-semibold leading-tight">
                  <span className="text-[#D4AF37] mb-0.5 font-bold text-[12px]">✓</span> Easy COD Orders
                </div>
                <div className="flex flex-col items-center justify-center text-neutral-200 text-[9.5px] font-semibold leading-tight">
                  <span className="text-[#D4AF37] mb-0.5 font-bold text-[12px]">✓</span> VIP Lifetime Offer
                </div>
              </div>

              <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
                <div className="text-left w-full">
                  <label className="block text-[10px] uppercase tracking-wider text-[#E7D3A8]/90 font-bold mb-1 ml-0.5">
                    Full Name
                  </label>
                  <input 
                    id="popupName"
                    type="text" 
                    required
                    autoFocus
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-neutral-700 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all placeholder:text-white/45 rounded-lg font-sans text-xs sm:text-sm text-white shadow-inner"
                  />
                </div>
                <div className="text-left w-full">
                  <label className="block text-[10px] uppercase tracking-wider text-[#E7D3A8]/90 font-bold mb-1 ml-0.5">
                    WhatsApp Number
                  </label>
                  <input 
                    id="popupMobile"
                    type="tel" 
                    inputMode="numeric"
                    pattern="[0-9]*"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                    placeholder="Enter 10-digit WhatsApp number"
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-neutral-700 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all placeholder:text-white/45 rounded-lg font-sans text-xs sm:text-sm text-white shadow-inner"
                  />
                </div>
                
                {errorMsg && (
                  <div className="text-red-400 text-xs font-semibold text-left ml-0.5 animate-in fade-in">
                    ⚠️ {errorMsg}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#D4AF37] hover:bg-[#E5C158] text-[#111111] font-bold py-2.5 sm:py-3 px-6 mt-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center font-sans tracking-wider rounded-lg text-xs sm:text-sm shadow-md active:scale-[0.98] cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-neutral-950/30 border-t-neutral-950 rounded-full animate-spin"></div>
                  ) : (
                    "Unlock My Discount"
                  )}
                </button>

                <div className="flex flex-col items-center mt-1.5 w-full gap-1.5">
                  <p className="text-[10px] sm:text-[11px] text-red-400 font-sans font-semibold flex items-center justify-center gap-1.5 leading-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                    Only a few coupons left for today!
                  </p>
                  
                  <p className="text-[9.5px] sm:text-[10.5px] text-neutral-300 font-sans flex items-center justify-center gap-1.5 max-w-[280px] text-center opacity-95 mx-auto leading-none mt-1">
                    <span className="flex items-center gap-0.5 font-medium text-neutral-200">
                      <svg className="w-3.5 h-3.5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg> 
                      Secure Checkout
                    </span>
                    <span className="text-neutral-600 font-bold">•</span>
                    <span className="font-medium text-neutral-200">Trusted Store</span>
                    <span className="text-neutral-600 font-bold">•</span>
                    <span className="font-medium text-neutral-200 font-sans">No Spam</span>
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


