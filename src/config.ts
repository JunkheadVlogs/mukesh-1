
const BASE_URL = import.meta.env.BASE_URL === '/' ? '' : import.meta.env.BASE_URL.replace(/\/$/, '');

const getValidApiUrl = () => {
  const url1 = import.meta.env.VITE_API_URL;
  if (url1 && !url1.startsWith('AIzaSy') && url1.length < 100) {
    return url1;
  }
  const url2 = import.meta.env.VITE_API_BASE_URL;
  if (url2 && !url2.startsWith('AIzaSy') && url2.length < 100) {
    return url2;
  }
  return '';
};

export const CONFIG = {
  API_BASE_URL: getValidApiUrl() || BASE_URL || '',
  STORE_NAME: import.meta.env.VITE_SITE_NAME || 'Mukesh Saree Centre',
  STORE_EMAIL: 'info@mukeshsarees.com',
  STORE_PHONE: import.meta.env.VITE_STORE_PHONE || '+91 7020664641',
  STORE_ADDRESS: import.meta.env.VITE_STORE_ADDRESS || 'Jagnath Road, Gandhibagh, Nagpur 440002',
  RAZORPAY_KEY_ID: import.meta.env.VITE_RAZORPAY_KEY_ID, // STRICTLY KEY_ID NO SECRET
};

export function getWhatsAppNumber(): string {
  const envNum = import.meta.env.VITE_WHATSAPP_NUMBER;
  if (envNum && typeof envNum === 'string') {
    const digits = envNum.replace(/[^0-9]/g, '');
    if (digits.length >= 10 && !envNum.includes('your_') && !envNum.includes('placeholder')) {
      return digits;
    }
  }
  const storePhone = CONFIG.STORE_PHONE;
  if (storePhone && typeof storePhone === 'string') {
    const digits = storePhone.replace(/[^0-9]/g, '');
    if (digits.length >= 10 && !storePhone.includes('your_') && !storePhone.includes('placeholder')) {
      return digits;
    }
  }
  return '917020664641';
}

export function getApiUrl(endpoint: string): string {
  const base = CONFIG.API_BASE_URL || "";
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  if (base.startsWith("http://") || base.startsWith("https://")) {
    const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
    
    // Safety check: if current page is loaded securely over HTTPS but base is an HTTP localhost url,
    // fallback to window.location.origin to prevent mixed content blocking and relative routing failures on the container
    if (typeof window !== "undefined") {
      if (window.location.protocol === "https:" && cleanBase.startsWith("http://localhost")) {
        return `${window.location.origin}${cleanEndpoint}`;
      }
    }
    return `${cleanBase}${cleanEndpoint}`;
  }

  const cleanBase = base ? (base.endsWith("/") ? base.slice(0, -1) : base) : "";
  
  if (typeof window !== "undefined") {
    return `${window.location.origin}${cleanBase}${cleanEndpoint}`;
  }
  return `${cleanBase}${cleanEndpoint}`;
}

export async function submitToGoogleSheets(data: any) {
  try {
    const response = await fetch(getApiUrl("api/submit-order"), {
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
      const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL || import.meta.env.VITE_SHEETS_WEBHOOK_URL || 'https://script.google.com/macros/s/AKfycbydYk2OFJIkU0i3yb1a0XAVqzJP73H8Gbuzqf102TtUkCyRcsL5F9Zc-DesrgP_ZVA/exec';
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



