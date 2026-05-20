const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

// Cache to prevent duplicate ViewContent events on the same product page view
const trackedViewContents = new Set<string>();

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
      (window as any).fbq("init", pixelId);
      (window as any).fbq("track", "PageView");
      console.log(`[Pixel Tracker] Initialized on client with ID: ${pixelId}`);
    }
  };

  initMetaPixel();
}

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
    
    // Prevent duplicated ViewContent firing on re-renders, fulfilling Task #2
    if (trackedViewContents.has(pId)) {
      console.log(`[Pixel] ViewContent for product ${product.name} already tracked, skipping duplicate.`);
      return;
    }
    trackedViewContents.add(pId);

    // Identical event_id for browser and server (Task #3 & #4)
    const eventId = `vc_${pId}_${Date.now()}`;
    const valueNum = parseFloat(product.price) || 0;

    const fbp = getCookie('_fbp');
    const fbc = getCookie('_fbc');

    // Server CAPI Post (Task #8)
    fetch("/api/meta-capi", {
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
        event_source_url: window.location.href,
        user_data: { fbp, fbc }
      })
    }).catch(err => console.error("[CAPI ViewContent Error]", err));

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

    // Server CAPI Post (Task #8)
    fetch("/api/meta-capi", {
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
        event_source_url: window.location.href,
        user_data: { fbp, fbc }
      })
    }).catch(err => console.error("[CAPI AddToCart Error]", err));

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

    // Retrieve local stored client info to upgrade Event Match Quality (Task #9)
    let storedUserData: any = {};
    try {
      const info = localStorage.getItem('customer_checkout_info');
      if (info) storedUserData = JSON.parse(info);
    } catch (e) {}

    // Server CAPI Post (Task #8)
    fetch("/api/meta-capi", {
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
        event_source_url: window.location.href,
        user_data: {
          fbp,
          fbc,
          em: storedUserData.email || undefined,
          ph: storedUserData.phone || undefined,
          fn: storedUserData.name ? storedUserData.name.split(' ')[0] : undefined,
          ln: storedUserData.name ? storedUserData.name.split(' ').slice(1).join(' ') : undefined,
          ct: storedUserData.city || undefined,
          zp: storedUserData.zip || undefined
        }
      })
    }).catch(err => console.error("[CAPI InitiateCheckout Error]", err));

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

    let storedUserData: any = {};
    try {
      const info = localStorage.getItem('customer_checkout_info');
      if (info) storedUserData = JSON.parse(info);
    } catch (e) {}

    // Server CAPI Post (Task #8 & #9)
    fetch('/api/meta-capi', {
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
        event_source_url: window.location.href,
        user_data: {
          fbp,
          fbc,
          em: storedUserData.email || undefined,
          ph: storedUserData.phone || undefined,
          fn: storedUserData.name ? storedUserData.name.split(' ')[0] : undefined,
          ln: storedUserData.name ? storedUserData.name.split(' ').slice(1).join(' ') : undefined,
          ct: storedUserData.city || undefined,
          zp: storedUserData.zip || undefined
        }
      })
    }).catch(err => console.error('Meta CAPI Purchase error:', err));
    
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
