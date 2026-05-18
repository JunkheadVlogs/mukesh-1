export const trackViewContent = (product: any) => {
  if (typeof window !== "undefined") {
    // Meta Pixel
    if ((window as any).fbq) {
      (window as any).fbq('track', 'ViewContent', {
        content_ids: [product.sku || product.id],
        content_type: 'product',
        content_name: product.name,
        content_category: product.category || 'Sarees',
        value: Number(product.price) || 0,
        currency: 'INR'
      });
    }
    
    // Pinterest Tag
    if ((window as any).pintrk) {
      (window as any).pintrk('track', 'pagevisit', {
        product_id: product.sku || product.id,
        product_name: product.name,
        product_price: Number(product.price) || 0,
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
        value: Number(product.price) || 0,
        items: [{
          item_id: product.sku || product.id,
          item_name: product.name,
          item_category: product.category,
          price: Number(product.price) || 0,
          quantity: 1
        }]
      }
    });
  }
};

export const trackAddToCart = (product: any, quantity: number = 1) => {
  if (typeof window !== "undefined") {
    const productPrice = Number(product.price) || 0;
    const valueNum = productPrice * quantity;
    // Meta Pixel
    if ((window as any).fbq) {
      (window as any).fbq('track', 'AddToCart', {
        content_ids: [product.sku || product.id],
        content_type: 'product',
        content_name: product.name,
        value: valueNum,
        currency: 'INR'
      });
    }
    
    // Pinterest Tag
    if ((window as any).pintrk) {
      (window as any).pintrk('track', 'addtocart', {
        product_id: product.sku || product.id,
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
          item_id: product.sku || product.id,
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
    const numericTotal = Number(totalValue) || 0;
    
    // Meta Pixel
    if ((window as any).fbq) {
      (window as any).fbq('track', 'InitiateCheckout', {
        content_ids: itemIds,
        num_items: items.reduce((total, item) => total + (item.quantity || 1), 0),
        value: numericTotal,
        currency: 'INR'
      });
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
    localStorage.setItem('hasPurchased', 'true');
    const itemIds = items.map(item => item.sku || item.id);
    const numericTotal = Number(totalValue) || 0;
    
    // Server-Side Conversions API Request (CAPI)
    fetch('/api/meta-capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: 'Purchase',
        event_id: transactionId,
        value: numericTotal,
        currency: 'INR',
        content_ids: itemIds,
        contents: items.map(item => ({ id: item.sku || item.id, quantity: item.quantity || 1 })),
        num_items: items.length
      })
    }).catch(err => console.error('Meta CAPI error:', err));
    
    // Meta Pixel
    if ((window as any).fbq) {
      (window as any).fbq('track', 'Purchase', {
        content_ids: itemIds,
        content_type: 'product',
        value: numericTotal,
        currency: 'INR',
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
