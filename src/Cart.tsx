import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { SEO } from "./components/SEO";
import { useStore } from "./store";
import { formatPrice, optimizeImage } from "./utils";
import { OptimizedImage } from "./components/OptimizedImage";
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, ShoppingBag } from "lucide-react";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, appliedCoupon } =
    useStore();
  const navigate = useNavigate();

  const handleQuantityChange = (
    id: string,
    size: string | undefined,
    qty: number,
  ) => {
    if (qty < 1) return;
    updateQuantity(id, size, qty);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[70vh] flex flex-col items-center justify-center text-center bg-primary-50">
        <div className="relative z-10 space-y-8">
          <div className="w-20 h-20 mx-auto border border-black/5 rounded-full flex items-center justify-center bg-white shadow-sm mb-6">
            <ShoppingBag size={32} className="text-primary-950/20" strokeWidth={1} />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-serif text-primary-950 font-normal">Your Cart is Empty</h2>
            <p className="text-primary-950/50 font-medium text-sm max-w-sm mx-auto leading-relaxed">
              Looks like you haven't added anything to your cart yet. Discover our latest collection.
            </p>
          </div>
          <div className="pt-4">
            <Link 
              to="/shop" 
              className="btn-primary"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");

  const subtotalMRP = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const activeCoupon = appliedCoupon || "VIP50";

  let discountMultiplier = 0;
  if (activeCoupon === "VIP50") discountMultiplier = 0.50;
  else if (activeCoupon === "VIPCLUB60") discountMultiplier = 0.60;

  const totalDiscount = Math.floor(subtotalMRP * discountMultiplier);
  const shipping = 0;
  const total = Math.max(0, subtotalMRP - totalDiscount);
  
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === "VIP50" || code === "VIPCLUB60") {
      useStore.getState().applyCoupon(code);
      setCouponCode("");
      setCouponError("");
    } else {
      setCouponError("Invalid Coupon Code");
    }
  };

  const handleRemoveCoupon = () => {
    // When removing the active coupon, it goes back to no coupon (null).
    // Or maybe if we want VIP50 auto-applied, we just set appliedCoupon to null but it falls back to VIP50?
    // Wait, if they remove VIP50, they might want to pay full price? Probably not.
    // Let's just set it to null. If they remove, it will fall back to VIP50 because of our `activeCoupon` logic, 
    // unless we strictly separate `appliedCoupon` and let them have nothing.
    // If we want them to have 0 discount when they remove it:
    useStore.getState().applyCoupon(null);
  };

  return (
    <div className="bg-primary-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <SEO
          title="Shopping Cart | Mukesh Saree Centre"
          description="Review your selection of premium ethnic wear at Mukesh Saree Centre. Securely manage your cart items and proceed to checkout for a seamless experience today."
          url="/cart"
        />
        
        <header className="mb-6 md:mb-12 border-b border-black/5 pb-4 md:pb-8">
          <h1 className="text-3xl md:text-4xl font-serif text-primary-950 font-normal">Shopping Cart</h1>
          <p className="text-primary-950/50 text-sm mt-2">{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-8 space-y-6 md:space-y-8">
            {cart.map((item) => {
              const itemMRP = item.price * item.quantity;
              const itemSellingPrice = Math.floor(item.price * 0.5) * item.quantity;
              return (
                <div
                  key={`${item.id}-${item.size}`}
                  className="flex flex-row gap-4 md:gap-6 pb-6 md:pb-8 border-b border-black/5 last:border-0"
                >
                  <div className="w-24 sm:w-32 aspect-[3/4] flex-shrink-0 bg-white rounded-sm overflow-hidden border border-black/5 shadow-sm">
                    <OptimizedImage
                      src={item.image}
                      width={400}
                      alt={item.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="flex-grow flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start mb-1 md:mb-2 gap-2">
                        <h3 className="text-sm md:text-xl font-serif text-primary-950 font-medium line-clamp-2 md:line-clamp-none pr-2">
                          <Link to={`/product/${item.slug}`} className="hover:text-gold-500 transition-colors">{item.name}</Link>
                        </h3>
                        <div className="flex flex-col items-end whitespace-nowrap">
                          <p className="text-sm md:text-lg font-sans font-bold text-primary-950">
                            {formatPrice(itemSellingPrice)}
                          </p>
                          <p className="text-[10px] md:text-xs text-primary-950/40 line-through font-medium">
                            MRP {formatPrice(itemMRP)}
                          </p>
                          <p className="text-[9px] md:text-[10px] uppercase tracking-[1px] font-bold text-[#8A6A4A] mt-0.5">
                            50% OFF
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 md:gap-4 text-[10px] md:text-xs font-medium uppercase tracking-wider text-primary-950/50">
                        <p>Category: {item.category}</p>
                        {item.size && <p className="text-gold-600">Size: {item.size}</p>}
                      </div>
                    </div>

                    <div className="mt-4 md:mt-6 flex items-center justify-between">
                      <div className="flex items-center border border-black/10 bg-white h-8 md:h-10 px-1 rounded-sm shadow-sm">
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.size, item.quantity - 1)} 
                          className="w-6 md:w-8 flex justify-center text-primary-950/40 hover:text-primary-950 transition-all font-bold"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 md:w-10 text-center text-[12px] md:text-[13px] font-bold text-primary-950">{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.size, item.quantity + 1)} 
                          className="w-6 md:w-8 flex justify-center text-primary-950/40 hover:text-primary-950 transition-all font-bold"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="text-[9px] md:text-[10px] uppercase tracking-[2px] text-primary-950/30 hover:text-red-500 flex items-center gap-1.5 md:gap-2 transition-all font-bold"
                      >
                        <Trash2 size={14} strokeWidth={2} /> <span className="hidden sm:inline">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Section */}
          <div className="lg:col-span-4">
            <div className="bg-white p-5 md:p-8 border border-black/5 rounded-sm shadow-xl shadow-black/[0.02] lg:sticky lg:top-32">
              <h2 className="text-lg md:text-xl font-serif text-primary-950 mb-4 md:mb-6 font-medium">Order Summary</h2>
              
              {appliedCoupon ? (
                <div className="mb-4 pb-4 border-b border-black/5">
                  <div className="bg-[#F9F7F4] border border-[#8A6A4A]/20 p-4 rounded-sm flex flex-col items-center text-center">
                    <span className="text-[12px] uppercase tracking-[1px] font-bold text-[#8A6A4A] flex items-center gap-1.5 mb-1"><ShieldCheck size={16} /> Coupon Applied</span>
                    <span className="font-serif text-lg text-primary-950 font-bold mb-1">{appliedCoupon}</span>
                    <span className="text-[11px] text-primary-950/60 font-medium mb-3 uppercase tracking-wider">{discountMultiplier * 100}% OFF Applied Successfully</span>
                    <span className="text-[13px] font-bold text-[#4CAF50] bg-[#4CAF50]/10 px-3 py-1.5 rounded-sm w-full">You Saved {formatPrice(totalDiscount)}</span>
                    <button onClick={handleRemoveCoupon} className="mt-3 text-[10px] uppercase font-bold text-primary-950/40 hover:text-red-500 transition-colors tracking-widest underline underline-offset-4">
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

              <div className="mb-6 pb-6 border-b border-black/5">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                   <input
                     type="text"
                     value={couponCode}
                     onChange={(e) => setCouponCode(e.target.value)}
                     placeholder="Enter Coupon Code"
                     className="flex-1 bg-[#F9F7F4] border border-black/10 rounded-sm px-3 py-2 text-xs text-primary-950 placeholder:text-primary-950/40 focus:outline-none focus:border-gold-500 uppercase font-medium tracking-wide"
                   />
                   <button 
                     type="submit" 
                     className="bg-primary-950 text-gold-400 px-4 rounded-sm text-[10px] uppercase font-bold tracking-widest hover:bg-primary-900 transition-colors"
                   >
                     Apply
                   </button>
                 </form>
                 {couponError && (
                   <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-2">{couponError}</p>
                 )}
                 <p className="text-[9px] uppercase font-medium text-primary-950/40 mt-2 tracking-wider">Only one coupon can be applied per order.</p>
              </div>

              <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                <div className="flex justify-between text-xs md:text-sm text-primary-950/60 font-medium">
                  <span>MRP Subtotal</span>
                  <span className="text-primary-950 font-bold">{formatPrice(subtotalMRP)}</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm text-[#8A6A4A] font-medium">
                  <span>Discount</span>
                  <span className="font-bold">-{formatPrice(totalDiscount)}</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm text-primary-950/60 font-medium">
                  <span>Shipping</span>
                  <span className="text-[#8A6A4A] font-bold">FREE</span>
                </div>
                <div className="pt-4 border-t border-black/5 flex justify-between items-center">
                  <span className="text-base md:text-lg font-medium text-primary-950">Total</span>
                  <span className="text-xl md:text-2xl font-bold text-primary-950">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="btn-primary w-full gap-3"
              >
                Checkout Now <ArrowRight size={18} />
              </button>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-[10px] uppercase tracking-[1px] font-bold text-primary-950/30">
                  <ShieldCheck size={16} strokeWidth={2} className="text-gold-500" /> Secure SSL Encryption
                </div>
                <div className="flex items-center gap-3 text-[10px] uppercase tracking-[1px] font-bold text-primary-950/30">
                  <Truck size={16} strokeWidth={2} className="text-gold-500" /> Verified Quality Check
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
