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
  }
};

export const trackAddToCart = (product: any) => {
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
        product_quantity: 1
      });
    }
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
  }
};
