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
    }
  }, [appliedCoupon]);

  const subtotalMRP = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = 0;
  
  const activeCoupon = appliedCoupon || "VIP50";
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
      const pinCodeValue = formData.get("pinCode")?.toString() || "";

      const errors: Record<string, string> = {};
      if (!fullName.trim()) errors.firstName = "Full name is required";
      if (!/^\d{10}$/.test(mobileNumber.trim())) errors.mobileNumber = "10-digit mobile number required";
      if (!address.trim()) errors.address = "Detailed address is required";
      if (!/^\d{6}$/.test(pinCodeValue.trim())) errors.pinCode = "6-digit PIN code required";

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        setIsSubmitting(false);
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
    <div className="bg-primary-50 min-h-screen">
      <SEO
        title="Checkout | Mukesh Saree Centre"
        description="Complete your luxury ethnic wear purchase at Mukesh Saree Centre."
        url="/checkout"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-12 border-b border-black/5 pb-8">
          <h1 className="text-3xl md:text-4xl font-serif text-primary-950 font-normal">Checkout</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Form */}
          <div className="lg:col-span-7">
            <form id="checkout-form" onSubmit={handleSubmit} noValidate className="space-y-12">
              {/* Delivery Section */}
              <section className="bg-white p-8 border border-black/5 rounded-sm shadow-sm">
                <h2 className="text-xl font-serif text-primary-950 mb-8 font-medium pb-4 border-b border-black/5 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gold-500/10 text-gold-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  Delivery Details
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                     <label className="text-xs uppercase tracking-wider text-primary-950/60 font-bold ml-1">Full Name *</label>
                     <input 
                       required name="firstName" type="text"
                       className={`w-full bg-primary-50/50 border ${formErrors.firstName ? "border-red-500" : "border-black/10"} px-5 py-4 text-primary-950 focus:border-gold-500 outline-none transition-all rounded-sm font-medium`}
                       placeholder="Enter your full name"
                     />
                     {formErrors.firstName && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1">{formErrors.firstName}</p>}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs uppercase tracking-wider text-primary-950/60 font-bold ml-1">Mobile Number *</label>
                       <input 
                         required name="mobileNumber" type="tel"
                         className={`w-full bg-primary-50/50 border ${formErrors.mobileNumber ? "border-red-500" : "border-black/10"} px-5 py-4 text-primary-950 focus:border-gold-500 outline-none transition-all rounded-sm font-medium`}
                         placeholder="10-digit number"
                       />
                       {formErrors.mobileNumber && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1">{formErrors.mobileNumber}</p>}
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs uppercase tracking-wider text-primary-950/60 font-bold ml-1">Email (Optional)</label>
                       <input 
                         name="email" type="email"
                         className="w-full bg-primary-50/50 border border-black/10 px-5 py-4 text-primary-950 focus:border-gold-500 outline-none transition-all rounded-sm font-medium"
                         placeholder="email@example.com"
                       />
                    </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs uppercase tracking-wider text-primary-950/60 font-bold ml-1">Shipping Address *</label>
                     <input 
                       required name="address" type="text"
                       className={`w-full bg-primary-50/50 border ${formErrors.address ? "border-red-500" : "border-black/10"} px-5 py-4 text-primary-950 focus:border-gold-500 outline-none transition-all rounded-sm font-medium`}
                       placeholder="House no, Street name, Landmark"
                     />
                     {formErrors.address && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1">{formErrors.address}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs uppercase tracking-wider text-primary-950/60 font-bold ml-1">City</label>
                       <input name="city" type="text" className="w-full bg-primary-50/50 border border-black/10 px-5 py-4 text-primary-950 focus:border-gold-500 outline-none transition-all rounded-sm font-medium" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs uppercase tracking-wider text-primary-950/60 font-bold ml-1">PIN Code *</label>
                       <input 
                         required name="pinCode" type="text"
                         className={`w-full bg-primary-50/50 border ${formErrors.pinCode ? "border-red-500" : "border-black/10"} px-5 py-4 text-primary-950 focus:border-gold-500 outline-none transition-all rounded-sm font-medium`}
                         placeholder="6-digit PIN"
                       />
                       {formErrors.pinCode && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1">{formErrors.pinCode}</p>}
                    </div>
                  </div>
                </div>
              </section>

              {/* Payment Section */}
              <section className="bg-white p-8 border border-black/5 rounded-sm shadow-sm">
                <h2 className="text-xl font-serif text-primary-950 mb-8 font-medium pb-4 border-b border-black/5 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gold-500/10 text-gold-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  Payment Method
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <label className={`relative p-6 border rounded-sm cursor-pointer transition-all ${paymentMethod === 'online' ? 'bg-primary-50/50 border-gold-500 shadow-sm' : 'border-black/5 hover:border-black/20'}`}>
                     <input type="radio" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} className="hidden" />
                     <div className="flex flex-col gap-1">
                       <span className="text-sm font-bold text-primary-950">Pay Online</span>
                       <span className="text-[10px] uppercase font-bold text-gold-600 tracking-wider">UPI / Cards / NetBanking</span>
                       <p className="mt-3 text-[11px] text-primary-950/40 leading-relaxed font-medium">Safe & Secure via Razorpay</p>
                     </div>
                   </label>
                   <label className={`relative p-6 border rounded-sm cursor-pointer transition-all ${paymentMethod === 'cod' ? 'bg-primary-50/50 border-gold-500 shadow-sm' : 'border-black/5 hover:border-black/20'}`}>
                     <input type="radio" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="hidden" />
                     <div className="flex flex-col gap-1">
                       <span className="text-sm font-bold text-primary-950">Cash on Delivery</span>
                       <span className="text-[10px] uppercase font-bold text-primary-950/30 tracking-wider">Pay when you receive</span>
                       <p className="mt-3 text-[11px] text-primary-950/40 leading-relaxed font-medium">Available for select locations</p>
                     </div>
                   </label>
                </div>
              </section>

              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="btn-primary w-full gap-4"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <>Complete Purchase <ArrowRight size={20} /></>}
              </button>
            </form>
          </div>

          {/* Checkout Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white p-8 border border-black/5 rounded-sm shadow-xl shadow-black/[0.02] lg:sticky lg:top-32">
               <h2 className="text-xl font-serif text-primary-950 mb-8 font-medium">Order Review</h2>
               
               <div className="space-y-6 mb-10 max-h-[40vh] overflow-y-auto pr-2 no-scrollbar">
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

               <div className="space-y-6 pt-8 border-t border-black/5">
                 {appliedCoupon ? (
                   <div className="mb-4 pb-4 border-b border-black/5">
                     <div className="bg-[#F9F7F4] border border-[#8A6A4A]/20 p-4 rounded-sm flex flex-col items-center text-center">
                       <span className="text-[12px] uppercase tracking-[1px] font-bold text-[#8A6A4A] flex items-center gap-1.5 mb-1"><ShieldCheck size={16} /> Coupon Applied</span>
                       <span className="font-serif text-lg text-primary-950 font-bold mb-1">{appliedCoupon}</span>
                       <span className="text-[11px] text-primary-950/60 font-medium mb-3 uppercase tracking-wider">{discountMultiplier * 100}% OFF Applied Successfully</span>
                       <span className="text-[13px] font-bold text-[#4CAF50] bg-[#4CAF50]/10 px-3 py-1.5 rounded-sm w-full">You Saved {formatPrice(totalDiscount)}</span>
                       <button type="button" onClick={handleRemoveCoupon} className="mt-3 text-[10px] uppercase font-bold text-primary-950/40 hover:text-red-500 transition-colors tracking-widest underline underline-offset-4">
                         Remove Coupon
                       </button>
                     </div>
                   </div>
                 ) : (
                   <div className="mb-4 pb-4 border-b border-black/5">
                     <div className="bg-[#F9F7F4] border border-[#8A6A4A]/20 p-4 rounded-sm flex flex-col items-center text-center">
                       <span className="text-[12px] uppercase tracking-[1px] font-bold text-[#8A6A4A] flex items-center gap-1.5 mb-1"><ShieldCheck size={16} /> Coupon Applied</span>
                       <span className="font-serif text-lg text-primary-950 font-bold mb-1">VIP50</span>
                       <span className="text-[11px] text-primary-950/60 font-medium mb-3 uppercase tracking-wider">50% OFF Applied Successfully</span>
                       <span className="text-[13px] font-bold text-[#4CAF50] bg-[#4CAF50]/10 px-3 py-1.5 rounded-sm w-full">You Saved {formatPrice(totalDiscount)}</span>
                     </div>
                   </div>
                 )}

                 <div className="flex gap-2">
                   <input 
                     type="text" value={couponInput} onChange={(e) => setCouponInput(e.target.value)}
                     placeholder="ENTER COUPON CODE"
                     className="flex-1 bg-primary-50 border border-black/5 px-4 py-3 text-xs text-primary-950 focus:border-gold-500 outline-none uppercase font-bold tracking-widest rounded-sm"
                   />
                   <button type="button" onClick={handleApplyCoupon} className="bg-primary-950 text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-black transition-colors">Apply</button>
                 </div>
                 {couponError && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-2">{couponError}</p>}
                 <p className="text-[9px] uppercase font-medium text-primary-950/40 mt-1 mb-4 tracking-wider">Only one coupon can be applied per order.</p>
                 
                 <div className="space-y-4 text-sm font-medium text-primary-950/60">
                   <div className="flex justify-between items-center text-primary-950">
                     <span>MRP Subtotal</span>
                     <span className="font-bold">{formatPrice(subtotalMRP)}</span>
                   </div>
                   <div className="flex justify-between items-center text-[#8A6A4A]">
                     <span>Discount</span>
                     <span className="font-bold">-{formatPrice(totalDiscount)}</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span>Shipping</span>
                     <span className="text-[#8A6A4A] font-bold">FREE</span>
                   </div>
                 </div>

                 <div className="pt-6 border-t border-black/5 flex justify-between items-end">
                   <span className="text-lg font-medium text-primary-950">Grand Total</span>
                   <span className="text-3xl font-bold text-primary-950">{formatPrice(total)}</span>
                 </div>
               </div>

               <div className="mt-8 pt-8 border-t border-black/5 space-y-4">
                 <div className="flex items-center gap-3 text-[10px] uppercase tracking-[1px] font-bold text-primary-950/40">
                   <ShieldCheck size={16} strokeWidth={2} className="text-gold-500" /> Secure Encryption
                 </div>
                 <div className="flex items-center gap-3 text-[10px] uppercase tracking-[1px] font-bold text-primary-950/40">
                   <Truck size={16} strokeWidth={2} className="text-gold-500" /> Fast Insured Transit
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
