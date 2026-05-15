
const BASE_URL = import.meta.env.BASE_URL === '/' ? '' : import.meta.env.BASE_URL.replace(/\/$/, '');

export const CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || BASE_URL || '',
  STORE_NAME: 'Mukesh Saree Centre',
  STORE_EMAIL: 'info.mukeshsareecentre@gmail.com',
  STORE_PHONE: '+91 7020664641',
  STORE_ADDRESS: 'Jaganth Road, Gandibagh, Nagpur 440002',
  RAZORPAY_KEY_ID: import.meta.env.VITE_RAZORPAY_KEY_ID, // STRICTLY KEY_ID NO SECRET
};

export async function submitToGoogleSheets(data: any) {
  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/api/submit-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Failed to submit order to backend proxy: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn("Order Submission Proxy Error, attempting direct fallback:", error);
    
    // Direct Fallback to Google Apps Script bypassing Node backend entirely
    try {
      const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbydYk2OFJIkU0i3yb1a0XAVqzJP73H8Gbuzqf102TtUkCyRcsL5F9Zc-DesrgP_ZVA/exec';
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain" // Required for no-cors to avoid preflight
        },
        body: JSON.stringify(data)
      });
      // no-cors fetch is opaque, we won't see response but the request is sent!
      return { status: "success", fallback: true };
    } catch (fallbackErr) {
      console.error("Direct fallback also failed:", fallbackErr);
      throw error; // throw original
    }
  }
}



