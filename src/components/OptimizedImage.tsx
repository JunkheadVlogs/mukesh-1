import { useState, useEffect, useRef } from 'react';
import { optimizeImage } from '../utils';

const PLACEHOLDER_1X1 = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

const LOCAL_IMAGE_FALLBACKS: Record<string, string> = {
  'mainshop.webp': 'https://ik.imagekit.io/tus1loev9/homepage/shopenterence.webp?updatedAt=1779907894298',
  'mainshop.jpg': 'https://ik.imagekit.io/tus1loev9/homepage/shopenterence.webp?updatedAt=1779907894298',
  'billingcounter.webp': 'https://ik.imagekit.io/tus1loev9/homepage/billingcounter.webp?updatedAt=1779907894357',
  'billingcounter.jpg': 'https://ik.imagekit.io/tus1loev9/homepage/billingcounter.webp?updatedAt=1779907894357',
  'sareesection.webp': 'https://ik.imagekit.io/tus1loev9/homepage/sareesection.webp?updatedAt=1779907895695',
  'sareesection.jpg': 'https://ik.imagekit.io/tus1loev9/homepage/sareesection.webp?updatedAt=1779907895695',
  'lehenga.webp': 'https://ik.imagekit.io/tus1loev9/homepage/lehengasection.webp?updatedAt=1779907894691',
  'lehenga.jpg': 'https://ik.imagekit.io/tus1loev9/homepage/lehengasection.webp?updatedAt=1779907894691',
  'logo.webp': 'https://ik.imagekit.io/tus1loev9/homepage/logo.webp?updatedAt=1779907895217',
  'logo.jpg': 'https://ik.imagekit.io/tus1loev9/homepage/logo.webp?updatedAt=1779907895217',
  'hero.webp': 'https://ik.imagekit.io/tus1loev9/homepage/heroimage.webp?updatedAt=1779907895469',
  'hero.jpg': 'https://ik.imagekit.io/tus1loev9/homepage/heroimage.webp?updatedAt=1779907895469',
  'coordset.webp': 'https://ik.imagekit.io/tus1loev9/homepage/coordsetcategory.webp?updatedAt=1779907895090',
  'coordset.jpg': 'https://ik.imagekit.io/tus1loev9/homepage/coordsetcategory.webp?updatedAt=1779907895090',
  'saree-bg.webp': 'https://ik.imagekit.io/tus1loev9/homepage/saree-category.webp?updatedAt=1779907894790',
  'saree-bg.jpg': 'https://ik.imagekit.io/tus1loev9/homepage/saree-category.webp?updatedAt=1779907894790',
  'main_shop_entrance.webp': 'https://ik.imagekit.io/tus1loev9/homepage/shopenterence.webp?updatedAt=1779907894298',
  'billing_counter.webp': 'https://ik.imagekit.io/tus1loev9/homepage/billingcounter.webp?updatedAt=1779907894357',
  'saree_section.webp': 'https://ik.imagekit.io/tus1loev9/homepage/sareesection.webp?updatedAt=1779907895695',
  'lehenga_section.webp': 'https://ik.imagekit.io/tus1loev9/homepage/lehengasection.webp?updatedAt=1779907894691',
  'hero_exhibition.webp': 'https://ik.imagekit.io/tus1loev9/homepage/heroimage.webp?updatedAt=1779907895469',
  'category_coord_sets.webp': 'https://ik.imagekit.io/tus1loev9/homepage/coordsetcategory.webp?updatedAt=1779907895090',
  'category_sarees.webp': 'https://ik.imagekit.io/tus1loev9/homepage/sareesection.webp?updatedAt=1779907895695',
  'saree_category_backgroung_image.webp': 'https://ik.imagekit.io/tus1loev9/homepage/saree-category.webp?updatedAt=1779907894790',
  'saree_category_background_image.webp': 'https://ik.imagekit.io/tus1loev9/homepage/saree-category.webp?updatedAt=1779907894790',
  'saree_category_background.webp': 'https://ik.imagekit.io/tus1loev9/homepage/saree-category.webp?updatedAt=1779907894790',
  'best-saree-shop-in-nagpur-logo.webp': 'https://ik.imagekit.io/tus1loev9/homepage/logo.webp?updatedAt=1779907895217',
  'hero-image-best-saree-shop-nagpur.webp': 'https://ik.imagekit.io/tus1loev9/homepage/heroimage.webp?updatedAt=1779907895469',
  'best-co-ord-set-shop-in-nagpur-category-image.webp': 'https://ik.imagekit.io/tus1loev9/homepage/coordsetcategory.webp?updatedAt=1779907895090',
  'shop-main-enterence.webp': 'https://ik.imagekit.io/tus1loev9/homepage/shopenterence.webp?updatedAt=1779907894298',
};

