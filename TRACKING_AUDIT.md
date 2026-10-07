# Analytics Tracking Audit & Implementation Note

## 1. Architecture & Single Deployment Path
Google Tag Manager (GTM) serves as the **single deployment path** for Google Analytics 4 (GA4). 
- Direct standalone `gtag.js` script injection has been removed from `index.html`.
- All analytics data is pushed to `window.dataLayer` following official Google Tag Manager ecommerce standards.
- Eliminates dual-tagging, duplicate GA4 instances, and duplicate event emissions.

---

## 2. Active Tracking Scripts
The following non-blocking third-party scripts remain configured in the application:
1. **Google Tag Manager (GTM)**: Container script loaded asynchronously to deploy and orchestrate GA4 tags and triggers.
2. **Meta Pixel**: Direct pixel library for social marketing conversion events.
3. **Pinterest Tag**: Standard tag for catalog and shopping engagement tracking.
4. **Microsoft Clarity**: Behavior analytics, session replay, and heatmap generation.
5. **Razorpay Checkout SDK**: Loaded on-demand only when a shopper triggers a payment action.

---

## 3. Expected Standard Events
The application emits the following structured events through `window.dataLayer` and advertising channels:
- `page_view`: Emitted on SPA route transitions with path, title, and location.
- `view_item_list`: Emitted when catalog collections or category listings are displayed.
- `select_item`: Emitted when a shopper selects a product from a list.
- `view_item`: Emitted when a product detail page is loaded.
- `add_to_cart`: Emitted when a product is added to the shopping bag.
- `remove_from_cart`: Emitted when an item is removed from the cart.
- `begin_checkout`: Emitted when entering the checkout flow.
- `purchase`: Emitted on confirmed order completion with transaction ID, items, and total amount.
- `search`: Emitted when searching the catalogue.
- `whatsapp_order_click`: Emitted when tapping the WhatsApp order CTA or floating chat button.

---

## 4. Duplicate-Event Prevention Mechanisms
1. **Single Script Tag**: By removing the direct `gtag.js` script and `gtag('config')` call, the initial page load no longer registers two independent GA4 tracker sessions.
2. **SPA Route Deduplication**: `trackPageView` records the last tracked path and timestamp, filtering out rapid reactive re-renders and hash adjustments within a 1-second window.
3. **Add to Cart Multi-Click Debounce**: `trackAddToCart` maintains an item timestamp map to ignore rapid double-clicks within 750ms.
4. **Checkout Initialization Signature Guard**: `trackInitiateCheckout` computes a signature of item IDs and cart total, debouncing repeat executions within 3 seconds.
5. **Purchase Order Idempotency**: `trackPurchase` employs a dual-layer check:
   - In-memory execution set to prevent concurrent microtask re-triggers.
   - Persistent local storage key per transaction ID (`tracked_order_<transaction_id>`), guaranteeing that refreshing or revisiting the thank-you screen will never fire a second purchase event.
6. **WhatsApp & Search Debounce**: Both event triggers are debounced to prevent duplicate fires on rapid clicks or repeated query triggers.
7. **Privacy & Security Compliance**: No measurement IDs, secret tokens, or customer personal identifiers are logged in console outputs or committed in repository notes.

---

## 5. Third-Party Script Loading Lifecycle & Performance Optimization

To ensure maximum initial page load speed, zero main-thread blockage, and pristine Web Vitals (LCP/INP/CLS), all third-party vendor scripts are controlled by singleton loaders (`src/utils/scriptLoader.ts` and `src/utils/razorpay.ts`):

| Script | Purpose | Loading Strategy / Trigger | Consent & Guard Rules |
| :--- | :--- | :--- | :--- |
| **Razorpay Checkout SDK** (`checkout.razorpay.com`) | Secure payment gateway modal | **Strictly On-Demand**: Loaded ONLY when shopper clicks "Buy Now" on a product page or selects "Pay Online" in checkout. Never loaded on catalog, cart, or initial page load. | Singleton Promise; removed on network failure for clean user retry. Zero credentials in frontend. |
| **Google Tag Manager (GTM) / GA4** (`googletagmanager.com`) | Essential ecommerce measurement | **Post-Load Defer**: Loaded asynchronously after window `load` event or idle callback. Never blocks initial DOM parse, FCP, or LCP. | In-flight promise deduplication. Stub in `<head>` ensures early calls are queued safely. |
| **Meta Pixel** (`connect.facebook.net`) | Paid social ad conversion attribution | **Deferred**: Loaded only upon first user interaction (`scroll`, `touchstart`, `pointerdown`, `keydown`) or 3.5s idle timer fallback. **Expedited** immediately if customer adds to cart, begins checkout, or places an order. | Checks `hasMarketingConsent()` (`msc_cookie_consent`). Stub in `<head>` queues events before script evaluation. |
| **Pinterest Tag** (`s.pinimg.com`) | Catalog & visual discovery tracking | **Deferred**: Loaded only upon first user interaction or idle timer. **Expedited** on conversion events (`AddToCart`, `InitiateCheckout`, `Purchase`). | Checks `hasMarketingConsent()`. Stub in `<head>` queues events before script evaluation. |
| **Microsoft Clarity** (`clarity.ms`) | Session replay & heatmaps | **Deferred**: Loaded strictly after user interaction or idle timer. Never executed during critical rendering. | Checks `hasMarketingConsent()`. Skipped if marketing consent is rejected. |

### Guarantees:
- **No Duplicate Scripts**: Every script injection checks DOM element ID, `src` URL attribute, and active in-flight promises.
- **Conversion Safety**: High-intent actions (`trackAddToCart`, `trackInitiateCheckout`, `trackPurchase`) invoke `ensureConversionScriptsLoaded()`, guaranteeing no conversion drops if a customer checks out rapidly.
- **Visual & UI Integrity**: Script loading logic runs completely in the background with zero layout impact, preserving the luxury boutique design pixel-perfect.
