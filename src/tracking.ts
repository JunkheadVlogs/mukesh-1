import { CONFIG, getApiUrl } from "./config";

// Detect and ignore default placeholders or corporate business contact profiles in general metric tracking
export const isPlaceholderOrBusinessEmail = (email?: string): boolean => {
  if (!email) return true;
  const clean = email.trim().toLowerCase();
  return (
    clean === 'info@mukeshsarees.com' ||
    clean === 'test@gmail.com' ||
    clean === 'test@example.com' ||
    clean === 'example@example.com' ||
    clean.includes('mukeshsaree')
  );
};

export const isPlaceholderOrBusinessPhone = (phone?: string): boolean => {
  if (!phone) return true;
  const digits = phone.replace(/\D/g, '');
  return (
    digits === '9170206646' ||
    digits === '917020664641' ||
    digits === '7020664641' ||
    digits === '1234567890' ||
    digits === '9999999999' ||
    digits === '0000000000' ||
    digits.length < 10
  );
};

// Map sandboxed or testing run.app/localhost domains to production home domain for Meta compatibility
export const getProductionizedUrl = (urlStr: string): string => {
  try {
    const url = new URL(urlStr);
    if (url.hostname.includes('run.app') || url.hostname.includes('localhost') || url.hostname.includes('127.0.0.1')) {
      url.hostname = 'mukeshsarees.com';
      url.protocol = 'https:';
      url.port = '';
    }
    return url.toString();
  } catch (e) {
    return `https://mukeshsarees.com${urlStr.startsWith('/') ? '' : '/'}${urlStr}`;
  }
};

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

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const setCookie = (name: string, value: string, days: number) => {
  if (typeof document === "undefined") return;
  const d = new Date();
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + d.toUTCString();
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax;Secure`;
};

// Generates or retrieves a unique, high-entropy advertiser-side user ID (external_id)
// matches browser and server events to dramatically raise Meta Event Match Quality (EMQ)
export const getExternalId = (): string => {
  if (typeof window === "undefined") return "";
  let extId = localStorage.getItem('_msc_ext_id');
  if (!extId) {
    extId = getCookie('_msc_ext_id');
    if (!extId) {
      extId = 'msc_ext_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
    localStorage.setItem('_msc_ext_id', extId);
  }
  setCookie('_msc_ext_id', extId, 365);
  return extId;
};

// Map of tracked ViewContent events with their timestamps to prevent reactive duplicate fires
const trackedViewContentTimes = new Map<string, number>();

if (typeof window !== "undefined") {
  // Safe helper to bootstrap Meta Pixel dynamically if not already initialized
  const initMetaPixel = () => {
    if ((window as any).fbq) return;

    (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

    const pixelId = import.meta.env.VITE_META_PIXEL_ID || "3834311026859384"; // Fallback to provided defaults if none configured
    if (pixelId) {
      const extId = getExternalId();
      const initUserData: any = { external_id: extId };
 
      // Enrich initial loading parameters with stored validated user details if present
      try {
        const info = localStorage.getItem('customer_checkout_info');
        if (info) {
          const stored = JSON.parse(info);
          if (stored.email && !isPlaceholderOrBusinessEmail(stored.email)) {
            initUserData.em = stored.email;
          }
          if (stored.phone && !isPlaceholderOrBusinessPhone(stored.phone)) {
            initUserData.ph = stored.phone;
          }
          if (stored.name) {
            initUserData.fn = stored.name.split(' ')[0];
            initUserData.ln = stored.name.split(' ').slice(1).join(' ');
          }
          if (stored.city) initUserData.ct = stored.city;
          if (stored.zip) initUserData.zp = stored.zip;
        }
      } catch (e) {}
 
      (window as any).fbq("init", pixelId, initUserData);
      console.log(`[Pixel Tracker] Initialized on client with ID: ${pixelId} and matched user data`);
    }
  };
 
  // Defer initialization to avoid main thread blockage during startup
  const delayInit = () => {
    const run = () => {
      if ((window as any)._fbq_initialized) return;
      (window as any)._fbq_initialized = true;
      initMetaPixel();
    };

    const attach = () => {
      // Fallback if no activity is detected within a reasonable timeframe (lab audits)
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => setTimeout(run, 8500));
      } else {
        setTimeout(run, 9000);
      }

      // Trigger on first human interaction
      const triggerEvents = ["mousedown", "keypress", "touchstart", "scroll", "mousemove"];
      const triggerLoader = () => {
        run();
        triggerEvents.forEach((ev) => window.removeEventListener(ev, triggerLoader));
      };
      triggerEvents.forEach((ev) => window.addEventListener(ev, triggerLoader, { passive: true }));
    };

    if (document.readyState === "complete") {
      attach();
    } else {
      window.addEventListener("load", attach, { passive: true });
    }
  };
 
  delayInit();
}
 
// Dynamically updates Meta Pixel user properties matching the active session
export const updateTrackerUserData = (userData: { email?: string; phone?: string; name?: string; city?: string; zip?: string }) => {
  if (typeof window !== "undefined") {
    const pixelId = import.meta.env.VITE_META_PIXEL_ID || "3834311026859384";
    if (pixelId && (window as any).fbq) {
      const extId = getExternalId();
      const pixelUserData: any = { external_id: extId };
      if (userData.email && !isPlaceholderOrBusinessEmail(userData.email)) {
        pixelUserData.em = userData.email;
      }
      if (userData.phone && !isPlaceholderOrBusinessPhone(userData.phone)) {
        pixelUserData.ph = userData.phone;
      }
      if (userData.name) {
        pixelUserData.fn = userData.name.split(' ')[0];
        pixelUserData.ln = userData.name.split(' ').slice(1).join(' ');
      }
      if (userData.city) pixelUserData.ct = userData.city;
      if (userData.zip) pixelUserData.zp = userData.zip;
 
      (window as any).fbq("init", pixelId, pixelUserData);
      console.log("[Pixel Tracker] User properties updated dynamically.");
    }
  }
};
 
// Dynamic deduplicated PageView tracking on SPA transitions
export const trackPageView = (path: string) => {
  if (typeof window !== "undefined") {
    const eventId = `pv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const fbp = getCookie('_fbp');
    const fbc = getCookie('_fbc');
    const extId = getExternalId();
 
    // Fetch stored user data for PageView tracking
    let storedUserData: any = {};
    try {
      const info = localStorage.getItem('customer_checkout_info');
      if (info) storedUserData = JSON.parse(info);
    } catch (e) {}

    // Ensure we do not send default, mock, placeholder or business email/phone numbers
    const validEmail = storedUserData.email && !isPlaceholderOrBusinessEmail(storedUserData.email) ? storedUserData.email : undefined;
    const validPhone = storedUserData.phone && !isPlaceholderOrBusinessPhone(storedUserData.phone) ? storedUserData.phone : undefined;
 
    // Server-Side Conversions API PageView Trigger
    fetch(getApiUrl("api/sys-metric"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_name: "PageView",
        event_id: eventId,
        event_source_url: getProductionizedUrl(window.location.origin + path),
        user_data: {
          fbp,
          fbc,
          external_id: extId,
          em: validEmail,
          ph: validPhone,
          fn: storedUserData.name ? storedUserData.name.split(' ')[0] : undefined,
          ln: storedUserData.name ? storedUserData.name.split(' ').slice(1).join(' ') : undefined,
          ct: storedUserData.city || undefined,
          zp: storedUserData.zip || undefined
        }
      })
    }).catch(err => console.warn("[CAPI PageView Error]", err));
 
    // Browser Multi-Channel Meta Pixel trigger
    if ((window as any).fbq) {
      (window as any).fbq('track', 'PageView', {}, { eventID: eventId });
    }
  }
};
 
