import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  product?: {
    price?: number;
    currency?: string;
    availability?: string;
    condition?: string;
    color?: string;
    fabric?: string;
    category?: string;
    [key: string]: any;
  };
  schema?: Record<string, any>;
  imageWidth?: string;
  imageHeight?: string;
}

export function getWhatsAppSafeDescription(text: string, productContext?: any): string {
  if (!text) return "Shop premium Indian ethnic wear, sarees, and co-ord sets at Mukesh Saree Centre.";
  
  // Clean HTML, Markdown, and other clutter
  let clean = text
    .replace(/<[^>]*>?/gm, " ")
    .replace(/\*\*(DESCRIPTION|HIGHLIGHTS|FABRIC DETAILS|SIZE & FIT|STYLING|CARE INSTRUCTIONS|WASH CARE|FABRIC):\*\*/gi, "")
    .replace(/\*\*[A-Z\s&_:\-]+\:\*\*/gi, " ")
    .replace(/\*\*[A-Z\s&_:\-]+\*\*/gi, " ")
    .replace(/^[•\-\*\s]+/gm, " ")
    .replace(/\*/g, "")
    .replace(/\s+/g, " ")
    .trim();

  // Extract first complete sentence (must end with . or ! or ?)
  const sentenceEndRegex = /[.!?](?=\s|$)/;
  const match = clean.match(sentenceEndRegex);
  
  let sentence = "";
  if (match && match.index !== undefined) {
    sentence = clean.slice(0, match.index + 1).trim();
  } else {
    sentence = clean;
  }

  // If sentence is empty or too short (less than 20 chars), design an elegant fallback based on product context
  if (sentence.length < 20 && productContext) {
    const color = productContext.color || "";
    const fabric = productContext.fabric || "";
    const category = productContext.category || "ensemble";
    sentence = `This elegant ${color} ${fabric} ${category} is beautifully crafted to elevate your ethnic style.`;
  } else if (sentence.length < 20) {
    sentence = "Experience premium comfort and elegance with our handpicked Indian ethnic wear collection.";
  }

  // Ensure it doesn't exceed 60 words and has no truncation mid-sentence
  const words = sentence.split(/\s+/);
  if (words.length > 60) {
    sentence = words.slice(0, 60).join(" ");
  }

  // Ensure proper sentence termination
  if (!/[.!?]$/.test(sentence)) {
    sentence += ".";
  }

  return sentence;
}

