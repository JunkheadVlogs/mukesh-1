import { BUSINESS_INFO } from "./business";

export interface RouteSeoConfig {
  path: string; // e.g. "/malvika-saree-buying-guide/"
  title: string;
  description: string;
  h1: string;
  canonical: string;
  ogType?: string;
  ogImage?: string;
}

export const ROUTE_SEO_REGISTRY: Record<string, RouteSeoConfig> = {
  "/": {
    path: "/",
    title: `${BUSINESS_INFO.name} | Wholesale & Retail Sarees Since ${BUSINESS_INFO.established}`,
    description: `🏬 Wholesale & Retail Sarees Since ${BUSINESS_INFO.established} | 📦 Bulk Orders & Single Pieces | 💵 COD Available | 🚚 Free Shipping | Nagpur`,
    h1: "Mukesh Saree Centre Nagpur",
    canonical: "https://mukeshsarees.com/",
    ogType: "website",
    ogImage: "https://mukeshsarees.com/og-image.jpg"
  },
  "/shop/": {
    path: "/shop/",
    title: "Shop Sarees & Women's Ethnic Wear | Mukesh Saree Centre",
    description: "Explore the complete ethnic wear collection at Mukesh Saree Centre. Shop authentic handloom sarees, designer silks, and festive drapes with COD & free delivery across India.",
    h1: "Shop Sarees & Women's Ethnic Wear",
    canonical: "https://mukeshsarees.com/shop/",
    ogType: "website"
  },
  "/sarees/": {
    path: "/sarees/",
    title: "Buy Sarees Online | Mukesh Saree Centre",
    description: "Discover our premium collection of sarees including pure silk, soft cotton, linen, and artisanal drapes. Trusted weavers since 1978 with Cash on Delivery available.",
    h1: "Premium Saree Collection",
    canonical: "https://mukeshsarees.com/sarees/",
    ogType: "website"
  },
  "/sarees/banarasi-sarees/": {
    path: "/sarees/banarasi-sarees/",
    title: "Banarasi Silk Sarees Online | Mukesh Saree Centre",
    description: "Shop opulent Banarasi silk sarees with rich zari brocade and heritage motifs. Perfect for weddings and grand celebrations. Free shipping and COD available.",
    h1: "Banarasi Silk Sarees",
    canonical: "https://mukeshsarees.com/sarees/banarasi-sarees/",
    ogType: "website"
  },
  "/sarees/linen-sarees/": {
    path: "/sarees/linen-sarees/",
    title: "Buy Linen Sarees Online | Mukesh Saree Centre",
    description: "Shop breathable, lightweight pure linen sarees. Featuring artistic botanical prints, pastel shades, and effortless drapes for work and casual elegance.",
    h1: "Pure Linen Sarees",
    canonical: "https://mukeshsarees.com/sarees/linen-sarees/",
    ogType: "website"
  },
  "/sarees/cotton-sarees/": {
    path: "/sarees/cotton-sarees/",
    title: "Cotton Sarees Online | Mukesh Saree Centre",
    description: "Browse comfortable handloom and mulmul cotton sarees. Breathable weaves, vibrant colors, and classic prints made for all-day comfort.",
    h1: "Handloom Cotton Sarees",
    canonical: "https://mukeshsarees.com/sarees/cotton-sarees/",
    ogType: "website"
  },
  "/sarees/paithani-sarees/": {
    path: "/sarees/paithani-sarees/",
    title: "Paithani Sarees Online | Mukesh Saree Centre Nagpur",
    description: "Buy authentic Paithani sarees featuring traditional zari borders, rich silk pallus, and peacock motifs from Nagpur's heritage store since 1978.",
    h1: "Paithani Silk Sarees",
    canonical: "https://mukeshsarees.com/sarees/paithani-sarees/",
    ogType: "website"
  },
  "/sarees/silk-sarees/": {
    path: "/sarees/silk-sarees/",
    title: "Silk Sarees Online | Mukesh Saree Centre Nagpur",
    description: "Explore luxurious pure silk and tissue silk sarees. Handpicked designs with lustrous sheen, elegant borders, and festive grandeur with COD.",
    h1: "Pure Silk Sarees",
    canonical: "https://mukeshsarees.com/sarees/silk-sarees/",
    ogType: "website"
  },
  "/lehengas/": {
    path: "/lehengas/",
    title: "Lehengas Online | Mukesh Saree Centre",
    description: "Shop exquisite bridal, wedding, and festive designer lehengas at Mukesh Saree Centre. Intricate embroidery, rich zari craftsmanship, and custom sizing support.",
    h1: "Designer Bridal & Festive Lehengas",
    canonical: "https://mukeshsarees.com/lehengas/",
    ogType: "website"
  },
  "/suits/": {
    path: "/suits/",
    title: "Designer Suits & Kurta Sets | Mukesh Saree Centre",
    description: "Discover designer salwar suits, anarkalis, and elegant kurta sets at Mukesh Saree Centre. Premium fabrics, tailored silhouettes, and timeless Indian craftsmanship.",
    h1: "Designer Suits & Kurta Ensembles",
    canonical: "https://mukeshsarees.com/suits/",
    ogType: "website"
  },
  "/categories/": {
    path: "/categories/",
    title: `All Collections & Categories | ${BUSINESS_INFO.name}`,
    description: "Browse our entire catalog of premium ethnic clothing, from Malvika sarees and uniform sarees to bridal lehengas and festive co-ords.",
    h1: "Shop By Category",
    canonical: "https://mukeshsarees.com/categories/",
    ogType: "website"
  },
  "/about/": {
    path: "/about/",
    title: "About Mukesh Saree Centre | Saree Shop in Nagpur Since 1978",
    description: "Discover the 46-year legacy of Mukesh Saree Centre in Gandhibagh, Nagpur. Founded in 1978 by Shri Nanakram Khemchandani, offering sarees, lehengas, & wholesale bulk orders.",
    h1: "Our Story",
    canonical: "https://mukeshsarees.com/about/",
    ogType: "website"
  },
  "/contact/": {
    path: "/contact/",
    title: "Contact Us | Mukesh Saree Centre Nagpur — WhatsApp, Phone & Store Address",
    description: "Contact Mukesh Saree Centre in Nagpur. Call or WhatsApp +91 70206 64641. Visit our store on Jagnath Road, Gandhibagh, Nagpur 440002. Open Mon–Sat, 10AM–8PM.",
    h1: "Contact Us",
    canonical: "https://mukeshsarees.com/contact/",
    ogType: "website"
  },
  "/faqs/": {
    path: "/faqs/",
    title: "Frequently Asked Questions (FAQ) | Mukesh Saree Centre",
    description: "Browse frequently asked questions regarding shopping, delivery, payments, pure silks, linen fabrics, customized blouses, wholesale rates, and returns at Mukesh Saree Centre, Nagpur.",
    h1: "Frequently Asked Questions",
    canonical: "https://mukeshsarees.com/faqs/",
    ogType: "website"
  },
  "/reviews/": {
    path: "/reviews/",
    title: `Verified Customer Reviews & Feedback | ${BUSINESS_INFO.name} Nagpur`,
    description: `Read genuine customer reviews for ${BUSINESS_INFO.name} in Gandhibagh, Nagpur. Trusted saree store & wholesale supplier since 1978.`,
    h1: "Customer Reviews & Feedback",
    canonical: "https://mukeshsarees.com/reviews/",
    ogType: "website"
  },
  "/customer-reviews/": {
    path: "/customer-reviews/",
    title: `Verified Customer Reviews & Feedback | ${BUSINESS_INFO.name} Nagpur`,
    description: `Read genuine customer reviews for ${BUSINESS_INFO.name} in Gandhibagh, Nagpur. Trusted saree store & wholesale supplier since 1978.`,
    h1: "Customer Reviews & Feedback",
    canonical: "https://mukeshsarees.com/reviews/",
    ogType: "website"
  },
  "/why-mukesh-saree-centre/": {
    path: "/why-mukesh-saree-centre/",
    title: "Why Choose Mukesh Saree Centre | Saree Store Nagpur Est. 1978",
    description: "Learn why Mukesh Saree Centre in Gandhibagh, Nagpur is Vidarbha's most trusted saree destination for 46+ years. Pure fabrics, wholesale prices, pan-India COD.",
    h1: "Why Choose Mukesh Saree Centre?",
    canonical: "https://mukeshsarees.com/why-mukesh-saree-centre/",
    ogType: "website"
  },
  "/fabric-authenticity-and-care/": {
    path: "/fabric-authenticity-and-care/",
    title: "Fabric Authenticity & Saree Care Guide | Mukesh Saree Centre Nagpur",
    description: "Factual fabric classifications, weave transparency, wash care recommendations, and saree dimensions from Mukesh Saree Centre, Gandhibagh, Nagpur. Established 1978.",
    h1: "Fabric Authenticity & Care",
    canonical: "https://mukeshsarees.com/fabric-authenticity-and-care/",
    ogType: "website"
  },
  "/media/": {
    path: "/media/",
    title: "Media & Press Coverage | Mukesh Saree Centre Nagpur",
    description: "Official media info, press resources, and verified digital presence for Mukesh Saree Centre, Gandhibagh, Nagpur. Saree landmark since 1978.",
    h1: "Media Coverage & Proof",
    canonical: "https://mukeshsarees.com/media/",
    ogType: "website"
  },
  "/uniform-saree-bulk-orders/": {
    path: "/uniform-saree-bulk-orders/",
    title: "Uniform Sarees & Wholesale Bulk Orders | Mukesh Saree Centre Nagpur",
    description: "Buy corporate, school, teacher, and hospital uniform sarees in bulk from Mukesh Saree Centre, Gandhibagh, Nagpur. Direct weaver prices, GST invoices, pan-India delivery.",
    h1: "Uniform Sarees & Bulk Orders",
    canonical: "https://mukeshsarees.com/uniform-saree-bulk-orders/",
    ogType: "website"
  },
  "/malvika-saree-buying-guide/": {
    path: "/malvika-saree-buying-guide/",
    title: "Malvika Saree Buying Guide | Mukesh Saree Centre Nagpur",
    description: "Everything you need to know about tissue micro-blend Malvika sarees from Mukesh Saree Centre Nagpur. Lightweight daily drape, easy care, teacher uniforms, and styling tips.",
    h1: "Malvika Saree Buying Guide",
    canonical: "https://mukeshsarees.com/malvika-saree-buying-guide/",
    ogType: "article"
  },
  "/terms/": {
    path: "/terms/",
    title: "Terms & Conditions | Mukesh Saree Centre",
    description: "Review the terms and conditions for Mukesh Saree Centre. Understanding our guidelines, policies, and terms ensures a transparent and smooth shopping experience.",
    h1: "Terms & Conditions",
    canonical: "https://mukeshsarees.com/terms/",
    ogType: "website"
  },
  "/shipping-policy/": {
    path: "/shipping-policy/",
    title: "Shipping & Delivery Policy | Mukesh Saree Centre",
    description: "Learn about our free shipping across India, delivery timelines, trusted courier partners, COD availability, and order tracking.",
    h1: "Shipping Policy",
    canonical: "https://mukeshsarees.com/shipping-policy/",
    ogType: "website"
  },
  "/return-policy/": {
    path: "/return-policy/",
    title: "Returns & Refund Policy — Mukesh Saree Centre",
    description: "Mukesh Saree Centre return policy — 7-day returns on all products. Refund via UPI/Bank Transfer within 3-5 business days. Easy hassle-free process.",
    h1: "Return & Refund Policy",
    canonical: "https://mukeshsarees.com/return-policy/",
    ogType: "website"
  },
  "/guides/": {
    path: "/guides/",
    title: "Saree Buying Guides & Styling Tips — Mukesh Saree Centre",
    description: "Explore our comprehensive collection of saree buying guides, fabric care tutorials, and draping instructions. Master the art of choosing the perfect saree.",
    h1: "AI Knowledge Hub & Guides",
    canonical: "https://mukeshsarees.com/guides/",
    ogType: "website"
  },
  "/wholesale-sarees-nagpur/": {
    path: "/wholesale-sarees-nagpur/",
    title: "Wholesale Sarees in Nagpur | Direct Weaver Rates | Mukesh Saree Centre",
    description: "Join Mukesh Saree Centre Wholesale VIP Club for daily new arrivals, wholesale saree prices, stock updates and exclusive dealer offers in Nagpur since 1978.",
    h1: "Wholesale Sarees VIP Club",
    canonical: "https://mukeshsarees.com/wholesale-sarees-nagpur/",
    ogType: "website"
  },
  "/cart/": {
    path: "/cart/",
    title: "Shopping Cart | Mukesh Saree Centre",
    description: "Review your selection of premium ethnic wear at Mukesh Saree Centre. Securely manage your cart items and proceed to checkout.",
    h1: "Your Shopping Cart",
    canonical: "https://mukeshsarees.com/cart/",
    ogType: "website"
  },
  "/checkout/": {
    path: "/checkout/",
    title: "Checkout | Mukesh Saree Centre",
    description: "Complete your luxury ethnic wear purchase with Cash on Delivery or secure online payment at Mukesh Saree Centre.",
    h1: "Secure Checkout",
    canonical: "https://mukeshsarees.com/checkout/",
    ogType: "website"
  },
  "/thank-you/": {
    path: "/thank-you/",
    title: "Order Confirmed | Mukesh Saree Centre",
    description: "Your boutique order has been confirmed successfully at Mukesh Saree Centre.",
    h1: "Order Confirmation",
    canonical: "https://mukeshsarees.com/thank-you/",
    ogType: "website"
  },
  "/wishlist/": {
    path: "/wishlist/",
    title: "My Wishlist | Mukesh Saree Centre",
    description: "View and manage your favorite picks from Mukesh Saree Centre. Create your dream wishlist of elegant sarees and designer collections.",
    h1: "My Wishlist",
    canonical: "https://mukeshsarees.com/wishlist/",
    ogType: "website"
  },
  "/search/": {
    path: "/search/",
    title: "Search Collection | Mukesh Saree Centre",
    description: "Search our curated collection of sarees, linens, and festive ethnic wear at Mukesh Saree Centre.",
    h1: "Search Collection",
    canonical: "https://mukeshsarees.com/search/",
    ogType: "website"
  }
};

/**
 * Returns registered metadata for a given path, or null if dynamic.
 */
export function getRouteSeo(pathname: string): RouteSeoConfig | null {
  if (!pathname) return null;
  let normalized = pathname.trim();
  if (!normalized.startsWith("/")) normalized = "/" + normalized;
  if (!normalized.endsWith("/")) normalized = normalized + "/";
  return ROUTE_SEO_REGISTRY[normalized] || null;
}