interface AdvancedMatchingData {
  em?: string;
  ph?: string;
  fn?: string;
  ln?: string;
  ct?: string;
  st?: string;
  zp?: string;
  country?: string;
}
 
export const getAdvancedMatchingData = (): AdvancedMatchingData => {
  const data: AdvancedMatchingData = {
    country: "in" // Default to India
  };
  try {
    const info = localStorage.getItem('customer_checkout_info');
    if (info) {
      const stored = JSON.parse(info);
      if (stored.email && !isPlaceholderOrBusinessEmail(stored.email)) {
        data.em = stored.email.trim();
      }
      if (stored.phone && !isPlaceholderOrBusinessPhone(stored.phone)) {
        data.ph = stored.phone.trim();
      }
      if (stored.name) {
        const nameParts = stored.name.trim().split(/\s+/);
        data.fn = nameParts[0] || "";
        data.ln = nameParts.slice(1).join(" ") || "";
      }
      if (stored.city) {
        data.ct = stored.city.trim();
        // Fallback for state mapping
        const cityLower = data.ct.toLowerCase();
        if (cityLower.includes("nagpur") || cityLower.includes("mumbai") || cityLower.includes("pune") || cityLower.includes("nashik")) {
          data.st = "maharashtra";
        } else if (cityLower.includes("delhi")) {
          data.st = "delhi";
        } else if (cityLower.includes("bangalore") || cityLower.includes("bengaluru")) {
          data.st = "karnataka";
        } else if (cityLower.includes("hyderabad")) {
          data.st = "telangana";
        } else if (cityLower.includes("chennai")) {
          data.st = "tamil nadu";
        } else if (cityLower.includes("kolkata")) {
          data.st = "west bengal";
        } else {
          data.st = "maharashtra"; // Default state fallback since stores are centered in Nagpur, MH
        }
      } else {
        data.st = "maharashtra"; // Default state fallback
      }
      if (stored.zip) data.zp = stored.zip.trim();
    } else {
      data.st = "maharashtra";
    }
  } catch (e) {
    console.warn("[Tracking] Error retrieving user matching data:", e);
  }
  return data;
};

