import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { Routes, Route } from "react-router";
import ProductPage from "../src/ProductPage.js";

// Mock global objects that might be accessed
if (typeof global !== "undefined") {
  (global as any).window = { scrollTo: () => {}, location: { pathname: '/product/test-slug' } };
  (global as any).document = { createElement: () => ({}), title: "" };
}

try {
  const html = renderToString(
    <StaticRouter location="/product/elegant-forest-green-cotton-coord-set">
      <Routes>
        <Route path="/product/:slug" element={<ProductPage />} />
      </Routes>
    </StaticRouter>
  );
  console.log("HTML length:", html.length);
  console.log(html.slice(0, 200));
} catch (e) {
  console.error("Error rendering:", e);
}
