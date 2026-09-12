import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router";
import { BUSINESS_INFO } from "../config/business";

export function GlobalSchema() {
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === '';
  const currentUrl = `${BUSINESS_INFO.website}${isHome ? '' : location.pathname}`;

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "ClothingStore"],
    "name": BUSINESS_INFO.name,
    "foundingDate": BUSINESS_INFO.established,
    "url": BUSINESS_INFO.website,
    "logo": `${BUSINESS_INFO.website}/images/logo.webp`,
    "image": `${BUSINESS_INFO.website}/og-image.jpg`,
    "telephone": "+91-7020664641",
    "email": BUSINESS_INFO.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": `${BUSINESS_INFO.address.street}, ${BUSINESS_INFO.address.area}`,
      "addressLocality": BUSINESS_INFO.address.city,
      "addressRegion": BUSINESS_INFO.address.region,
      "postalCode": BUSINESS_INFO.address.postalCode,
      "addressCountry": BUSINESS_INFO.address.country
    },
    "sameAs": BUSINESS_INFO.social
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BUSINESS_INFO.website}/#website`,
    "url": `${BUSINESS_INFO.website}/`,
    "name": BUSINESS_INFO.name,
    "description": "Looking for a saree shop in Nagpur? Mukesh Saree Centre has been Nagpur's trusted saree destination since 1978. Shop premium sarees online or visit us.",
    "publisher": {
      "@id": `${BUSINESS_INFO.website}/#organization`
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${BUSINESS_INFO.website}/shop?search={search_term_string}`
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
      {!isHome && (
        <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
      )}
      {!isHome && (
        <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
      )}
      {!isHome && (
        <script type="application/ld+json">{JSON.stringify(currentWebPageSchema)}</script>
      )}
    </Helmet>
  );
}
