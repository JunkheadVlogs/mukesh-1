import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { SEO } from "./components/SEO";
import { useStore } from "./store";
import { formatPrice, optimizeImage, getImageAlt } from "./utils";
import { OptimizedImage } from "./components/OptimizedImage";
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, ShoppingBag } from "lucide-react";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, appliedCoupon } =
    useStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Preload Razorpay script on Cart page for faster checkout
    if (!document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      const script = document.createElement('script');
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 min-h-[70vh] flex flex-col items-center justify-center text-center bg-primary-50">
        <div className="relative z-10 space-y-8 max-w-2xl w-full">
          <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full flex items-center justify-center bg-white shadow-[0_0_40px_rgba(0,0,0,0.03)] mb-4 md:mb-8 border border-black/5 animate-pulse">
            <ShoppingBag size={48} className="text-gold-500/60" strokeWidth={1} />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-serif text-primary-950 font-normal">Your Cart is Empty</h2>
            <p className="text-primary-950/60 font-medium text-sm md:text-base max-w-md mx-auto leading-relaxed">
              Looks like you haven't added anything to your cart yet. Discover our latest collection.
            </p>
          </div>
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Link 
              to="/shop?category=Sarees" 
              className="px-6 py-4 bg-white border border-black/5 hover:border-gold-500/50 rounded-sm hover:shadow-lg transition-all duration-300 group flex flex-col items-center gap-2 transform hover:-translate-y-1"
            >
              <span className="text-sm font-bold uppercase tracking-wider text-primary-950 group-hover:text-gold-600 transition-colors">Sarees</span>
              <span className="text-[10px] uppercase font-medium text-primary-950/40 tracking-widest flex items-center gap-1 group-hover:text-gold-500 transition-colors">Shop Now <ArrowRight size={12} /></span>
            </Link>
            <Link 
              to="/shop?category=Lehengas" 
              className="px-6 py-4 bg-white border border-black/5 hover:border-gold-500/50 rounded-sm hover:shadow-lg transition-all duration-300 group flex flex-col items-center gap-2 transform hover:-translate-y-1"
            >
              <span className="text-sm font-bold uppercase tracking-wider text-primary-950 group-hover:text-gold-600 transition-colors">Lehengas</span>
              <span className="text-[10px] uppercase font-medium text-primary-950/40 tracking-widest flex items-center gap-1 group-hover:text-gold-500 transition-colors">Shop Now <ArrowRight size={12} /></span>
            </Link>
            <Link 
              to="/shop?category=Co-Ord Sets" 
              className="px-6 py-4 bg-white border border-black/5 hover:border-gold-500/50 rounded-sm hover:shadow-lg transition-all duration-300 group flex flex-col items-center gap-2 sm:col-span-2 md:col-span-1 transform hover:-translate-y-1"
            >
              <span className="text-sm font-bold uppercase tracking-wider text-primary-950 group-hover:text-gold-600 transition-colors">Co-Ord Sets</span>
              <span className="text-[10px] uppercase font-medium text-primary-950/40 tracking-widest flex items-center gap-1 group-hover:text-gold-500 transition-colors">Shop Now <ArrowRight size={12} /></span>
            </Link>
          </div>
          <div className="pt-8">
            <Link 
              to="/shop" 
              className="btn-primary inline-flex items-center justify-center gap-3 w-full sm:w-auto"
            >
              View All Products <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");

  const subtotalMRP = cart.reduce((total, item) => total + (item.originalPrice || item.price * 2) * item.quantity, 0);
  const activeCoupon = appliedCoupon ? appliedCoupon.trim().toUpperCase() : null;

  const discountRate = (activeCoupon === "VIPCLUB60" || activeCoupon === "VIBCLUB60") ? 0.60 : 0.50;
  const discountAmount = Math.round(subtotalMRP * discountRate);
  const total = subtotalMRP - discountAmount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === "VIP50" || code === "VIPCLUB65" || code === "VIPCLUB60" || code === "VIBCLUB60") {
      sessionStorage.removeItem('coupon_removed');
      useStore.getState().applyCoupon(code === "VIBCLUB60" ? "VIPCLUB60" : code);
      setCouponCode("");
      setCouponError("");
    } else {
      setCouponError("Invalid Coupon Code");
    }
  };

  const handleRemoveCoupon = () => {
    sessionStorage.setItem('coupon_removed', 'true');
    useStore.getState().applyCoupon(null);
  };

  return (
    <div className="bg-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-6 pb-20 sm:pb-8 md:py-12">
        <SEO
          title="Shopping Cart | Mukesh Saree Centre"
          description="Review your selection of premium ethnic wear at Mukesh Saree Centre. Securely manage your cart items and proceed to checkout for a seamless experience today."
          url="/cart"
        />
        
        <header className="mb-3.5 sm:mb-6 md:mb-12 border-b border-black/5 pb-2.5 sm:pb-4 md:pb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif text-primary-950 font-normal">Shopping Cart</h1>
          <p className="text-primary-950/50 text-[12px] sm:text-sm mt-1 sm:mt-2">{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 lg:gap-12">
          <div className="lg:col-span-8 space-y-3.5 sm:space-y-6 md:space-y-8">
            {cart.map((item) => {
              const mrp = item.originalPrice || item.price * 2;
              const discountRate = (activeCoupon === "VIPCLUB60" || activeCoupon === "VIBCLUB60") ? 0.60 : 0.50;
              const calculatedPrice = mrp - Math.round(mrp * discountRate);
              const itemTotal = calculatedPrice * item.quantity;
              const itemMRP = mrp * item.quantity;
              return (
                <div
                  key={`${item.id}-${item.size}`}
                  className="flex flex-row gap-3 sm:gap-4 md:gap-6 pb-3.5 sm:pb-6 md:pb-8 border-b border-black/5 last:border-0"
                >
                  <div className="w-20 sm:w-32 aspect-[3/4] flex-shrink-0 rounded-sm overflow-hidden border border-black/5 shadow-sm flex items-center justify-center p-0" style={{ backgroundColor: '#FAF8F5' }}>
                    <OptimizedImage
                      src={item.image}
                      width={400}
                      alt={getImageAlt(item)}
                      className="w-full h-full object-contain object-center will-change-transform transform-gpu"
                    />
                  </div>
                  <div className="flex-grow flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex justify-between items-start mb-0.5 sm:mb-2 gap-2">
                        <h3 className="text-[12.5px] sm:text-base md:text-xl font-serif text-primary-950 font-medium line-clamp-2 md:line-clamp-none pr-1 focus:outline-none">
                          <Link to={`/product/${item.slug}`} className="hover:text-gold-500 transition-colors">{item.name}</Link>
                        </h3>
                        <div className="flex flex-col items-end whitespace-nowrap pl-1">
                          <p className="text-[13px] sm:text-base md:text-lg font-sans font-bold text-primary-950">
                            {formatPrice(itemTotal)}
                          </p>
                          {item.originalPrice && (
                            <>
                              <p className="text-[9px] sm:text-xs text-primary-950/40 line-through font-medium leading-none mt-0.5">
                                {formatPrice(itemMRP)}
                              </p>
                              <p className="text-[8px] sm:text-[10px] uppercase tracking-[0.5px] sm:tracking-[1px] font-bold text-[#8A6A4A] mt-0.5 leading-none">
                                {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-x-2 gap-y-0.5 sm:gap-4 text-[9.5px] sm:text-xs font-medium uppercase tracking-wider text-primary-950/50">
                        <p>Category: {item.category}</p>
                        {item.size && <p className="text-[#8A6A4A] font-semibold">Size: {item.size}</p>}
                      </div>
                    </div>

                    <div className="mt-2.5 sm:mt-5 flex items-center justify-between">
                      <div className="flex items-center border border-black/10 bg-white h-[28px] sm:h-[34px] px-0.5 sm:px-1 rounded-sm shadow-sm">
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.size, item.quantity - 1)} 
                          className="w-7 sm:w-9 h-full flex items-center justify-center text-primary-950/65 hover:text-primary-950 active:scale-90 transition-all"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={11} strokeWidth={2.5} />
                        </button>
                        <span className="w-6 sm:w-8 text-center text-[11px] sm:text-[12px] font-bold text-primary-950 select-none">{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.size, item.quantity + 1)} 
                          className="w-7 sm:w-9 h-full flex items-center justify-center text-primary-950/65 hover:text-primary-950 active:scale-90 transition-all0"
                          aria-label="Increase quantity"
                        >
                          <Plus size={11} strokeWidth={2.5} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="text-[9px] sm:text-[10px] uppercase tracking-[2px] text-primary-950/50 hover:text-red-600 flex items-center gap-1.5 md:gap-2 transition-all font-bold h-[28px] sm:h-[34px]"
                      >
                        <Trash2 size={13} strokeWidth={2.2} /> <span className="hidden sm:inline">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Section */}
          <div className="lg:col-span-4 mt-2 lg:mt-0">
            <div className="bg-white p-4 sm:p-5 md:p-8 pt-2 sm:pt-2.5 md:pt-6 border border-black/5 rounded-sm shadow-xl shadow-black/[0.01] lg:sticky lg:top-32">
              <h2 className="text-base sm:text-lg md:text-xl font-serif text-primary-950 mb-3 sm:mb-4 md:mb-6 font-medium">Order Summary</h2>
              
              {appliedCoupon ? (
                <div className="mb-3 sm:mb-4 pb-3 sm:pb-3.5 border-b border-black/5">
                  <div className="bg-[#FAF9F6] border border-[#8A6A4A]/20 px-3 py-2.5 rounded-sm flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0 text-left">
                      <ShieldCheck size={14} className="text-[#8A6A4A] shrink-0" />
                      <div className="min-w-0">
                        <span className="block text-[11px] font-bold text-primary-950 uppercase tracking-wider truncate">
                          ✓ {appliedCoupon} APPLIED
                        </span>
                        <span className="block text-[9px] text-[#4CAF50] font-bold uppercase tracking-wider mt-0.5">
                          {(activeCoupon === "VIPCLUB60" || activeCoupon === "VIBCLUB60") ? "60% OFF ON MRP SUCCESSFULLY APPLIED" : "50% OFF ON MRP SUCCESSFULLY APPLIED"}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-[9.5px] uppercase font-bold text-red-500 hover:underline tracking-wider select-none shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-2 sm:mb-3 pb-2 sm:pb-3 border-b border-black/5">
                  <div className="text-[9.5px] font-bold text-emerald-600 mb-2 uppercase tracking-wide text-left">
                    ✨ DEFAULT 50% OFF AUTO-APPLIED! ENTER VIPCLUB60 TO UPGRADE:
                  </div>
                  <form onSubmit={handleApplyCoupon} className="flex items-stretch gap-2 w-full">
                     <input
                       type="text"
                       value={couponCode}
                       onChange={(e) => setCouponCode(e.target.value)}
                       placeholder="ENTER COUPON CODE"
                       className="flex-grow min-w-0 bg-[#F9F7F4] border border-black/10 rounded-sm px-3 h-9 sm:h-10 text-[9.5px] sm:text-[10.5px] text-primary-950 placeholder:text-primary-950/40 focus:outline-none focus:border-gold-500 uppercase font-medium tracking-wide"
                     />
                     <button 
                       type="submit" 
                       className="flex-shrink-0 bg-primary-950 text-gold-400 border border-primary-950 hover:border-primary-900 px-4 sm:px-5 h-9 sm:h-10 rounded-sm text-[9.5px] sm:text-[10.5px] uppercase font-bold tracking-wider hover:bg-primary-900 transition-colors flex items-center justify-center"
                     >
                       Apply
                     </button>
                    </form>
                    {couponError && (
                      <p className="text-red-500 text-[9px] font-bold uppercase tracking-wider mt-1">{couponError}</p>
                    )}
                    <p className="text-[8.5px] uppercase font-medium text-primary-950/40 mt-1 tracking-wider text-left">Only one coupon can be applied per order.</p>
                </div>
              )}

              <div className="space-y-2.5 sm:space-y-3.5 mb-4 sm:mb-6 text-[11.5px] sm:text-xs md:text-sm font-medium text-primary-950/60 font-sans text-left">
                <div className="flex justify-between">
                  <span>MRP Total</span>
                  <span className="text-primary-950 font-bold">{formatPrice(subtotalMRP)}</span>
                </div>
                
                {(activeCoupon === "VIP55" || activeCoupon === "VIP50" || !activeCoupon) && (
                  <div className="flex justify-between text-[#1E7E34]">
                    <span>VIP50 Applied</span>
                    <span className="font-bold">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                {(activeCoupon === "VIPCLUB60" || activeCoupon === "VIBCLUB60") && (
                  <div className="flex justify-between text-[#1E7E34]">
                    <span>VIPCLUB60 Applied</span>
                    <span className="font-bold">-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-[#1E7E34] font-bold">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>GST & All Taxes Included</span>
                  <span className="text-[#2C241B]/45 font-medium">Included</span>
                </div>
                <div className="pt-2.5 sm:pt-4 border-t border-black/5 flex justify-between items-center gap-2">
                  <span className="text-sm sm:text-base md:text-lg font-serif text-primary-950 font-normal">Grand Total</span>
                  <span className="text-base sm:text-xl md:text-2xl font-bold text-primary-950">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="btn-primary w-full gap-2.5 sm:gap-3 py-2.5 sm:py-3.5"
              >
                Checkout Now <ArrowRight size={16} />
              </button>

              <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-black/5">
                <div className="flex flex-col space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center group cursor-default">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={13} className="text-[var(--color-gold-dark)] opacity-70 group-hover:opacity-100 transition-opacity" />
                      <span className="text-[9.5px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.1em] font-medium text-[var(--color-dark)] opacity-80 group-hover:opacity-100 transition-opacity">Secure SSL Encryption</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center group cursor-default">
                    <div className="flex items-center gap-2">
                      <Truck size={13} className="text-[var(--color-gold-dark)] opacity-70 group-hover:opacity-100 transition-opacity" />
                      <span className="text-[9.5px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.1em] font-medium text-[var(--color-dark)] opacity-80 group-hover:opacity-100 transition-opacity">Verified Quality Check</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
