import { useState, useEffect } from 'react';
import { submitToGoogleSheets } from '../config';

export function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
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
      
      const hasPurchased = localStorage.getItem('hasPurchased');
      if (hasPurchased === 'true') return false;

      // Do not show on thank you pages
      if (window.location.pathname.includes('/thank-you') || window.location.pathname.includes('/success')) {
        return false;
      }
      
      const submitted = localStorage.getItem('exitIntentSubmittedTime');
      const now = Date.now();
      const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
      
      if (submitted && (now - parseInt(submitted)) < SEVEN_DAYS) return false;
      
      return true;
    };

    if (!checkShouldShow()) return;

    const showPopup = () => {
      if (!hasShown && checkShouldShow()) {
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
      }
    };

    let activityTimer: ReturnType<typeof setTimeout>;
    let scrollPos = window.scrollY;

    const resetInactivityTimer = () => {
      clearTimeout(activityTimer);
      activityTimer = setTimeout(() => {
        showPopup();
      }, 30000); // 30 seconds of inactivity
    };

    // 1. Desktop Exit Intent (Mouse leave top)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 20) {
        showPopup();
      }
    };

    // 2. Mobile Rapid Scroll Up / Back scroll
    let scrollUpCount = 0;
    const handleScroll = () => {
      resetInactivityTimer();
      const currentScroll = window.scrollY;
      if (currentScroll < scrollPos) {
        scrollUpCount++;
        if (scrollUpCount > 4 && currentScroll < 150) {
          showPopup();
        }
      } else {
        scrollUpCount = 0;
      }
      scrollPos = currentScroll;
    };

    const handleInteraction = () => {
      resetInactivityTimer();
    };

    // 3. Tab Switch
    const handleVisibilityChange = () => {
      if (document.hidden) {
        showPopup();
      }
    };

    // 4. Back button trap
    const handlePopState = (e: PopStateEvent) => {
       if (e.state && e.state.exitIntentTrap === "trap") {
         return;
       }
       showPopup();
    };

    if (!window.history.state || window.history.state.exitIntentTrap !== "trap") {
       window.history.replaceState({ exitIntentTrap: "base" }, "");
       window.history.pushState({ exitIntentTrap: "trap" }, "");
    }

    // Delay activation to avoid showing immediately on load
    const activateTriggers = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('popstate', handlePopState);
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      // Interaction tracking for inactivity
      window.addEventListener('touchstart', handleInteraction);
      window.addEventListener('mousemove', handleInteraction);
      window.addEventListener('click', handleInteraction);
      window.addEventListener('keydown', handleInteraction);
      
      resetInactivityTimer();
    }, 10000); // Start listening after 10 seconds

    const autoShowTimer = setTimeout(() => {
      showPopup();
    }, 30000); // Auto show after 30 seconds of staying on page
    
    return () => {
      clearTimeout(activateTriggers);
      clearTimeout(activityTimer);
      clearTimeout(autoShowTimer);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
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
      setErrorMsg("Please enter a valid 10-digit mobile number");
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
          value: 0
        });
        (window as any).fbq('track', 'CompleteRegistration', {
          content_name: 'VIP Coupon Signup'
        });
      }
      
      if ((window as any).gtag) {
        (window as any).gtag('event', 'generate_lead', {
          currency: 'INR',
          value: 0,
          lead_type: 'Exit Intent'
        });
      }

      const result = await submitToGoogleSheets(payload);

      if (result && (result.status === "success" || result.status === 200 || result.fallback)) {
        setIsSuccess(true);
        setSuccessStorage();
        // Automatically copy the coupon code to clipboard
        copyText('VIPCLUB60');
        
        setTimeout(() => isVisible && handleClose(), 20000);
      } else {
        setIsSuccess(true);
        setSuccessStorage();
        copyText('VIPCLUB60');
        setTimeout(() => isVisible && handleClose(), 20000);
      }
    } catch (error) {
      console.error("Popup Error:", error);
      setIsSuccess(true);
      setSuccessStorage();
      copyText('VIPCLUB60');
      setTimeout(() => isVisible && handleClose(), 20000);
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
    <div className="fixed inset-0 z-[2147483647] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Popup */}
      <div
        className="relative w-full max-w-[90vw] md:max-w-[400px] bg-[#FFFBF7] shadow-2xl rounded-2xl border border-gold-200 z-10 flex flex-col animate-in slide-in-from-bottom-8 md:slide-in-from-bottom-0 md:zoom-in-95 fade-in duration-400 ease-out py-6 px-5 sm:px-8"
      >
        <button 
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 p-2 text-primary-500 hover:text-primary-900 bg-black/5 hover:bg-black/10 rounded-full transition-colors focus:outline-none"
          aria-label="Close"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div className="flex flex-col items-center text-center">
          {isSuccess ? (
              <div className="flex flex-col items-center py-2 w-full animate-in fade-in duration-500">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                 <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h3 className="text-xl md:text-2xl font-serif font-medium text-primary-950 mb-2">Thank You!</h3>
              <p className="text-primary-700 font-sans text-sm md:text-base mb-4">Your 60% OFF coupon has been unlocked.</p>

              <div className="w-full bg-gold-50/50 border border-gold-200 rounded-xl p-5 mb-5 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-gold-200/20 rounded-bl-[100px] -z-0"></div>
                 <div className="absolute bottom-0 left-0 w-20 h-20 bg-gold-200/20 rounded-tr-[80px] -z-0"></div>
                 
                 <div id="couponCode" className="relative z-10 font-sans font-bold text-2xl md:text-3xl tracking-widest text-primary-950 mb-3 bg-white/80 py-3 rounded-lg border border-white/80 shadow-sm">
                   VIPCLUB60
                 </div>
                 <p className="text-[10px] sm:text-xs font-semibold text-gold-600 mb-4 uppercase tracking-widest">Get 60% OFF on Your Order</p>
                 
                 <div className="flex flex-col gap-2">
                   <button 
                     onClick={handleCopyCode}
                     className="w-full bg-gold-500 hover:bg-gold-600 text-white font-medium py-3.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm active:scale-[0.98]"
                   >
                     {copied ? (
                       <>
                         <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                         Coupon Copied
                       </>
                     ) : (
                       <>
                         <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                         Copy Code
                       </>
                     )}
                   </button>

                   <a
                     href={`https://wa.me/?text=${encodeURIComponent("Hey! Use my VIP coupon 'VIPCLUB60' to get 60% OFF on premium sarees at Mukesh Saree Centre! Check it out: https://mukeshsarees.com")}`}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="w-full bg-[#25D366] hover:bg-[#20BE5A] text-white font-medium py-3.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm active:scale-[0.98]"
                   >
                     <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                       <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                     </svg>
                     Share on WhatsApp
                   </a>
                 </div>
              </div>

              <p className="text-[12px] sm:text-sm text-primary-700 font-sans font-medium mt-1 mb-2 text-center leading-relaxed">Use this code during checkout to claim your special discount.</p>
              
              <button 
                onClick={handleClose}
                className="mt-3 text-xs md:text-sm text-primary-500 hover:text-primary-800 underline underline-offset-4 transition-colors p-2"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500 w-full flex flex-col items-center pt-2">
              <h2 className="text-[22px] md:text-[28px] font-serif font-medium text-primary-950 mb-2 leading-tight">
                Wait! Enjoy an <span className="text-gold-500 font-bold">Exclusive Offer</span> ✨
              </h2>
              <p className="text-primary-700 font-sans text-[13px] md:text-sm mb-5 leading-relaxed">
                Get an exclusive 60% OFF discount on your order today!
              </p>

              <div className="flex flex-col items-start gap-2.5 w-full mb-6 bg-gold-50/40 px-5 py-4 rounded-xl border border-gold-100/60 shadow-[inset_0_0_20px_rgba(234,179,8,0.03)]">
                <div className="flex items-center gap-2.5 text-primary-800 text-[13px] sm:text-sm font-medium">
                  <span className="text-xl leading-none">✨</span> Extra Savings
                </div>
                <div className="flex items-center gap-2.5 text-primary-800 text-[13px] sm:text-sm font-medium">
                  <span className="text-xl leading-none">✨</span> Premium Saree Collection
                </div>
                <div className="flex items-center gap-2.5 text-primary-800 text-[13px] sm:text-sm font-medium">
                  <span className="text-xl leading-none">✨</span> Limited Time Offer
                </div>
                <div className="flex items-center gap-2.5 text-primary-800 text-[13px] sm:text-sm font-medium">
                  <span className="text-xl leading-none">✨</span> COD Available
                </div>
              </div>

              <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                <div className="text-left">
                  <label className="block text-[11px] uppercase tracking-wider text-primary-700 font-semibold mb-1.5 ml-1">Full Name</label>
                  <input 
                    id="popupName"
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Your Name"
                    className="w-full px-4 py-3 bg-white border border-primary-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all placeholder:text-primary-300 rounded-lg font-sans text-sm md:text-base shadow-sm"
                  />
                </div>
                <div className="text-left mb-1">
                  <label className="block text-[11px] uppercase tracking-wider text-primary-700 font-semibold mb-1.5 ml-1">Mobile Number</label>
                  <input 
                    id="popupMobile"
                    type="tel" 
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                    placeholder="+91 Mobile Number"
                    className="w-full px-4 py-3 bg-white border border-primary-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all placeholder:text-primary-300 rounded-lg font-sans text-sm md:text-base shadow-sm"
                  />
                </div>
                
                {errorMsg && (
                  <div className="text-red-500 text-xs font-medium text-left ml-1 mb-1 animate-in fade-in">{errorMsg}</div>
                )}

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-950 text-white font-medium py-3.5 px-6 mt-2 hover:bg-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center font-sans tracking-wide rounded-lg text-sm md:text-base shadow-md active:scale-[0.98] relative"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    "Unlock Offer"
                  )}
                </button>
                <div className="flex flex-col items-center mt-1 w-full gap-2">
                  <p className="text-[11px] md:text-xs text-red-600 font-sans font-medium flex items-center justify-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span> Only few coupons left for today!</p>
                  <p className="text-[10px] md:text-[11px] text-primary-500 font-sans flex items-center justify-center gap-2 max-w-[280px] text-center opacity-90 mx-auto leading-tight mt-1">
                     <span className="flex items-center gap-1"><svg className="w-3.5 h-3.5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg> Secure Checkout</span>
                     <span className="text-primary-300">•</span>
                     <span className="flex items-center gap-1">COD Available</span>
                     <span className="text-primary-300">•</span>
                     <span className="flex items-center gap-1">No Spam</span>
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

