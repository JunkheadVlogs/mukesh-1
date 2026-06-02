import { Product } from "../store";
import { products } from "../mockData";

export function getLevenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

export function calculateSearchScore(product: Product, query: string): number {
  if (!query) return 0;
  
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return 0;

  const queryTokens = normalizedQuery.split(/\s+/).filter(t => t.length > 0);
  if (queryTokens.length === 0) return 0;

  let totalScore = 0;
  let matchedAllTokens = true;

  const pName = (product.name || '').toLowerCase();
  const pDesc = (product.description || '').toLowerCase();
  const pCat = (product.category || '').toLowerCase();
  const pFabric = (product.fabric || '').toLowerCase();
  const pColor = (product.color || '').toLowerCase();
  const pSku = (product.sku || '').toLowerCase();
  const pTagline = (product.tagline || '').toLowerCase();

  const variantColors = product.colorVariants
    ? product.colorVariants.map(v => v.color.toLowerCase())
    : [];
  const variantSlugs = product.colorVariants
    ? product.colorVariants.map(v => v.slug.toLowerCase().replace(/-/g, ' '))
    : [];

  const checkTokenMatch = (token: string, text: string): { matches: boolean; score: number } => {
    if (text === token) {
      return { matches: true, score: 100 };
    }
    const index = text.indexOf(token);
    if (index === 0) {
      return { matches: true, score: 80 };
    }
    if (index > 0) {
      return { matches: true, score: 60 };
    }

    const singularToken = token.endsWith('s') ? token.slice(0, -1) : token;
    const singularText = text.endsWith('s') ? text.slice(0, -1) : text;
    if (singularText === singularToken || singularText.includes(singularToken)) {
      return { matches: true, score: 50 };
    }

    if (token.length >= 4) {
      const targetWords = text.split(/[\s\-/,.]+/);
      for (const word of targetWords) {
        if (word.length >= 3) {
          const editDist = getLevenshteinDistance(token, word);
          const maxAllowedDist = token.length >= 6 ? 2 : 1;
          if (editDist <= maxAllowedDist) {
            const matchPercent = 1 - (editDist / Math.max(token.length, word.length));
            return { matches: true, score: Math.round(40 * matchPercent) };
          }
        }
      }
    }

    return { matches: false, score: 0 };
  };

  for (const token of queryTokens) {
    let tokenMatched = false;
    let tokenBestScore = 0;

    const fieldsToQuery: [string, number][] = [
      [pName, 10],
      [pCat, 8],
      [pColor, 9],
      [pFabric, 8],
      [pTagline, 5],
      [pSku, 4],
      [pDesc, 2]
    ];

    for (const vColor of variantColors) {
      fieldsToQuery.push([vColor, 7]);
    }
    for (const vSlug of variantSlugs) {
      fieldsToQuery.push([vSlug, 5]);
    }

    if (token === 'saree' || token === 'sarees') {
      fieldsToQuery.push(['sarees', 8]);
      fieldsToQuery.push(['saree', 8]);
    }
    if (token === 'coord' || token === 'co-ord' || token === 'set' || token === 'sets' || token === 'suit' || token === 'suits') {
      if (pCat.includes('co-ord')) {
        tokenMatched = true;
        tokenBestScore = Math.max(tokenBestScore, 20 * 8);
      }
    }

    for (const [fieldValue, weight] of fieldsToQuery) {
      if (!fieldValue) continue;
      const { matches, score } = checkTokenMatch(token, fieldValue);
      if (matches) {
        tokenMatched = true;
        const weightedScore = score * weight;
        if (weightedScore > tokenBestScore) {
          tokenBestScore = weightedScore;
        }
      }
    }

    if (tokenMatched) {
      totalScore += tokenBestScore;
    } else {
      matchedAllTokens = false;
    }
  }

  if (matchedAllTokens && queryTokens.length > 1) {
    totalScore += 2000;
  }

  return totalScore;
}

/**
 * Perform a multi-field search across product titles, descriptions, categories, tags, and variants
 * using a weighted scoring algorithm to boost exact keyword matches and partial matches while being case-insensitive.
 * Returns products sorted by relevance score.
 */
export function searchProducts(query: string): Product[] {
  if (!query || !query.trim()) {
    return products.filter(p => !p.isVariant && !p.isHidden);
  }

  const scored = products
    .filter(p => !p.isVariant && !p.isHidden)
    .map(p => ({
      product: p,
      score: calculateSearchScore(p, query)
    }))
    .filter(item => item.score > 0);

  scored.sort((a, b) => b.score - a.score);

  return scored.map(item => item.product);
}
