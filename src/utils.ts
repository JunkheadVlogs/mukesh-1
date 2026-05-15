import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

export function parseMarkdownDescription(markdown: string) {
  const sections: { title: string; content: string }[] = [];
  // Updated regex to catch **Title** or **1. Title**
  const regex = /\*\*(\d*\.?\s*([^*]+))\*\*\s*([\s\S]*?)(?=\*\*(\d*\.?\s*[^*]+)\*\*|$)/g;
  let match;
  while ((match = regex.exec(markdown)) !== null) {
    sections.push({ title: match[2].trim(), content: match[3].trim() });
  }
  
  if (sections.length === 0) {
    return [{ title: 'Description', content: markdown }];
  }
  return sections;
}

export function getSeededRandom(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export function getProductReviewStats(product: { id: string, fabric?: string, category?: string, price?: number }) {
  const seed = getSeededRandom(product.id);
  
  // Base 4.4 to 4.9
  let baseRating = 4.4 + ((seed % 60) / 100); 
  
  // Luxury or Linen or Price > 900 tend to have higher reviews
  const isPremium = (product.price && product.price > 900) || 
                   (product.fabric && product.fabric.toLowerCase().includes('linen')) ||
                   (product.category && product.category.toLowerCase().includes('premium'));

  if (isPremium) {
    baseRating = 4.7 + ((seed % 30) / 100); // 4.7 to 4.99
  }
  
  // Make some exactly 5.0
  if (seed % 10 === 0 && isPremium) {
    baseRating = 5.0;
  }
  
  const rating = Number(baseRating.toFixed(1));
  
  // Review counts 32 to 450 depending on seed
  let reviewCount = (seed % 418) + 32;
  
  // Popular items (like trending) get a little bump
  if (seed % 5 === 0) {
    reviewCount += 100 + (seed % 50);
  }

  return {
    rating,
    reviewCount
  }
}

export function optimizeImage(url: string, width: number = 800, format: 'webp' | 'jpg' | 'png' = 'webp') {
  if (!url) return url;
  
  if (url.includes('drive.google.com/thumbnail')) {
    // Get a high-res version from Drive then optimize via wsrv.nl (Cloudflare) for webp caching
    const targetUrl = url.replace(/sz=w\d+/, 'sz=w2000');
    return `https://wsrv.nl/?url=${encodeURIComponent(targetUrl)}&w=${width}&output=${format}&q=80&we`;
  }
  
  if (url.includes('images.unsplash.com')) {
    const urlObj = new URL(url);
    urlObj.searchParams.set('w', width.toString());
    urlObj.searchParams.set('q', '80');
    if (format === 'webp') {
      urlObj.searchParams.set('fm', 'webp');
    } else {
      urlObj.searchParams.set('fm', format);
    }
    urlObj.searchParams.set('fit', 'crop');
    return urlObj.toString();
  }
  
  if (url.startsWith('http')) {
     return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${width}&output=${format}&q=80&we`;
  }
  
  return url;
}
