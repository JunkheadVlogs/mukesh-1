import type { FormEvent } from "react";
import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import { SEO } from "./components/SEO";
import { Link, useNavigate } from "react-router";
import { useStore } from "./store";
import { formatPrice, optimizeImage, getImageAlt } from "./utils";
import { OptimizedImage } from "./components/OptimizedImage";
import {
  CheckCircle2,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Truck,
  ShieldCheck,
} from "lucide-react";
import { CONFIG, submitToGoogleSheets } from "./config";
import { trackInitiateCheckout } from "./tracking";

const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.defer = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Checkout() {
  const { cart, cartTotal, clearCart, appliedCoupon, applyCoupon } = useStore();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [couponInput, setCouponInput] = useState(appliedCoupon || "");
  const [couponError, setCouponError] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const isOrderSubmitted = useRef(false);

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

  const subtotalCart = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const subtotalMRP = cart.reduce(
    (total, item) => total + (item.originalPrice || item.price) * item.quantity,
    0,
  );

  const productSavings = subtotalMRP - subtotalCart;
  const shipping = 0;

  const activeCoupon = appliedCoupon;
  let couponDiscountMultiplier = 0;
  if (activeCoupon === "VIP50") couponDiscountMultiplier = 0.5;
  else if (activeCoupon === "VIPCLUB60" || activeCoupon === "VIBCLUB60")
    couponDiscountMultiplier = 0.6;

  let finalPayable = subtotalCart;
  let finalCouponSavings = 0;

  if (couponDiscountMultiplier > 0) {
    const priceWithCoupon = Math.floor(
      subtotalMRP * (1 - couponDiscountMultiplier),
    );
    if (priceWithCoupon < subtotalCart) {
      finalPayable = priceWithCoupon;
      finalCouponSavings = subtotalCart - priceWithCoupon;
    }
  }

  const totalDiscount = productSavings + finalCouponSavings;
  const total = Math.max(0, finalPayable);

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
      const email = formData.get("email")?.toString() || "";
      const streetAddress = formData.get("streetAddress")?.toString() || "";
      const city = formData.get("city")?.toString() || "";
      const zipCode = formData.get("zipCode")?.toString() || "";

      const errors: Record<string, string> = {};
      if (!fullName.trim()) errors.firstName = "Please enter your full name";
      if (!/^\d{10}$/.test(mobileNumber.trim()))
        errors.mobileNumber = "Please enter a valid 10-digit mobile number";
      if (!streetAddress.trim())
        errors.address = "Please enter your shipping address";
      if (!city.trim()) errors.city = "Please enter your city";
      if (!/^\d{6}$/.test(zipCode.trim()))
        errors.pinCode = "Please enter a 6-digit PIN code";

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        setIsSubmitting(false);
        const firstErrorKey = Object.keys(errors)[0];
        const fieldName =
          firstErrorKey === "address"
            ? "streetAddress"
            : firstErrorKey === "pinCode"
              ? "zipCode"
              : firstErrorKey;
        const errorElement = document.querySelector(
          `[name="${fieldName}"]`,
        ) as HTMLElement;
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
          errorElement.focus();
        }
        return;
      }
      setFormErrors({});

      // Save customer info to localStorage to maximize Event Match Quality (EMQ) on conversions
      try {
        localStorage.setItem('customer_checkout_info', JSON.stringify({
          email: email || "",
          phone: mobileNumber,
          name: fullName,
          city: city,
          zip: zipCode
        }));
      } catch (err) {
        console.warn("Could not save customer info:", err);
      }

      const newOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(newOrderId);

      const finalizeOrder = async (
        isSuccessState: boolean = true,
        status: string = paymentMethod === "online"
          ? "Online"
          : "Cash on Delivery",
        paymentId: string = "N/A",
      ) => {
        try {
          const productName = cart.map((i) => i.name).join(", ");
          const size = cart.map((i) => i.size || "Standard").join(", ");
          const sku = cart.map((i) => i.sku || "N/A").join(", ");
          const color = cart.map((i) => i.color || "N/A").join(", ");

          const istTime = new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          });
          const googleSheetsData = {
            orderId: newOrderId,
            firstName: fullName,
            mobileNumber: mobileNumber,
            email: email || "N/A",
            streetAddress: streetAddress,
            city: city,
            zipCode: zipCode,
            productName: productName,
            totalAmount: total.toString(),
            size: size,
            sku: sku,
            color: color,
            paymentStatus: status,
            paymentId: paymentId,
            timestamp: istTime,
          };

          const result = await submitToGoogleSheets(googleSheetsData);

          if (isSuccessState) {
            // Assume success if no exception was thrown by submitToGoogleSheets
            if (
              result &&
              (result.status === "success" ||
                result.result === "success" ||
                result.status === 200 ||
                !result.status)
            ) {
              alert("Order Placed Successfully!");
              isOrderSubmitted.current = true;
              const cartData = [...cart];
              clearCart();
              navigate("/thank-you", {
                state: { orderId: newOrderId, total, cart: cartData },
                replace: true,
              });
            } else {
              // Usually the proxy adds `status: 'success'` or the sheet sets it. If not, it's safer to just proceed if no HTTP error
              alert("Order Placed Successfully!");
              isOrderSubmitted.current = true;
              const cartData = [...cart];
              clearCart();
              navigate("/thank-you", {
                state: { orderId: newOrderId, total, cart: cartData },
                replace: true,
              });
            }
          }
        } catch (error: any) {
          console.error("Submission error:", error);
          if (isSuccessState) {
            setIsSubmitting(false);
            setTimeout(() => {
              alert("Unable to place your order right now. Please try again.");
            }, 10);
          }
        }
      };

      if (paymentMethod === "online") {
        try {
          const reqBody = { amount: total };
          const response = await fetch(
            `${CONFIG.API_BASE_URL}/api/create-order`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(reqBody),
            },
          );

          if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || "Failed to create order");
          }

          const data = await response.json();

          if (!data.orderId && !data.id) {
            throw new Error("Invalid order response");
          }

          // Save order to sheets as Pending BEFORE opening payment gateway
          finalizeOrder(false, "Payment Pending", "N/A").catch(console.error);

          let rzpKey = (
            import.meta.env.VITE_RAZORPAY_KEY_ID ||
            import.meta.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
            CONFIG.RAZORPAY_KEY_ID ||
            ""
          ).trim();
          if (!rzpKey || rzpKey === "rzp_live_Slf11Odg572QOq") {
            rzpKey = "rzp_live_So7zJe4qbXm4LY";
          }

          const options = {
            key: rzpKey,
            amount: data.amount,
            currency: data.currency,
            order_id: data.orderId || data.id,
            name: "Mukesh Sarees",
            description: "Order Payment",
            prefill: { name: fullName, contact: mobileNumber },
            theme: { color: "#D4AF37" },
            modal: {
              ondismiss: function () {
                setIsSubmitting(false);
              },
            },
            handler: async function (paymentResponse: any) {
              try {
                // Submit to google sheets after successful payment
                const rzpId = paymentResponse.razorpay_payment_id || "Success";
                await finalizeOrder(true, "Paid Online", rzpId);
              } catch (e) {
                console.error(e);
                alert(
                  "Payment successful but there was an error recording your order. Please contact support.",
                );
              }
            },
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        } catch (error: any) {
          console.error("Payment Error:", error);
          alert("Unable to initiate payment right now. Please try again.");
          setIsSubmitting(false);
        }
      } else {
        await finalizeOrder();
      }
    } catch (err: any) {
      console.error("Checkout unhandled error:", err);
      setIsSubmitting(false);
      setTimeout(() => {
        alert("Unable to place your order right now. Please try again.");
      }, 10);
    }
  };

  useEffect(() => {
    if (cart.length === 0 && !isOrderSubmitted.current) {
      navigate("/cart");
    }
  }, [cart.length, navigate]);

  if (cart.length === 0 && !isOrderSubmitted.current) {
    return null;
  }

  return (
    <div className="bg-primary-50">
      <SEO
        title="Checkout | Mukesh Saree Centre"
        description="Complete your luxury ethnic wear purchase at Mukesh Saree Centre."
        url="/checkout"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-8">
        <header className="mb-2.5 md:mb-8 border-b border-black/5 pb-1.5 md:pb-5">
          <h1 className="text-lg md:text-2xl font-serif text-primary-950 font-medium">
            Checkout
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-5 lg:gap-8">
          {/* Main Form */}
          <div className="lg:col-span-7">
            <form
              id="checkout-form"
              onSubmit={handleSubmit}
              noValidate
              className="space-y-2.5 sm:space-y-5 md:space-y-8"
            >
              {/* Delivery Section */}
              <section className="bg-white p-2.5 sm:p-5 md:p-6 border border-black/5 rounded-sm shadow-sm">
                <h2 className="text-sm sm:text-base md:text-lg font-serif text-primary-950 mb-2.5 sm:mb-4 md:mb-5 font-medium pb-1.5 sm:pb-3 border-b border-black/5 flex items-center gap-2 md:gap-3">
                  <span className="w-5.5 h-5.5 sm:w-7 sm:h-7 bg-gold-500/10 text-gold-600 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold font-serif">
                    1
                  </span>
                  Delivery Details
                </h2>
                <div className="grid grid-cols-1 gap-2.5 sm:gap-4">
                  <div className="space-y-0.5 md:space-y-1">
                    <label
                      htmlFor="firstName"
                      className="text-[9px] md:text-[10px] uppercase tracking-widest text-primary-950/60 font-bold ml-0.5 sm:ml-1"
                    >
                      Full Name *
                    </label>
                    <input
                      required
                      name="firstName"
                      id="firstName"
                      type="text"
                      className={`w-full bg-primary-50/20 border ${formErrors.firstName ? "border-red-500 ring-1 ring-red-500/20" : "border-black/10 focus:border-gold-500"} px-2.5 sm:px-4 py-1.5 sm:py-2.5 md:py-3 text-primary-950 focus:ring-1 focus:ring-gold-500/30 outline-none transition-all rounded-sm font-medium text-xs sm:text-sm md:text-base placeholder:text-primary-950/50`}
                      placeholder="Enter your full name"
                    />
                    {formErrors.firstName && (
                      <p className="text-red-500 text-[9px] font-bold tracking-wide mt-1 ml-0.5 sm:ml-1">
                        {formErrors.firstName}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-4">
                    <div className="space-y-0.5 md:space-y-1">
                      <label
                        htmlFor="mobileNumber"
                        className="text-[9px] md:text-[10px] uppercase tracking-widest text-primary-950/60 font-bold ml-0.5 sm:ml-1"
                      >
                        Mobile Number *
                      </label>
                      <input
                        required
                        name="mobileNumber"
                        id="mobileNumber"
                        type="tel"
                        className={`w-full bg-primary-50/20 border ${formErrors.mobileNumber ? "border-red-500 ring-1 ring-red-500/20" : "border-black/10 focus:border-gold-500"} px-2.5 sm:px-4 py-1.5 sm:py-2.5 md:py-3 text-primary-950 focus:ring-1 focus:ring-gold-500/30 outline-none transition-all rounded-sm font-medium text-xs sm:text-sm md:text-base placeholder:text-primary-950/50`}
                        placeholder="10-digit number"
                      />
                      {formErrors.mobileNumber && (
                        <p className="text-red-500 text-[9px] font-bold tracking-wide mt-1 ml-0.5 sm:ml-1">
                          {formErrors.mobileNumber}
                        </p>
                      )}
                    </div>
                    <div className="space-y-0.5 md:space-y-1">
                      <label
                        htmlFor="email"
                        className="text-[9px] md:text-[10px] uppercase tracking-widest text-primary-950/60 font-bold ml-0.5 sm:ml-1"
                      >
                        Email{" "}
                        <span className="text-primary-950/30 font-normal">
                          (Optional)
                        </span>
                      </label>
                      <input
                        name="email"
                        id="email"
                        type="email"
                        className="w-full bg-primary-50/20 border border-black/10 px-2.5 sm:px-4 py-1.5 sm:py-2.5 md:py-3 text-primary-950 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 outline-none transition-all rounded-sm font-medium text-xs sm:text-sm md:text-base placeholder:text-primary-950/50"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-0.5 md:space-y-1">
                    <label
                      htmlFor="streetAddress"
                      className="text-[9px] md:text-[10px] uppercase tracking-widest text-primary-950/60 font-bold ml-0.5 sm:ml-1"
                    >
                      Shipping Address *
                    </label>
                    <input
                      required
                      name="streetAddress"
                      id="streetAddress"
                      type="text"
                      className={`w-full bg-primary-50/20 border ${formErrors.address ? "border-red-500 ring-1 ring-red-500/20" : "border-black/10 focus:border-gold-500"} px-2.5 sm:px-4 py-1.5 sm:py-2.5 md:py-3 text-primary-950 focus:ring-1 focus:ring-gold-500/30 outline-none transition-all rounded-sm font-medium text-xs sm:text-sm md:text-base placeholder:text-primary-950/50`}
                      placeholder="House no, Street name, Landmark"
                    />
                    {formErrors.address && (
                      <p className="text-red-500 text-[9px] font-bold tracking-wide mt-1 ml-0.5 sm:ml-1">
                        {formErrors.address}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                    <div className="space-y-0.5 md:space-y-1">
                      <label
                        htmlFor="city"
                        className="text-[9px] md:text-[10px] uppercase tracking-widest text-primary-950/60 font-bold ml-0.5 sm:ml-1"
                      >
                        City *
                      </label>
                      <input
                        required
                        name="city"
                        id="city"
                        type="text"
                        className={`w-full bg-primary-50/20 border ${formErrors.city ? "border-red-500 ring-1 ring-red-500/20" : "border-black/10 focus:border-gold-500"} px-2.5 sm:px-4 py-1.5 sm:py-2.5 md:py-3 text-primary-950 focus:ring-1 focus:ring-gold-500/30 outline-none transition-all rounded-sm font-medium text-xs sm:text-sm md:text-base placeholder:text-primary-950/50`}
                        placeholder="City name"
                      />
                      {formErrors.city && (
                        <p className="text-red-500 text-[9px] font-bold tracking-wide mt-1 ml-0.5 sm:ml-1">
                          {formErrors.city}
                        </p>
                      )}
                    </div>
                    <div className="space-y-0.5 md:space-y-1">
                      <label
                        htmlFor="zipCode"
                        className="text-[9px] md:text-[10px] uppercase tracking-widest text-primary-950/60 font-bold ml-0.5 sm:ml-1"
                      >
                        PIN Code *
                      </label>
                      <input
                        required
                        name="zipCode"
                        id="zipCode"
                        type="text"
                        className={`w-full bg-primary-50/20 border ${formErrors.pinCode ? "border-red-500 ring-1 ring-red-500/20" : "border-black/10 focus:border-gold-500"} px-2.5 sm:px-4 py-1.5 sm:py-2.5 md:py-3 text-primary-950 focus:ring-1 focus:ring-gold-500/30 outline-none transition-all rounded-sm font-medium text-xs sm:text-sm md:text-base placeholder:text-primary-950/50`}
                        placeholder="6-digit PIN"
                      />
                      {formErrors.pinCode && (
                        <p className="text-red-500 text-[9px] font-bold tracking-wide mt-1 ml-0.5 sm:ml-1">
                          {formErrors.pinCode}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-1 md:mt-3 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="saveDetails"
                      className="w-3.5 h-3.5 rounded text-gold-500 focus:ring-gold-500/30 border-black/20"
                    />
                    <label
                      htmlFor="saveDetails"
                      className="text-[10px] sm:text-xs text-primary-950/80"
                    >
                      Save my details for next time
                    </label>
                  </div>
                </div>

                {/* Hidden fields for ID requirements */}
                <input
                  type="hidden"
                  id="productName"
                  value={cart.map((i) => i.name).join(", ")}
                />
                <input type="hidden" id="totalAmount" value={total} />
                <input
                  type="hidden"
                  id="size"
                  value={cart.map((i) => i.size || "Standard").join(", ")}
                />
                <input
                  type="hidden"
                  id="sku"
                  value={cart.map((i) => i.sku || "N/A").join(", ")}
                />
                <input
                  type="hidden"
                  id="color"
                  value={cart.map((i) => i.color || "N/A").join(", ")}
                />
              </section>

              {/* Payment Section */}
              <section className="bg-white p-2.5 sm:p-5 md:p-6 border border-black/5 rounded-sm shadow-sm">
                <h2 className="text-sm sm:text-base md:text-lg font-serif text-primary-950 mb-2.5 sm:mb-4 md:mb-5 font-medium pb-1.5 sm:pb-3 border-b border-black/5 flex items-center gap-2 md:gap-3">
                  <span className="w-5.5 h-5.5 sm:w-7 sm:h-7 bg-gold-500/10 text-gold-600 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold font-serif">
                    2
                  </span>
                  Payment Method
                </h2>
                <div className="flex flex-col gap-2 md:gap-3">
                  <div
                    className="payment-option transition-all p-2.5 sm:p-4 rounded-sm cursor-pointer"
                    style={{
                      border:
                        paymentMethod === "cod"
                          ? "2px solid #C9A84C"
                          : "1px solid rgba(0,0,0,0.1)",
                      background:
                        paymentMethod === "cod"
                          ? "#FFFDF8"
                          : "rgba(250, 246, 240, 0.2)",
                    }}
                    onClick={() => setPaymentMethod("cod")}
                  >
                    <label className="flex items-center gap-2.5 sm:gap-3 cursor-pointer m-0 w-full select-none">
                      <input
                        type="radio"
                        name="payment_method"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        style={{
                          width: "16px",
                          height: "16px",
                          accentColor: "#C9A84C",
                        }}
                        className="cursor-pointer flex-shrink-0"
                      />
                      <div className="flex-grow">
                        <strong className="text-[13px] sm:text-[15px] font-bold text-[#1A0A00] block leading-snug">
                          💵 Cash on Delivery
                        </strong>
                        <div className="text-[11px] sm:text-[13px] text-[#6B5F4A] mt-0.5 leading-tight">
                          Pay when your order arrives. 100% safe.
                        </div>
                      </div>
                    </label>
                  </div>

                  <div
                    className="payment-option transition-all p-2.5 sm:p-4 rounded-sm cursor-pointer"
                    style={{
                      border:
                        paymentMethod === "online"
                          ? "2px solid #C9A84C"
                          : "1px solid rgba(0,0,0,0.1)",
                      background:
                        paymentMethod === "online"
                          ? "#FFFDF8"
                          : "rgba(250, 246, 240, 0.2)",
                    }}
                    onClick={() => setPaymentMethod("online")}
                  >
                    <label className="flex items-center gap-2.5 sm:gap-3 cursor-pointer m-0 w-full select-none">
                      <input
                        type="radio"
                        name="payment_method"
                        value="online"
                        checked={paymentMethod === "online"}
                        onChange={() => setPaymentMethod("online")}
                        style={{
                          width: "16px",
                          height: "16px",
                          accentColor: "#C9A84C",
                        }}
                        className="cursor-pointer flex-shrink-0"
                      />
                      <div className="flex-grow">
                        <strong className="text-[13px] sm:text-[15px] font-bold text-[#1A0A00] block leading-snug">
                          💳 Pay Online
                        </strong>
                        <div className="text-[11px] sm:text-[13px] text-[#6B5F4A] mt-0.5 leading-tight">
                          UPI, Credit/Debit Cards, Netbanking.
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </section>

              <div className="sticky bottom-0 md:static z-20 px-3.5 py-2 md:py-0 md:px-0 -mx-3.5 md:mx-0 bg-primary-50/95 backdrop-blur-md border-t border-black/5 md:border-t-0 md:backdrop-blur-none md:bg-transparent shadow-[0_-8px_20px_rgba(0,0,0,0.03)] md:shadow-none">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-950 hover:bg-black text-white px-8 py-2.5 sm:py-3.5 md:py-4 rounded-sm transition-all shadow-xl shadow-primary-950/20 text-xs md:text-sm font-bold tracking-[2px] uppercase flex items-center justify-center gap-3 disabled:opacity-70 active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Processing
                      Your Order...
                    </>
                  ) : (
                    <>
                      Place Order <ArrowRight size={16} className="-mt-0.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Checkout Summary */}
          <div className="lg:col-span-5 mt-1 sm:mt-0">
            <div className="bg-white p-2.5 sm:p-5 md:p-6 border border-black/5 rounded-sm shadow-sm lg:sticky lg:top-32">
              <h2 className="text-sm sm:text-base md:text-lg font-serif text-primary-950 mb-2 sm:mb-4 font-medium pb-1.5 sm:pb-3 border-b border-black/5">
                Order Summary
              </h2>

              <div className="space-y-2.5 mb-3.5 max-h-[35vh] overflow-y-auto pr-1 sm:pr-2 no-scrollbar">
                {cart.map((item) => (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="flex gap-2.5 sm:gap-4 items-center"
                  >
                    <div className="w-[56px] h-[72px] sm:w-16 sm:h-20 bg-primary-50 rounded-sm relative overflow-hidden flex-shrink-0 border border-black/5">
                      <OptimizedImage
                        src={item.image}
                        alt={getImageAlt(item)}
                        width={200}
                        className="w-full h-full object-cover object-top will-change-transform transform-gpu"
                      />
                      <div className="absolute top-1 right-1 bg-gold-500 text-white text-[9px] w-4.5 h-4.5 sm:w-5 sm:h-5 flex items-center justify-center rounded-full font-bold shadow-sm">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex flex-col justify-center gap-0.5">
                      <p className="text-[12px] sm:text-sm font-medium text-primary-950 leading-tight line-clamp-2">
                        {item.name}
                      </p>
                      <p className="text-[8.5px] sm:text-[10px] uppercase text-gold-600 font-bold tracking-wider">
                        Size: {item.size || "Standard"}
                      </p>
                      <p className="text-[12px] sm:text-sm font-bold text-primary-950">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2.5 pt-2.5 sm:pt-5 border-t border-black/5">
                {appliedCoupon && (
                  <div className="mb-2.5 sm:mb-4 pb-2.5 sm:pb-4 border-b border-black/5">
                    <div className="bg-[#F9F7F4] border border-[#8A6A4A]/15 px-3 py-2 sm:py-2.5 rounded-sm flex items-center justify-between gap-3 text-left">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <CheckCircle2 size={13} className="text-[#4CAF50] flex-shrink-0" />
                        <div className="flex flex-col min-w-0">
                          <span className="text-[9.5px] sm:text-[10px] uppercase tracking-wider font-bold text-primary-950 truncate">
                            ✓ Coupon Applied: {appliedCoupon}
                          </span>
                          <span className="text-[8px] sm:text-[8.5px] text-[#4CAF50] font-bold uppercase tracking-wider mt-0.5">
                            {couponDiscountMultiplier * 100}% OFF Applied Successfully
                          </span>
                        </div>
                      </div>
                      <div className="text-[9.5px] sm:text-[11px] font-bold text-[#4CAF50] font-sans flex-shrink-0">
                        -{formatPrice(finalCouponSavings)}
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2 text-[11px] sm:text-xs font-medium text-primary-950/60 font-sans">
                  <div className="flex justify-between items-center text-primary-950/60">
                    <span>MRP Total</span>
                    <span className="text-primary-950/40 line-through">
                      {formatPrice(subtotalMRP)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gold-700">
                    <span>Product Discount</span>
                    <span className="font-bold">
                      -{formatPrice(productSavings)}
                    </span>
                  </div>
                  {finalCouponSavings > 0 && (
                    <div className="flex justify-between items-center text-[#4CAF50]">
                      <span>Coupon Savings</span>
                      <span className="font-bold">
                        -{formatPrice(finalCouponSavings)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span>Shipping</span>
                    <span className="text-gold-700 font-bold">FREE</span>
                  </div>
                </div>

                <div className="pt-2.5 sm:pt-4 border-t border-black/5 flex justify-between items-center">
                  <span className="text-xs sm:text-base font-medium text-primary-950 font-serif">
                    Grand Total
                  </span>
                  <span className="text-base sm:text-2xl font-bold text-primary-950">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <div className="mt-3.5 sm:mt-8 pt-2.5 sm:pt-6 border-t border-black/5 flex flex-col space-y-2 sm:space-y-3">
                <div className="flex items-center justify-center gap-2 group cursor-default">
                  <ShieldCheck
                    size={13}
                    className="text-[var(--color-gold-dark)] opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                  <span className="text-[9.5px] sm:text-[10px] uppercase tracking-[0.1em] font-medium text-[var(--color-dark)] opacity-80 group-hover:opacity-100 transition-opacity">
                    Secure Encryption
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2 group cursor-default">
                  <Truck
                    size={13}
                    className="text-[var(--color-gold-dark)] opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                  <span className="text-[9.5px] sm:text-[10px] uppercase tracking-[0.1em] font-medium text-[var(--color-dark)] opacity-80 group-hover:opacity-100 transition-opacity">
                    Fast Insured Transit
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
