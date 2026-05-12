/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router';
import { lazy, Suspense } from 'react';
import Layout from './Layout';
import Home from './Home';
import { ExitIntentPopup } from './components/ExitIntentPopup';

const Shop = lazy(() => import('./Shop'));
const Wishlist = lazy(() => import('./Wishlist'));
const ProductPage = lazy(() => import('./ProductPage'));
const Cart = lazy(() => import('./Cart'));
const Checkout = lazy(() => import('./Checkout'));
const ThankYou = lazy(() => import('./ThankYou'));
const About = lazy(() => import('./About'));
const Contact = lazy(() => import('./Contact'));
const Privacy = lazy(() => import('./Privacy'));
const Terms = lazy(() => import('./Terms'));

export default function App() {
  return (
    <BrowserRouter>
      <ExitIntentPopup />
      <Suspense fallback={
        <div className="w-full h-screen flex flex-col items-center justify-center bg-ivory space-y-12">
          <div className="flex flex-col items-center space-y-4">
             <span className="text-xl font-serif text-onyx tracking-[12px] uppercase">MUKESH</span>
             <div className="w-12 h-[1px] bg-gold-500 animate-pulse"></div>
          </div>
          <div className="text-[10px] uppercase tracking-[6px] text-onyx/20 font-bold animate-pulse italic">The Selection is Loading</div>
        </div>
      }>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="wishlist/:shareId" element={<Wishlist />} />
            <Route path="product/:slug" element={<ProductPage />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="thank-you" element={<ThankYou />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="terms" element={<Terms />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
