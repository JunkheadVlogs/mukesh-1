/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router';
import { lazy, Suspense } from 'react';
import Layout from './Layout';
import Home from './Home';

const Shop = lazy(() => import('./Shop'));
const Wishlist = lazy(() => import('./Wishlist'));
const ProductPage = lazy(() => import('./ProductPage'));
const Cart = lazy(() => import('./Cart'));
const Checkout = lazy(() => import('./Checkout'));
const About = lazy(() => import('./About'));
const Contact = lazy(() => import('./Contact'));
const Privacy = lazy(() => import('./Privacy'));
const Terms = lazy(() => import('./Terms'));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="w-full h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div></div>}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="wishlist/:shareId" element={<Wishlist />} />
            <Route path="product/:slug" element={<ProductPage />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
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
