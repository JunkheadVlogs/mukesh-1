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
    return url.replace(/sz=w\d+/, `sz=w${width}-rw`);
  }
  if (url.includes('images.unsplash.com')) {
    // Add format and compression to unsplash images if not present
    let optimizedUrl = url;
    if (!optimizedUrl.includes('auto=format')) optimizedUrl += '&auto=format';
    if (!optimizedUrl.includes('fit=crop')) optimizedUrl += '&fit=crop';
    if (!optimizedUrl.includes('q=')) optimizedUrl += '&q=80';
    optimizedUrl = optimizedUrl.replace(/w=\d+/, `w=${width}`);
    return optimizedUrl;
  }
  return url;
}
