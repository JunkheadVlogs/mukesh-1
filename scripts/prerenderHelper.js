export function injectIntoRoot(html, bodyHtml) {
  if (html.includes('<div id="root">')) {
    return html.replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">\n${bodyHtml}\n</div>`);
  }
  return html.replace('</body>', `<div id="root">\n${bodyHtml}\n</div>\n</body>`);
}

export function createStaticPage({
  htmlTemplate,
  bodyHtml,
  title,
  description,
  customOgTags = "",
  schemaJson = null
}) {
  let html = htmlTemplate;

  // 1. Replace title
  if (title) {
    if (html.includes('<title>')) {
      html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
    } else {
      html = html.replace('</head>', `<title>${title}</title>\n</head>`);
    }
  }

  // 2. Replace meta description
  if (description) {
    const escapedDesc = description.replace(/"/g, '&quot;');
    if (html.includes('<meta name="description"')) {
      html = html.replace(/<meta name="description" content="[^"]*"/i, `<meta name="description" content="${escapedDesc}"`);
    } else {
      html = html.replace('</head>', `<meta name="description" content="${escapedDesc}" />\n</head>`);
    }
  }

  // 3. Inject custom OG tags
  if (customOgTags) {
    html = html.replace(/<meta property="og:[^>]*>/gi, '');
    html = html.replace(/<meta name="twitter:[^>]*>/gi, '');
    html = html.replace(/<link[^>]*rel="canonical"[^>]*>/gi, '');
    html = html.replace('</head>', `\n${customOgTags}\n</head>`);
  }

  // 4. Inject Schema JSON
  if (schemaJson) {
    const schemaStr = typeof schemaJson === 'string' ? schemaJson : JSON.stringify(schemaJson);
    const schemaTag = `\n<script type="application/ld+json">${schemaStr}</script>\n`;
    html = html.replace('</head>', `${schemaTag}</head>`);
  }

  // 5. Inject body into root
  if (bodyHtml) {
    html = injectIntoRoot(html, bodyHtml);
  }

  return html;
}
