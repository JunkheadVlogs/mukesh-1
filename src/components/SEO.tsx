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
}

export function SEO({
  title,
  description,
  image = "https://mukeshsarees.com/images/og-homepage.jpg",
  url = "https://mukeshsarees.com",
  type = "website",
  product,
  schema,
}: SEOProps) {
  const siteUrl = "https://mukeshsarees.com";
  const absoluteUrl = url.startsWith("http") ? url : `${siteUrl}${url}`;
  const absoluteImage = image?.startsWith("http") ? image : `${siteUrl}${image}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <link rel="canonical" href={absoluteUrl} />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={absoluteUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImage} />
      {/* 1200x630 is best for social links but Facebook accepts variations */}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Mukesh Saree Centre" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={absoluteUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />

      {/* Product Specific */}
      {(type === "product" || type === "og:product") && product && (
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