export const trackWhatsAppClick = () => {
  if (typeof window !== "undefined") {
    if ((window as any).fbq) {
      (window as any).fbq('trackCustom', 'WhatsAppOrderClick', { currency: 'INR' });
    }
  }
};

export const trackExitIntentShown = () => {
  if (typeof window !== "undefined") {
    if ((window as any).fbq) {
      (window as any).fbq('trackCustom', 'ExitIntentShown');
    }
  }
};

export const trackViewContent = (product: any) => {
  if (typeof window !== "undefined") {
    const pId = product.sku || product.id || product.slug;
    
    // Prevent duplicated ViewContent firing on re-renders, while preserving correct tracking on subsequent visits
    const now = Date.now();
    const lastTrackedTime = trackedViewContentTimes.get(pId) || 0;
    if (now - lastTrackedTime < 5000) {
      console.log(`[Pixel] ViewContent for product ${product.name} already tracked within last 5 seconds, skipping duplicate.`);
      return;
    }
    trackedViewContentTimes.set(pId, now);

    // Identical event_id for browser and server (Task #3 & #4)
    const eventId = `vc_${pId}_${Date.now()}`;
    const valueNum = parseFloat(product.price) || 0;

    const fbp = getCookie('_fbp');
    const fbc = getCookie('_fbc');
    const extId = getExternalId();
    const userMatch = getAdvancedMatchingData();

    // Reinit Pixel to boost EMQ before track
    const pixelId = import.meta.env.VITE_META_PIXEL_ID || "3834311026859384";
    if ((window as any).fbq) {
      (window as any).fbq("init", pixelId, { external_id: extId, ...userMatch });
    }

    // Server CAPI Post (Task #8)
    fetch(getApiUrl("api/sys-metric"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_name: "ViewContent",
        event_id: eventId,
        value: valueNum,
        currency: "INR",
        content_type: "product",
        content_name: product.name,
        content_ids: [pId],
        contents: [{ id: pId, quantity: 1 }],
        num_items: 1,
        event_source_url: getProductionizedUrl(window.location.href),
        user_data: { fbp, fbc, external_id: extId, ...userMatch }
      })
    }).catch(err => console.warn("[CAPI ViewContent Error]", err));

    // Meta Pixel (Deduplicated via eventID matches)
    if ((window as any).fbq) {
      (window as any).fbq('track', 'ViewContent', {
        content_ids: [pId],
        content_type: 'product',
        content_name: product.name,
        content_category: product.category || 'Sarees',
        contents: [{ id: pId, quantity: 1 }],
        value: valueNum,
        currency: 'INR'
      }, { eventID: eventId });
    }
    
    // Pinterest Tag
    if ((window as any).pintrk) {
      (window as any).pintrk('track', 'pagevisit', {
        product_id: pId,
        product_name: product.name,
        product_price: valueNum,
        currency: 'INR'
      });
    }

    // Google Tag Manager / GA4 DataLayer
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({ ecommerce: null }); // Clear previous
    (window as any).dataLayer.push({
      event: 'view_item',
      ecommerce: {
        currency: 'INR',
        value: valueNum,
        items: [{
          item_id: pId,
          item_name: product.name,
          item_category: product.category || 'Sarees',
          price: valueNum,
          quantity: 1
        }]
      }
    });
  }
};