const VIDEO_THUMB_FALLBACKS: Record<string, string> = {
  'VID-20260601-WA0034': 'https://ik.imagekit.io/tus1loev9/homepage/sareesection.webp?updatedAt=1779907895695',
  'VID-20260521-WA0037': 'https://ik.imagekit.io/tus1loev9/homepage/sareesection.webp?updatedAt=1779907895695',
  'VID-20260513-WA0026': 'https://ik.imagekit.io/tus1loev9/homepage/sareesection.webp?updatedAt=1779907895695',
  'VID-20260513-WA0025': 'https://ik.imagekit.io/tus1loev9/homepage/shopenterence.webp?updatedAt=1779907894298',
  'VID_20260124_071257_055': 'https://ik.imagekit.io/tus1loev9/homepage/sareesection.webp?updatedAt=1779907895695'
};

/**
 * Robustly extracts the Google Drive File ID from Google Drive URLs.
 */
function extractGoogleDriveId(url: string): string | null {
  if (!url) return null;
  
  // Match "/d/FILE_ID" (most common format for view/share links)
  const dMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (dMatch && dMatch[1]) {
    return dMatch[1];
  }
  
  // Match "id=FILE_ID" (common for uc, open, or download endpoints)
  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/) || url.match(/id%3D([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) {
    return idMatch[1];
  }
  
  // Match "lh3.googleusercontent.com/d/FILE_ID" or similar googleusercontent patterns
  const lhMatch = url.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
  if (lhMatch && lhMatch[1]) {
    return lhMatch[1];
  }
  
  return null;
}

/**
 * Sanitizes and properly URL encodes any image URL.
 * Replaces unencoded spaces specifically with %20.
 * Translates localhost paths to relative paths so they resolve correctly in dev.
 */
function sanitizeUrl(url: string): string {
  if (!url) return '';
  
  // Replace localhost and sandbox references with relative paths
  let clean = url.replace(/https?:\/\/localhost(:\d+)?/g, '');
  clean = clean.replace(/localhost(:\d+)?/g, '');
  
  // Ensure relative or local-looking paths are kept clean as relative paths starting with /
  if (clean.startsWith('/') || clean.startsWith('images/') || clean.startsWith('home')) {
    if (!clean.startsWith('/')) {
      clean = '/' + clean;
    }
  }

  // Re-encode spaces cleanly to %20 without double-encoding
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
 * Evaluates source dynamically to form a robust list of fallback candidate solutions.
 */
function getCandidateUrls(src: string, width: number = 800): string[] {
  if (!src) return [];
  
  const sanitized = sanitizeUrl(src);
  const candidates: string[] = [];

  // If it's a video file or an ImageKit video thumbnail, try loading the exact sanitized URL first,
  // and then fallback to beautiful pre-mapped store section WebP images instead of generic local asset directories
  if (sanitized.includes('ik-thumbnail.jpg') || sanitized.endsWith('.mp4') || sanitized.includes('.mp4')) {
    candidates.push(sanitized);
    
    // Find matching video-specific premium WebP image
    let foundFallback = false;
    for (const [vKey, vVal] of Object.entries(VIDEO_THUMB_FALLBACKS)) {
      if (sanitized.includes(vKey)) {
        candidates.push(vVal);
        foundFallback = true;
        break;
      }
    }
    
    // If no specific match, append general Saree Section image
    if (!foundFallback) {
      candidates.push('https://ik.imagekit.io/tus1loev9/homepage/sareesection.webp?updatedAt=1779907895695');
    }
    
    // Also append the Shop Entrance as supplementary fallback
    candidates.push('https://ik.imagekit.io/tus1loev9/homepage/shopenterence.webp?updatedAt=1779907894298');
    
    return candidates;
  }

  // Determine if it is a Google Drive asset
  const isDrive = sanitized.includes('drive.google.com') || 
                  sanitized.includes('googleusercontent.com') || 
                  sanitized.includes('lh3.googleusercontent.com') || 
                  sanitized.includes('drive.usercontent.google.com');

  const driveId = extractGoogleDriveId(sanitized);

  if (isDrive && driveId) {
    // 1. High-speed, lightweight pre-resized Google Drive thumbnail (direct from Google CDN, no redirects, fastest fallback render!) - FIRST CHOICE TO PREVENT BLUR
    candidates.push(`https://drive.google.com/thumbnail?id=${driveId}&sz=w${width}`);

    // 2. Direct static cookieless Google CDN download cache with on-the-fly resizing - fastest possible delivery with no authentication checks
    candidates.push(`https://lh3.googleusercontent.com/d/${driveId}=w${width}`);

    // 3. High-speed, dynamically compressed WebP from wsrv.nl proxying the non-redirecting thumbnail URL with encoded high-res size
    candidates.push(`https://wsrv.nl/?url=https%3A%2F%2Fdrive.google.com%2Fthumbnail%3Fid%3D${driveId}%26sz%3Dw1200&w=${width}&output=webp&q=80`);
    
    // 4. High-speed, dynamically compressed WebP from wsrv.nl proxying lh3 direct CDN
    candidates.push(`https://wsrv.nl/?url=https%3A%2F%2Flh3.googleusercontent.com%2Fd%2F${driveId}&w=${width}&output=webp&q=80`);
    
    // 5. WSRV webp from redirect export URL (slower fallback)
    candidates.push(`https://wsrv.nl/?url=https%3A%2F%2Fdrive.google.com%2Fuc%3Fexport%3Dview%26id%3D${driveId}&w=${width}&output=webp&q=80`);
    
    // 6. Direct Export Link (always works for public Google Drive items as fallback)
    candidates.push(`https://drive.google.com/uc?export=view&id=${driveId}`);
    
    // 7. Simple layout query parameter alternative
    candidates.push(`https://drive.google.com/uc?id=${driveId}`);
    
    // 8. Original sanitized input
    if (!candidates.includes(sanitized)) {
      candidates.push(sanitized);
    }
  } else {
    // Hostinger or general local image asset path
    candidates.push(sanitized);

    // Get filename to see if we have predefined mapping in LOCAL_IMAGE_FALLBACKS
    const parts = sanitized.split('/');
    let filename = parts.pop() || '';
    if (filename.includes('?')) {
      filename = filename.split('?')[0];
    }
    
    // Check if we have explicitly mapped fallback for this filename
    if (filename && LOCAL_IMAGE_FALLBACKS[filename]) {
      const mapped = LOCAL_IMAGE_FALLBACKS[filename];
      if (!candidates.includes(mapped)) {
        candidates.push(mapped); // Try the mapped main Hostinger URL if original fails
      }
    }

    // Add generic paths as backup search candidates on Hostinger domain
    if (filename) {
      let rawName = filename;
      try {
        rawName = decodeURIComponent(filename);
      } catch (e) {}

      // Apply Image File Rules:
      // 1. Lowercase filenames.
      // 2. Remove spaces, brackets (), underscores _, and special characters.
      const cleanedBase = rawName
        .toLowerCase()
        .replace(/[\s\(_\)]/g, '')
        .replace(/[^a-z0-9\.\-]/g, '');

      // 3. Prefer JPG format over WEBP
      const jpgName = cleanedBase.replace(/\.(webp|png|jpeg|gif)$/i, '.jpg');
      const webpName = cleanedBase.replace(/\.(jpg|png|jpeg|gif)$/i, '.webp');

      const filenamesToTry = [jpgName];
      if (webpName !== jpgName) {
        filenamesToTry.push(webpName);
      }
      if (cleanedBase !== jpgName && cleanedBase !== webpName) {
        filenamesToTry.push(cleanedBase);
      }

      for (const fn of filenamesToTry) {
        const genericHostingerPaths = [
          `https://mukeshsarees.com/assets/product/fendy/${fn}`,
          `https://mukeshsarees.com/assets/homepage/${fn}`,
          `/assets/product/fendy/${fn}`,
          `/assets/homepage/${fn}`,
          `/images/${fn}`,
          `https://mukeshsarees.com/images/${fn}`,
        ];

        for (const p of genericHostingerPaths) {
          const sp = sanitizeUrl(p);
          if (!candidates.includes(sp)) {
            candidates.push(sp);
          }
        }
      }
    }
  }

  // Unsplash fallback placeholder as final backup if everything fails
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
  width = 800, 
  height, 
  alt, 
  className, 
  srcSet, 
  sizes, 
  priority = false, 
  loading,
  decoding,
  onError, 
  ...props 
}: OptimizedImageProps) {
  const calculatedHeight = height || Math.round(width * 1.33333);
  
  // Apply SEO optimized alt text rules:
  // - End with " - Mukesh Saree Centre Nagpur"
  // - Keep under 125 characters
  let processedAlt = (alt || "").trim();
  const suffix = " - Mukesh Saree Centre Nagpur";
  
  // Strip any old suffix formats containing Mukesh Saree Centre or duplicates
  processedAlt = processedAlt.replace(/\s*[—\-\u2014]\s*Mukesh Saree Centre.*$/gi, "");
  processedAlt = processedAlt.trim();

  if (!processedAlt) {
    processedAlt = "Exclusive Elegant Traditional Wear";
  }

  // Ensure overall length doesn't exceed 125 characters including the suffix
  const maxBaseLen = 125 - suffix.length;
  if (processedAlt.length > maxBaseLen) {
    processedAlt = processedAlt.substring(0, maxBaseLen).trim().replace(/[\s,\-_|]+$/, "");
  }
  
  const finalAlt = processedAlt + suffix;  // Derived state: calculate candidates list synchronously on render
  const candidates = getCandidateUrls(src, width);

  // Use synchronous state tracking to reset states on source changed
  const [prevSrc, setPrevSrc] = useState(src);
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [hasFailedAll, setHasFailedAll] = useState(false);

  // Intersection Observer implementation
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [isInView, setIsInView] = useState(true);

  useEffect(() => {
    if (priority || isInView) return;

    if (typeof window === 'undefined' || !window.IntersectionObserver) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px', // Preload images 200px before they enter the viewport
        threshold: 0.01
      }
    );

    const el = imageRef.current;
    if (el) {
      observer.observe(el);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority, isInView]);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setCandidateIndex(0);
    setRetryCount(0);
    setHasFailedAll(false);
    setIsInView(true);
  }

  const currentSrc = candidates[candidateIndex] || sanitizeUrl(src);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (retryCount < 1) {
      // Retry once for the current candidate URL
      console.log(`Image failed to load: ${currentSrc}. Retrying once...`);
      setRetryCount((prev) => prev + 1);
    } else {
      // Already tried. Reset retry count and advance to the next candidate URL
      setRetryCount(0);
      if (candidateIndex < candidates.length - 1) {
        console.log(`Fallback retry also failed. Loading candidate ${candidateIndex + 1} for [${finalAlt}]: ${candidates[candidateIndex + 1]}`);
        setCandidateIndex((prev) => prev + 1);
      } else {
        console.warn(`All image candidates and retries failed to load for [${finalAlt}]. Triggering emergency boutique brand card.`);
        setHasFailedAll(true);
        if (onError) {
          onError(e);
        }
      }
    }
  };

  // If all candidates and retries failed, display a gorgeous boutique brand card placeholder
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
          {finalAlt}
        </span>
        <div className="w-8 h-[1px] bg-[#D4AF37]/40 mt-3"></div>
      </div>
    );
  }

  const isGoogleDrive = src.includes('drive.google.com') || src.includes('googleusercontent.com') || currentSrc.includes('drive.google.com') || currentSrc.includes('googleusercontent.com');
  const isRelative = currentSrc.startsWith('/');
  
  // Google Drive logic or relative references loading directly with the specific custom key to force refresh
  if (isGoogleDrive || isRelative) {
    const driveId = extractGoogleDriveId(src) || extractGoogleDriveId(currentSrc);
    const driveSrcSet = (isGoogleDrive && driveId)
      ? `https://drive.google.com/thumbnail?id=${driveId}&sz=w300 300w, https://drive.google.com/thumbnail?id=${driveId}&sz=w450 450w, https://drive.google.com/thumbnail?id=${driveId}&sz=w600 600w, https://drive.google.com/thumbnail?id=${driveId}&sz=w800 800w, https://drive.google.com/thumbnail?id=${driveId}&sz=w1200 1200w`
      : undefined;

    const finalRenderSrc = (isGoogleDrive && driveId)
      ? `https://drive.google.com/thumbnail?id=${driveId}&sz=w${width}`
      : currentSrc;

    return (
      <img
        ref={imageRef}
        key={`${currentSrc}-${retryCount}`}
        src={isInView ? finalRenderSrc : PLACEHOLDER_1X1}
        srcSet={isInView ? (srcSet || driveSrcSet) : undefined}
        sizes={isInView ? (sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw") : undefined}
        alt={finalAlt}
        width={width}
        height={calculatedHeight}
        className={`${className || ''} ${!isInView ? 'animate-pulse' : ''}`}
        loading={loading !== undefined ? loading : (priority ? "eager" : "lazy")}
        fetchPriority={priority ? "high" : "auto"}
        referrerPolicy="no-referrer"
        decoding={decoding !== undefined ? decoding : (priority ? "sync" : "async")}
        style={{ background: '#F5F0E8', objectFit: 'cover', ...(props.style || {}) }}
        onError={handleImageError}
        {...props}
      />
    );
  }

  // Custom live Hostinger links or external bypass optimization logic
  const isDirectBypass = (currentSrc.startsWith('http') && 
                          !currentSrc.includes('drive.google.com') && 
                          !currentSrc.includes('googleusercontent.com') &&
                          !currentSrc.includes('ik.imagekit.io') &&
                          !currentSrc.includes('imagekit.io') &&
                          !currentSrc.includes('mukeshsarees.com')) ||
                          currentSrc.includes('wsrv.nl');

  const webpUrl = isDirectBypass ? currentSrc : optimizeImage(currentSrc, width, 'webp');
  const jpgUrl = isDirectBypass ? currentSrc : optimizeImage(currentSrc, width, 'jpg');

  let generatedSrcSetWebp = srcSet;
  let generatedSrcSetJpg = srcSet;
  
  if (!srcSet && !isDirectBypass) {
    generatedSrcSetWebp = `${optimizeImage(currentSrc, 300, 'webp')} 300w, ${optimizeImage(currentSrc, 600, 'webp')} 600w, ${optimizeImage(currentSrc, 1000, 'webp')} 1000w`;
    generatedSrcSetJpg = `${optimizeImage(currentSrc, 300, 'jpg')} 300w, ${optimizeImage(currentSrc, 600, 'jpg')} 600w, ${optimizeImage(currentSrc, 1000, 'jpg')} 1000w`;
  }
  const defaultSizes = sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";

  return (
    <picture key={`${currentSrc}-${retryCount}`} className="contents">
      {isInView && generatedSrcSetWebp && <source srcSet={generatedSrcSetWebp} sizes={defaultSizes} type="image/webp" />}
      <img
        ref={imageRef}
        src={isInView ? jpgUrl : PLACEHOLDER_1X1}
        srcSet={isInView ? generatedSrcSetJpg : undefined}
        sizes={isInView && generatedSrcSetJpg ? defaultSizes : undefined}
        alt={finalAlt}
        width={width}
        height={calculatedHeight}
        className={`${className || ''} ${!isInView ? 'animate-pulse' : ''}`}
        loading={loading !== undefined ? loading : (priority ? "eager" : "lazy")}
        fetchPriority={priority ? "high" : "auto"}
        referrerPolicy="no-referrer"
        decoding={decoding !== undefined ? decoding : (priority ? "sync" : "async")}
        style={{ background: '#F5F0E8', objectFit: 'cover', ...(props.style || {}) }}
        onError={handleImageError}
        {...props}
      />
    </picture>
  );
}
