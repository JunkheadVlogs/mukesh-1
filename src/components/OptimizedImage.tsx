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
  'category_sarees.webp': 'https://mukeshsarees.com/home%20Page%20Images/saree_category_background_image.webp',
  'saree_category_backgroung_image.webp': 'https://mukeshsarees.com/home%20Page%20Images/saree_category_background_image.webp',
  'saree_category_background_image.webp': 'https://mukeshsarees.com/home%20Page%20Images/saree_category_background_image.webp',
  'best-saree-shop-in-nagpur-logo.webp': 'https://mukeshsarees.com/home%20Page%20Images/best-saree-shop-in-nagpur-logo.webp',
  'hero-image-best-saree-shop-nagpur.webp': 'https://mukeshsarees.com/home%20Page%20Images/hero-image-best-saree-shop-nagpur.webp',
  'best-co-ord-set-shop-in-nagpur-category-image.webp': 'https://mukeshsarees.com/home%20Page%20Images/best-co-ord-set-shop-in-nagpur-category-image.webp',
  'shop-main-enterence.webp': 'https://mukeshsarees.com/home%20Page%20Images/shop-main-enterence.webp',
};

/**
 * Sanitizes and properly URL encodes any image URL.
 * Replaces unencoded spaces specifically with %20.
 * Translates localhost paths to the live Hostinger domain.
 */
function sanitizeUrl(url: string): string {
  if (!url) return '';
  
  // Replace localhost references with the live Hostinger domain
  let clean = url.replace(/http:\/\/localhost:\d+/g, 'https://mukeshsarees.com');
  clean = clean.replace(/https:\/\/localhost:\d+/g, 'https://mukeshsarees.com');
  clean = clean.replace(/localhost:\d+/g, 'mukeshsarees.com');
  
  // Re-encode spaces cleanly to %20 without double encoding
  try {
    const decoded = decodeURIComponent(clean);
    clean = decoded.replace(/ /g, '%20');
  } catch (e) {
    clean = clean.replace(/ /g, '%20');
  }
  
  return clean;
}

/**
 * Generates an ordered list of candidate URLs for the image.
 * If Hostinger locations fail, standard fallbacks are tested, ending with high quality placeholder backups.
 */
