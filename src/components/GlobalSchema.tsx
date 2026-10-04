import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router";
import { BUSINESS_INFO, SHARED_ORGANIZATION_SCHEMA } from "../config/business";

export function GlobalSchema() {
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === '';
  const currentUrl = `${BUSINESS_INFO.website}${isHome ? '' : location.pathname}`;

  // Current WebPage schema linking to #website and #organization
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
    },
    "publisher": {
      "@id": `${BUSINESS_INFO.website}/#organization`
    }
  };

  return (
    <Helmet>
      {!isHome && (
        <script type="application/ld+json">{JSON.stringify(currentWebPageSchema)}</script>
      )}
    </Helmet>
  );
}