export const trackAddToCart = (product: any, quantity: number = 1) => {
  if (typeof window !== "undefined") {
    const productPrice = parseFloat(product.price) || 0;
    const valueNum = productPrice * quantity;
    const pId = product.sku || product.id;
    
    // Identical event_id for browser and server (Task #3 & #4)
    const eventId = `atc_${pId}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const fbp = getCookie('_fbp');
    const fbc = getCookie('_fbc');
    const extId = getExternalId();
    const userMatch = getAdvancedMatchingData();

    // Reinit Pixel to boost EMQ before track
    const pixelId = import.meta.env.VITE_META_PIXEL_ID || "3834311026859384";
    if ((window as any).fbq) {
      (window as any).fbq("init", pixelId, { external_id: extId, ...userMatch });
    }

    // Server CAPI Post (Task #8)
    fetch(getApiUrl("api/sys-metric"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_name: "AddToCart",
        event_id: eventId,
        value: valueNum,
        currency: "INR",
        content_type: "product",
        content_name: product.name,
        content_ids: [pId],
        contents: [{ id: pId, quantity: quantity }],
        num_items: quantity,
        event_source_url: getProductionizedUrl(window.location.href),
        user_data: { fbp, fbc, external_id: extId, ...userMatch }
      })
    }).catch(err => console.warn("[CAPI AddToCart Error]", err));

    // Meta Pixel
    if ((window as any).fbq) {
      (window as any).fbq('track', 'AddToCart', {
        content_ids: [pId],
        content_name: product.name,
        content_type: 'product',
        contents: [{ id: pId, quantity: quantity }],
        value: valueNum,
        currency: 'INR'
      }, { eventID: eventId });
    }
    
    // Pinterest Tag
    if ((window as any).pintrk) {
      (window as any).pintrk('track', 'addtocart', {
        product_id: pId,
        product_name: product.name,
        product_price: productPrice,
        currency: 'INR',
        product_quantity: quantity
      });
    }

    // Google Tag Manager / GA4 DataLayer
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({ ecommerce: null }); // Clear previous
    (window as any).dataLayer.push({
      event: 'add_to_cart',
      ecommerce: {
        currency: 'INR',
        value: valueNum,
        items: [{
          item_id: pId,
          item_name: product.name,
          item_category: product.category,
          price: productPrice,
          quantity: quantity
        }]
      }
    });
  }
};

export const trackInitiateCheckout = (totalValue: number, items: any[]) => {
  if (typeof window !== "undefined") {
    const itemIds = items.map(item => item.sku || item.id);
    const numericTotal = parseFloat(totalValue.toString()) || 0;

    // Identical event_id for browser and server (Task #3 & #4)
    const eventId = `ic_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const fbp = getCookie('_fbp');
    const fbc = getCookie('_fbc');
    const extId = getExternalId();
    const userMatch = getAdvancedMatchingData();

    // Reinit Pixel to boost EMQ before track
    const pixelId = import.meta.env.VITE_META_PIXEL_ID || "3834311026859384";
    if ((window as any).fbq) {
      (window as any).fbq("init", pixelId, { external_id: extId, ...userMatch });
    }

    // Server CAPI Post (Task #8)
    fetch(getApiUrl("api/sys-metric"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_name: "InitiateCheckout",
        event_id: eventId,
        value: numericTotal,
        currency: "INR",
        content_type: "product",
        content_name: items.map(i => i.name).join(', '),
        content_ids: itemIds,
        contents: items.map(item => ({ id: item.sku || item.id, quantity: item.quantity || 1 })),
        num_items: items.reduce((total, item) => total + (item.quantity || 1), 0),
        event_source_url: getProductionizedUrl(window.location.href),
        user_data: {
          fbp,
          fbc,
          external_id: extId,
          ...userMatch
        }
      })
    }).catch(err => console.warn("[CAPI InitiateCheckout Error]", err));

    // Meta Pixel
    if ((window as any).fbq) {
      (window as any).fbq('track', 'InitiateCheckout', {
        content_ids: itemIds,
        content_type: 'product',
        content_name: items.map(i => i.name).join(', '),
        num_items: items.reduce((total, item) => total + (item.quantity || 1), 0),
        contents: items.map(item => ({ id: item.sku || item.id, quantity: item.quantity || 1 })),
        value: numericTotal,
        currency: 'INR'
      }, { eventID: eventId });
    }
    
    // Pinterest Tag
    if ((window as any).pintrk) {
      (window as any).pintrk('track', 'checkout', {
        product_ids: itemIds,
        value: numericTotal,
        currency: 'INR',
        product_quantity: items.length
      });
    }

    // Google Tag Manager / GA4 DataLayer
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({ ecommerce: null }); // Clear previous
    (window as any).dataLayer.push({
      event: 'begin_checkout',
      ecommerce: {
        currency: 'INR',
        value: numericTotal,
        items: items.map((item, index) => ({
          item_id: item.sku || item.id,
          item_name: item.name,
          item_category: item.category,
          price: Number(item.price) || 0,
          quantity: item.quantity || 1,
          index: index
        }))
      }
    });
  }
};

