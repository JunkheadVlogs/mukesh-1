export const BUSINESS_INFO = {
  name: "Mukesh Saree Centre",
  type: ["Women's Clothing Store", "Saree Store", "Wholesale Saree Supplier"],
  established: "1978",
  address: {
    street: "Jagnath Road",
    area: "Gandhibagh",
    city: "Nagpur",
    region: "Maharashtra",
    postalCode: "440002",
    country: "IN",
    fullAddress: "Jagnath Road, Gandhibagh, Nagpur, Maharashtra, 440002, India"
  },
  phone: "+91 7020664641",
  email: "info@mukeshsarees.com",
  website: "https://mukeshsarees.com",
  social: [
    "https://www.facebook.com/Mukeshsareesindia/",
    "https://www.instagram.com/mukeshsarees_nagpur",
    "https://www.youtube.com/@mukeshsarees",
    "https://www.pinterest.com/MukeshSareesdotcom"
  ]
};

export const SHARED_ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@id": "https://mukeshsarees.com/#organization",
  "@type": ["Organization", "ClothingStore"],
  "name": "Mukesh Saree Centre",
  "url": "https://mukeshsarees.com",
  "logo": "https://mukeshsarees.com/images/logo.webp",
  "image": "https://mukeshsarees.com/og-image.jpg",
  "foundingDate": "1978",
  "telephone": "+91 7020664641",
  "email": "info@mukeshsarees.com",
  "priceRange": "₹₹",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Jagnath Road, Gandhibagh",
    "addressLocality": "Nagpur",
    "addressRegion": "Maharashtra",
    "postalCode": "440002",
    "addressCountry": "IN"
  },
  "sameAs": [
    "https://www.facebook.com/Mukeshsareesindia/",
    "https://www.instagram.com/mukeshsarees_nagpur",
    "https://www.youtube.com/@mukeshsarees",
    "https://www.pinterest.com/MukeshSareesdotcom"
  ]
};

