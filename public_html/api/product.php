<?php
/**
 * Mukesh Saree Centre - Dynamic SEO & Dynamic OG (WhatsApp Preview) Product Router
 * File: product.php
 * Path: public_html/api/product.php
 * 
 * This file handles Server-Side Injection of OG image / Metadata for bots and users alike.
 * It serves the SEO/OG tags dynamically while wrapping around the main interactive React SPA.
 */

// 1. Get the product slug from URL parameter
$slug = isset($_GET['slug']) ? trim($_GET['slug']) : '';
$slug = basename($slug); // Basic security sanitize

// 2. Load the product records metadata (checking multiple robust paths)
$products_file = '';
$possible_paths = [
    dirname(__DIR__) . '/products-meta.json',
    dirname(__DIR__) . '/products.json',
    __DIR__ . '/data/products.json',
    dirname(__DIR__) . '/data/products.json',
    __DIR__ . '/products-meta.json',
    __DIR__ . '/products.json'
];

foreach ($possible_paths as $path) {
    if (file_exists($path)) {
        $products_file = $path;
        break;
    }
}

$product = null;

if (!empty($slug) && !empty($products_file)) {
    $products_data = json_decode(file_get_contents($products_file), true);
    if (is_array($products_data)) {
        foreach ($products_data as $p) {
            if (isset($p['slug']) && $p['slug'] === $slug) {
                $product = $p;
                break;
            }
        }
    }
}

// 3. Fallback to homepage defaults if product is missing or files not found
if (!$product) {
    // If the product is not found, serve the clean index.html directly
    $fallback_index = dirname(__DIR__) . '/index.html';
    if (file_exists($fallback_index)) {
        echo file_get_contents($fallback_index);
    } else {
        http_response_code(404);
        echo "Product/Page not found.";
    }
    exit();
}

// 4. Extract details
$name = isset($product['name']) ? $product['name'] : '';
$price = isset($product['price']) ? $product['price'] : '';
$desc = isset($product['description']) ? $product['description'] : '';
$image_field = isset($product['image']) ? $product['image'] : '';

// 5. ImageKit Integration and WhatsApp-ready formatting (1200x630 pixel size)
$image_url = '';

if (!empty($image_field)) {
    if (strpos($image_field, 'ik.imagekit.io') !== false) {
        // IMAGEKIT DIRECT URL: Format and apply WhatsApp-perfect 1200x630 aspect ratio
        // Strip any existing query params to avoid duplicate transforms
        $clean_image = strtok($image_field, '?');
        $image_url = $clean_image . '?tr=w-1200,h-630,c-maintain_ratio,bg-F0F0F0';
    } elseif (strpos($image_field, 'drive.google.com') !== false) {
        // GOOGLE DRIVE URL: Extract ID to use wsrv.nl proxy (works like a public CDN fallback)
        $doc_id = '';
        if (preg_match('/id=([a-zA-Z0-9_-]+)/', $image_field, $matches)) {
            $doc_id = $matches[1];
        } elseif (preg_match('/\/d\/([a-zA-Z0-9_-]+)/', $image_field, $matches)) {
            $doc_id = $matches[1];
        }
        
        if (!empty($doc_id)) {
            $raw_drive = "https://drive.google.com/uc?export=download&id=" . $doc_id;
            $image_url = "https://wsrv.nl/?url=" . urlencode($raw_drive) . "&w=1200&h=630&fit=contain&cbg=ffffff&output=jpg&q=90";
        } else {
            $image_url = $image_field;
        }
    } else {
        // Fallback for relative or general URLs
        if (strpos($image_field, 'http') === 0) {
            $image_url = $image_field;
        } else {
            $image_url = "https://mukeshsarees.com/" . ltrim($image_field, '/');
        }
    }
}

// Double safety: If product image is still blank, use homepage fallback
if (empty($image_url)) {
    $image_url = "https://mukeshsarees.com/images/og-home.jpg";
}

// 6. Read the main SPA single page application index.html
$index_file = dirname(__DIR__) . '/index.html';
if (!file_exists($index_file)) {
    http_response_code(500);
    echo "Required SPA template (index.html) is missing.";
    exit();
}

$html = file_get_contents($index_file);

// 7. Inject Meta-tags securely & replace default tags to prevent duplicates
$seo_title = htmlspecialchars($name) . " " . (!empty($price) ? "– ₹" . htmlspecialchars($price) : "") . " | Mukesh Saree Centre";
$seo_desc = htmlspecialchars(mb_strimwidth($desc, 0, 160, "..."));

// Replaces original global Title, Canonical, and Description
$html = preg_replace('/<title>.*?<\/title>/is', "<title>" . $seo_title . "</title>", $html);
$html = preg_replace('/<link rel="canonical" href="[^"]*".*?>/is', '<link rel="canonical" href="https://mukeshsarees.com/product/' . htmlspecialchars($slug) . '" />', $html);
$html = preg_replace('/<meta name="description" content=".*?".*?>/is', '<meta name="description" content="' . $seo_desc . '" />', $html);

// Build modern social meta-tags specifically optimized for social share platforms details
$og_tags_replacement = '<!-- Dynamic OG Tags -->
  <meta property="og:title" content="' . $seo_title . '" />
  <meta property="og:description" content="' . $seo_desc . '" />
  <meta property="og:image" content="' . htmlspecialchars($image_url) . '" />
  <meta property="og:image:secure_url" content="' . htmlspecialchars($image_url) . '" />
  <meta property="og:url" content="https://mukeshsarees.com/product/' . htmlspecialchars($slug) . '" />
  <meta property="og:type" content="product" />
  <meta property="og:site_name" content="Mukesh Saree Centre" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="' . $seo_title . '" />
  <meta name="twitter:description" content="' . $seo_desc . '" />
  <meta name="twitter:image" content="' . htmlspecialchars($image_url) . '" />
  <link rel="canonical" href="https://mukeshsarees.com/product/' . htmlspecialchars($slug) . '" />
  <!-- End Dynamic OG Tags -->';

// Perform surgical replacement between boundaries
if (strpos($html, '<!-- Dynamic OG Tags -->') !== false && strpos($html, '<!-- End Dynamic OG Tags -->') !== false) {
    $html = preg_replace('/<!-- Dynamic OG Tags -->.*?<!-- End Dynamic OG Tags -->/is', $og_tags_replacement, $html);
} else {
    // If placeholders are missing, append them to the <head> tag
    $html = str_replace('<head>', "<head>\n" . $og_tags_replacement, $html);
}

// 8. Serve the final compiled markup
echo $html;
