import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Product } from "./store"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageAlt(product: Partial<Product>) {
  if (!product) return "Exclusive Traditional Wear - Mukesh Saree Centre Nagpur";
  
  const suffix = " - Mukesh Saree Centre Nagpur";
  const maxLength = 125;
  const maxBaseLength = maxLength - suffix.length; // 94 characters

  const name = (product.name || "").trim();
  const color = (product.color || "").trim();
  const fabric = (product.fabric || "").trim();
  const category = (product.category || "").trim();

  let base = "";
  const parts: string[] = [];

  // Start with Color if available and not already in name
  if (color && !name.toLowerCase().includes(color.toLowerCase())) {
    parts.push(color);
  }

  // Add Fabric type if available and not already in name
  if (fabric && !name.toLowerCase().includes(fabric.toLowerCase())) {
    parts.push(fabric);
  }

  // Add Category if name doesn't already contain it, or name doesn't contain category singulars
  let categoryDisplay = category;
  if (category.toLowerCase() === "sarees") {
    categoryDisplay = "Saree";
  } else if (category.toLowerCase() === "co-ord sets") {
    categoryDisplay = "Co-Ord Set";
  } else if (category.toLowerCase() === "lehengas") {
    categoryDisplay = "Lehenga";
  }

  // Let's make sure the name is cleanly formatted and included
  parts.push(name);

  base = parts.join(" ").replace(/\s+/g, " ").trim();
  
  if (!base) {
    base = [color, fabric, categoryDisplay].filter(Boolean).join(" ").trim();
  }
  
  if (!base) {
    base = "Exclusive Elegant Traditional Wear";
  }

  // Ensure base length fits under maxBaseLength
  if (base.length > maxBaseLength) {
    base = base.substring(0, maxBaseLength).trim();
    // remove any trailing comma/space/dash
    base = base.replace(/[\s,\-_|]+$/, "");
  }

  return base + suffix;
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
  
  if (url.includes('wsrv.nl')) {
    return url;
  }
  
  const isGoogle = url.includes('drive.google.com') || 
                   url.includes('googleusercontent.com') ||
                   url.includes('drive.usercontent.google.com') ||
                   url.includes('lh3.googleusercontent.com');

  if (isGoogle) {
    // Extract the raw file ID from the Google Drive URL robustly
    let driveId = '';
    const dMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/) || url.match(/id%3D([a-zA-Z0-9_-]+)/);
    const lhMatch = url.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);

    if (dMatch && dMatch[1]) {
      driveId = dMatch[1];
    } else if (idMatch && idMatch[1]) {
      driveId = idMatch[1];
    } else if (lhMatch && lhMatch[1]) {
      driveId = lhMatch[1];
    }

    if (driveId) {
      // Use wsrv.nl to dynamically compress and resize the Google Drive target image.
      // export=view is highly reliable, and wsrv.nl creates highly optimized, small webp/jpg files with CDN caching.
      const outputFormat = format === 'jpg' ? 'jpg' : 'webp';
      return `https://wsrv.nl/?url=https%3A%2F%2Fdrive.google.com%2Fuc%3Fexport%3Dview%26id%3D${driveId}&w=${width}&output=${outputFormat}&q=85`;
    }
    
    // Safety guarantee: Do not let any Google URL fall through to the wsrv.nl proxy block
    return url;
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

  if (absoluteUrl.startsWith('http') && 
      !absoluteUrl.includes('localhost') && 
      !absoluteUrl.includes('127.0.0.1') && 
      !absoluteUrl.includes('3000') && 
      !absoluteUrl.includes('run.app') &&
      !absoluteUrl.includes('mukeshsarees.com')) {
     return `https://wsrv.nl/?url=${encodeURIComponent(absoluteUrl)}&w=${width}&output=${format}&q=80&we`;
  }
  
  return url;
}
