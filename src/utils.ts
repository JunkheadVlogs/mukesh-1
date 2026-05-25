import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Product } from "./store"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageAlt(product: Partial<Product>) {
  if (!product) return "Mukesh Saree Centre";
  const parts = [];
  if (product.color) parts.push(product.color);
  if (product.fabric) parts.push(product.fabric);
  
  if (product.category === 'Co-Ord Sets' && product.name?.toLowerCase().includes('suit')) {
    parts.push('Suit');
  } else if (product.category) {
    if (product.category.toLowerCase() === 'co-ord sets') parts.push('Co-Ord Set');
    else if (product.category.toLowerCase() === 'sarees') parts.push('Saree');
    else if (product.category.toLowerCase() === 'lehengas') parts.push('Lehenga');
    else parts.push(product.category);
  }
  
  let occasion = '';
  const desc = product.description?.toLowerCase() || '';
  if (desc.includes('brid') || desc.includes('wedding')) occasion = 'for Wedding';
  else if (desc.includes('festiv')) occasion = 'for Festive Wear';
  else if (desc.includes('party')) occasion = 'for Party Wear';
  else if (desc.includes('office') || desc.includes('work') || desc.includes('formal')) occasion = 'for Office Wear';
  else if (desc.includes('casual') || desc.includes('daily') || desc.includes('everyday')) occasion = 'for Daily Wear';

  let text = parts.join(' ').trim();
  if (occasion) {
    text += ` ${occasion}`;
  }
  
  return text ? `${text} — Mukesh Saree Centre` : `${product.name} — Mukesh Saree Centre`;
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
  
  if (url.startsWith('/images/')) {
    return url;
  }
  
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
  
  let absoluteUrl = url;
  if (url.startsWith('/')) {
    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      // Convert relative browser path to absolute to leverage wsrv.nl on production
      if (!origin.includes('localhost') && !origin.includes('127.0.0.1') && !origin.includes('::1') && !origin.includes('3000') && !origin.includes('run.app')) {
        absoluteUrl = origin + url;
      }
    } else {
      // During server-side prerendering, prefix with production site domain
      absoluteUrl = "https://mukeshsarees.com" + url;
    }
  }

  if (absoluteUrl.startsWith('http') && !absoluteUrl.includes('localhost') && !absoluteUrl.includes('127.0.0.1') && !absoluteUrl.includes('3000') && !absoluteUrl.includes('run.app')) {
     return `https://wsrv.nl/?url=${encodeURIComponent(absoluteUrl)}&w=${width}&output=${format}&q=80&we`;
  }
  
  return url;
}
