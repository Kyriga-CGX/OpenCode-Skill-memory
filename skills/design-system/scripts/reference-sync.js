'use strict';

const DIRECTIONS = {
  'editorial-restraint': 'Editorial Restraint (Stripe/Apple/Monocle)',
  'modern-minimal': 'Modern Minimal (Linear/Vercel/Notion)',
  'warm-soft': 'Warm Soft (Notion warm/Cohere/Lovable/Cal)',
  'tech-utility': 'Tech Utility (Datadog/Sentry/ClickHouse)',
  'brutalist-experimental': 'Brutalist Experimental (x.ai/Are.na/Wired)'
};

function normalizeBrand(raw) {
  const name = (raw.name || '').toLowerCase().trim();
  const category = (raw.category || 'other').toLowerCase().trim();
  const direction = DIRECTIONS[ (raw.direction || '').toLowerCase() ] ? (raw.direction || '').toLowerCase().trim() : 'editorial-restraint';
  const inspiredBy = raw.inspiredBy || `https://example.com/brand/${encodeURIComponent(name)}`;
  return { name, category, direction, inspiredBy };
}

function generateCatalog(rawList) {
  const brands = rawList.map(normalizeBrand);
  return JSON.stringify(brands, null, 2);
}

if (require.main === module) {
  const outDir = require('path').join(__dirname, 'data');
  require('fs').mkdirSync(outDir, { recursive: true });
  require('fs').writeFileSync(require('path').join(outDir, 'reference-catalog.json'), generateCatalog([]));
}

module.exports = { normalizeBrand, generateCatalog };
