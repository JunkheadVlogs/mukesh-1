import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
  product?: {
    price?: number;
    currency?: string;
    availability?: string;
    condition?: string;
  };
  schema?: Record<string, any>;
  imageWidth?: string;
  imageHeight?: string;
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
  image = "https://mukeshsarees.com/images/og-homepage.jpg",
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

  // Clean the description to prevent markdown/asterisks or tags appearing in SEO/og:description tags
  const cleanDescriptionText = cleanSEOText(description);

  // Default to 800 for square image presentation (ideal for WhatsApp/Instagram/Facebook crop alignment without black bars)
  const isProductType = type === "product" || type === "og:product";
  const defaultWidth = isProductType ? "800" : "1200";
  const defaultHeight = isProductType ? "800" : "630";

  const finalImageWidth = imageWidth || defaultWidth;
  const finalImageHeight = imageHeight || defaultHeight;

  let displayImage = absoluteImage;
  if (isProductType && absoluteImage) {
    displayImage = `https://wsrv.nl/?url=${encodeURIComponent(absoluteImage)}&w=800&h=800&fit=contain&bg=ffffff&output=jpg`;
  }

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={cleanDescriptionText} />
      <link rel="canonical" href={absoluteUrl} />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={absoluteUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={cleanDescriptionText} />
      <meta property="og:image" content={displayImage} />
      <meta property="og:image:width" content={finalImageWidth} />
      <meta property="og:image:height" content={finalImageHeight} />
      <meta property="og:site_name" content="Mukesh Saree Centre" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={absoluteUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={cleanDescriptionText} />
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
