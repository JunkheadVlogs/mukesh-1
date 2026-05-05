export const trackViewContent = (product: any) => {
  if (typeof window !== "undefined") {
    // Meta Pixel
    if ((window as any).fbq) {
      (window as any).fbq('track', 'ViewContent', {
        content_name: product.name,
        content_ids: [product.sku || product.id],
        content_type: 'product',
        value: product.price,
        currency: 'INR'
      });
    }
    
    // Pinterest Tag
    if ((window as any).pintrk) {
      (window as any).pintrk('track', 'pagevisit', {
        product_id: product.sku || product.id,
        product_name: product.name,
        product_price: product.price,
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
        value: product.price,
        items: [{
          item_id: product.sku || product.id,
          item_name: product.name,
          item_category: product.category,
          price: product.price,
          quantity: 1
        }]
      }
    });
  }
};

export const trackAddToCart = (product: any, quantity: number = 1) => {
  if (typeof window !== "undefined") {
    // Meta Pixel
    if ((window as any).fbq) {
      (window as any).fbq('track', 'AddToCart', {
        content_name: product.name,
        content_ids: [product.sku || product.id],
        content_type: 'product',
        value: product.price,
        currency: 'INR'
      });
    }
    
    // Pinterest Tag
    if ((window as any).pintrk) {
      (window as any).pintrk('track', 'addtocart', {
        product_id: product.sku || product.id,
        product_name: product.name,
        product_price: product.price,
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
        value: product.price * quantity,
        items: [{
          item_id: product.sku || product.id,
          item_name: product.name,
          item_category: product.category,
          price: product.price,
          quantity: quantity
        }]
      }
    });
  }
};

export const trackInitiateCheckout = (totalValue: number, items: any[]) => {
  if (typeof window !== "undefined") {
    const itemIds = items.map(item => item.sku || item.id);
    
    // Meta Pixel
    if ((window as any).fbq) {
      (window as any).fbq('track', 'InitiateCheckout', {
        content_ids: itemIds,
        content_type: 'product',
        value: totalValue,
        currency: 'INR',
        num_items: items.length
      });
    }
    
    // Pinterest Tag
    if ((window as any).pintrk) {
      (window as any).pintrk('track', 'checkout', {
        product_ids: itemIds,
        value: totalValue,
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
        value: totalValue,
        items: items.map((item, index) => ({
          item_id: item.sku || item.id,
          item_name: item.name,
          item_category: item.category,
          price: item.price,
          quantity: item.quantity || 1,
          index: index
        }))
      }
    });
  }
};

export const trackPurchase = (totalValue: number, items: any[], transactionId: string) => {
  if (typeof window !== "undefined") {
    const itemIds = items.map(item => item.sku || item.id);
    
    // Meta Pixel
    if ((window as any).fbq) {
      (window as any).fbq('track', 'Purchase', {
        content_ids: itemIds,
        content_type: 'product',
        value: totalValue,
        currency: 'INR',
        num_items: items.length,
        order_id: transactionId
      });
    }
    
    // Pinterest Tag
    if ((window as any).pintrk) {
      (window as any).pintrk('track', 'checkout', {
        product_ids: itemIds,
        value: totalValue,
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
        value: totalValue,
        tax: 0,
        shipping: 0,
        currency: 'INR',
        items: items.map((item, index) => ({
          item_id: item.sku || item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity,
          index: index
        }))
      }
    });
  }
};
