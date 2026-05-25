import { motion } from "motion/react";
import { Link, useLocation } from "react-router";
import { CheckCircle2, Printer, MapPin, Phone, Mail, Calendar, CreditCard, ShoppingBag, ArrowLeft } from "lucide-react";
import { SEO } from "./components/SEO";
import { useEffect, useRef } from "react";
import { trackPurchase } from "./tracking";

export default function ThankYou() {
  const location = useLocation();
  const stateOrderId = location.state?.orderId;
  const stateTotal = location.state?.total;
  const stateCart = location.state?.cart;
  const stateCustomer = location.state?.customer;

  // Sync to/from localStorage for absolute persistence on browser refreshes or direct entry
  useEffect(() => {
    if (stateOrderId) {
      localStorage.setItem("msc_last_order_id", stateOrderId);
    }
    if (stateTotal !== undefined && stateTotal !== null) {
      localStorage.setItem("msc_last_order_total", stateTotal.toString());
    }
    if (stateCart) {
      localStorage.setItem("msc_last_order_cart", JSON.stringify(stateCart));
    }
    if (stateCustomer) {
      localStorage.setItem("msc_last_order_customer", JSON.stringify(stateCustomer));
    }
  }, [stateOrderId, stateTotal, stateCart, stateCustomer]);

  // Retrieve state with robust, fail-safe backups
  const orderId = stateOrderId || localStorage.getItem("msc_last_order_id") || `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  
  const rawSavedTotal = localStorage.getItem("msc_last_order_total");
  const total = stateTotal !== undefined ? stateTotal : (rawSavedTotal ? parseFloat(rawSavedTotal) : 0);

  const rawSavedCart = localStorage.getItem("msc_last_order_cart");
  const cart = stateCart || (rawSavedCart ? JSON.parse(rawSavedCart) : []);

  const rawSavedCustomer = localStorage.getItem("msc_last_order_customer");
  const customer = stateCustomer || (rawSavedCustomer ? JSON.parse(rawSavedCustomer) : null);

  const orderDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  // Calculate prices cleanly
  const subtotal = cart.reduce((acc: number, item: any) => acc + (item.price * (item.quantity || 1)), 0);
  const displayTotal = total || subtotal || 0;
  const discountAmount = subtotal > displayTotal ? (subtotal - displayTotal) : 0;

  // Render mock values to guarantee a premium visual preview when entered empty/direct
  const isDemo = cart.length === 0;
  const printableCart = isDemo ? [
    {
      id: "demo-saree-1",
      name: "Handloom Pure Silk Banarasi Saree (Emerald Green)",
      price: 6490,
      quantity: 1,
      image: "https://wsrv.nl/?url=https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80",
      size: "Free Size",
      color: "Emerald Green"
    }
  ] : cart;
  
  const printableSubtotal = isDemo ? 6490 : subtotal;
  const printableTotal = isDemo ? 6490 : displayTotal;
  const printableDiscount = isDemo ? 0 : discountAmount;
  
  const printableCustomer = customer || {
    fullName: "Valued Saree Club Member",
    mobileNumber: "+91 9910006733",
    email: "info.mukeshsareecentre@gmail.com",
    streetAddress: "M-20, Main Market, Part 1",
    city: "New Delhi",
    state: "Delhi",
    zipCode: "110048",
    paymentMethod: "cod"
  };

  const handlePrint = () => {
    window.print();
  };

  const hasTracked = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (displayTotal && cart.length > 0 && !hasTracked.current) {
      trackPurchase(displayTotal, cart, orderId);
      hasTracked.current = true;
    }
  }, [displayTotal, cart, orderId]);

  return (
    <div className="bg-[#FAF6F0] min-h-screen py-6 md:py-12 px-4 relative overflow-hidden">
      <SEO
        title="Order Confirmed | Mukesh Saree Centre"
        description="Your boutique order has been confirmed successfully."
        url="/thank-you"
      />

      {/* Confetti Animation Layer (Hidden on print) */}
      <div className="no-print">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 0, x: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 0], 
              y: -120 - Math.random() * 120, 
              x: (Math.random() - 0.5) * 240,
              scale: [0, 1.4, 0.4] 
            }}
            transition={{ duration: 2.2, ease: "easeOut", delay: i * 0.12 }}
            className={`absolute w-2 h-2 rounded-full ${['bg-gold-400', 'bg-gold-600', 'bg-amber-700'][i % 3]} opacity-60`}
            style={{ 
              top: '25%', left: '50%', 
              marginTop: '-50px',
              zIndex: 1
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto z-10 relative">
        
        {/* SUCCESS HEADER - HIDDEN ON PRINT */}
        <div className="no-print text-center mb-8 md:mb-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-16 h-16 md:w-20 md:h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-green-200 shadow-sm"
          >
            <CheckCircle2 size={36} className="text-green-500" strokeWidth={1.5} />
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-4xl font-serif text-[#1A0A00] mb-3"
          >
            Order Confirmed
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[#1A0A00]/70 max-w-md mx-auto text-sm md:text-base leading-relaxed mb-6"
          >
            Thank you for shopping at Mukesh Saree Centre! Your payment and order details have been secured. We are now preparing your heritage sarees for delivery.
          </motion.p>

          <motion.div
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 0.25 }}
             className="inline-block bg-white border border-[#2D452F]/15 text-[#2D452F] text-xs sm:text-sm px-5 py-2 rounded-full font-medium shadow-sm mb-4"
          >
             Estimated Dispatch: <strong className="font-semibold">3-5 Business Days</strong>
          </motion.div>
        </div>

        {/* PRINT CONTROLS / NAVIGATION TABS - HIDDEN ON PRINT */}
        <div className="no-print flex flex-col sm:flex-row gap-3 items-center justify-between bg-white border border-[#1A0A00]/5 p-4 rounded-sm shadow-sm mb-6">
          <Link 
            to="/shop" 
            className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#1A0A00]/60 hover:text-[#1A0A00] transition-colors py-2"
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>
          
          <div className="flex gap-2.5 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-[#2D452F] hover:bg-[#203322] active:scale-[0.98] text-white text-xs uppercase tracking-widest font-semibold px-5 py-3 rounded-sm shadow-sm transition-all"
            >
              <Printer size={15} />
              Print Invoice
            </button>
            <a 
              href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '917020664641'}?text=${encodeURIComponent(`Hello Mukesh Saree Centre, support requested for my design order ID ${orderId}.`)}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 border border-[#25D366]/30 hover:bg-[#25D366]/5 text-xs uppercase tracking-widest font-semibold text-green-700 px-5 py-3 rounded-sm transition-all"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" className="fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp Help
            </a>
          </div>
        </div>

        {/* PRINTABLE BOUTIQUE INVOICE CARD */}
        <div id="msc-invoice" className="print-invoice-page bg-white p-6 md:p-10 border border-[#1A0A00]/5 sm:rounded-sm shadow-xl shadow-black/[0.015] font-sans text-left">
          
          {/* Invoice Header */}
          <div className="print-invoice-header flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#1A0A00]/10 pb-6 mb-8">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl text-[#1A0A00] tracking-wide font-medium">MUKESH SAREE CENTRE</h2>
              <p className="text-[10px] md:text-xs uppercase tracking-widest text-amber-800 font-semibold mt-1">Heritage Artistry & Organic Silks</p>
              <p className="text-xs text-[#1A0A00]/60 mt-1 max-w-sm">M-24, Saree Market Chambers, Chandni Chowk, New Delhi, 110006</p>
            </div>
            <div className="text-left md:text-right">
              <span className="inline-block bg-amber-500/10 text-amber-800 text-[10px] sm:text-xs uppercase tracking-widest font-semibold px-3 py-1 rounded-sm mb-2">
                Official Receipt
              </span>
              <p className="text-xs text-[#1A0A00]/50">Invoice Number</p>
              <p className="text-base sm:text-lg font-bold text-[#1A0A00] font-mono">{orderId}</p>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="print-grid grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12 mb-8 text-xs md:text-sm">
            <div className="border-l-2 border-amber-800 pl-4">
              <h3 className="text-[10px] uppercase tracking-widest text-[#1A0A00]/40 font-bold mb-2">Customer & Delivery Address</h3>
              <p className="font-semibold text-[#1A0A00] mb-1">{printableCustomer.fullName}</p>
              <p className="text-[#1A0A00]/70 leading-relaxed mb-2">
                {printableCustomer.streetAddress}<br />
                {printableCustomer.city}, {printableCustomer.state} - {printableCustomer.zipCode}
              </p>
              <div className="flex flex-col gap-1 text-[#1A0A00]/80">
                <span className="flex items-center gap-1.5"><Phone size={13} className="text-amber-800" /> {printableCustomer.mobileNumber}</span>
                {printableCustomer.email && (
                  <span className="flex items-center gap-1.5"><Mail size={13} className="text-amber-800" /> {printableCustomer.email}</span>
                )}
              </div>
            </div>

            <div className="border-l-2 border-black/15 pl-4 sm:pl-6 bg-[#FAF6F0]/40 p-3 rounded-sm">
              <h3 className="text-[10px] uppercase tracking-widest text-[#1A0A00]/40 font-bold mb-2">Order Information</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#1A0A00]/50 flex items-center gap-1.5"><Calendar size={13} /> Date:</span>
                  <span className="font-medium text-[#1A0A00]">{orderDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#1A0A00]/50 flex items-center gap-1.5"><CreditCard size={13} /> Payment Method:</span>
                  <span className="font-semibold uppercase text-amber-900 tracking-wide">{printableCustomer.paymentMethod === 'cod' ? 'Cash On Delivery (COD)' : 'Prepaid (Online)'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#1A0A00]/50 flex items-center gap-1.5"><ShoppingBag size={13} /> Order Status:</span>
                  <span className="font-medium text-amber-800">Processing Dispatch</span>
                </div>
              </div>
            </div>
          </div>

          {/* Item details */}
          <div className="mb-8 overflow-x-auto">
            <h3 className="text-[10px] uppercase tracking-widest text-[#1A0A00]/40 font-bold mb-3">Item Details</h3>
            <table className="w-full text-xs md:text-sm border-b border-[#1A0A00]/5">
              <thead>
                <tr className="bg-[#FAF6F0]/80 border-b border-[#1A0A00]/10 text-left text-[#1A0A00]/60 text-[10px] uppercase tracking-widest">
                  <th className="py-2.5 px-3">Product Description</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Price</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A0A00]/5">
                {printableCart.map((item: any, idx: number) => (
                  <tr key={idx} className="print-avoid-break">
                    <td className="py-4 px-3 flex items-center gap-4">
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="print-product-img w-10 h-13 object-cover border border-black/5 rounded-sm flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-[#1A0A00]">{item.name}</p>
                        <p className="text-[10px] text-[#1A0A00]/50 mt-0.5 uppercase tracking-wider">
                          {item.size ? `Size: ${item.size}` : "Size: Free Size"} {item.color ? `· Color: ${item.color}` : ""}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-3 text-center text-[#1A0A00] font-medium">{item.quantity || 1}</td>
                    <td className="py-4 px-3 text-right text-[#1A0A00]">₹{(item.price || 0).toLocaleString("en-IN")}</td>
                    <td className="py-4 px-3 text-right text-[#1A0A00] font-semibold">₹{((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing breakdown */}
          <div className="flex justify-end mb-8 print-avoid-break">
            <div className="w-full sm:w-80 space-y-2.5 text-xs md:text-sm">
              <div className="flex justify-between text-[#1A0A00]/60">
                <span>Subtotal</span>
                <span>₹{printableSubtotal.toLocaleString("en-IN")}</span>
              </div>
              {printableDiscount > 0 && (
                <div className="flex justify-between text-green-700 font-medium">
                  <span>Coupon Discount</span>
                  <span>-₹{printableDiscount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-[#1A0A00]/60">
                <span>Shipping Fee</span>
                <span className="text-[#2D452F] font-medium">FREE</span>
              </div>
              <div className="flex justify-between text-[#1A0A00]/60">
                <span>Tax GST (Incl. of all taxes)</span>
                <span>₹0.00</span>
              </div>
              <div className="h-px bg-[#1A0A00]/10 my-1"></div>
              <div className="flex justify-between text-base font-bold text-[#1A0A00]">
                <span>Grand Total</span>
                <span className="text-amber-900 font-serif">₹{printableTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Invoice Footer */}
          <div className="print-invoice-footer border-t border-[#1A0A00]/10 pt-6 mt-8 text-center text-[10px] md:text-xs text-[#1A0A00]/50">
            <p className="font-medium text-[#1A0A00]/70 mb-1">Thank you for patronizing classic handlooms & luxury silks.</p>
            <p>This is a computer-generated billing receipt and does not require a physical signature.</p>
            <p className="mt-1">For return info or support: info@mukeshsarees.com · www.mukeshsarees.com</p>
          </div>

        </div>

        {/* BOTTOM ACTION CONTROLS - HIDDEN ON PRINT */}
        <div className="no-print mt-6 text-center">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 border border-[#1A0A00]/30 hover:border-[#1A0A00] hover:bg-[#1A0A00]/5 text-[#1A0A00] text-xs uppercase tracking-widest font-semibold px-6 py-3 rounded-sm transition-all"
          >
            <Printer size={15} />
            Direct Download / Print Receipt
          </button>
        </div>

      </div>
    </div>
  );
}