export const trackPurchase = (totalValue: number, items: any[], transactionId: string) => {
  if (typeof window !== "undefined") {
    // Prevent duplicate tracking for the same order (Task #10)
    const trackedKey = `tracked_order_${transactionId}`;
    if (localStorage.getItem(trackedKey)) {
      console.log(`[Pixel] Purchase event ${transactionId} already tracked, skipping duplicate.`);
      return;
    }
    localStorage.setItem(trackedKey, 'true');
    localStorage.setItem('hasPurchased', 'true');
    
    const itemIds = items.map(item => item.sku || item.id);
    const numericTotal = parseFloat(totalValue.toString()) || 0;

    const fbp = getCookie('_fbp');
    const fbc = getCookie('_fbc');
    const extId = getExternalId();
    const userMatch = getAdvancedMatchingData();

    // Reinit Pixel to boost EMQ before track
    const pixelId = import.meta.env.VITE_META_PIXEL_ID || "3834311026859384";
    if ((window as any).fbq) {
      (window as any).fbq("init", pixelId, { external_id: extId, ...userMatch });
    }

    // Server CAPI Post (Task #8 & #9)
    fetch(getApiUrl("api/sys-metric"), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: 'Purchase',
        event_id: transactionId,
        value: numericTotal,
        currency: 'INR',
        content_type: 'product',
        content_name: items.map(i => i.name).join(', '),
        content_ids: itemIds,
        contents: items.map(item => ({ id: item.sku || item.id, quantity: item.quantity || 1 })),
        num_items: items.length,
        event_source_url: getProductionizedUrl(window.location.href),
        user_data: {
          fbp,
          fbc,
          external_id: extId,
          ...userMatch
        }
      })
    }).catch(err => console.warn('Meta CAPI Purchase error:', err));
    
    // Meta Pixel
    if ((window as any).fbq) {
      (window as any).fbq('track', 'Purchase', {
        value: numericTotal,
        currency: 'INR',
        content_ids: itemIds,
        content_name: items.map(i => i.name).join(', '),
        content_type: 'product',
        contents: items.map(item => ({ id: item.sku || item.id, quantity: item.quantity || 1 })),
        num_items: items.reduce((total, item) => total + (item.quantity || 1), 0)
      }, { eventID: transactionId });
    }
    
    // Pinterest Tag
    if ((window as any).pintrk) {
      (window as any).pintrk('track', 'checkout', {
        product_ids: itemIds,
        value: numericTotal,
        currency: 'INR',
        product_quantity: items.length,
        order_id: transactionId
      });
    }

    // Google Tag Manager / GA4 DataLayer
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({ ecommerce: null }); // Clear previous
    (window as any).dataLayer.push({
      event: 'purchase',
      ecommerce: {
        transaction_id: transactionId,
        value: numericTotal,
        tax: 0,
        shipping: 0,
        currency: 'INR',
        items: items.map((item, index) => ({
          item_id: item.sku || item.id,
          item_name: item.name,
          price: Number(item.price) || 0,
          quantity: item.quantity,
          index: index
        }))
      }
    });
  }
};

export const trackRemoveFromCart = (product: any, quantity: number = 1) => {
  if (typeof window !== "undefined") {
    const productPrice = parseFloat(product.price) || 0;
    const valueNum = productPrice * quantity;
    const pId = product.sku || product.id || product.slug;

    // Google Tag Manager / GA4 DataLayer
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({ ecommerce: null }); // Clear previous
    (window as any).dataLayer.push({
      event: 'remove_from_cart',
      ecommerce: {
        currency: 'INR',
        value: valueNum,
        items: [{
          item_id: pId,
          item_name: product.name,
          item_category: product.category || 'Sarees',
          price: productPrice,
          quantity: quantity
        }]
      }
    });

    if ((window as any).fbq) {
      (window as any).fbq('trackCustom', 'RemoveFromCart', {
        content_ids: [pId],
        content_name: product.name,
        content_type: 'product',
        value: valueNum,
        currency: 'INR'
      });
    }
  }
};