export function cleanDescriptionForOG(rawDesc: string): string {
  if (!rawDesc) return "";
  
  let text = rawDesc;
  // Remove markdown headers/labels first so they don't clutter the SEO sentence
  text = text.replace(/\*\*(DESCRIPTION|HIGHLIGHTS|FABRIC DETAILS|SIZE & FIT|STYLING|CARE INSTRUCTIONS|WASH CARE|FABRIC):\*\*/gi, "");
  text = text.replace(/\*\*[A-Z\s&_:\-]+\:\*\*/gi, "");
  text = text.replace(/\*\*[A-Z\s&_:\-]+\*\*/gi, "");

  return text
    // Remove markdown bold **text**
    .replace(/\*\*(.*?)\*\*/g, '$1')
    // Remove markdown italic *text*
    .replace(/\*(.*?)\*/g, '$1')
    // Remove DESCRIPTION: label if present
    .replace(/^DESCRIPTION:\s*/i, '')
    // Remove markdown headers ## 
    .replace(/#{1,6}\s/g, '')
    // Remove bullet points
    .replace(/^[-*•]\s/gm, '')
    // Collapse multiple spaces/newlines
    .replace(/\s+/g, ' ')
    // Trim
    .trim()
    // Limit to 120 characters for clean preview
    .slice(0, 120);
}

export function cleanSEOText(text: string): string {
  if (!text) return "";
  let clean = text;

  // Replace HTML tags
  clean = clean.replace(/<[^>]*>?/gm, " ");

  // Replace markdown header-like patterns e.g. **DESCRIPTION:** or **SIZE & FIT:** or **CARE INSTRUCTIONS:**
  clean = clean.replace(/\*\*[A-Z\s&_:\-]+\*\*/gi, " ");
  clean = clean.replace(/\*\*[A-Z\s&_:\-]+\:\*\*/gi, " ");

  // Remove bullets and dashes at the beginning of lines
  clean = clean.replace(/^[•\-\*\s]+/gm, " ");

  // Remove all remaining asterisks
  clean = clean.replace(/\*/g, "");

  // Replace multiple spacing/newlines with single space
  clean = clean.replace(/\s+/g, " ");

  return clean.trim();
}

export function SEO({
  title,
  description,
  keywords,
  image = "https://mukeshsarees.com/images/og-home.jpg",
  url = "https://mukeshsarees.com",
  type = "website",
  product,
  schema,
  imageWidth,
  imageHeight,
}: SEOProps) {
  const siteUrl = "https://mukeshsarees.com";
  const absoluteUrl = url.startsWith("http") ? url : `${siteUrl}${url}`;
  const absoluteImage = image?.startsWith("http") ? image : `${siteUrl}${image}`;

  const isProductType = type === "product" || type === "og:product";
  const finalType = isProductType ? "product" : type;

  // Clean the description to prevent markdown/asterisks or tags appearing in SEO/og:description tags
  // For products, leverage the getWhatsAppSafeDescription to make sure it is exactly ONE clean sentence (max 60 words, no truncation)
  const cleanDescriptionText = isProductType 
    ? getWhatsAppSafeDescription(description, product) 
    : cleanSEOText(description);

  // Default to 1200x630 for landscape social card presentation (ideal for WhatsApp/Instagram/Facebook crop alignment without letterbox bars)
  const defaultWidth = "1200";
  const defaultHeight = "630";

  let displayTitle = title;
  let finalDescriptionText = cleanDescriptionText;
  let displayImage = absoluteImage;
  let finalImageWidth = imageWidth || defaultWidth;
  let finalImageHeight = imageHeight || defaultHeight;
  let imageType = "image/jpeg";

  if (isProductType && product) {
    const pPrice = product.price || "";
    const pOriginalPrice = product.originalPrice || "";
    const pName = product.name || title.replace(" – Mukesh Saree Centre", "");

    // Exact requested format: PRODUCT_NAME – ₹PRICE | Mukesh Saree Centre
    displayTitle = `${pName} – ₹${pPrice} | Mukesh Saree Centre`;

    // Exact requested format: ✨ PRODUCT_SHORT_DESCRIPTION | 💰 ₹PRICE (MRP ₹ORIGINAL_PRICE) | 🚚 Free Shipping | Cash on Delivery Available
    const cleanShortDesc = cleanDescriptionText.replace(/\|/g, "").trim();
    const mrpPart = pOriginalPrice ? ` (MRP ₹${pOriginalPrice})` : "";
    finalDescriptionText = `✨ ${cleanShortDesc} | 💰 ₹${pPrice}${mrpPart} | 🚚 Free Shipping | Cash on Delivery Available`;

    // Un-wrap if already wrapped in wsrv
    let targetUrl = absoluteImage;
    if (absoluteImage.includes('wsrv.nl')) {
      try {
        const urlObj = new URL(absoluteImage);
        const originUrl = urlObj.searchParams.get('url');
        if (originUrl) {
          targetUrl = originUrl;
        }
      } catch (e) {
        const match = absoluteImage.match(/[?&]url=([^&]+)/);
        if (match) {
          targetUrl = decodeURIComponent(match[1]);
        }
      }
    }

    if (targetUrl.includes('drive.google.com')) {
      let fileId = '';
      const idMatch = targetUrl.match(/[?&]id=([^&]+)/);
      if (idMatch) {
        fileId = idMatch[1];
      } else {
        const dMatch = targetUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (dMatch) {
          fileId = dMatch[1];
        }
      }
      if (fileId) {
        targetUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
      }
    } else if (targetUrl.includes('lh3.googleusercontent.com')) {
      targetUrl = targetUrl.split('=')[0]; // strip existing params
    }

    // Optimized 1200x630 format to show the full vertical image without cropping or cutoffs on WhatsApp & social platforms
    displayImage = `https://wsrv.nl/?url=${encodeURIComponent(targetUrl)}&w=1200&h=630&fit=contain&cbg=ffffff&output=jpg&q=90`;
    finalImageWidth = "1200";
    finalImageHeight = "630";
    imageType = "image/jpeg";
  } else {
    // Standard logic
    if (absoluteImage) {
      let targetUrl = absoluteImage;
      if (absoluteImage.includes('drive.google.com')) {
        let fileId = '';
        const idMatch = absoluteImage.match(/[?&]id=([^&]+)/);
        if (idMatch) {
          fileId = idMatch[1];
        } else {
          const dMatch = absoluteImage.match(/\/d\/([a-zA-Z0-9_-]+)/);
          if (dMatch) {
            fileId = dMatch[1];
          }
        }
        if (fileId) {
          targetUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
        }
      } else if (absoluteImage.includes('lh3.googleusercontent.com')) {
        targetUrl = absoluteImage.split('=')[0]; // strip existing resize parameters
      }
      
      // Check if wsrv is already wrapping this URL
      if (targetUrl.includes('wsrv.nl')) {
        // Just make sure it uses 1200x630 cover crop
        displayImage = targetUrl
          .replace(/w=\d+/, 'w=1200')
          .replace(/h=\d+/, 'h=630')
          .replace(/fit=[a-z]+/, 'fit=cover')
          .replace('output=webp', 'output=jpg');
      } else {
        displayImage = `https://wsrv.nl/?url=${encodeURIComponent(targetUrl)}&w=1200&h=630&fit=cover&a=attention&output=jpg&q=85`;
      }
    }
    finalImageWidth = imageWidth || defaultWidth;
    finalImageHeight = imageHeight || defaultHeight;
    imageType = "image/jpeg";
  }

  return (
    <Helmet>
      <title>{displayTitle}</title>
      <meta name="title" content={displayTitle} />
      <meta name="description" content={finalDescriptionText} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={absoluteUrl} />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content={finalType} />
      <meta property="og:url" content={absoluteUrl} />
      <meta property="og:title" content={displayTitle} />
      <meta property="og:description" content={finalDescriptionText} />
      <meta property="og:image" content={displayImage} />
      <meta property="og:image:width" content={finalImageWidth} />
      <meta property="og:image:height" content={finalImageHeight} />
      <meta property="og:image:type" content={imageType} />
      <meta property="og:site_name" content="Mukesh Saree Centre" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={absoluteUrl} />
      <meta name="twitter:title" content={displayTitle} />
      <meta name="twitter:description" content={finalDescriptionText} />
      <meta name="twitter:image" content={displayImage} />

      {/* Product Specific */}
      {isProductType && product && (
        <>
          {product.price && <meta property="product:price:amount" content={product.price.toString()} />}
          {product.currency && <meta property="product:price:currency" content={product.currency} />}
          {product.availability && <meta property="product:availability" content={product.availability} />}
          {product.condition && <meta property="product:condition" content={product.condition} />}
          <meta property="product:retailer_item_id" content={title} />
        </>
      )}

      {/* Structured Data Schema */}
      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  );
}
