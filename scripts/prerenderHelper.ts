import fs from "fs";
import path from "path";

const distPath = path.resolve(process.cwd(), "dist");

/**
 * Universal Prerender Injection Helper
 * Ensures generated HTML correctly replaces the React shell root, preserving scripts and hydration metadata.
 * 
 * @param slug The subdirectory path or slug (e.g., '', 'shop', 'product/sarees-name')
 * @param htmlBody The main HTML body string to inject
 * @param meta SEO metadata to replace
 * @param customOgTags Optional OG Tag injection
 * @param processedCleanHtml Pre-processed clean html string containing env replacements 
 */
export function createStaticPage({
  htmlTemplate,
  bodyHtml,
  title,
  description,
  customOgTags,
  schemaJson
}: {
  htmlTemplate: string;
  bodyHtml: string;
  title?: string;
  description?: string;
  customOgTags?: string;
  schemaJson?: any;
}): string {
  let baseHtml = htmlTemplate;

  // 1. Inject Metadata
  if (title) {
    baseHtml = baseHtml.replace(/<title(.*?)>.*?<\/title>/is, `<title$1>${title}</title>`);
  }
  if (description) {
    baseHtml = baseHtml.replace(
      /<meta[^>]*name=["']description["'][^>]*>/is,
      `<meta name="description" content="${description}">`
    );
  }

  // 1b. Canonical Preparation: If custom OG tags provide a canonical tag, strip any existing canonical tag from the base template
  if (customOgTags && /<link\s+[^>]*rel=['"]canonical['"]/i.test(customOgTags)) {
    baseHtml = baseHtml.replace(/<link\s+[^>]*rel=['"]canonical['"][^>]*>\s*/gi, '');
  }

  // 2. Inject OG Tags
  if (customOgTags) {
    if (baseHtml.includes('<!-- Default OG Tags -->')) {
      baseHtml = baseHtml.replace(/(<!-- Default OG Tags -->)[\s\S]*?(<!-- End Default OG Tags -->)/, customOgTags);
    } else if (baseHtml.includes('<!-- Dynamic OG Tags -->')) {
      baseHtml = baseHtml.replace(/(<!-- Dynamic OG Tags -->)[\s\S]*?(<!-- End Dynamic OG Tags -->)/, customOgTags);
    } else {
      // Fallback
      baseHtml = baseHtml.replace("</head>", `\n${customOgTags}\n</head>`);
    }
  }
  
  if (schemaJson) {
    const schemas = Array.isArray(schemaJson) ? schemaJson : [schemaJson];
    const schemaScriptTags = schemas
      .map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`)
      .join("\n");
    baseHtml = baseHtml.replace("</head>", `\n${schemaScriptTags}\n</head>`);
  }

  // 2b. Canonical Deduplication Guarantee: Strictly ensure exactly ONE canonical tag exists in <head>
  const canonicalMatches = baseHtml.match(/<link\s+[^>]*rel=['"]canonical['"][^>]*>/gi);
  if (canonicalMatches && canonicalMatches.length > 1) {
    const preferredCanonical = canonicalMatches.find(tag => tag.includes('data-rh="true"') && !tag.includes('href="https://mukeshsarees.com/"'))
      || canonicalMatches.find(tag => tag.includes('data-rh="true"'))
      || canonicalMatches[canonicalMatches.length - 1];
    baseHtml = baseHtml.replace(/<link\s+[^>]*rel=['"]canonical['"][^>]*>\s*/gi, '');
    baseHtml = baseHtml.replace("</head>", `    ${preferredCanonical}\n</head>`);
  }

  // 3. Strip initial page loader for statically pre-rendered pages
  baseHtml = baseHtml.replace(/<div id="initial-page-loader"[\s\S]*?<\/div>\s*<\/div>/gi, '');

  // 4. Inject into Root
  return injectIntoRoot(baseHtml, bodyHtml);
}

/**
 * Universally injects generated HTML body into the #root React container.
 * Robust fallback matching ensures we safely wrap and inject the static DOM tree.
 */
export function injectIntoRoot(html: string, newBody: string): string {
  let res = html;

  // Strip initial page loader if present
  res = res.replace(/<div id="initial-page-loader"[\s\S]*?<\/div>\s*<\/div>/gi, '');

  let found = false;

  const startMarker = '<div id="root">';
  const startIndex = res.indexOf(startMarker);
  
  if (startIndex !== -1) {
    // Match script tag flexible for defer attribute or missing defer
    const scriptMatch = res.match(/<script type="module"[^>]*src="\/src\/main\.tsx"><\/script>/);
    if (scriptMatch && scriptMatch.index !== undefined) {
      const endIndex = scriptMatch.index;
      const before = res.substring(0, startIndex + startMarker.length);
      const after = "\n</div>\n    " + res.substring(endIndex);
      
      res = before + "\n" + newBody + after;
      found = true;
    }
  }

  if (!found) {
    if (res.includes('<div id="root"></div>')) {
      res = res.replace('<div id="root"></div>', `<div id="root">\n${newBody}\n</div>`);
      found = true;
    } else {
      res = res.replace(/<div id="root">[\s\S]*?<\/div>/i, `<div id="root">\n${newBody}\n</div>`);
      found = true;
    }
  }
  
  return res;
}

