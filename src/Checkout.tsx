import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { SEO } from "./components/SEO";
import { Link, useNavigate } from "react-router";
import { useStore } from "./store";
import { formatPrice, optimizeImage } from "./utils";
import { OptimizedImage } from "./components/OptimizedImage";
import { CheckCircle2, Loader2, ArrowLeft, ArrowRight, Truck, ShieldCheck } from "lucide-react";
import { CONFIG, submitToGoogleSheets } from "./config";
import { trackInitiateCheckout, trackPurchase } from "./tracking";

const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Checkout() {
  const { cart, cartTotal, clearCart, appliedCoupon, applyCoupon } = useStore();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [couponInput, setCouponInput] = useState(appliedCoupon || "");
  const [couponError, setCouponError] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    window.scrollTo(0, 0);
    if (cart.length > 0) {
      trackInitiateCheckout(cartTotal(), cart);
    }
  }, []);

  useEffect(() => {
    if (appliedCoupon) {
      setCouponInput(appliedCoupon);
    } else {
      setCouponInput("");
    }
  }, [appliedCoupon]);

  const subtotalMRP = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = 0;
  
  const activeCoupon = appliedCoupon;
  let discountMultiplier = 0;
  if (activeCoupon === "VIP50") discountMultiplier = 0.50;
  else if (activeCoupon === "VIPCLUB60") discountMultiplier = 0.60;

  const totalDiscount = Math.floor(subtotalMRP * discountMultiplier);
  const total = Math.max(0, subtotalMRP + shipping - totalDiscount);

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    if (code === "VIP50" || code === "VIPCLUB60") {
      applyCoupon(code);
      setCouponError("");
    } else {
      setCouponError("Invalid Coupon Code");
    }
  };

  const handleRemoveCoupon = () => {
    applyCoupon(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const fullName = formData.get("firstName")?.toString() || "";
      const mobileNumber = formData.get("mobileNumber")?.toString() || "";
      const address = formData.get("address")?.toString() || "";
      const city = formData.get("city")?.toString() || "";
      const pinCodeValue = formData.get("pinCode")?.toString() || "";

      const errors: Record<string, string> = {};
      if (!fullName.trim()) errors.firstName = "Please enter your full name";
      if (!/^\d{10}$/.test(mobileNumber.trim())) errors.mobileNumber = "Please enter a valid 10-digit mobile number";
      if (!address.trim()) errors.address = "Please enter your shipping address";
      if (!city.trim()) errors.city = "Please enter your city";
      if (!/^\d{6}$/.test(pinCodeValue.trim())) errors.pinCode = "Please enter a 6-digit PIN code";

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        setIsSubmitting(false);
        const firstErrorKey = Object.keys(errors)[0];
        const errorElement = document.querySelector(`[name="${firstErrorKey}"]`) as HTMLElement;
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
          errorElement.focus();
        }
        return;
      }
      setFormErrors({});

      const newOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(newOrderId);

      const finalizeOrder = async () => {
        try {
          const googleSheetsData = {
            "First Name": fullName,
            "Mobile Number": mobileNumber,
            "Total Amount": total.toString(),
            "Product Name": cart.map(i => i.name).join(", "),
            "Date & Time": new Date().toLocaleString(),
            firstName: fullName,
            mobileNumber,
            address,
            totalAmount: total.toString()
          };
          await submitToGoogleSheets(googleSheetsData);
          trackPurchase(total, cart, newOrderId);
          setIsSuccess(true);
          clearCart();
        } catch (error) {
          setIsSuccess(true);
          clearCart();
        } finally {
          setIsSubmitting(false);
        }
      };

      if (paymentMethod === "online") {
        const isLoaded = await loadRazorpay();
        if (!isLoaded) {
          alert("Payment gateway failed to load.");
          setIsSubmitting(false);
          return;
        }

        // Call backend API explicitly without VITE_API_BASE_URL to avoid wrong routes
        const res = await fetch("/api/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: total }),
        });
        
        let orderData;
        try {
          const text = await res.text();
          if (text.startsWith("<!doctype") || text.includes("<html")) {
            throw new Error(`Invalid response from server. Are you running the backend Node.js server? Received HTML.`);
          }
          orderData = JSON.parse(text);
          
          if (!res.ok || orderData.error) {
            throw new Error(orderData.error || "Failed to create order");
          }
        } catch (e: any) {
          console.error("Payment Error:", e);
          alert(e.message || "Payment service is currently unavailable.");
          setIsSubmitting(false);
          return;
        }

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY || "rzp_live_Slf11Odg572QOq",
          amount: orderData.amount,
          currency: orderData.currency || "INR",
          name: "Mukesh Saree Centre",
          description: "Premium Purchase",
          order_id: orderData.id,
          handler: async function () {
            await finalizeOrder();
          },
          prefill: { name: fullName, contact: mobileNumber },
          theme: { color: "#D4AF37" },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        await finalizeOrder();
      }
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0 && !isSuccess) {
    navigate("/cart");
    return null;
  }

  if (isSuccess) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 min-h-[70vh] flex flex-col items-center justify-center text-center bg-primary-50">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-8 border border-green-100">
          <CheckCircle2 size={40} className="text-green-500" strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl md:text-5xl font-serif text-primary-950 mb-4">Order Confirmed</h1>
        <p className="text-primary-950/60 mb-10 max-w-md mx-auto">
          Thank you for your purchase. Your order has been placed successfully and is being processed.
        </p>
        <div className="bg-white p-8 border border-black/5 rounded-sm shadow-xl shadow-black/[0.02] mb-12 max-w-sm w-full mx-auto">
           <p className="text-[10px] uppercase tracking-[2px] text-gold-600 font-bold mb-2">Order ID</p>
           <p className="text-2xl font-bold text-primary-950 mb-6">{orderId}</p>
           <Link to="/shop" className="btn-primary">
             Continue Shopping
           </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-primary-50">
      <SEO
        title="Checkout | Mukesh Saree Centre"
        description="Complete your luxury ethnic wear purchase at Mukesh Saree Centre."
        url="/checkout"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <header className="mb-4 md:mb-8 border-b border-black/5 pb-3 md:pb-5">
          <h1 className="text-xl md:text-2xl font-serif text-primary-950 font-medium">Checkout</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8">
          {/* Main Form */}
          <div className="lg:col-span-7">
            <form id="checkout-form" onSubmit={handleSubmit} noValidate className="space-y-5 md:space-y-8">
              {/* Delivery Section */}
              <section className="bg-white p-4 md:p-6 border border-black/5 rounded-sm shadow-sm">
                <h2 className="text-base md:text-lg font-serif text-primary-950 mb-4 md:mb-5 font-medium pb-3 border-b border-black/5 flex items-center gap-2 md:gap-3">
                  <span className="w-6 h-6 md:w-7 md:h-7 bg-gold-500/10 text-gold-600 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold">1</span>
                  Delivery Details
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                     <label className="text-[9px] md:text-[10px] uppercase tracking-widest text-primary-950/60 font-bold ml-1">Full Name *</label>
                     <input 
                       required name="firstName" type="text"
                       className={`w-full bg-primary-50/20 border ${formErrors.firstName ? "border-red-500 ring-1 ring-red-500/20" : "border-black/10 focus:border-gold-500"} px-4 py-2.5 md:py-3 text-primary-950 focus:ring-1 focus:ring-gold-500/30 outline-none transition-all rounded-sm font-medium text-xs md:text-sm placeholder:text-primary-950/30`}
                       placeholder="Enter your full name"
                     />
                     {formErrors.firstName && <p className="text-red-500 text-[9px] font-bold tracking-wide mt-1 ml-1">{formErrors.firstName}</p>}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-[9px] md:text-[10px] uppercase tracking-widest text-primary-950/60 font-bold ml-1">Mobile Number *</label>
                       <input 
                         required name="mobileNumber" type="tel"
                         className={`w-full bg-primary-50/20 border ${formErrors.mobileNumber ? "border-red-500 ring-1 ring-red-500/20" : "border-black/10 focus:border-gold-500"} px-4 py-2.5 md:py-3 text-primary-950 focus:ring-1 focus:ring-gold-500/30 outline-none transition-all rounded-sm font-medium text-xs md:text-sm placeholder:text-primary-950/30`}
                         placeholder="10-digit number"
                       />
                       {formErrors.mobileNumber && <p className="text-red-500 text-[9px] font-bold tracking-wide mt-1 ml-1">{formErrors.mobileNumber}</p>}
                    </div>
                    <div className="space-y-1">
                       <label className="text-[9px] md:text-[10px] uppercase tracking-widest text-primary-950/60 font-bold ml-1">Email <span className="text-primary-950/30 font-normal">(Optional)</span></label>
                       <input 
                         name="email" type="email"
                         className="w-full bg-primary-50/20 border border-black/10 px-4 py-2.5 md:py-3 text-primary-950 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 outline-none transition-all rounded-sm font-medium text-xs md:text-sm placeholder:text-primary-950/30"
                         placeholder="email@example.com"
                       />
                    </div>
                  </div>

                  <div className="space-y-1">
                     <label className="text-[9px] md:text-[10px] uppercase tracking-widest text-primary-950/60 font-bold ml-1">Shipping Address *</label>
                     <input 
                       required name="address" type="text"
                       className={`w-full bg-primary-50/20 border ${formErrors.address ? "border-red-500 ring-1 ring-red-500/20" : "border-black/10 focus:border-gold-500"} px-4 py-2.5 md:py-3 text-primary-950 focus:ring-1 focus:ring-gold-500/30 outline-none transition-all rounded-sm font-medium text-xs md:text-sm placeholder:text-primary-950/30`}
                       placeholder="House no, Street name, Landmark"
                     />
                     {formErrors.address && <p className="text-red-500 text-[9px] font-bold tracking-wide mt-1 ml-1">{formErrors.address}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <div className="space-y-1">
                       <label className="text-[9px] md:text-[10px] uppercase tracking-widest text-primary-950/60 font-bold ml-1">City *</label>
                       <input 
                          required name="city" type="text" 
                          className={`w-full bg-primary-50/20 border ${formErrors.city ? "border-red-500 ring-1 ring-red-500/20" : "border-black/10 focus:border-gold-500"} px-4 py-2.5 md:py-3 text-primary-950 focus:ring-1 focus:ring-gold-500/30 outline-none transition-all rounded-sm font-medium text-xs md:text-sm placeholder:text-primary-950/30`} 
                          placeholder="City name"
                       />
                       {formErrors.city && <p className="text-red-500 text-[9px] font-bold tracking-wide mt-1 ml-1">{formErrors.city}</p>}
                    </div>
                    <div className="space-y-1">
                       <label className="text-[9px] md:text-[10px] uppercase tracking-widest text-primary-950/60 font-bold ml-1">PIN Code *</label>
                       <input 
                         required name="pinCode" type="text"
                         className={`w-full bg-primary-50/20 border ${formErrors.pinCode ? "border-red-500 ring-1 ring-red-500/20" : "border-black/10 focus:border-gold-500"} px-4 py-2.5 md:py-3 text-primary-950 focus:ring-1 focus:ring-gold-500/30 outline-none transition-all rounded-sm font-medium text-xs md:text-sm placeholder:text-primary-950/30`}
                         placeholder="6-digit PIN"
                       />
                       {formErrors.pinCode && <p className="text-red-500 text-[9px] font-bold tracking-wide mt-1 ml-1">{formErrors.pinCode}</p>}
                    </div>
                  </div>
                </div>
              </section>

              {/* Payment Section */}
              <section className="bg-white p-4 md:p-6 border border-black/5 rounded-sm shadow-sm">
                <h2 className="text-base md:text-lg font-serif text-primary-950 mb-4 md:mb-5 font-medium pb-3 border-b border-black/5 flex items-center gap-2 md:gap-3">
                  <span className="w-6 h-6 md:w-7 md:h-7 bg-gold-500/10 text-gold-600 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold">2</span>
                  Payment Method
                </h2>
                <div className="grid grid-cols-2 gap-3">
                   <label className={`relative p-3 md:p-4 border rounded-sm cursor-pointer transition-all flex items-center justify-center text-center h-full ${paymentMethod === 'online' ? 'bg-gold-500/5 border-gold-500 ring-1 ring-gold-500/30' : 'bg-primary-50/20 border-black/10 hover:border-black/20'}`}>
                     <input type="radio" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} className="hidden" />
                     <div className="flex flex-col items-center justify-center gap-0.5 md:gap-1 w-full">
                       <span className={`text-[13px] md:text-sm font-bold ${paymentMethod === 'online' ? 'text-gold-700' : 'text-primary-950'}`}>Pay Online</span>
                       <span className="text-[9px] md:text-[10px] uppercase font-bold text-primary-950/40 tracking-wider">UPI / Cards</span>
                     </div>
                   </label>
                   <label className={`relative p-3 md:p-4 border rounded-sm cursor-pointer transition-all flex items-center justify-center text-center h-full ${paymentMethod === 'cod' ? 'bg-gold-500/5 border-gold-500 ring-1 ring-gold-500/30' : 'bg-primary-50/20 border-black/10 hover:border-black/20'}`}>
                     <input type="radio" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="hidden" />
                     <div className="flex flex-col items-center justify-center gap-0.5 md:gap-1 w-full">
                       <span className={`text-[13px] md:text-sm font-bold ${paymentMethod === 'cod' ? 'text-gold-700' : 'text-primary-950'}`}>Cash on Delivery</span>
                       <span className="text-[9px] md:text-[10px] uppercase font-bold text-primary-950/40 tracking-wider">Pay when received</span>
                     </div>
                   </label>
                </div>
              </section>

              <div className="sticky bottom-4 md:static z-20 px-4 md:px-0 -mx-4 md:mx-0">
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full bg-primary-950 hover:bg-black text-white px-8 py-3.5 md:py-4 rounded-sm transition-all shadow-xl shadow-primary-950/20 text-xs md:text-sm font-bold tracking-[2px] uppercase flex items-center justify-center gap-3 disabled:opacity-70 active:scale-[0.98]"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <>Complete Purchase <ArrowRight size={18} className="-mt-0.5" /></>}
                </button>
              </div>
            </form>
          </div>

          {/* Checkout Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white p-5 md:p-6 border border-black/5 rounded-sm shadow-sm lg:sticky lg:top-32">
               <h2 className="text-base md:text-lg font-serif text-primary-950 mb-4 font-medium pb-3 border-b border-black/5">Order Summary</h2>
               
               <div className="space-y-4 mb-5 max-h-[35vh] overflow-y-auto pr-2 no-scrollbar">
                  {cart.map(item => (
                    <div key={`${item.id}-${item.size}`} className="flex gap-4">
                      <div className="w-16 h-20 bg-primary-50 rounded-sm relative overflow-hidden flex-shrink-0 border border-black/5">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" />
                        <div className="absolute top-1 right-1 bg-gold-500 text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm">{item.quantity}</div>
                      </div>
                      <div className="flex flex-col justify-center gap-1">
                        <p className="text-sm font-medium text-primary-950 leading-tight">{item.name}</p>
                        <p className="text-[10px] uppercase text-gold-600 font-bold tracking-wider">Size: {item.size || 'Standard'}</p>
                        <p className="text-sm font-bold text-primary-950">{formatPrice(item.price)}</p>
                      </div>
                    </div>
                  ))}
               </div>

               <div className="space-y-4 pt-5 border-t border-black/5">
                 {appliedCoupon && (
                   <div className="mb-4 pb-4 border-b border-black/5">
                     <div className="bg-[#F9F7F4] border border-[#8A6A4A]/20 p-3 rounded-sm flex flex-col items-center text-center">
                       <span className="text-[10px] md:text-[11px] uppercase tracking-[1px] font-bold text-[#8A6A4A] flex items-center gap-1 mb-1"><ShieldCheck size={12} /> Coupon Applied</span>
                       <span className="font-serif text-sm md:text-base text-primary-950 font-bold mb-0.5">{appliedCoupon}</span>
                       <span className="text-[9px] md:text-[10px] text-primary-950/60 font-medium mb-2.5 uppercase tracking-wider">{discountMultiplier * 100}% OFF Applied Successfully</span>
                       <span className="text-[11px] md:text-[12px] font-bold text-[#4CAF50] bg-[#4CAF50]/10 px-3 py-1.5 rounded-sm w-full">You Saved {formatPrice(totalDiscount)}</span>
                       <button type="button" onClick={handleRemoveCoupon} className="mt-2 text-[9px] uppercase font-bold text-primary-950/40 hover:text-red-500 transition-colors tracking-widest underline underline-offset-4">
                         Remove Coupon
                       </button>
                     </div>
                   </div>
                 )}

                 <div className="flex gap-2">
                   <input 
                     type="text" value={couponInput} onChange={(e) => setCouponInput(e.target.value)}
                     placeholder="ENTER COUPON CODE"
                     className="flex-1 bg-primary-50/20 border border-black/10 px-3 md:px-4 py-2.5 text-[10px] md:text-xs text-primary-950 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 outline-none uppercase font-bold tracking-widest rounded-sm placeholder:text-primary-950/30"
                   />
                   <button type="button" onClick={handleApplyCoupon} className="bg-primary-950 text-white px-5 py-2.5 text-[9px] md:text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-black transition-colors">Apply</button>
                 </div>
                 {couponError && <p className="text-red-500 text-[9px] font-bold uppercase tracking-widest mt-1 ml-1">{couponError}</p>}
                 <p className="text-[8px] uppercase font-medium text-primary-950/40 mt-1 mb-2 ml-1 tracking-wider">Only one coupon can be applied per order.</p>
                 
                 <div className="space-y-2.5 text-xs font-medium text-primary-950/60">
                   <div className="flex justify-between items-center text-primary-950">
                     <span>MRP Subtotal</span>
                     <span className="font-bold">{formatPrice(subtotalMRP)}</span>
                   </div>
                   <div className="flex justify-between items-center text-gold-700">
                     <span>Discount</span>
                     <span className="font-bold">-{formatPrice(totalDiscount)}</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span>Shipping</span>
                     <span className="text-gold-700 font-bold">FREE</span>
                   </div>
                 </div>

                 <div className="pt-4 md:pt-5 border-t border-black/5 flex justify-between items-end">
                   <span className="text-sm md:text-base font-medium text-primary-950">Grand Total</span>
                   <span className="text-xl md:text-2xl font-bold text-primary-950">{formatPrice(total)}</span>
                 </div>
               </div>

               <div className="mt-5 pt-5 border-t border-black/5 space-y-2.5">
                 <div className="flex items-center justify-center gap-2 text-[9px] uppercase tracking-[1px] font-bold text-primary-950/40">
                   <ShieldCheck size={14} strokeWidth={2} className="text-gold-500" /> Secure Encryption
                 </div>
                 <div className="flex items-center justify-center gap-2 text-[9px] uppercase tracking-[1px] font-bold text-primary-950/40">
                   <Truck size={14} strokeWidth={2} className="text-gold-500" /> Fast Insured Transit
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
