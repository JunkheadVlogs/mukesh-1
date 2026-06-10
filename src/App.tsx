/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Suspense, useEffect, useState, lazy } from 'react';
import Layout from './Layout';
import Home from './Home';
import { ExitIntentPopup } from './components/ExitIntentPopup';
import { useExitIntent } from './hooks/useExitIntent';
import { trackWhatsAppClick, trackLead } from './tracking';
import { useStore } from './store';
import { safeSessionStorage } from './utils/safeStorage';

const Shop = lazy(() => import('./Shop'));
const Wishlist = lazy(() => import('./Wishlist'));
const ProductPage = lazy(() => import('./ProductPage'));
const Cart = lazy(() => import('./Cart'));
const Checkout = lazy(() => import('./Checkout'));
const ThankYou = lazy(() => import('./ThankYou'));
const Contact = lazy(() => import('./Contact'));
const Terms = lazy(() => import('./Terms'));
const ShippingPolicy = lazy(() => import('./ShippingPolicy'));
const ReturnPolicy = lazy(() => import('./ReturnPolicy'));
const WholesaleSarees = lazy(() => import('./WholesaleSarees'));

import { CONFIG, submitToGoogleSheets, getApiUrl } from "./config";

function LoadingScreen() {
  const [logoSrc, setLogoSrc] = useState("https://ik.imagekit.io/tus1loev9/homepage/IMG_20260530_201904.png");
  const [retryStep, setRetryStep] = useState(0);
  const [logoError, setLogoError] = useState(false);

  const handleLogoError = () => {
    if (retryStep === 0) {
      setLogoSrc("https://ik.imagekit.io/tus1loev9/homepage/IMG_20260530_201904.png");
      setRetryStep(1);
    } else if (retryStep === 1) {
      setLogoSrc("https://ik.imagekit.io/tus1loev9/homepage/IMG_20260530_201904.png");
      setRetryStep(2);
    } else {
      setLogoError(true);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-ivory space-y-12">
      <div className="flex flex-col items-center space-y-4">
         <img 
           src="https://ik.imagekit.io/tus1loev9/homepage/IMG_20260530_201904.png" 
           alt="Mukesh Saree Centre Logo" 
           className="w-auto h-[260px] md:h-[350px] object-contain animate-pulse drop-shadow-sm m-0 p-0 block" 
         />
         <div className="w-12 h-[1px] bg-gold-500 animate-pulse"></div>
      </div>
      <div className="text-[10px] uppercase tracking-[6px] text-onyx/20 font-bold animate-pulse italic">The Selection is Loading</div>
    </div>
  );
}

export default function App() {
  const { triggered, dismiss } = useExitIntent({ delay: 5000, sensitivity: 20 });
  // Version 1.0.1 - Cache Bust
  console.log("[DEBUG] BASE_URL:", import.meta.env.BASE_URL);
  console.log("[DEBUG] CONFIG API_BASE_URL:", CONFIG.API_BASE_URL);

  // Dynamically load Google Tag Manager at runtime for extreme performance
  useEffect(() => {
    const gtmId = import.meta.env.VITE_GTM_ID;
    if (gtmId && gtmId !== '%VITE_GTM_ID%' && !gtmId.startsWith('%')) {
      const injectGTM = () => {
        // Prevent duplicate injection
        if ((window as any)._gtm_loaded) return;
        (window as any)._gtm_loaded = true;

        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          'gtm.start': new Date().getTime(),
          event: 'gtm.js'
        });

        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
        
        const firstScript = document.getElementsByTagName('script')[0];
        if (firstScript && firstScript.parentNode) {
          firstScript.parentNode.insertBefore(script, firstScript);
        } else {
          document.head.appendChild(script);
        }
      };

      // Defer loading slightly to prevent render-blocking on mobile
      if (document.readyState === 'complete') {
        const deferTimer = setTimeout(() => {
          if ('requestIdleCallback' in window) {
            (window as any).requestIdleCallback(() => injectGTM());
          } else {
            injectGTM();
          }
        }, 800);
        return () => clearTimeout(deferTimer);
      } else {
        const handleWindowLoad = () => {
          setTimeout(() => {
            if ('requestIdleCallback' in window) {
              (window as any).requestIdleCallback(() => injectGTM());
            } else {
              injectGTM();
            }
          }, 800);
        };
        window.addEventListener('load', handleWindowLoad);
        return () => window.removeEventListener('load', handleWindowLoad);
      }
    }
  }, []);

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

  // Auto-apply VIP50 by default unless explicitly removed in sessionStorage
  useEffect(() => {
    const store = useStore.getState();
    const removedInSession = safeSessionStorage.getItem('coupon_removed') === 'true';
    if (!store.appliedCoupon && !removedInSession) {
      store.applyCoupon('VIP50');
    }
  }, []);

  const handleSubmitLead = async (name: string, phone: string) => {
    const isMobileDevice = window.innerWidth <= 768;
    const deviceType = isMobileDevice ? 'Mobile' : 'Desktop';
    const viewedProduct = window.location.pathname.includes('/product/') 
      ? window.location.pathname.split('/').pop() || 'N/A' 
      : 'N/A';

    const payload = {
      firstName: name,
      mobileNumber: phone,
      productViewed: viewedProduct,
      pageUrl: window.location.href,
      date: new Date().toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" }),
      time: new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" }),
      deviceType: deviceType,
      source: "Popup",
      leadSource: "Exit Intent Popup",
      request: 'Exit Intent Discount Coupon VIP50',
      requestId: 'REQ-' + Math.floor(100000 + Math.random() * 900000)
    };

    // Fire Meta & GA4 Events
    try {
      trackLead({ name, phone });
    } catch (err) {
      console.warn("Meta trackLead failed:", err);
    }

    if ((window as any).fbq) {
      (window as any).fbq('track', 'CompleteRegistration', {
        content_name: 'VIP Coupon Signup'
      });
    }
    
    if ((window as any).gtag) {
      (window as any).gtag('event', 'generate_lead', {
        currency: 'INR',
        value: 60,
        lead_type: 'Exit Intent'
      });
    }

    await submitToGoogleSheets(payload);

    // Trigger serverless Firebase save + Interakt WhatsApp send pipeline
    try {
      await fetch(getApiUrl("api/capture-lead"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phone: phone,
          source: "Exit Intent Popup",
          page: window.location.href
        })
      }).catch(err => console.warn("Firestore Lead Capture API check failed:", err));
    } catch (leadErr) {
      console.error("Failed to send lead to serverless pipeline:", leadErr);
    }
  };

  return (
    <BrowserRouter>
      {triggered && <ExitIntentPopup onDismiss={dismiss} onSubmit={handleSubmitLead} />}
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
          <Route path="wholesalesarees" element={<WholesaleSarees />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
