// =========================================================================
//                   GOOGLE SHEETS INTEGRATION UTILITY
// =========================================================================
// File Name: src/utils/googleSheets.ts
//
// USAGE EXAMPLES:
//
// 1) In ExitIntentPopup.tsx onSubmit handler:
//    import { sendExitLeadToSheets } from '../utils/googleSheets';
//    await sendExitLeadToSheets({ name, phone });
//
// 2) In COD order handler (ProductPage.tsx / Checkout.tsx):
//    import { sendOrderToSheets } from './utils/googleSheets';
//    await sendOrderToSheets({
//      customerName, phone, productName: product.name,
//      size: selectedSize, price: product.price,
//      originalPrice: product.originalPrice,
//      couponUsed: appliedCoupon,
//      paymentMethod: 'COD',
//      address, pincode,
//      status: 'Pending COD',
//      orderId: firestoreOrderId
//    });
//
// 3) In Razorpay verify payment success handler:
//    await sendOrderToSheets({
//      customerName, phone, productName: product.name,
//      size: selectedSize, price: finalAmount / 100,
//      couponUsed: appliedCoupon,
//      paymentMethod: 'Razorpay (Online)',
//      address, pincode,
//      status: 'Paid ✅',
//      paymentId: razorpay_payment_id
//    });
// =========================================================================

// Support both potential environment variable naming conventions
const SHEETS_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL || import.meta.env.VITE_SHEETS_WEBHOOK_URL;

export interface ExitLeadData {
  name: string;
  phone: string;
}

export interface OrderSheetData {
  firstName?: string;
  customerName?: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  zip?: string;
  pincode?: string;
  productName: string;
  amount?: number;
  price?: number;
  size: string;
  sku?: string;
  color?: string;
  couponUsed?: string;
  source?: string;
  paymentMethod: string;
  status: string;
  orderId?: string;
  paymentId?: string;
}

/**
 * Submits exit intent lead capture data to Sheet Tab 1 (Exit Intent Leads)
 */
export async function sendExitLeadToSheets({ name, phone }: ExitLeadData): Promise<void> {
  if (!SHEETS_URL) {
    console.log('Sheets: VITE_GOOGLE_SHEETS_URL is not configured. Skipping submission.');
    return;
  }
  
  const device = /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop';
  
  try {
    await fetch(SHEETS_URL, {
      method: 'POST',
      mode: 'no-cors', // Required for Google Apps Script Web App endpoints (avoids preflight issues)
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'exit_lead',
        name,
        phone: phone.startsWith('+91') ? phone : '+91' + phone,
        couponCode: 'VIPCLUB60',
        page: window.location.pathname,
        device,
      })
    });
    // Note: no-cors fetch generates an opaque response, meaning we can't inspect the body or status code
    // but the request completes successfully and writes code directly into the spreadsheet.
  } catch (err) {
    console.warn('Sheets: exit lead send failed', err);
    // Silent fail so we don't interfere with the customer checkout experience
  }
}

/**
 * Submits successful COD/Prepaid order data to Sheet Tab 2 (Order Details)
 */
export async function sendOrderToSheets(orderData: OrderSheetData): Promise<void> {
  if (!SHEETS_URL) {
    console.log('Sheets: VITE_GOOGLE_SHEETS_URL is not configured. Skipping order submission.');
    return;
  }
  
  try {
    await fetch(SHEETS_URL, {
      method: 'POST',
      mode: 'no-cors', // Required for Google Apps Script Web App endpoints (avoids preflight issues)
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'order',
        ...orderData
      })
    });
  } catch (err) {
    console.warn('Sheets: order send failed', err);
    // Silent fail to preserve smooth checkout process
  }
}
