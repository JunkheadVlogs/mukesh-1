import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { SEO } from "./components/SEO";
import { useStore } from "./store";
import { trackRemoveFromCart } from "./tracking";
import { formatPrice, getImageAlt } from "./utils";
import { OptimizedImage } from "./components/OptimizedImage";
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, ShoppingBag } from "lucide-react";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, appliedCoupon } = useStore();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");

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
      <div className="bg-[#faf8f6] min-h-[70vh] flex flex-col items-center justify-center py-16 px-4 text-center">
        <SEO
          title="Shopping Cart | Mukesh Saree Centre"
          description="Your shopping cart is currently empty. Explore our handloom sarees, tissue sarees, linen sarees, and festive ethnic wear collection."
          url="/cart/"
        />
        <div className="max-w-md w-full space-y-6 bg-white p-8 md:p-10 border border-[#dfd9d5] rounded-[2px] shadow-xs">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#faf8f6] border border-[#dfd9d5] flex items-center justify-center text-[#8a2633]">
            <ShoppingBag size={36} strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-serif text-[#1f1b1b] font-medium">Your Shopping Cart is Empty</h1>
            <p className="text-[14px] text-[#6b6461] leading-relaxed">
              Looks like you haven't added any sarees to your cart yet. Discover our authentic weaver-direct collections.
            </p>
          </div>
          <div className="pt-2">
            <Link 
              to="/shop/" 
              className="w-full h-[48px] bg-[#8a2633] hover:bg-[#6f1d29] text-white font-medium text-[13px] uppercase tracking-[0.08em] rounded-[2px] inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Continue Shopping</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotalMRP = cart.reduce((total, item) => total + (item.originalPrice || item.price * 2) * item.quantity, 0);
  const activeCoupon = appliedCoupon ? appliedCoupon.trim().toUpperCase() : null;

  const hasPromotionalItem = cart.some(item => item.codAvailable === false || item.sku === 'SAR-LIN-BRD-062' || item.disallowVIP60 || item.sku === 'SAR-CHN-RED-001' || item.id === 'p-sindoor-red-ajrakh-chanderi');
  const total = cart.reduce((sum, item) => {
    const mrp = item.originalPrice || item.price * 2;
    const isVIP60Disallowed = item.disallowVIP60 || item.sku === 'SAR-CHN-RED-001' || item.id === 'p-sindoor-red-ajrakh-chanderi';
    const itemCoupon = (isVIP60Disallowed && (activeCoupon === "VIPCLUB60" || activeCoupon === "VIP60" || activeCoupon === "VIBCLUB60")) ? "VIP50" : activeCoupon;
    const discountRate = (itemCoupon === "VIPCLUB60" || itemCoupon === "VIP60" || itemCoupon === "VIBCLUB60") ? 0.60 : 0.50;
    const standardPrice = mrp - Math.round(mrp * discountRate);
    const calculatedPrice = (item.codAvailable === false || item.sku === 'SAR-LIN-BRD-062' || item.sku === 'SAR-GHU-MAR-001' || item.slug === 'maroon-ghungroo-tissue-saree-zari-border-lace')
      ? item.price
      : standardPrice;
    return sum + calculatedPrice * item.quantity;
  }, 0);
  const discountAmount = subtotalMRP - total;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === "VIP50" || code === "VIPCLUB65" || code === "VIPCLUB60" || code === "VIP60" || code === "VIBCLUB60") {
      const normalizedCode = (code === "VIP60" || code === "VIBCLUB60") ? "VIPCLUB60" : code;
      const allItemsDisallowVIP60 = cart.length > 0 && cart.every(item => item.disallowVIP60 || item.sku === 'SAR-CHN-RED-001' || item.id === 'p-sindoor-red-ajrakh-chanderi');
      if (normalizedCode === "VIPCLUB60" && allItemsDisallowVIP60) {
        setCouponError("VIPCLUB60 coupon is not applicable to items in your cart");
        return;
      }
      try {
        sessionStorage.removeItem('coupon_removed');
      } catch (e) {}
      useStore.getState().applyCoupon(normalizedCode);
      setCouponCode("");
      setCouponError("");
    } else {
      setCouponError("Invalid Coupon Code");
    }
  };

  const handleRemoveCoupon = () => {
    try {
      sessionStorage.setItem('coupon_removed', 'true');
    } catch (e) {}
    useStore.getState().applyCoupon(null);
  };

  return (
    <div className="bg-[#faf8f6] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-4 md:py-8">
        <SEO
          title="Shopping Cart | Mukesh Saree Centre"
          description="Review your selection of premium ethnic wear at Mukesh Saree Centre. Securely manage your cart items and proceed to checkout for a seamless experience today."
          url="/cart/"
        />
        
        <header className="mb-6 pb-4 border-b border-[#dfd9d5]">
          <h1 className="text-2xl sm:text-3xl font-serif text-[#1f1b1b] font-medium">Your Shopping Cart</h1>
          <p className="text-[#6b6461] text-[13px] mt-1">{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Cart Items (65% / ~7 cols on desktop) */}
          <div className="lg:col-span-7 divide-y divide-[#dfd9d5] border-t border-b border-[#dfd9d5]">
            {cart.map((item) => {
              const mrp = item.originalPrice || item.price * 2;
              const isVIP60Disallowed = item.disallowVIP60 || item.sku === 'SAR-CHN-RED-001' || item.id === 'p-sindoor-red-ajrakh-chanderi';
              const itemCoupon = (isVIP60Disallowed && (activeCoupon === "VIPCLUB60" || activeCoupon === "VIP60" || activeCoupon === "VIBCLUB60")) ? "VIP50" : activeCoupon;
              const discountRate = (itemCoupon === "VIPCLUB60" || itemCoupon === "VIBCLUB60") ? 0.60 : 0.50;
              const standardPrice = mrp - Math.round(mrp * discountRate);
              const calculatedPrice = (item.codAvailable === false || item.sku === 'SAR-LIN-BRD-062' || item.sku === 'SAR-GHU-MAR-001' || item.slug === 'maroon-ghungroo-tissue-saree-zari-border-lace')
                ? item.price
                : standardPrice;
              const itemTotal = calculatedPrice * item.quantity;
              const itemMRP = mrp * item.quantity;

              return (
                <div
                  key={`${item.id}-${item.size}`}
                  className="py-5 flex flex-row gap-4 sm:gap-6 items-start"
                >
                  {/* Stable 2:3 Portrait Product Image Stage: 112px x 168px desktop, 88px x 132px mobile */}
                  <div className="w-[88px] h-[132px] md:w-[112px] md:h-[168px] aspect-[2/3] shrink-0 bg-[#faf8f6] border border-[#dfd9d5] rounded-[2px] overflow-hidden relative">
                    <OptimizedImage
                      src={item.image}
                      width={160}
                      height={240}
                      alt={getImageAlt(item)}
                      loading="lazy"
                      fetchPriority="low"
                      decoding="async"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* Details & Controls */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h2 className="text-[14px] sm:text-[16px] font-sans font-medium text-[#1f1b1b] line-clamp-2 leading-snug">
                          <Link to={`/product/${item.slug}/`} className="hover:text-[#8a2633] transition-colors">
                            {item.name}
                          </Link>
                        </h2>
                        <button
                          type="button"
                          onClick={() => {
                            trackRemoveFromCart(item, item.quantity);
                            removeFromCart(item.id, item.size);
                          }}
                          className="text-[#6b6461] hover:text-[#8a2633] p-1 transition-colors cursor-pointer shrink-0"
                          aria-label={`Remove ${item.name} from cart`}
                          title="Remove Item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="text-[12px] text-[#6b6461] space-y-0.5 mb-2">
                        {item.category && <p className="m-0">Category: {item.category}</p>}
                        {item.size && <p className="m-0 font-medium text-[#1f1b1b]">Size: {item.size}</p>}
                      </div>

                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-[15px] sm:text-[17px] font-medium text-[#1f1b1b]">
                          {formatPrice(itemTotal)}
                        </span>
                        {item.originalPrice && (
                          <>
                            <span className="text-[12px] text-[#6b6461] line-through">
                              {formatPrice(itemMRP)}
                            </span>
                            <span className="bg-[#8a2633] text-white text-[10px] font-medium px-1.5 py-0.5 rounded-[2px]">
                              {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* 40px Square Quantity Stepper Controls */}
                    <div className="pt-3 flex items-center justify-between border-t border-[#dfd9d5]/60 mt-2">
                      <span className="text-[12px] text-[#6b6461]">Quantity:</span>
                      <div className="flex items-center border border-[#dfd9d5] bg-[#faf8f6] rounded-[2px] h-[40px]">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.id, item.size, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-[40px] h-[40px] flex items-center justify-center text-[#1f1b1b] hover:text-[#8a2633] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-[40px] text-center text-[13px] font-medium text-[#1f1b1b] select-none">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.id, item.size, item.quantity + 1)}
                          className="w-[40px] h-[40px] flex items-center justify-center text-[#1f1b1b] hover:text-[#8a2633] transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Order Summary (35% / ~5 cols on desktop) */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-[#dfd9d5] p-5 sm:p-6 rounded-[2px] shadow-xs lg:sticky lg:top-28 space-y-4">
              <h2 className="text-[16px] font-serif font-medium text-[#1f1b1b] pb-3 border-b border-[#dfd9d5] m-0">
                Order Summary
              </h2>

              {/* Coupon Row */}
              {appliedCoupon ? (
                <div className="bg-[#faf8f6] border border-[#dfd9d5] p-3 rounded-[2px] flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2 min-w-0">
                    <ShieldCheck size={16} className="text-[#8a2633] shrink-0" />
                    <div className="min-w-0">
                      <span className="block font-medium text-[#1f1b1b] truncate">
                        ✓ {appliedCoupon} APPLIED
                      </span>
                      <span className="block text-emerald-800 text-[11px]">
                        {(activeCoupon === "VIPCLUB60" || activeCoupon === "VIBCLUB60") ? "60% Off MRP Applied" : "50% Off MRP Applied"}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-[11px] text-[#8a2633] underline hover:text-[#6f1d29] cursor-pointer shrink-0 ml-2"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                  <div className="flex items-stretch gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter Coupon Code"
                      className="flex-1 h-9 px-3 bg-[#faf8f6] border border-[#dfd9d5] rounded-[2px] text-[12px] text-[#1f1b1b] placeholder:text-[#6b6461]/60 focus:outline-none focus:border-[#8a2633] uppercase"
                    />
                    <button
                      type="submit"
                      className="h-9 px-4 bg-[#1f1b1b] hover:bg-[#8a2633] text-white text-[12px] uppercase tracking-[0.08em] font-medium rounded-[2px] transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-[#8a2633] m-0">{couponError}</p>
                  )}
                </form>
              )}

              {/* Calculation Breakdown */}
              <div className="space-y-2.5 text-[13px] text-[#6b6461] pt-2 border-t border-[#dfd9d5]">
                <div className="flex justify-between">
                  <span>Subtotal (MRP)</span>
                  <span className="text-[#1f1b1b] font-medium">{formatPrice(subtotalMRP)}</span>
                </div>
                
                <div className="flex justify-between text-emerald-800 font-medium">
                  <span>Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-emerald-800 font-medium">FREE</span>
                </div>

                <div className="flex justify-between text-[12px]">
                  <span>GST & Taxes</span>
                  <span className="text-[#1f1b1b]">Included</span>
                </div>

                <div className="pt-3 border-t border-[#dfd9d5] flex justify-between items-baseline">
                  <span className="text-[15px] font-medium text-[#1f1b1b]">Total Payable</span>
                  <span className="text-[18px] font-medium text-[#8a2633]">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Primary Checkout Button (48px height, full width, #8a2633 background) */}
              <button
                type="button"
                onClick={() => navigate("/checkout")}
                className="w-full h-[48px] bg-[#8a2633] hover:bg-[#6f1d29] text-white font-medium text-[13px] uppercase tracking-[0.08em] rounded-[2px] flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a2633]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </button>

              {/* Payment Strip from Prompt 2 below checkout */}
              <div className="pt-3 border-t border-[#dfd9d5] space-y-2">
                <span className="text-[12px] font-medium text-[#1f1b1b] block">Secure payment options</span>
                <div className="flex items-center justify-between flex-wrap gap-2 text-[11px] text-[#6b6461]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center justify-center px-2 py-1 bg-[#faf8f6] border border-[#dfd9d5] rounded-[2px] text-[10px] text-[#1f1b1b] font-medium">
                      UPI
                    </span>
                    <span className="inline-flex items-center justify-center px-2 py-1 bg-[#faf8f6] border border-[#dfd9d5] rounded-[2px] text-[10px] text-[#1f1b1b] font-medium">
                      GPay
                    </span>
                    <span className="inline-flex items-center justify-center px-2 py-1 bg-[#faf8f6] border border-[#dfd9d5] rounded-[2px] text-[10px] text-[#1f1b1b] font-medium">
                      PhonePe
                    </span>
                    <span className="inline-flex items-center justify-center px-2 py-1 bg-[#faf8f6] border border-[#dfd9d5] rounded-[2px] text-[10px] text-[#1f1b1b] font-medium">
                      Cards
                    </span>
                    <span className="inline-flex items-center justify-center px-2 py-1 bg-[#faf8f6] border border-[#dfd9d5] rounded-[2px] text-[10px] text-[#1f1b1b] font-medium">
                      NetBanking
                    </span>
                    <span className="inline-flex items-center justify-center px-2 py-1 bg-[#faf8f6] border border-[#dfd9d5] rounded-[2px] text-[10px] text-[#1f1b1b] font-medium">
                      COD
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-800 font-medium">
                    <ShieldCheck size={14} className="text-emerald-700" />
                    <span>256-Bit SSL</span>
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
