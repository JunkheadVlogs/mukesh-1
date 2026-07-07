import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Product } from "./store"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageAlt(product: Partial<Product>) {
  if (!product) return "Authentic Premium Traditional Indian Clothing from Mukesh Saree Centre";
  
  const name = (product.name || "").trim();
  const color = (product.color || "").trim();
  const fabric = (product.fabric || "").trim();
  const category = (product.category || "").trim();
  
  let categoryDisplay = category;
  if (category.toLowerCase() === "sarees") {
    categoryDisplay = "Saree";
  } else if (category.toLowerCase() === "co-ord sets") {
    categoryDisplay = "Co-Ord Set";
  } else if (category.toLowerCase() === "lehengas") {
    categoryDisplay = "Lehenga";
  }

  const parts = [];
  parts.push("High-Quality Authentic");
  
  if (fabric && !name.toLowerCase().includes(fabric.toLowerCase())) {
    parts.push(fabric);
  }
  
  if (color && !name.toLowerCase().includes(color.toLowerCase())) {
    parts.push(`${color} Color`);
  }
  
  parts.push(name);
  
  if (!name.toLowerCase().includes(categoryDisplay.toLowerCase())) {
    parts.push(categoryDisplay);
  }
  
  parts.push("perfect for Wedding, Festival, or Party Wear from Mukesh Saree Centre");

  let altText = parts.join(" ").replace(/\s+/g, " ").trim();
  
  if (altText.length > 200) {
    altText = `${name} in ${color} ${fabric} ${categoryDisplay} - Mukesh Saree Centre`;
  }
  
  return altText;
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

export function getProductReviewStats(product: { id: string, name?: string, fabric?: string, category?: string, price?: number }) {
  const seed = getSeededRandom(product.id + "-revs");
  
  // Check if it is a Raga Tissue Saree
  const isRagaTissue = (product.id && ["p72", "p73", "p74", "p75", "p76"].includes(product.id)) || 
                       (product.name && product.name.toLowerCase().includes('raga') && product.name.toLowerCase().includes('tissue'));
  
  // Review Count: exactly 12-20 (or 9-12 for Raga Tissue as requested)
  const reviewCount = isRagaTissue ? ((seed % 4) + 9) : ((seed % 9) + 12);
  
  let totalRating = 0;
  for (let i = 0; i < reviewCount; i++) {
    const s = Math.abs(seed + i * 997);
    const mod = s % 15;
    if (mod < 12) {
      totalRating += 5;
    } else if (mod < 14) {
      totalRating += 4;
    } else {
      totalRating += 3;
    }
  }
  
  const rating = Number((totalRating / reviewCount).toFixed(1));
  
  return {
    rating,
    reviewCount
  };
}

export function optimizeImage(url: string, width: number = 800, format: 'webp' | 'jpg' | 'png' | 'auto' = 'webp') {
  if (!url) return url;
  
  if (url.includes('wsrv.nl') && !url.includes('imagekit.io')) {
    return url;
  }

  const IMAGEKIT_ENDPOINT = 'https://ik.imagekit.io/tus1loev9';

  // 1. Handle Native ImageKit optimization (and transform existing ImageKit URLs)
  if (url.includes('ik.imagekit.io') || url.includes('imagekit.io')) {
    if (url.includes('ik-thumbnail.jpg') || url.endsWith('.mp4') || url.includes('.mp4')) {
      return url;
    }
    try {
      const urlObj = new URL(url);
      
      // Clean path of any older path-based transformations like /tr:h-200,w-300
      let cleanPath = urlObj.pathname;
      cleanPath = cleanPath.replace(/\/tr:[^/]+/g, '');
      
      // Re-create raw ImageKit base without transformations
      const cleanUrlStr = `${urlObj.origin}${cleanPath}`;
      const cleanUrlObj = new URL(cleanUrlStr);
      
      // Preserve tracking and caching query parameters (like updatedAt) but remove old 'tr'
      for (const [key, val] of urlObj.searchParams.entries()) {
        if (key !== 'tr') {
          cleanUrlObj.searchParams.set(key, val);
        }
      }
      
      // Append optimized quality and format conversion parameters
      cleanUrlObj.searchParams.set('tr', `w-${width},f-${format},q-75`);
      return cleanUrlObj.toString();
    } catch (e) {
      // Fallback if URL parsing fails
      let cleanUrl = url.replace(/\/tr:[^/]+/g, '');
      cleanUrl = cleanUrl.replace(/[?&]tr=[^&]*/g, '');
      const sep = cleanUrl.includes('?') ? '&' : '?';
      return `${cleanUrl}${sep}tr=w-${width},f-${format},q-75`;
    }
  }

  // 2. Transform relative, localhost, or production-hosted paths into optimized ImageKit URLs
  const isRelative = url.startsWith('/');
  const isLocalOrMs = url.includes('localhost') || 
                      url.includes('127.0.0.1') || 
                      url.includes('3000') || 
                      url.includes('run.app') || 
                      url.includes('mukeshsarees.com');

  if (isRelative || isLocalOrMs) {
    let pathname = '';
    try {
      if (isRelative) {
        pathname = url;
      } else {
        pathname = new URL(url).pathname;
      }
    } catch (e) {
      pathname = url;
    }

    // Clean leading slashes and map asset path directly to the ImageKit endpoint
    const cleanPath = pathname.replace(/^\/+/, '');
    
    // Ensure all local media assets map directly to our ImageKit instance for premium delivery
    const finalUrl = `${IMAGEKIT_ENDPOINT}/${cleanPath}`;
    try {
      const urlObj = new URL(finalUrl);
      urlObj.searchParams.set('tr', `w-${width},f-${format},q-75`);
      return urlObj.toString();
    } catch (e) {
      return `${finalUrl}?tr=w-${width},f-${format},q-75`;
    }
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
      // Return high-quality pre-resized direct Google Drive thumbnail (direct from Google CDN, no redirects or proxy-induced blur)
      return `https://drive.google.com/thumbnail?id=${driveId}&sz=w${width}`;
    }
    
    // Safety guarantee: Do not let any Google URL fall through to the wsrv.nl proxy block
    return url;
  }
  
  if (url.includes('images.unsplash.com')) {
    const urlObj = new URL(url);
    urlObj.searchParams.set('w', width.toString());
    urlObj.searchParams.set('q', '75');
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
    const wsrvOutput = format === 'auto' ? 'webp' : format;
    return `https://wsrv.nl/?url=${encodeURIComponent(absoluteUrl)}&w=${width}&output=${wsrvOutput}&q=75&we`;
  }
  
  return url;
}
