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
    baseHtml = baseHtml.replace(/<title(.*?)>.*?<\/title>/, `<title$1>${title}</title>`);
  }
  if (description) {
    baseHtml = baseHtml.replace(
      /<meta(.*?)name="description" content=".*?"\s*\/?>/,
      `<meta$1name="description" content="${description}">`
    );
  }

  // 2. Inject OG Tags
  if (customOgTags) {
    baseHtml = baseHtml.replace(/(<!-- Default OG Tags -->)[\s\S]*?(<!-- End Default OG Tags -->)/, customOgTags);
  }
  
  if (schemaJson) {
      baseHtml = baseHtml.replace("</head>", `\n<script type="application/ld+json">${JSON.stringify(schemaJson)}</script>\n</head>`);
  }

  // 3. Inject into Root
  let found = false;

  // Attempt 1: Safe string splitting around the loading wrapper block
  const startMarker = '<div id="root">';
  const startIndex = baseHtml.indexOf(startMarker);
  
  if (startIndex !== -1) {
    // Find where the script starts, which is exactly after the root div closes in index.html
    const endMarker = '<script type="module" src="/src/main.tsx"></script>';
    const endIndex = baseHtml.indexOf(endMarker);
    
    if (endIndex !== -1) {
      // Extract everything before <div id="root">
      const before = baseHtml.substring(0, startIndex + startMarker.length);
      // Extract everything from <script type="module" ... onwards
      const after = "\n</div>\n    " + baseHtml.substring(endIndex);
      
      baseHtml = before + "\n" + bodyHtml + after;
      found = true;
    }
  }

  if (!found) {
    // Fallback: simple replace if the structure is not exactly as expected
    const rootInjectionRegex = /<div id="root">[\s\S]*?<div class="loading-spinner"><\/div>\s*<\/div>\s*<\/div>/i;
    if (rootInjectionRegex.test(baseHtml)) {
      baseHtml = baseHtml.replace(rootInjectionRegex, `<div id="root">\n${bodyHtml}\n</div>`);
      found = true;
    }
  }
  
  if (!found) {
    baseHtml = baseHtml.replace(/<div id="root"><\/div>/, `<div id="root">\n${bodyHtml}\n</div>`);
  }

  return baseHtml;
}

/**
 * Universally injects generated HTML body into the #root React container.
 * Robust fallback matching ensures we safely wrap and inject the static DOM tree.
 */
export function injectIntoRoot(html: string, newBody: string): string {
  let res = html;
  let found = false;

  const startMarker = '<div id="root">';
  const startIndex = res.indexOf(startMarker);
  
  if (startIndex !== -1) {
    const endMarker = '<script type="module" src="/src/main.tsx"></script>';
    const endIndex = res.indexOf(endMarker);
    
    if (endIndex !== -1) {
      const before = res.substring(0, startIndex + startMarker.length);
      const after = "\n</div>\n    " + res.substring(endIndex);
      
      res = before + "\n" + newBody + after;
      found = true;
    }
  }

  if (!found) {
    const rootInjectionRegex = /<div id="root">[\s\S]*?<div class="loading-spinner"><\/div>\s*<\/div>\s*<\/div>/i;
    if (rootInjectionRegex.test(res)) {
      res = res.replace(rootInjectionRegex, `<div id="root">\n${newBody}\n</div>`);
      found = true;
    }
  }
  
  if (!found) {
    res = res.replace(/<div id="root"><\/div>/, `<div id="root">\n${newBody}\n</div>`);
  }
  
  return res;
}

