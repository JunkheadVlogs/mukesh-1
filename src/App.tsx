/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { lazy, Suspense, useEffect, useState } from 'react';
import Layout from './Layout';
import Home from './Home';
import { ExitIntentPopup } from './components/ExitIntentPopup';
import { trackWhatsAppClick } from './tracking';

const Shop = lazy(() => import('./Shop'));
const Wishlist = lazy(() => import('./Wishlist'));
const ProductPage = lazy(() => import('./ProductPage'));
const Cart = lazy(() => import('./Cart'));
const Checkout = lazy(() => import('./Checkout'));
const ThankYou = lazy(() => import('./ThankYou'));
import Contact from './Contact';
import Terms from './Terms';
import ShippingPolicy from './ShippingPolicy';
import ReturnPolicy from './ReturnPolicy';

import { CONFIG } from "./config";

function LoadingScreen() {
  const [logoError, setLogoError] = useState(false);
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-ivory space-y-12">
      <div className="flex flex-col items-center space-y-4">
         {!logoError ? (
           <img 
             src="/images/logo.webp" 
             alt="Mukesh Saree Centre Logo" 
             className="w-auto h-auto min-w-[160px] max-w-[180px] md:min-w-[200px] md:max-w-[230px] lg:max-w-[250px] object-contain animate-pulse drop-shadow-sm m-0 p-0 block header-logo" 
             onError={() => setLogoError(true)} 
           />
         ) : (
           <span className="text-xl font-serif text-onyx tracking-[12px] uppercase block">MUKESH</span>
         )}
         <div className="w-12 h-[1px] bg-gold-500 animate-pulse"></div>
      </div>
      <div className="text-[10px] uppercase tracking-[6px] text-onyx/20 font-bold animate-pulse italic">The Selection is Loading</div>
    </div>
  );
}

export default function App() {
  // Version 1.0.1 - Cache Bust
  console.log("[DEBUG] BASE_URL:", import.meta.env.BASE_URL);
  console.log("[DEBUG] CONFIG API_BASE_URL:", CONFIG.API_BASE_URL);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.btn-whatsapp, .whatsapp-order, #whatsapp-float')) {
        trackWhatsAppClick();
      }
    };
    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  return (
    <BrowserRouter>
      <ExitIntentPopup />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="search" element={<Shop />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="wishlist/:shareId" element={<Wishlist />} />
            <Route path="product/:slug" element={<ProductPage />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="thank-you" element={<ThankYou />} />
            <Route path="about" element={<Navigate to="/contact" replace />} />
            <Route path="contact" element={<Contact />} />
            <Route path="privacy" element={<Navigate to="/contact" replace />} />
            <Route path="terms" element={<Terms />} />
            <Route path="shipping-policy" element={<ShippingPolicy />} />
            <Route path="return-policy" element={<ReturnPolicy />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
