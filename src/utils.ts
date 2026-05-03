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
  const regex = /\*\*\d+\.\s+([^*]+)\*\*\s*([\s\S]*?)(?=\*\*\d+\.|$)/g;
  let match;
  while ((match = regex.exec(markdown)) !== null) {
    sections.push({ title: match[1].trim(), content: match[2].trim() });
  }
  
  if (sections.length === 0) {
    return [{ title: 'Description', content: markdown }];
  }
  return sections;
}

export function optimizeImage(url: string, width: number = 800) {
  if (!url) return url;
  
  if (url.includes('drive.google.com/thumbnail')) {
    // Get a high-res version from Drive then optimize via wsrv.nl (Cloudflare) for webp caching
    const targetUrl = url.replace(/sz=w\d+/, 'sz=w2000');
    return `https://wsrv.nl/?url=${encodeURIComponent(targetUrl)}&w=${width}&output=webp&q=80&we`;
  }
  
  if (url.includes('images.unsplash.com')) {
    const urlObj = new URL(url);
    urlObj.searchParams.set('w', width.toString());
    urlObj.searchParams.set('q', '80');
    if (!urlObj.searchParams.has('auto')) {
      urlObj.searchParams.set('auto', 'format,compress'); // delivers webp/avif automatically
    }
    urlObj.searchParams.set('fit', 'crop');
    return urlObj.toString();
  }
  
  if (url.startsWith('http')) {
     return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${width}&output=webp&q=80&we`;
  }
  
  return url;
}
