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

function getCandidateUrls(src: string): string[] {
  if (!src) return [];
  const candidates: string[] = [src];

  if (src.includes('drive.google.com') || src.includes('googleusercontent.com')) {
    return candidates;
  }

  const parts = src.split('/');
  const filename = parts.pop() || '';
  const folder = parts.pop() || '';

  if (filename && folder && folder !== 'images' && folder !== 'product' && folder !== 'products') {
    const paths = [
      `/images/${folder}/${filename}`,
      `/images/product/${folder}/${filename}`,
      `/images/${filename}`,
      `/wp-content/uploads/${folder}/${filename}`,
      `/wp-content/uploads/${filename}`,
      `/${folder}/${filename}`,
      `https://mukeshsarees.com/images/${folder}/${filename}`,
      `https://mukeshsarees.com/images/product/${folder}/${filename}`,
      `https://mukeshsarees.com/wp-content/uploads/${folder}/${filename}`,
      `https://mukeshsarees.com/${folder}/${filename}`,
    ];
    for (const p of paths) {
      if (!candidates.includes(p)) {
        candidates.push(p);
      }
    }
  } else if (filename) {
    const paths = [
      `/images/${filename}`,
      `https://mukeshsarees.com/images/${filename}`,
      `/images/fendy-chiffon-white/${filename}`,
      `https://mukeshsarees.com/images/fendy-chiffon-white/${filename}`,
    ];
    for (const p of paths) {
      if (!candidates.includes(p)) {
        candidates.push(p);
      }
    }
  }

  if (filename && LOCAL_IMAGE_FALLBACKS[filename]) {
    candidates.push(LOCAL_IMAGE_FALLBACKS[filename]);
  }

  // Silk background safety fallback
  const fallbackUnsplash = 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=45';
  if (!candidates.includes(fallbackUnsplash)) {
    candidates.push(fallbackUnsplash);
  }

  return candidates;
}

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
  
  const [candidates, setCandidates] = useState<string[]>([]);
  const [candidateIndex, setCandidateIndex] = useState(0);

  useEffect(() => {
    const list = getCandidateUrls(src);
    setCandidates(list);
    setCandidateIndex(0);
  }, [src]);

  const currentSrc = candidates[candidateIndex] || src;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (candidateIndex < candidates.length - 1) {
      console.log(`OptimizedImage Error loading ${currentSrc}. Trying fallback candidate: ${candidates[candidateIndex + 1]}`);
      setCandidateIndex((prev) => prev + 1);
    } else {
      console.warn(`All OptimizedImage candidates failed to load for ${src}.`);
      if (onError) {
        onError(e);
      }
    }
  };

  const isGoogleDrive = currentSrc.includes('drive.google.com') || currentSrc.includes('googleusercontent.com');
  const isRelative = currentSrc.startsWith('/');

  // Google Drive optimization
  if (isGoogleDrive) {
    const optimizedDriveUrl = optimizeImage(currentSrc, width);
    return (
      <img
        src={optimizedDriveUrl}
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

  // Relative paths render directly
  if (isRelative) {
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

  // External / Bypass logic
  const isDirectBypass = currentSrc.startsWith('http') && 
                         !currentSrc.includes('drive.google.com') && 
                         !currentSrc.includes('googleusercontent.com') &&
                         !currentSrc.includes('mukeshsarees.com');

  const webpUrl = isDirectBypass ? currentSrc : optimizeImage(currentSrc, width, 'webp');
  const jpgUrl = isDirectBypass ? currentSrc : optimizeImage(currentSrc, width, 'jpg');

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
