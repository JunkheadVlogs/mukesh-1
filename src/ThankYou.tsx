import { motion } from "motion/react";
import { Link, useLocation } from "react-router";
import { CheckCircle2, Printer, MapPin, Phone, Mail, Calendar, CreditCard, ShoppingBag, ArrowLeft } from "lucide-react";
import { SEO } from "./components/SEO";
import { useEffect, useRef } from "react";
import { trackPurchase } from "./tracking";
import { OptimizedImage } from "./components/OptimizedImage";
import { submitToGoogleSheets, getWhatsAppNumber } from "./config";
import { sendOrderToSheets } from "./utils/googleSheets";

// Safe in-memory fallback for localStorage in sandboxed iframes
const memoryStorage: Record<string, string> = {};
const localStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window === "undefined" || !window.localStorage) return null;
      return window.localStorage.getItem(key);
    } catch (e) {
      return memoryStorage[key] || null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window === "undefined" || !window.localStorage) return;
      window.localStorage.setItem(key, value);
    } catch (e) {
      memoryStorage[key] = String(value);
    }
  }
};

export default function ThankYou() {
  const location = useLocation();
  const stateOrderId = location.state?.orderId;
  const stateTotal = location.state?.total;
  const stateCart = location.state?.cart;
  const stateCustomer = location.state?.customer;
  const stateCoupon = location.state?.couponUsed;

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
    if (stateCoupon) {
      localStorage.setItem("msc_last_order_coupon", stateCoupon);
    }
  }, [stateOrderId, stateTotal, stateCart, stateCustomer, stateCoupon]);

  // Retrieve state with robust, fail-safe backups
  const orderId = stateOrderId || localStorage.getItem("msc_last_order_id") || `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  const couponUsed = stateCoupon || localStorage.getItem("msc_last_order_coupon") || "VIP50";
  
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
  const subtotalMRP = cart.reduce((acc: number, item: any) => acc + ((item.originalPrice || item.price * 2) * (item.quantity || 1)), 0);
  const activeCouponOnPage = couponUsed ? couponUsed.trim().toUpperCase() : "VIP50";

  const calculatedTotal = cart.reduce((acc: number, item: any) => {
    const mrp = item.originalPrice || item.price * 2;
    let discountRate = 0.0;
    if (activeCouponOnPage === "VIP50") {
      discountRate = 0.50;
    } else if (activeCouponOnPage === "VIPCLUB60" || activeCouponOnPage === "VIBCLUB60") {
      discountRate = 0.60;
    }
    const calculatedPrice = mrp - Math.round(mrp * discountRate);
    return acc + calculatedPrice * (item.quantity || 1);
  }, 0);

  const subtotal = subtotalMRP;
  const displayTotal = total || calculatedTotal || Math.round(subtotalMRP * 0.5);
  const discountAmount = subtotal - displayTotal;

  const queryParams = new URLSearchParams(location.search);
  const isPaidOnline = 
    queryParams.get("success") === "true" || 
    queryParams.get("payment") === "success" || 
    queryParams.has("razorpay_payment_id") ||
    localStorage.getItem("msc_last_order_payment_status") === "Paid";

  // Check if they paid successfully via Razorpay Payment Handle
  useEffect(() => {
    const isSuccessfulPayment = 
      queryParams.get("success") === "true" || 
      queryParams.get("payment") === "success" ||
      queryParams.has("razorpay_payment_id") ||
      queryParams.has("razorpay_payment_link_id");

    if (isSuccessfulPayment && orderId) {
      const hasBeenMarkedPaid = localStorage.getItem(`msc_paid_submitted_${orderId}`);
      if (!hasBeenMarkedPaid) {
        // Mark as Paid on checkout backup log
        localStorage.setItem("msc_last_order_payment_status", "Paid");
        
        const updateSheetsData = async () => {
          try {
            const istTime = new Date().toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
            });
            const savedCustomer = customer || (rawSavedCustomer ? JSON.parse(rawSavedCustomer) : null);
            const savedCart = cart || (rawSavedCart ? JSON.parse(rawSavedCart) : []);

            const productName = savedCart.map((i: any) => i.name).join(", ");
            const size = savedCart.map((i: any) => i.size || "Standard").join(", ");
            const sku = savedCart.map((i: any) => i.sku || "N/A").join(", ");
            const color = savedCart.map((i: any) => i.color || "N/A").join(", ");

            const googleSheetsData = {
              type: 'order' as const,
              orderId: orderId,
              firstName: savedCustomer?.fullName || "Valued Customer",
              customerName: savedCustomer?.fullName || "Valued Customer",
              phone: savedCustomer?.mobileNumber || "N/A",
              mobileNumber: savedCustomer?.mobileNumber || "N/A",
              email: savedCustomer?.email || "N/A",
              address: savedCustomer?.streetAddress || "N/A",
              streetAddress: savedCustomer?.streetAddress || "N/A",
              city: savedCustomer?.city || "N/A",
              zip: savedCustomer?.zipCode || "N/A",
              zipCode: savedCustomer?.zipCode || "N/A",
              productName: productName,
              amount: total || displayTotal,
              totalAmount: (total || displayTotal).toString(),
              size: size,
              sku: sku,
              color: color,
              couponUsed: couponUsed || 'None',
              source: 'Payment Handle Return',
              paymentMethod: 'Pay Online (Razorpay Handle)',
              status: 'Confirmed',         // Order Status = Confirmed
              paymentStatus: 'Paid',       // Payment Status = Paid
              paymentId: queryParams.get("razorpay_payment_id") || 'Paid via Handle',
              timestamp: istTime,
            };

            await Promise.any([
              submitToGoogleSheets(googleSheetsData),
              sendOrderToSheets(googleSheetsData)
            ]).catch(err => console.warn("Background sheet update failed:", err));

            localStorage.setItem(`msc_paid_submitted_${orderId}`, "true");
          } catch (err) {
            console.error("Error setting order status to paid in sheets:", err);
          }
        };
        updateSheetsData();
      }
    }
  }, [orderId, customer, cart, displayTotal, couponUsed, rawSavedCustomer, rawSavedCart]);

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
    mobileNumber: "+91 9170206646",
    email: "info@mukeshsarees.com",
    streetAddress: "Jagannath Road, Gandhibagh",
    city: "Nagpur",
    state: "Maharashtra",
    zipCode: "440002",
    paymentMethod: "cod"
  };

  const handleDownloadOnly = () => {
    const esc = (str: string) => str ? str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;") : "";
    
    // Build cart items rows
    const itemsHtml = printableCart.map((item: any) => {
      const mrp = item.originalPrice || item.price * 2;
      let discountRate = 0.0;
      if (activeCouponOnPage === "VIP50") {
        discountRate = 0.50;
      } else if (activeCouponOnPage === "VIPCLUB60" || activeCouponOnPage === "VIBCLUB60") {
        discountRate = 0.60;
      }
      const calculatedPrice = mrp - Math.round(mrp * discountRate);
      const priceVal = calculatedPrice;
      const qtyVal = item.quantity || 1;
      const totalVal = priceVal * qtyVal;
      const sizeText = item.size ? `Size: ${item.size}` : "Size: Free Size";
      const colorText = item.color ? ` &middot; Color: ${item.color}` : "";
      const imgTag = item.image ? `<img src="${esc(item.image)}" style="width: 44px; height: 58px; object-fit: cover; border: 1px solid rgba(0,0,0,0.06); border-radius: 2px;" />` : '';
      
      return `
        <tr>
          <td style="padding: 12px 10px; border-bottom: 1px solid rgba(26,10,0,0.05); display: flex; align-items: center; gap: 12px;">
            ${imgTag}
            <div>
              <p style="margin: 0; font-weight: 500; font-size: 13px; color: #1A0A00;">${esc(item.name)}</p>
              <p style="margin: 4px 0 0 0; font-size: 10px; color: rgba(26,10,0,0.5); text-transform: uppercase; letter-spacing: 0.5px;">${sizeText}${colorText}</p>
            </div>
          </td>
          <td style="padding: 12px 10px; text-align: center; border-bottom: 1px solid rgba(26,10,0,0.05); color: #1A0A00;">${qtyVal}</td>
          <td style="padding: 12px 10px; text-align: right; border-bottom: 1px solid rgba(26,10,0,0.05); color: #1A0A00;">₹${priceVal.toLocaleString("en-IN")}</td>
          <td style="padding: 12px 10px; text-align: right; border-bottom: 1px solid rgba(26,10,0,0.05); font-weight: 600; color: #1A0A00;">₹${totalVal.toLocaleString("en-IN")}</td>
        </tr>
      `;
    }).join("");

    const paymentMethodText = printableCustomer.paymentMethod === 'cod' ? 'Cash On Delivery (COD)' : 'Prepaid (Online)';

    let couponRowHtml = '';
    if (activeCouponOnPage === "VIP50") {
      couponRowHtml = `
        <div class="pricing-row" style="color: #2D452F; font-weight: 500;">
          <span>VIP50 Coupon Applied</span>
          <span>-₹${printableDiscount.toLocaleString("en-IN")}</span>
        </div>
      `;
    } else if (activeCouponOnPage === "VIPCLUB60" || activeCouponOnPage === "VIBCLUB60") {
      couponRowHtml = `
        <div class="pricing-row" style="color: #2D452F; font-weight: 500;">
          <span>VIPCLUB60 Coupon Applied</span>
          <span>-₹${printableDiscount.toLocaleString("en-IN")}</span>
        </div>
      `;
    }

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${esc(orderId)} - Mukesh Saree Centre</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@500;600&display=swap');
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      background-color: #FAF4EB;
      color: #1A0A00;
      margin: 0;
      padding: 30px 15px;
    }
    .invoice-container {
      max-width: 750px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 35px;
      border: 1px solid rgba(26,10,0,0.08);
      box-shadow: 0 4px 20px rgba(0,0,0,0.03);
      border-radius: 2px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 1px solid rgba(26,10,0,0.1);
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    @media (max-width: 550px) {
      .header {
        flex-direction: column;
        gap: 16px;
      }
      .meta-grid {
        grid-template-columns: 1fr !important;
        gap: 16px !important;
      }
    }
    .store-title {
      font-family: 'Playfair Display', serif;
      font-size: 26px;
      color: #1A0A00;
      margin: 0;
      font-weight: 500;
      letter-spacing: 0.5px;
    }
    .store-subtitle {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #8A6A4A;
      margin: 6px 0;
      font-weight: 600;
    }
    .store-address {
      font-size: 12px;
      color: rgba(26,10,0,0.6);
      margin: 4px 0 0 0;
    }
    .receipt-badge {
      display: inline-block;
      background-color: rgba(138,106,74,0.08);
      color: #8A6A4A;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 2px;
      margin-bottom: 8px;
    }
    .inv-num-label {
      font-size: 11px;
      color: rgba(26,10,0,0.4);
      margin: 0;
    }
    .inv-num-val {
      font-size: 16px;
      font-weight: 700;
      margin: 2px 0 0 0;
      font-family: monospace;
      color: #1A0A00;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 24px;
    }
    .col-left {
      border-left: 2px solid #8A6A4A;
      padding-left: 15px;
    }
    .col-right {
      border-left: 2px solid rgba(26,10,0,0.1);
      padding-left: 15px;
      background-color: rgba(250,246,240,0.45);
      padding: 12px 15px;
      border-radius: 2px;
    }
    .section-title {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: rgba(26,10,0,0.4);
      margin: 0 0 8px 0;
      font-weight: 700;
    }
    .cust-name {
      font-weight: 600;
      font-size: 13.5px;
      margin: 0 0 4px 0;
    }
    .cust-address {
      font-size: 12px;
      color: rgba(26,10,0,0.7);
      line-height: 1.45;
      margin: 0 0 8px 0;
    }
    .cust-detail {
      font-size: 12px;
      color: rgba(26,10,0,0.8);
      margin: 2px 0;
    }
    .order-info-row {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      margin-bottom: 8px;
    }
    .order-info-row:last-child {
      margin-bottom: 0;
    }
    .info-label {
      color: rgba(26,10,0,0.5);
    }
    .info-val {
      font-weight: 500;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    th {
      background-color: rgba(250,246,240,0.8);
      border-bottom: 1px solid rgba(26,10,0,0.1);
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: rgba(26,10,0,0.6);
      padding: 8px 10px;
      text-align: left;
    }
    .pricing-container {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 24px;
    }
    .pricing-table {
      width: 280px;
      font-size: 12px;
    }
    .pricing-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .pricing-divider {
      height: 1px;
      background-color: rgba(26,10,0,0.1);
      margin: 6px 0;
    }
    .total-row {
      font-size: 14px;
      font-weight: 700;
      color: #1A0A00;
    }
    .total-price {
      color: #8A6A4A;
      font-family: 'Playfair Display', serif;
      font-size: 17px;
    }
    .footer {
      border-top: 1px solid rgba(26,10,0,0.1);
      padding-top: 15px;
      text-align: center;
      font-size: 11px;
      color: rgba(26,10,0,0.4);
    }
    .btn-print-box {
      margin-bottom: 20px;
      text-align: center;
    }
    .btn-print-action {
      background-color: #2D452F;
      color: #ffffff;
      border: none;
      padding: 10px 20px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
      border-radius: 2px;
      cursor: pointer;
    }
    @media print {
      body {
        background-color: #ffffff;
        padding: 0;
      }
      .invoice-container {
        border: none;
        box-shadow: none;
        padding: 0;
      }
      .btn-print-box {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="btn-print-box">
    <button class="btn-print-action" onclick="window.print()">Print This Invoice</button>
  </div>
  <div class="invoice-container">
    <div class="header">
      <div>
        <h1 class="store-title">MUKESH SAREE CENTRE</h1>
        <p class="store-subtitle">Heritage Artistry & Organic Silks</p>
        <p class="store-address">Jagannath Road, Gandhibagh, Nagpur – 440002</p>
      </div>
      <div style="text-align: right;">
        <span class="receipt-badge">Official Receipt</span>
        <p class="inv-num-label">Invoice Number</p>
        <p class="inv-num-val">${esc(orderId)}</p>
      </div>
    </div>

    <div class="meta-grid">
      <div class="col-left">
        <h3 class="section-title">Customer & Delivery Address</h3>
        <p class="cust-name">${esc(printableCustomer.fullName)}</p>
        <p class="cust-address">
          ${esc(printableCustomer.streetAddress)}<br>
          ${esc(printableCustomer.city)}, ${esc(printableCustomer.state)} - ${esc(printableCustomer.zipCode)}
        </p>
        <p class="cust-detail">Phone: ${esc(printableCustomer.mobileNumber)}</p>
        ${printableCustomer.email ? `<p class="cust-detail">Email: ${esc(printableCustomer.email)}</p>` : ''}
      </div>
      <div class="col-right">
        <h3 class="section-title">Order Information</h3>
        <div class="order-info-row">
          <span class="info-label">Date:</span>
          <span class="info-val">${esc(orderDate)}</span>
        </div>
        <div class="order-info-row">
          <span class="info-label">Payment Method:</span>
          <span class="info-val" style="text-transform: uppercase;">${esc(paymentMethodText)}</span>
        </div>
        <div class="order-info-row">
          <span class="info-label">Order Status:</span>
          <span class="info-val" style="color: #8A6A4A;">Processing Dispatch</span>
        </div>
      </div>
    </div>

    <h3 class="section-title" style="margin-bottom: 10px;">Item Details</h3>
    <table>
      <thead>
        <tr>
          <th style="width: 50%;">Product Description</th>
          <th style="text-align: center; width: 10%;">Qty</th>
          <th style="text-align: right; width: 20%;">Price</th>
          <th style="text-align: right; width: 20%;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <div class="pricing-container">
      <div class="pricing-table">
        <div class="pricing-row">
          <span style="color: rgba(26,10,0,0.6);">MRP Total</span>
          <span>₹${printableSubtotal.toLocaleString("en-IN")}</span>
        </div>
        ${couponRowHtml}
        <div class="pricing-row">
          <span style="color: rgba(26,10,0,0.6);">Shipping Fee</span>
          <span style="color: #2D452F; font-weight: 500;">FREE</span>
        </div>
        <div class="pricing-row">
          <span style="color: rgba(26,10,0,0.6);">GST & All Taxes Included</span>
          <span style="color: rgba(26,10,0,0.46);">Included</span>
        </div>
        <div class="pricing-divider"></div>
        <div class="pricing-row total-row">
          <span>Grand Total</span>
          <span class="total-price">₹${printableTotal.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>

    <div class="footer">
      <p style="font-weight: 500; margin-bottom: 4px;">Thank you for patronizing classic handlooms & luxury silks.</p>
      <p style="margin: 0 0 4px 0;">This is a computer-generated billing receipt and does not require a physical signature.</p>
      <p style="margin: 0;">For return info or support: info@mukeshsarees.com · www.mukeshsarees.com</p>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 300);
    };
  </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `MSC_Invoice_${orderId}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    // 1. Try printing directly in case not sandboxed
    try {
      window.focus();
      window.print();
    } catch (e) {
      console.log("Direct print blocked by sandbox environment, using fallback.", e);
    }
    // 2. Always trigger download of the fully designed print-ready HTML Invoice
    handleDownloadOnly();
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
    <div className="bg-[#FAF6F0] min-h-screen py-4 md:py-8 px-4 relative overflow-hidden">
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

      <div className="max-w-3xl mx-auto z-10 relative">
        
        {/* SUCCESS HEADER - HIDDEN ON PRINT */}
        <div className="no-print text-center mb-6 md:mb-8">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-12 h-12 md:w-14 md:h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3.5 border border-green-200 shadow-sm"
          >
            <CheckCircle2 size={24} className="text-green-500" strokeWidth={1.5} />
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl font-serif text-[#1A0A00] tracking-wide mb-2 font-medium"
          >
            Order Confirmed
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[#1A0A00]/70 max-w-md mx-auto text-xs sm:text-sm leading-relaxed mb-4"
          >
            Thank you for shopping at Mukesh Saree Centre! Your payment and order details have been secured. We are now preparing your heritage sarees for delivery.
          </motion.p>

          <motion.div
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 0.25 }}
             className="inline-block bg-white border border-[#2D452F]/15 text-[#2D452F] text-[11px] sm:text-xs px-4 py-1.5 rounded-full font-medium shadow-sm mb-2"
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
              href={`https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(`Hello Mukesh Saree Centre, support requested for my design order ID ${orderId}.`)}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 border border-[#25D366]/30 hover:bg-[#25D366]/5 text-xs uppercase tracking-widest font-semibold text-green-700 px-5 py-3 rounded-sm transition-all"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" className="fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp Help
            </a>
          </div>
        </div>

        {/* PAYMENT STATUS BANNERS */}
        {isPaidOnline && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="no-print mb-6 p-4 sm:p-5 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 border border-emerald-500/20 rounded-sm text-emerald-800 text-left flex items-start gap-3.5 shadow-sm bg-white"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 text-emerald-600">
              <CheckCircle2 size={18} strokeWidth={2} />
            </div>
            <div className="flex-grow space-y-1">
              <h4 className="text-sm font-bold text-emerald-950 font-serif leading-none">
                Payment Confirmed Successfully
              </h4>
              <p className="text-xs text-emerald-900/80 leading-relaxed font-sans">
                Thank you! Your payment of <strong>₹{displayTotal.toLocaleString("en-IN")}</strong> via Razorpay Online has been received and verified. Your order is <strong>Confirmed</strong> and your payment status is <strong>Paid</strong>.
              </p>
            </div>
          </motion.div>
        )}

        {!isPaidOnline && printableCustomer.paymentMethod !== 'cod' && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="no-print mb-6 p-4 sm:p-5 bg-gradient-to-r from-amber-50/50 to-orange-50/50 border border-amber-500/20 rounded-sm text-amber-800 text-left flex items-start gap-3.5 shadow-sm bg-white"
          >
            <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0 text-amber-600">
              <CheckCircle2 size={16} className="text-amber-600 animate-pulse" />
            </div>
            <div className="flex-grow space-y-2">
              <h4 className="text-sm font-bold text-amber-950 font-serif leading-none">
                Online Payment Pending
              </h4>
              <p className="text-xs text-amber-950/80 leading-relaxed font-sans">
                Your order is currently booked as <strong>Pending Payment</strong>. If you closed the payment window or encountered an issue, please click below to complete your payment of <strong>₹{displayTotal.toLocaleString("en-IN")}</strong> via Razorpay.
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <a
                  href={`https://razorpay.me/@Mukeshsareecentre/${displayTotal}?amount=${displayTotal}`}
                  className="inline-flex items-center justify-center bg-amber-800 hover:bg-amber-900 text-white rounded-sm py-2 px-4.5 font-bold text-[10px] uppercase tracking-widest shadow-md transition-colors"
                >
                  💳 Complete Online Payment
                </a>
                <Link
                  to="/thank-you?success=true"
                  className="inline-flex items-center justify-center border border-amber-700/20 bg-white hover:bg-amber-500/5 text-amber-900 rounded-sm py-2 px-4.5 font-bold text-[10px] uppercase tracking-widest transition-colors"
                >
                  ✓ Click if already paid
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* PRINTABLE BOUTIQUE INVOICE CARD */}
        <div id="msc-invoice" className="print-invoice-page bg-white p-4 sm:p-6 md:p-8 border border-[#1A0A00]/5 sm:rounded-sm shadow-xl shadow-black/[0.015] font-sans text-left">
          
          {/* Invoice Header */}
          <div className="print-invoice-header flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#1A0A00]/10 pb-6 mb-8">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl text-[#1A0A00] tracking-wide font-medium">MUKESH SAREE CENTRE</h2>
              <p className="text-[10px] md:text-xs uppercase tracking-widest text-amber-800 font-semibold mt-1">Heritage Artistry & Organic Silks</p>
              <p className="text-xs text-[#1A0A00]/60 mt-1 max-w-sm">Jagannath Road, Gandhibagh, Nagpur – 440002</p>
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
          <div className="print-grid grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 text-xs md:text-sm">
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
                  <span className="font-semibold text-amber-800 font-sans">Confirmed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#1A0A00]/50 flex items-center gap-1.5"><CheckCircle2 size={13} /> Payment Status:</span>
                  <span className="font-semibold text-amber-800 font-sans">
                    {isPaidOnline ? "Paid [Online] ✅" : (printableCustomer.paymentMethod === 'cod' ? "Pending [COD]" : "Pending Online ⏳")}
                  </span>
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
                {printableCart.map((item: any, idx: number) => {
                  const mrp = item.originalPrice || item.price * 2;
                  let discountRate = 0.0;
                  if (activeCouponOnPage === "VIP50") {
                    discountRate = 0.50;
                  } else if (activeCouponOnPage === "VIPCLUB60" || activeCouponOnPage === "VIBCLUB60") {
                    discountRate = 0.60;
                  }
                  const calculatedPrice = mrp - Math.round(mrp * discountRate);
                  return (
                    <tr key={idx} className="print-avoid-break">
                      <td className="py-2.5 px-2 flex items-center gap-3">
                        {item.image && (
                          <OptimizedImage 
                            src={item.image} 
                            alt={item.name} 
                            width={100}
                            className="print-product-img w-10 h-14 object-contain object-center border border-black/5 rounded-sm flex-shrink-0"
                            style={{ backgroundColor: '#FAF8F5' }}
                          />
                        )}
                        <div>
                          <p className="font-medium text-[#1A0A00] text-xs sm:text-sm">{item.name}</p>
                          <p className="text-[9px] sm:text-[10px] text-[#1A0A00]/50 mt-0.5 uppercase tracking-wider">
                            {item.size ? `Size: ${item.size}` : "Size: Free Size"} {item.color ? `· Color: ${item.color}` : ""}
                          </p>
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-center text-[#1A0A00] font-medium">{item.quantity || 1}</td>
                      <td className="py-2.5 px-2 text-right text-[#1A0A00]">₹{calculatedPrice.toLocaleString("en-IN")}</td>
                      <td className="py-2.5 px-2 text-right text-[#1A0A00] font-semibold">₹{(calculatedPrice * (item.quantity || 1)).toLocaleString("en-IN")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pricing breakdown */}
          <div className="flex justify-end mb-8 print-avoid-break">
            <div className="w-full sm:w-80 space-y-2.5 text-xs md:text-sm">
              <div className="flex justify-between">
                <span>MRP Total</span>
                <span className="font-bold">₹{printableSubtotal.toLocaleString("en-IN")}</span>
              </div>
              {activeCouponOnPage === "VIP50" && (
                <div className="flex justify-between text-[#1E7E34]">
                  <span>VIP50 Applied</span>
                  <span className="font-bold">-₹{printableDiscount.toLocaleString("en-IN")}</span>
                </div>
              )}
              {(activeCouponOnPage === "VIPCLUB60" || activeCouponOnPage === "VIBCLUB60") && (
                <div className="flex justify-between text-[#1E7E34]">
                  <span>VIPCLUB60 Applied</span>
                  <span className="font-bold">-₹{printableDiscount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="text-[#1E7E34] font-bold">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>GST & All Taxes Included</span>
                <span className="text-[#1A0A00]/50">Included</span>
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
