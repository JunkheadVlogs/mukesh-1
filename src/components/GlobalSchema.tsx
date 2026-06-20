import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router";

export function GlobalSchema() {
  const location = useLocation();
  const currentUrl = `https://mukeshsarees.com${location.pathname === '/' ? '' : location.pathname}`;

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "ClothingStore", "LocalBusiness"],
    "@id": "https://mukeshsarees.com/#organization",
    "name": "Mukesh Saree Centre",
    "url": "https://mukeshsarees.com/",
    "logo": "https://ik.imagekit.io/tus1loev9/homepage/IMG_20260530_201904.png",
    "image": "https://ik.imagekit.io/tus1loev9/homepage/IMG_20260530_201904.png",
    "description": "Premium Sarees & Ethnic Indian Wear in Nagpur since 1978. Offering an exclusive collection of silk sarees, cotton sarees, designer suits, and wholesale ethnic wear.",
    "telephone": "+918149868720",
    "priceRange": "₹₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Gyaneshwar Mandir Road, Tin Nul Chowk, Hansapuri",
      "addressLocality": "Nagpur",
      "addressRegion": "Maharashtra",
      "postalCode": "440018",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "21.1498",
      "longitude": "79.0806"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+918149868720",
        "contactType": "customer service",
        "email": "info.mukeshsareecentre@gmail.com",
        "availableLanguage": ["English", "Hindi", "Marathi"]
      }
    ],
    "sameAs": [
      "https://www.facebook.com/109033288599426",
      "https://www.instagram.com/mukesh_saree_centre_"
    ],
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
    "@id": "https://mukeshsarees.com/#website",
    "url": "https://mukeshsarees.com/",
    "name": "Mukesh Saree Centre",
    "description": "Premium Sarees & Ethnic Indian Wear since 1978",
    "publisher": {
      "@id": "https://mukeshsarees.com/#organization"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://mukeshsarees.com/shop?q={search_term_string}"
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
      "@id": "https://mukeshsarees.com/#website"
    },
    "about": {
      "@id": "https://mukeshsarees.com/#organization"
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