function getCandidateUrls(src: string): string[] {
  if (!src) return [];
  
  const sanitized = sanitizeUrl(src);
  const candidates: string[] = [sanitized];

  // Look for Google Drive parameters
  let driveId = '';
  const idMatch = sanitized.match(/[?&]id=([^&]+)/);
  if (idMatch) {
    driveId = idMatch[1];
  } else {
    const dMatch = sanitized.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (dMatch) {
      driveId = dMatch[1];
    }
  }

  // Extract filename and folder structures
  const parts = sanitized.split('/');
  let filename = parts.pop() || '';
  if (filename.includes('?')) {
    filename = filename.split('?')[0];
  }
  const folder = parts.pop() || '';

  // 1. If we have a Google Drive ID, generate equivalent Hostinger direct URLs first
  // to satisfy "Remove all Google Drive image dependency" whilst retaining fallback compatibility
  if (driveId) {
    const hostingerDriveFallbacks = [
      `https://mukeshsarees.com/home%20Page%20Images/${driveId}.webp`,
      `https://mukeshsarees.com/images/${driveId}.webp`,
      `https://mukeshsarees.com/product/${driveId}.webp`,
      `https://mukeshsarees.com/home%20Page%20Images/${driveId}.jpg`,
      `https://mukeshsarees.com/images/${driveId}.jpg`,
      `https://mukeshsarees.com/product/${driveId}.jpg`,
      `/images/${driveId}.webp`,
      `/images/product/${driveId}.webp`,
    ];

    for (const path of hostingerDriveFallbacks) {
      if (!candidates.includes(path)) {
        // Put hostinger candidates FIRST to favor Hostinger Direct over Google Drive
        candidates.unshift(path);
      }
    }

    // Google Drive direct thumbnail link as last resort alternative
    const driveThumbnail = `https://drive.google.com/thumbnail?id=${driveId}&sz=w800`;
    if (!candidates.includes(driveThumbnail)) {
      candidates.push(driveThumbnail);
    }
  }

  // 2. Map explicitly defined local fallbacks
  if (filename && LOCAL_IMAGE_FALLBACKS[filename]) {
    const mapped = LOCAL_IMAGE_FALLBACKS[filename];
    if (!candidates.includes(mapped)) {
      candidates.unshift(mapped); // Try the mapped main Hostinger URL first
    }
  }

  // 3. Inject standard search paths (both Hostinger live direct & local public assets)
  if (filename && folder && folder !== 'images' && folder !== 'product' && folder !== 'products' && folder !== 'home%20Page%20Images') {
    const hostingerPaths = [
      `https://mukeshsarees.com/home%20Page%20Images/${filename}`,
      `https://mukeshsarees.com/images/${folder}/${filename}`,
      `https://mukeshsarees.com/product/${folder}/${filename}`,
      `https://mukeshsarees.com/${folder}/${filename}`,
      `/images/${folder}/${filename}`,
    ];
    for (const p of hostingerPaths) {
      const sp = sanitizeUrl(p);
      if (!candidates.includes(sp)) {
        candidates.push(sp);
      }
    }
  } else if (filename) {
    const hostingerPaths = [
      `https://mukeshsarees.com/home%20Page%20Images/${filename}`,
      `https://mukeshsarees.com/images/${filename}`,
      `https://mukeshsarees.com/product/${filename}`,
      `/images/${filename}`,
    ];
    for (const p of hostingerPaths) {
      const sp = sanitizeUrl(p);
      if (!candidates.includes(sp)) {
        candidates.push(sp);
      }
    }
  }

  // 4. Elegant premium Unsplash placeholder as final resource fallback
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

export function OptimizedImage({ 
  src, 
  width = 600, 
  height, 
  alt, 
  className, 
  srcSet, 
  sizes, 
  priority = false, 
  onError, 
  ...props 
}: OptimizedImageProps) {
  const calculatedHeight = height || Math.round(width * 1.33333);
  
  const [candidates, setCandidates] = useState<string[]>([]);
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [hasFailedAll, setHasFailedAll] = useState(false);

  useEffect(() => {
    const list = getCandidateUrls(src);
    setCandidates(list);
    setCandidateIndex(0);
    setHasFailedAll(false);
  }, [src]);

  const currentSrc = candidates[candidateIndex] || sanitizeUrl(src);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (candidateIndex < candidates.length - 1) {
      console.log(`OptimizedImage loading fallback candidate for [${alt}]: ${candidates[candidateIndex + 1]}`);
      setCandidateIndex((prev) => prev + 1);
    } else {
      console.warn(`All image candidates failed to load for [${alt}]. Triggering emergency brand card placeholder.`);
      setHasFailedAll(true);
      if (onError) {
        onError(e);
      }
    }
  };

  // If even the unspash fallback failed, display a gorgeous boutique brand card placeholder
  if (hasFailedAll) {
    return (
      <div 
        className={`flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#1E0E05] to-[#3D1D0B] border border-[#D4AF37]/30 text-white select-none ${className || ''}`}
        style={{ 
          width: '100%', 
          height: calculatedHeight ? `${calculatedHeight}px` : '100%', 
          minHeight: '260px',
          ...(props.style || {}) 
        }}
      >
        <span className="font-serif text-[#D4AF37] font-semibold text-[13px] md:text-sm tracking-[4px] uppercase block mb-2">
          MUKESH SAREE CENTRE
        </span>
        <span className="text-[10px] text-white/50 tracking-widest uppercase block max-w-[85%] mx-auto">
          {alt || 'Exclusive Designer Wear'}
        </span>
        <div className="w-8 h-[1px] bg-[#D4AF37]/40 mt-3"></div>
      </div>
    );
  }

  const isGoogleDrive = currentSrc.includes('drive.google.com') || currentSrc.includes('googleusercontent.com');
  const isRelative = currentSrc.startsWith('/');

  // Google Drive optimization proxy if needed
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

  // Custom live Hostinger links / external bypass optimization logic
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
        style={{ background: '#F5F0E8', objectFit: 'cover', ...(props.style || {}) }}
        onError={handleImageError}
        {...props}
      />
    </picture>
  );
}
