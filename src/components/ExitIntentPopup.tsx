import { useState, useEffect } from 'react';
import { submitToGoogleSheets } from '../config';

export function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    mobile: ''
  });

  useEffect(() => {
    const hasSubmitted = localStorage.getItem('exitIntentSubmitted');
    const hasDismissed = sessionStorage.getItem('exitIntentDismissed');
    
    if (hasSubmitted === 'true' || hasDismissed === 'true' || hasShown) {
      return;
    }

    const showPopup = () => {
      if (!hasShown) {
        setIsVisible(true);
        setHasShown(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      if (e.clientY < 20 && e.clientX > 0) {
        showPopup();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        showPopup();
      }
    };

    let inactivityTimer: NodeJS.Timeout;
    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        const path = window.location.pathname;
        if (path.includes('/product') || path.includes('/cart') || path.includes('/checkout')) {
          showPopup();
        }
      }, 60000);
    };

    const handlePopState = () => {
      showPopup();
    };

    window.history.pushState({ popupTrap: true }, '');

    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('popstate', handlePopState);
    
    const events = ['mousemove', 'touchstart', 'scroll', 'keydown', 'click'];
    events.forEach(e => document.addEventListener(e, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('popstate', handlePopState);
      events.forEach(e => document.removeEventListener(e, resetTimer));
      clearTimeout(inactivityTimer);
    };
  }, [hasShown]);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('exitIntentDismissed', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const name = formData.name.trim();
    const mobile = formData.mobile.trim();

    if (!name || !mobile) {
      alert("Please fill all fields");
      return;
    }

    // Mobile validation: 10 digits (handling optional 91 prefix)
    let mobileValue = mobile.replace(/\D/g, ''); // Remove non-digits
    
    // If it starts with 91 and is 12 digits, take last 10
    if (mobileValue.length === 12 && mobileValue.startsWith('91')) {
      mobileValue = mobileValue.substring(2);
    }
    
    const mobileRegex = /^[0-9]{10}$/;
    
    if (!mobileRegex.test(mobileValue)) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        firstName: name,
        mobileNumber: mobileValue,
        leadSource: "Exit Intent Popup",
        timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
      };

      const result = await submitToGoogleSheets(payload);

      if (result && result.status === "success") {
        setIsSuccess(true);
        localStorage.setItem('exitIntentSubmitted', 'true');
        
        alert("Coupon Unlocked Successfully");
        
        // Close after 8 seconds if they don't close it themselves
        setTimeout(() => {
          if (isVisible) handleClose();
        }, 8000);
      } else {
        throw new Error(result?.message || "Submission failed");
      }
      
    } catch (error) {
      console.error("Popup Error:", error);
      alert("Submission Failed. Please check your connection and try again.");
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Popup */}
      <div
        className="relative w-full max-w-md bg-[#FFFBF7] shadow-2xl overflow-hidden rounded-xl border border-gold-200 z-10 flex flex-col animate-in fade-in zoom-in duration-300"
      >
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/50 hover:bg-white rounded-full transition-colors"
          aria-label="Close"
        >
          <svg className="text-primary-900 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div className="p-8 md:p-10 flex flex-col items-center text-center">
          {isSuccess ? (
            <div className="flex flex-col items-center py-4 w-full animate-in fade-in duration-300">
              <h3 className="text-xl md:text-2xl font-serif font-medium text-primary-950 mb-2">🎉 Your Exclusive Coupon is Unlocked!</h3>
              <p className="text-primary-700 font-sans mb-6">Use Code:</p>

              <div className="w-full bg-gold-50 border border-gold-200 rounded-lg p-5 mb-6 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-20 h-20 bg-gold-200/30 rounded-bl-full -z-0"></div>
                 <div className="absolute bottom-0 left-0 w-16 h-16 bg-gold-200/30 rounded-tr-full -z-0"></div>
                 
                 <div id="couponCode" className="relative z-10 font-sans font-bold text-3xl tracking-widest text-primary-950 mb-4 bg-white/60 py-3 rounded border border-white/80">
                   VIBCLUB60
                 </div>
                 <p className="text-sm font-semibold text-gold-600 mb-4 uppercase tracking-wider">Get 60% OFF on Your Order</p>
                 
                 <button 
                   onClick={handleCopyCode}
                   className="w-full bg-gold-500 hover:bg-gold-600 text-white font-medium py-3 px-6 rounded transition-colors flex items-center justify-center gap-2"
                 >
                   {copied ? (
                     <>
                       <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                       Coupon Copied Successfully
                     </>
                   ) : (
                     <>
                       <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                       Copy Code
                     </>
                   )}
                 </button>
              </div>

              <p className="text-sm text-primary-600 font-sans italic">Apply this code at checkout</p>
              
              <button 
                onClick={handleClose}
                className="mt-6 text-sm text-primary-500 hover:text-primary-800 underline underline-offset-4 transition-colors p-2"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="animate-in fade-in duration-300 w-full flex flex-col items-center">
              <h2 className="text-3xl font-serif font-medium text-primary-950 mb-3 leading-tight">
                WAIT! Unlock an Exclusive <span className="text-gold-500 font-bold">60% OFF</span> Offer ✨
              </h2>
              <p className="text-primary-700 font-sans text-sm md:text-base mb-8">
                Enter your details to receive your special discount code and latest saree offers.
              </p>

              <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                <div className="text-left">
                  <label className="block text-[11px] uppercase tracking-wider text-primary-600 font-medium mb-1.5 ml-1">Full Name</label>
                  <input 
                    id="popupName"
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Your Name"
                    className="w-full px-4 py-3 bg-white border border-primary-200 focus:border-gold-400 focus:ring-1 focus:ring-gold-400 outline-none transition-all placeholder:text-primary-300 rounded font-sans"
                  />
                </div>
                <div className="text-left mb-2">
                  <label className="block text-[11px] uppercase tracking-wider text-primary-600 font-medium mb-1.5 ml-1">Mobile Number</label>
                  <input 
                    id="popupMobile"
                    type="tel" 
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                    placeholder="+91"
                    className="w-full px-4 py-3 bg-white border border-primary-200 focus:border-gold-400 focus:ring-1 focus:ring-gold-400 outline-none transition-all placeholder:text-primary-300 rounded font-sans"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-950 text-white font-medium py-3.5 px-6 mt-2 hover:bg-primary-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center font-sans tracking-wide rounded"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    "Unlock My Offer"
                  )}
                </button>
                <p className="text-xs text-primary-500 mt-3 font-sans mb-1">
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
