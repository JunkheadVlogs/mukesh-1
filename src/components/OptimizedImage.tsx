import { useState, useEffect } from 'react';
import { optimizeImage } from '../utils';

const LOCAL_IMAGE_FALLBACKS: Record<string, string> = {
  'main_shop_entrance.webp': 'https://wsrv.nl/?url=https%3A%2F%2Flh3.googleusercontent.com%2Fd%2F1IFI6HR5__1CmmWFj2SOU9dRZkJL3oSRU&output=webp&q=85',
  'billing_counter.webp': 'https://wsrv.nl/?url=https%3A%2F%2Flh3.googleusercontent.com%2Fd%2F1BkjTW2c9Lp0KUQH337w7boQtrXmrnHDl&output=webp&q=85',
  'saree_section.webp': 'https://wsrv.nl/?url=https%3A%2F%2Flh3.googleusercontent.com%2Fd%2F1ANZwb_MyHYzwJE8otCzY2DiwvkU_N7T4&output=webp&q=85',
  'lehenga_section.webp': 'https://wsrv.nl/?url=https%3A%2F%2Flh3.googleusercontent.com%2Fd%2F1gjPnofLFUOXMAbD4gowCAi_3ie36HJmp&output=webp&q=85',
  'logo.webp': 'https://wsrv.nl/?url=https%3A%2F%2Flh3.googleusercontent.com%2Fd%2F1QDVfG-lK8wmYw_Wfz62Yb745gR40foRw&output=webp&q=85',
  'hero_exhibition.webp': 'https://wsrv.nl/?url=https%3A%2F%2Flh3.googleusercontent.com%2Fd%2F1tucc1ZblHYQt5suadHkwZl-3BzyzAuIA&output=webp&q=85',
  'category_coord_sets.webp': 'https://wsrv.nl/?url=https%3A%2F%2Flh3.googleusercontent.com%2Fd%2F1lSuvWpjCmEyPWtWlDOmlJPAP9oaBaW6c&output=webp&q=85',
  'category_sarees.webp': 'https://wsrv.nl/?url=https%3A%2F%2Flh3.googleusercontent.com%2Fd%2F1oU1UYZS8CU3OOa-3CNyc3cQlyAS0AfJ_&output=webp&q=85',
};

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  width?: number;
  height?: number;
  alt: string;
  className?: string;
  srcSet?: string;
  sizes?: string;
  priority?: boolean;
}

export function OptimizedImage({ src, width = 600, height, alt, className, srcSet, sizes, priority = false, onError, ...props }: OptimizedImageProps) {
  const calculatedHeight = height || Math.round(width * 1.33333);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [fallbackCount, setFallbackCount] = useState(0);

  useEffect(() => {
    setCurrentSrc(src);
    setFallbackCount(0);
  }, [src]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const filename = src.split('/').pop() || '';
    if (fallbackCount === 0) {
      setFallbackCount(1);
      if (LOCAL_IMAGE_FALLBACKS[filename]) {
        console.log(`Image load failed for ${src}, falling back to premium cloud CDN...`);
        setCurrentSrc(LOCAL_IMAGE_FALLBACKS[filename]);
        return;
      }
    }
    
    if (fallbackCount < 2) {
      setFallbackCount(2);
      console.warn(`Fallback image failed or not found for ${src}, using luxury silk placeholder...`);
      // Premium silk/saree styled luxury background placeholder
      setCurrentSrc('https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=45');
    }

    if (onError) {
      onError(e);
    }
  };

  // If the image is/was a local static asset (and hasn't errored to fallback), bypass CDN/Optimizations.
  if (currentSrc.startsWith('/') && fallbackCount === 0) {
    return (
      <img
        src={currentSrc}
        alt={alt}
        width={width}
        height={calculatedHeight}
        className={className}
        loading={priority ? undefined : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        referrerPolicy="no-referrer"
        decoding={priority ? "sync" : "async"}
        style={{ background: '#F5F0E8', objectFit: 'cover', ...(props.style || {}) }}
        onError={handleImageError}
        {...props}
      />
    );
  }

  const webpUrl = currentSrc.startsWith('http') ? currentSrc : optimizeImage(currentSrc, width, 'webp');
  const jpgUrl = currentSrc.startsWith('http') ? currentSrc : optimizeImage(currentSrc, width, 'jpg');

  // Generate responsive srcSet if not provided and it's not a direct fallback CDN URL
  let generatedSrcSetWebp = srcSet;
  let generatedSrcSetJpg = srcSet;
  
  if (!srcSet && !currentSrc.startsWith('http')) {
    generatedSrcSetWebp = `${optimizeImage(currentSrc, 400, 'webp')} 400w, ${optimizeImage(currentSrc, 800, 'webp')} 800w, ${optimizeImage(currentSrc, 1200, 'webp')} 1200w`;
    generatedSrcSetJpg = `${optimizeImage(currentSrc, 400, 'jpg')} 400w, ${optimizeImage(currentSrc, 800, 'jpg')} 800w, ${optimizeImage(currentSrc, 1200, 'jpg')} 1200w`;
  }
  const defaultSizes = sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";

  return (
    <picture key={currentSrc} className="contents">
      {generatedSrcSetWebp && <source srcSet={generatedSrcSetWebp} sizes={defaultSizes} type="image/webp" />}
      <img
        src={jpgUrl}
        srcSet={generatedSrcSetJpg}
        sizes={generatedSrcSetJpg ? defaultSizes : undefined}
        alt={alt}
        width={width}
        height={calculatedHeight}
        className={className}
        loading={priority ? undefined : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        referrerPolicy="no-referrer"
        decoding={priority ? "sync" : "async"}
        style={{ background: '#F5F0E8', ...(props.style || {}) }}
        onError={handleImageError}
        {...props}
      />
    </picture>
  );
}
