import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router";
import { BUSINESS_INFO } from "../config/business";

export function GlobalSchema() {
  const location = useLocation();
  const currentUrl = `${BUSINESS_INFO.website}${location.pathname === '/' ? '' : location.pathname}`;

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["Organization", ...BUSINESS_INFO.type.map(t => t.replace(/ /g, ''))].filter(t => t === 'Organization' || t === 'ClothingStore' || t === 'LocalBusiness'),
    "@id": `${BUSINESS_INFO.website}/#organization`,
    "name": BUSINESS_INFO.name,
    "url": `${BUSINESS_INFO.website}/`,
    "logo": "https://ik.imagekit.io/tus1loev9/homepage/IMG_20260530_201904.png",
    "image": "https://ik.imagekit.io/tus1loev9/homepage/IMG_20260530_201904.png",
    "description": "Mukesh Saree Centre, Nagpur: Wholesale and retail sarees since 1978. Shop online for premium silk, linen & uniform sarees. Cash on Delivery.",
    "telephone": BUSINESS_INFO.phone,
    "priceRange": "₹₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": `${BUSINESS_INFO.address.street}, ${BUSINESS_INFO.address.area}`,
      "addressLocality": BUSINESS_INFO.address.city,
      "addressRegion": BUSINESS_INFO.address.region,
      "postalCode": BUSINESS_INFO.address.postalCode,
      "addressCountry": BUSINESS_INFO.address.country
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "21.1498",
      "longitude": "79.0806"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": BUSINESS_INFO.phone,
        "contactType": "customer service",
        "email": BUSINESS_INFO.email,
        "availableLanguage": ["English", "Hindi", "Marathi"]
      }
    ],
    "sameAs": BUSINESS_INFO.social,
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "11:00",
        "closes": "21:00"
      }
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BUSINESS_INFO.website}/#website`,
    "url": `${BUSINESS_INFO.website}/`,
    "name": BUSINESS_INFO.name,
    "description": "Mukesh Saree Centre, Nagpur: Wholesale and retail sarees since 1978. Shop online for premium silk, linen & uniform sarees. Cash on Delivery.",
    "publisher": {
      "@id": `${BUSINESS_INFO.website}/#organization`
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${BUSINESS_INFO.website}/shop?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  const currentWebPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${currentUrl}#webpage`,
    "url": currentUrl,
    "isPartOf": {
      "@id": `${BUSINESS_INFO.website}/#website`
    },
    "about": {
      "@id": `${BUSINESS_INFO.website}/#organization`
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(currentWebPageSchema)}</script>
    </Helmet>
  );
}
