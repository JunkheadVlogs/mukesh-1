import { optimizeImage } from '../utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  width?: number;
  alt: string;
  className?: string;
  srcSet?: string;
  sizes?: string;
  priority?: boolean;
}

export function OptimizedImage({ src, width = 800, alt, className, srcSet, sizes, priority = false, ...props }: OptimizedImageProps) {
  const webpUrl = optimizeImage(src, width, 'webp');
  const jpgUrl = optimizeImage(src, width, 'jpg');

  // Generate responsive srcSet if not provided
  const generatedSrcSetWebp = srcSet || `${optimizeImage(src, 400, 'webp')} 400w, ${optimizeImage(src, 800, 'webp')} 800w, ${optimizeImage(src, 1200, 'webp')} 1200w`;
  const generatedSrcSetJpg = srcSet || `${optimizeImage(src, 400, 'jpg')} 400w, ${optimizeImage(src, 800, 'jpg')} 800w, ${optimizeImage(src, 1200, 'jpg')} 1200w`;
  const defaultSizes = sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";

  return (
    <picture className="contents">
      <source srcSet={generatedSrcSetWebp} sizes={defaultSizes} type="image/webp" />
      <img
        src={jpgUrl}
        srcSet={generatedSrcSetJpg}
        sizes={defaultSizes}
        alt={alt}
        className={className}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        referrerPolicy="no-referrer"
        decoding="async"
        {...props}
      />
    </picture>
  );
}
