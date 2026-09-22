/**
 * URL Utilities for consistent trailing slash formatting and canonical URL generation.
 * All internal page URLs must consistently use trailing slashes to match Hostinger's
 * server behavior (avoiding 301 redirect hops and SEO signal splitting).
 */

const ASSET_EXTENSIONS_REGEX = /\.(xml|txt|jpg|jpeg|png|webp|svg|gif|pdf|css|js|map|ico|json|woff|woff2|ttf|eot)$/i;

/**
 * Formats a route path or URL so that internal pages always end with a trailing slash.
 * Query parameters and hash anchors are preserved after the trailing slash.
 * File assets (images, robots.txt, sitemap.xml, etc.) and external protocol links are untouched.
 *
 * Examples:
 * - formatPageUrl('/shop') -> '/shop/'
 * - formatPageUrl('/shop/') -> '/shop/'
 * - formatPageUrl('/') -> '/'
 * - formatPageUrl('/shop?category=Sarees') -> '/shop/?category=Sarees'
 * - formatPageUrl('/product/my-saree#reviews') -> '/product/my-saree/#reviews'
 * - formatPageUrl('https://mukeshsarees.com/about') -> 'https://mukeshsarees.com/about/'
 */
export function formatPageUrl(urlOrPath: string): string {
  if (!urlOrPath) return '/';

  // Ignore non-HTTP/page protocols and hash-only links
  if (
    urlOrPath.startsWith('#') ||
    urlOrPath.startsWith('mailto:') ||
    urlOrPath.startsWith('tel:') ||
    urlOrPath.startsWith('whatsapp:') ||
    urlOrPath.startsWith('javascript:')
  ) {
    return urlOrPath;
  }

  // Handle external domains that are not our website
  const isMukeshDomain =
    urlOrPath.startsWith('https://mukeshsarees.com') ||
    urlOrPath.startsWith('http://mukeshsarees.com');

  if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://')) {
    if (!isMukeshDomain) {
      return urlOrPath;
    }
  }

  // Separate hash
  const hashIndex = urlOrPath.indexOf('#');
  let hash = '';
  let withoutHash = urlOrPath;
  if (hashIndex !== -1) {
    hash = urlOrPath.slice(hashIndex);
    withoutHash = urlOrPath.slice(0, hashIndex);
  }

  // Separate query parameters
  const queryIndex = withoutHash.indexOf('?');
  let query = '';
  let pathname = withoutHash;
  if (queryIndex !== -1) {
    query = withoutHash.slice(queryIndex);
    pathname = withoutHash.slice(0, queryIndex);
  }

  // Check if pathname is an asset or file (e.g., sitemap.xml, image.jpg)
  if (ASSET_EXTENSIONS_REGEX.test(pathname)) {
    return urlOrPath;
  }

  // Ensure trailing slash on pathname
  if (!pathname.endsWith('/')) {
    pathname = `${pathname}/`;
  }

  return `${pathname}${query}${hash}`;
}

/**
 * Returns the absolute canonical URL with a trailing slash on the pathname.
 *
 * Examples:
 * - getCanonicalUrl('/shop') -> 'https://mukeshsarees.com/shop/'
 * - getCanonicalUrl('/about/') -> 'https://mukeshsarees.com/about/'
 * - getCanonicalUrl('https://mukeshsarees.com/faqs') -> 'https://mukeshsarees.com/faqs/'
 */
export function getCanonicalUrl(pathOrUrl: string, base: string = 'https://mukeshsarees.com'): string {
  if (!pathOrUrl) return `${base}/`;

  const formatted = formatPageUrl(pathOrUrl);
  if (formatted.startsWith('http://') || formatted.startsWith('https://')) {
    return formatted;
  }

  const cleanPath = formatted.startsWith('/') ? formatted : `/${formatted}`;
  return `${base}${cleanPath}`;
}