export const trackViewItemList = (productsList: any[], categoryName?: string) => {
  if (typeof window !== "undefined" && productsList.length > 0) {
    const itemsData = productsList.slice(0, 12).map((p, idx) => ({
      item_id: p.sku || p.id || p.slug,
      item_name: p.name,
      item_category: p.category || categoryName || 'Collection',
      price: parseFloat(p.price) || 0,
      index: idx
    }));

    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({ ecommerce: null }); // Clear previous
    (window as any).dataLayer.push({
      event: 'view_item_list',
      ecommerce: {
        item_list_name: categoryName || 'Shop Collection',
        items: itemsData
      }
    });
  }
};

export const trackSelectItem = (product: any) => {
  if (typeof window !== "undefined") {
    const pId = product.sku || product.id || product.slug;
    const productPrice = parseFloat(product.price) || 0;

    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({ ecommerce: null }); // Clear previous
    (window as any).dataLayer.push({
      event: 'select_item',
      ecommerce: {
        items: [{
          item_id: pId,
          item_name: product.name,
          item_category: product.category,
          price: productPrice
        }]
      }
    });
  }
};

export const trackLead = (userData?: { email?: string; phone?: string; name?: string; city?: string; zip?: string }) => {
  if (typeof window !== "undefined") {
    if (userData) {
      try {
        const existing = localStorage.getItem('customer_checkout_info');
        const parsed = existing ? JSON.parse(existing) : {};
        localStorage.setItem('customer_checkout_info', JSON.stringify({
          ...parsed,
          email: userData.email || parsed.email || "",
          phone: userData.phone || parsed.phone || "",
          name: userData.name || parsed.name || "",
          city: userData.city || parsed.city || "",
          zip: userData.zip || parsed.zip || ""
        }));
      } catch (e) {}
    }

    const eventId = `ld_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const fbp = getCookie('_fbp');
    const fbc = getCookie('_fbc');
    const extId = getExternalId();
    const userMatch = getAdvancedMatchingData();

    // Reinit Pixel to boost EMQ before track
    const pixelId = import.meta.env.VITE_META_PIXEL_ID || "3834311026859384";
    if ((window as any).fbq) {
      (window as any).fbq("init", pixelId, { external_id: extId, ...userMatch });
    }

    // Server-Side CAPI
    fetch(getApiUrl("api/sys-metric"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_name: "Lead",
        event_id: eventId,
        event_source_url: getProductionizedUrl(window.location.href),
        user_data: {
          fbp,
          fbc,
          external_id: extId,
          ...userMatch
        }
      })
    }).catch(err => console.warn("[CAPI Lead Error]", err));

    // Pixel track
    if ((window as any).fbq) {
      (window as any).fbq('track', 'Lead', {
        content_name: 'Lead Capture Form',
        currency: 'INR',
        value: 60
      }, { eventID: eventId });
    }
  }
};

export const trackContact = (userData?: { email?: string; phone?: string; name?: string; city?: string; zip?: string }) => {
  if (typeof window !== "undefined") {
    if (userData) {
      try {
        const existing = localStorage.getItem('customer_checkout_info');
        const parsed = existing ? JSON.parse(existing) : {};
        localStorage.setItem('customer_checkout_info', JSON.stringify({
          ...parsed,
          email: userData.email || parsed.email || "",
          phone: userData.phone || parsed.phone || "",
          name: userData.name || parsed.name || "",
          city: userData.city || parsed.city || "",
          zip: userData.zip || parsed.zip || ""
        }));
      } catch (e) {}
    }

    const eventId = `ct_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const fbp = getCookie('_fbp');
    const fbc = getCookie('_fbc');
    const extId = getExternalId();
    const userMatch = getAdvancedMatchingData();

    // Reinit Pixel to boost EMQ before track
    const pixelId = import.meta.env.VITE_META_PIXEL_ID || "3834311026859384";
    if ((window as any).fbq) {
      (window as any).fbq("init", pixelId, { external_id: extId, ...userMatch });
    }

    // Server-Side CAPI
    fetch(getApiUrl("api/sys-metric"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_name: "Contact",
        event_id: eventId,
        event_source_url: getProductionizedUrl(window.location.href),
        user_data: {
          fbp,
          fbc,
          external_id: extId,
          ...userMatch
        }
      })
    }).catch(err => console.warn("[CAPI Contact Error]", err));

    // Pixel track
    if ((window as any).fbq) {
      (window as any).fbq('track', 'Contact', {
        content_name: 'Contact Form Inquiry'
      }, { eventID: eventId });
    }
  }
};
