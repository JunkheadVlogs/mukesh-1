# Google Merchant Center Setup Guide — Mukesh Saree Centre

This document provides setup instructions for submitting the Mukesh Saree Centre product feed to **Google Merchant Center** and activating **Free Product Listings** on Google Search, Google Images, and the Google Shopping tab.

---

## 1. Feed URLs & Supported Formats

The project automatically generates and synchronizes both XML and CSV feeds during every build (`npm run build`). The feeds are served directly by the production Express server with `Content-Type: application/xml` and `X-Robots-Tag: noindex` (preventing search engines from indexing raw XML while keeping product pages fully indexable).

| Format | Canonical Public URL | Recommended Use |
| :--- | :--- | :--- |
| **XML (RSS 2.0 + Google Base)** | `https://mukeshsarees.com/product-feed.xml` | **Primary Feed (Recommended)** |
| **CSV (Comma-Separated)** | `https://mukeshsarees.com/product-feed.csv` | Secondary / Manual Sheet Upload |
| **API Endpoint (Dynamic)** | `https://mukeshsarees.com/api/product-feed.xml` | Serverless / Proxy Fetch |

---

## 2. Feed Specifications & Factual Data Mapping

Every product is mapped directly from the catalog (`src/mockData.ts`) without invented fields:

| Google Attribute | Field Source | Example Value | Strict Policy Compliance |
| :--- | :--- | :--- | :--- |
| `g:id` | `product.sku` | `SAR-CHI-YEL-001` | Uses real SKU; no invented identifiers. |
| `g:title` | `product.name` | `Sunshine Yellow Chiffon Saree` | Real product title. |
| `g:description` | `product.description` | Sanitized plain-text description | Markdown, asterisks, and emojis cleanly stripped. |
| `g:link` | `product.slug` | `https://mukeshsarees.com/product/.../` | Canonical product landing page. |
| `g:image_link` | `product.image` | `https://mukeshsarees.com/images/products/p10.webp` | Absolute, high-resolution primary image URL. |
| `g:additional_image_link` | `product.images` | `https://mukeshsarees.com/images/...-gallery-1.webp` | Up to 10 additional gallery angles. |
| `g:availability` | `product.stock` | `in_stock` | Excludes zero-stock or hidden items. |
| `g:price` | `product.price` | `2099.00 INR` | Exact active checkout price in INR (matches JSON-LD). |
| `g:condition` | Constant | `new` | All boutique sarees are brand-new unstitched drapes. |
| `g:brand` | Constant | `Mukesh Saree Centre` | Brand identity since 1978. |
| `g:product_type` | `product.category` | `Apparel & Accessories > Clothing > ... > Sarees` | Real category breadcrumbs. |
| `g:google_product_category` | Category map | `5422` (Sarees) or `5423` (Traditional) | Official Google Product Taxonomy code. |
| `g:identifier_exists` | Constant | `no` | Complies with no-GTIN rule for weaver-crafted textiles. |
| `g:color` | `product.color` | `Sunshine Yellow` | Factual color; only populated when verified. |
| `g:material` | `product.fabric` | `Premium Chiffon` | Factual fabric; only populated when verified. |
| `g:shipping` | Website Policy | Country: `IN`, Service: `Standard`, Price: `0.00 INR` | Matches free shipping policy for orders > ₹499. |
| `g:return_policy_label` | Website Policy | `7_day_return` | Matches 7-day return policy for unworn items. |

---

## 3. Step-by-Step Google Merchant Center Setup

### Step 1: Create or Sign In to Merchant Center
1. Navigate to [Google Merchant Center](https://merchants.google.com/).
2. Log in with the business Google account: `info.mukeshsareecentre@gmail.com`.
3. Set Business Name: **Mukesh Saree Centre**.
4. Set Registered Country: **India**.

### Step 2: Verify & Claim Website
1. Go to **Settings > Business information > Website**.
2. Enter: `https://mukeshsarees.com`.
3. Choose verification method: **Add an HTML tag to your homepage** (the tag is already supported in `index.html`).
4. Click **Verify website**, then click **Claim website**.

### Step 3: Add Primary Data Feed (Scheduled Fetch)
1. Go to **Products > Feeds** (or **Data sources**).
2. Click the **+** button to add a primary product feed.
3. Configure settings:
   - **Target Countries:** India
   - **Language:** English
   - **Destinations:** Free listings, Shopping ads
4. Feed Name: `Mukesh Saree Centre Products`
5. Select input method: **Scheduled fetch**.
6. Provide File details:
   - **File name:** `product-feed.xml`
   - **Fetch frequency:** **Daily**
   - **Fetch time:** **04:00 AM IST** (ensures inventory refreshes before morning shopping peak)
   - **File URL:** `https://mukeshsarees.com/product-feed.xml`
   - **Username / Password:** Leave blank (feed is publicly accessible)
7. Click **Create feed** and trigger **Fetch now**.

---

## 4. Items Requiring Manual Verification in Merchant Center

Google requires these business settings to be verified inside your Merchant Center console before free listings go live:

1. **Phone Number Verification:**
   - Go to **Settings > Business info > Phone number**.
   - Verify `+91 7020664641` via automated SMS or phone call OTP.
2. **Showroom Address Verification:**
   - Ensure the business address matches Google Maps:
     *Mukesh Saree Centre, Jagnath Road, Gandhibagh, Nagpur, Maharashtra, 440002, India*.
3. **Shipping Policy Setup:**
   - Go to **Settings > Shipping and returns > Shipping services**.
   - Create a service named `Standard Shipping (Pan-India)`.
   - Transit time: `3–7 business days`. Handling time: `1–2 business days`.
   - Shipping cost: Set Free shipping for orders over ₹499 (or Flat Rate ₹0 for all sarees).
4. **Return Policy Setup:**
   - Go to **Settings > Shipping and returns > Return policies**.
   - Label: `7_day_return`.
   - Return window: `7 days` from delivery.
   - Return policy URL: `https://mukeshsarees.com/return-policy/`.
   - Method: Return by mail / courier.
   - Fees: Customer contacts WhatsApp for free return authorization.
5. **Enable Free Listings Program:**
   - Go to **Growth > Manage programs > Free product listings**.
   - Verify all prerequisite steps are marked with green checkmarks.

---

## 5. Identified Product Data Gaps (Recommended for Future Catalog Expansions)

While the current feed is 100% valid and free of errors, the following catalog data enhancements can improve conversion and ranking over time:

1. **Exact Fiber Percentages:** Defining exact yarn blend ratios (e.g., `100% Linen` vs `60% Linen / 40% Cotton`) allows Google Shopping filters to showcase premium natural textiles.
2. **Package Shipping Weight:** Adding `shipping_weight` (e.g., `0.7 kg` per saree, `2.5 kg` per bridal lehenga) will enable weight-tier logistics in the future.
3. **Weave Provenance:** Storing cluster regions (e.g., `Surat`, `Varanasi`, `Kolkata`) will support localized cultural search queries.
