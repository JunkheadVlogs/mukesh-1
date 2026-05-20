import { motion } from "motion/react";
import { Link, useLocation } from "react-router";
import { CheckCircle2 } from "lucide-react";
import { SEO } from "./components/SEO";
import { useEffect, useRef } from "react";
import { trackPurchase } from "./tracking";

export default function ThankYou() {
  const location = useLocation();
  const orderId = location.state?.orderId || `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  const total = location.state?.total;
  const cart = location.state?.cart;
  const hasTracked = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (total && cart && !hasTracked.current) {
      trackPurchase(total, cart, orderId);
      hasTracked.current = true;
    }
  }, [total, cart, orderId]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 min-h-[70vh] flex flex-col items-center justify-center text-center bg-primary-50 relative overflow-hidden">
      <SEO
        title="Order Confirmed | Mukesh Saree Centre"
        description="Thank you for shopping at Mukesh Saree Centre."
        url="/thank-you"
      />
      {/* Subtle Confetti Dots using motion */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 0, x: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 1, 0], 
            y: -100 - Math.random() * 100, 
            x: (Math.random() - 0.5) * 200,
            scale: [0, 1.5, 0.5] 
          }}
          transition={{ duration: 2, ease: "easeOut", delay: i * 0.1 }}
          className={`absolute w-2 h-2 rounded-full ${['bg-gold-400', 'bg-gold-600', 'bg-primary-500'][i % 3]} opacity-60`}
          style={{ 
            top: '50%', left: '50%', 
            marginTop: '-50px' 
          }}
        />
      ))}

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-8 border border-green-100 z-10"
      >
        <CheckCircle2 size={40} className="text-green-500" strokeWidth={1.5} />
      </motion.div>
      
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-3xl md:text-5xl font-serif text-primary-950 mb-4 z-10"
      >
        Order Confirmed
      </motion.h1>
      
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-primary-950/80 mb-6 max-w-md mx-auto text-base md:text-lg z-10 leading-relaxed"
      >
        Your order has been placed successfully ❤️<br/>
        We’re preparing your order and will contact you shortly.
      </motion.p>

      <motion.div
         initial={{ y: 20, opacity: 0 }}
         animate={{ y: 0, opacity: 1 }}
         transition={{ delay: 0.25 }}
         className="bg-green-50 text-green-800 border border-green-200 px-6 py-3 rounded-full text-sm font-medium mb-10 z-10 shadow-sm"
      >
         Estimated Delivery: <strong>3-5 Business Days</strong>
      </motion.div>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white p-6 md:p-8 border border-black/5 rounded-sm shadow-xl shadow-black/[0.02] mb-6 max-w-sm w-full mx-auto z-10"
      >
         <p className="text-[10px] uppercase tracking-[2px] text-gold-600 font-bold mb-2">Order ID</p>
         <p className="text-2xl font-bold text-primary-950 mb-6">{orderId}</p>
         <Link to="/shop" className="btn-primary w-full flex justify-center mb-4">
           Continue Shopping
         </Link>
         <a 
           href="https://wa.me/917020664641" 
           target="_blank" 
           rel="noopener noreferrer" 
           className="flex items-center justify-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm transition-colors py-2"
         >
           <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
           WhatsApp Support
         </a>
      </motion.div>
    </div>
  );
}
