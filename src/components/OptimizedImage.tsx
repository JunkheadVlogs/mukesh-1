import { useState, useEffect } from 'react';
import { optimizeImage } from '../utils';

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

  // Determine if it is a Google Drive asset
  const isDrive = sanitized.includes('drive.google.com') || 
                  sanitized.includes('googleusercontent.com') || 
                  sanitized.includes('lh3.googleusercontent.com') || 
                  sanitized.includes('drive.usercontent.google.com');

  const driveId = extractGoogleDriveId(sanitized);

  if (isDrive && driveId) {
    // 1. High-speed, dynamically compressed CDN webp url using the reliable export option (Option A + speed)
    candidates.push(`https://wsrv.nl/?url=https%3A%2F%2Fdrive.google.com%2Fuc%3Fexport%3Dview%26id%3D${driveId}&w=${width}&output=webp&q=85`);
    
    // 2. High-speed, lightweight pre-resized Google Drive thumbnail (also super fast!)
    candidates.push(`https://drive.google.com/thumbnail?id=${driveId}&sz=w${width}`);
    
    // 3. Direct Export Link (Option A recommended format - always works for public Google Drive items as fallback)
    candidates.push(`https://drive.google.com/uc?export=view&id=${driveId}`);
    
    // 4. Simple layout query parameter alternative
    candidates.push(`https://drive.google.com/uc?id=${driveId}`);
    
    // 5. WSRV Proxy fallback using thumbnail link
    candidates.push(`https://wsrv.nl/?url=https%3A%2F%2Fdrive.google.com%2Fthumbnail%3Fid%3D${driveId}%26sz%3Dw${width}&w=${width}&output=webp&q=85`);

    // 6. Original sanitized input
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
  
  const finalAlt = processedAlt + suffix;

  // Derived state: calculate candidates list synchronously on render
  const candidates = getCandidateUrls(src, width);

  // Use synchronous state tracking to reset states on source changed
  const [prevSrc, setPrevSrc] = useState(src);
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [hasFailedAll, setHasFailedAll] = useState(false);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setCandidateIndex(0);
    setRetryCount(0);
    setHasFailedAll(false);
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

  const isGoogleDrive = (currentSrc.includes('drive.google.com') || currentSrc.includes('googleusercontent.com')) && !currentSrc.includes('wsrv.nl');
  const isRelative = currentSrc.startsWith('/');

  // Google Drive logic or relative references loading directly with the specific custom key to force refresh
  if (isGoogleDrive || isRelative) {
    return (
      <img
        key={`${currentSrc}-${retryCount}`}
        src={currentSrc}
        alt={finalAlt}
        width={width}
        height={calculatedHeight}
        className={`${className || ''}`}
        loading={loading !== undefined ? loading : (priority ? undefined : "lazy")}
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
                          !currentSrc.includes('mukeshsarees.com')) ||
                         currentSrc.includes('wsrv.nl');

  const webpUrl = isDirectBypass ? currentSrc : optimizeImage(currentSrc, width, 'webp');
  const jpgUrl = isDirectBypass ? currentSrc : optimizeImage(currentSrc, width, 'jpg');

  let generatedSrcSetWebp = srcSet;
  let generatedSrcSetJpg = srcSet;
  
  if (!srcSet && !isDirectBypass) {
    generatedSrcSetWebp = `${optimizeImage(currentSrc, 400, 'webp')} 400w, ${optimizeImage(currentSrc, 400, 'webp')} 400w, ${optimizeImage(currentSrc, 800, 'webp')} 800w`;
    generatedSrcSetJpg = `${optimizeImage(currentSrc, 400, 'jpg')} 400w, ${optimizeImage(currentSrc, 400, 'jpg')} 400w, ${optimizeImage(currentSrc, 800, 'jpg')} 800w`;
  }
  const defaultSizes = sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";

  return (
    <picture key={`${currentSrc}-${retryCount}`} className="contents">
      {generatedSrcSetWebp && <source srcSet={generatedSrcSetWebp} sizes={defaultSizes} type="image/webp" />}
      <img
        src={jpgUrl}
        srcSet={generatedSrcSetJpg}
        sizes={generatedSrcSetJpg ? defaultSizes : undefined}
        alt={finalAlt}
        width={width}
        height={calculatedHeight}
        className={`${className || ''}`}
        loading={loading !== undefined ? loading : (priority ? undefined : "lazy")}
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
