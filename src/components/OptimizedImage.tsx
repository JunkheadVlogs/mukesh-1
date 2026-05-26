import { useState, useEffect } from 'react';
import { optimizeImage } from '../utils';

const LOCAL_IMAGE_FALLBACKS: Record<string, string> = {
  'main_shop_entrance.webp': 'https://mukeshsarees.com/home%20Page%20Images/shop-main-enterence.webp',
  'billing_counter.webp': 'https://mukeshsarees.com/home%20Page%20Images/billing-counter.webp',
  'saree_section.webp': 'https://mukeshsarees.com/home%20Page%20Images/saree_section.webp',
  'lehenga_section.webp': 'https://mukeshsarees.com/home%20Page%20Images/lehenga-section.webp',
  'logo.webp': 'https://mukeshsarees.com/home%20Page%20Images/best-saree-shop-in-nagpur-logo.webp',
  'hero_exhibition.webp': 'https://mukeshsarees.com/home%20Page%20Images/hero-image-best-saree-shop-nagpur.webp',
  'category_coord_sets.webp': 'https://mukeshsarees.com/home%20Page%20Images/best-co-ord-set-shop-in-nagpur-category-image.webp',
  'category_sarees.webp': 'https://mukeshsarees.com/home%20Page%20Images/saree_category_backgroung_image.webp',
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

  const isDirectBypass = currentSrc.startsWith('http') && 
                         !currentSrc.includes('drive.google.com') && 
                         !currentSrc.includes('googleusercontent.com') &&
                         !currentSrc.includes('mukeshsarees.com');

  const webpUrl = isDirectBypass ? currentSrc : optimizeImage(currentSrc, width, 'webp');
  const jpgUrl = isDirectBypass ? currentSrc : optimizeImage(currentSrc, width, 'jpg');

  // Generate responsive srcSet if not provided and it's not a direct fallback CDN URL
  let generatedSrcSetWebp = srcSet;
  let generatedSrcSetJpg = srcSet;
  
  if (!srcSet && !isDirectBypass) {
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
