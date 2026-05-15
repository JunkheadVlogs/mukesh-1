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
      }
    };

    // 1. Desktop Exit Intent
    const handleMouseOut = (e: MouseEvent) => {
      if (e.clientY < 20 && e.movementY < 0) {
        showPopup();
      }
    };

    // 2. Mobile Scroll Depth (40%)
    const handleScroll = () => {
      if (window.innerWidth <= 768) {
        const scrollDepth = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        if (scrollDepth > 0.4) {
          showPopup();
        }
      }
    };

    // 3. Fallback Timers (Mobile & Desktop)
    const timeTimer = setTimeout(() => {
      showPopup();
    }, 12000);

    // 4. History / Back button intent on mobile
    // Create a dummy history state to trap the back button once
    const handlePopState = (e: PopStateEvent) => {
       if (e.state && e.state.exitIntentTrap === "trap") {
         // This is our trap state, ignore
         return;
       }
       showPopup();
    };

    // Push two states so the user has to press back to trigger the popstate before leaving
    if (!window.history.state || window.history.state.exitIntentTrap !== "trap") {
       window.history.replaceState({ exitIntentTrap: "base" }, "");
       window.history.pushState({ exitIntentTrap: "trap" }, "");
    }

    document.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      document.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('popstate', handlePopState);
      clearTimeout(timeTimer);
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
      const payload = {
        orderId: "LEAD-" + Date.now().toString().slice(-6),
        firstName: name,
        lastName: "",
        email: "",
        mobileNumber: mobileValue,
        address: "Website Lead",
        items: "Exit Intent Form Submitted",
        totalAmount: "0",
        discountAmount: "0",
        paymentMethod: "",
        paymentStatus: "Lead",
        paymentId: "",
        timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        leadType: "Exit Intent",
        status: "Lead",
        source: "Popup",
        couponUsed: "VIBCLUB60",
        pageUrl: window.location.href
      };

      // Add actual keys specifically requested by user just in case the Google script picks up exact string matches
      (payload as any)["Lead Type"] = "Exit Intent";
      (payload as any)["Status"] = "Lead";
      (payload as any)["Source"] = "Popup";
      (payload as any)["Coupon Used"] = "VIBCLUB60";
      (payload as any)["Page URL"] = window.location.href;

      const result = await submitToGoogleSheets(payload);

      if (result && (result.status === "success" || result.status === 200 || result.fallback)) {
        setIsSuccess(true);
        setSuccessStorage();
        // Automatically copy the coupon code to clipboard
        try {
          navigator.clipboard.writeText('VIBCLUB60');
          setCopied(true);
        } catch (err) {}
        
        setTimeout(() => isVisible && handleClose(), 5000);
      } else {
        setIsSuccess(true);
        setSuccessStorage();
        setTimeout(() => isVisible && handleClose(), 5000);
      }
    } catch (error) {
      console.error("Popup Error:", error);
      setIsSuccess(true);
      setSuccessStorage();
      setTimeout(() => isVisible && handleClose(), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('VIBCLUB60');
    setCopied(true);
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
              <p className="text-primary-700 font-sans text-sm md:text-base mb-6">Your 60% OFF coupon has been unlocked.</p>

              <div className="w-full bg-gold-50/50 border border-gold-200 rounded-xl p-5 mb-5 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-gold-200/20 rounded-bl-[100px] -z-0"></div>
                 <div className="absolute bottom-0 left-0 w-20 h-20 bg-gold-200/20 rounded-tr-[80px] -z-0"></div>
                 
                 <div id="couponCode" className="relative z-10 font-sans font-bold text-2xl md:text-3xl tracking-widest text-primary-950 mb-3 bg-white/80 py-3 rounded-lg border border-white/80 shadow-sm">
                   VIBCLUB60
                 </div>
                 <p className="text-[10px] sm:text-xs font-semibold text-gold-600 mb-4 uppercase tracking-widest">Get 60% OFF on Your Order</p>
                 
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
              </div>

              <p className="text-[11px] text-primary-600 font-sans italic opacity-80">Apply this code at checkout</p>
              
              <button 
                onClick={handleClose}
                className="mt-4 text-xs md:text-sm text-primary-500 hover:text-primary-800 underline underline-offset-4 transition-colors p-2"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500 w-full flex flex-col items-center pt-2">
              <h2 className="text-[22px] md:text-[28px] font-serif font-medium text-primary-950 mb-2 leading-tight">
                Wait! Unlock <span className="text-gold-500 font-bold">60% OFF</span> ✨
              </h2>
              <p className="text-primary-700 font-sans text-[13px] md:text-sm mb-6 leading-relaxed">
                Enter your details to receive your special discount code instantly.
              </p>

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
                    "Unlock My Offer"
                  )}
                </button>
                <p className="text-[11px] text-primary-500 mt-2 font-sans opacity-80 text-center">
                  No spam. Only exclusive offers & new arrivals.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

