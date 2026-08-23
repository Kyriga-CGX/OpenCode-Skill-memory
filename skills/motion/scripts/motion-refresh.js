'use strict';

const path = require('path');
const fs = require('fs');

// Seed curato: un catalogo di partenza, mai vuoto. Le fonti live vengono
// agganciate via SOURCES; se non disponibili (offline/reti bloccate) il
// risultato resta popolato con questi pattern di riferimento.
const SEED = [
  { name: 'tooltip', category: 'micro', technique: 'transition', source: 'seed' },
  { name: 'icon-stagger', category: 'micro', technique: 'stagger', source: 'seed' },
  { name: 'button-hover', category: 'micro', technique: 'transition', source: 'seed' },
  { name: 'modal', category: 'panel', technique: 'transition', source: 'seed' },
  { name: 'drawer', category: 'panel', technique: 'transition', source: 'seed' },
  { name: 'toast', category: 'panel', technique: 'transition', source: 'seed' },
  { name: 'card-stagger', category: 'card', technique: 'stagger', source: 'seed' },
  { name: 'section-scroll', category: 'card', technique: 'scroll', source: 'seed' },
  { name: 'empty-onboarding', category: 'card', technique: 'lottie', source: 'seed' },
  { name: 'hero-parallax', category: 'scroll', technique: 'parallax', source: 'seed' },
  { name: 'narrative-scroll', category: 'scroll', technique: 'gsap', source: 'seed' },
  { name: 'product-viewer', category: '3d', technique: 'three', source: 'seed' },
  { name: 'camera-path', category: '3d', technique: 'three', source: 'seed' },
  { name: 'particles', category: '3d', technique: 'points', source: 'seed' },
  { name: 'morph-2d', category: '3d', technique: 'shader', source: 'seed' },
  { name: 'terrain-viz', category: '3d', technique: 'three', source: 'seed' }
];

// Fonti da cui tentare il fetch. Il download è best-effort: ogni fonte
// fallita viene saltata, non blocca il resto.
const SOURCES = [
  { name: 'motion.dev', url: 'https://motion.dev' },
  { name: 'gsap', url: 'https://gsap.com' },
  { name: 'lottiefiles', url: 'https://lottiefiles.com/featured' }
];

function normalizePattern(raw) {
  const name = (raw.name || '').toLowerCase().trim();
  const category = (raw.category || 'other').toLowerCase().trim();
  const technique = (raw.technique || 'transition').toLowerCase().trim();
  const source = raw.source || `https://example.com/motion/${encodeURIComponent(name)}`;
  return { name, category, technique, source };
}

function generateCatalog(rawList) {
  const patterns = rawList.map(normalizePattern);
  return JSON.stringify(patterns, null, 2);
}

// Merge deduplica per name+source e preserva l'ordine del primo incontro.
function mergePatterns(lists) {
  const seen = new Set();
  const out = [];
  for (const list of lists) {
    for (const raw of list) {
      const p = normalizePattern(raw);
      const key = `${p.name}|${p.source}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(p);
    }
  }
  return out;
}

// Fetch con timeout, senza dipendenze. Node v24 ha fetch built-in.
async function fetchWithTimeout(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

// Funzione pura (testabile offline): accetta una lista di fonti e un fetcher
// iniettato, oppure usa il fetcher di default. Ogni fonte è best-effort.
async function fetchPatternsFromSources(sources, fetcher = fetchWithTimeout) {
  const collected = [];
  for (const src of sources) {
    try {
      const body = await fetcher(src.url);
      const patterns = parseSourceBody(body);
      for (const p of patterns) {
        collected.push({ ...normalizePattern(p), source: src.name });
      }
    } catch (err) {
      // fonte non raggiungibile: si salta
    }
  }
  return collected.length > 0 ? collected : SEED;
}

// Estrazione minimale: se il body è JSON (array di oggetti con name), usa
// quello e normalizza. Altrimenti ripiega su SEED. Non fa parsing fragile di
// HTML arbitrario — per le fonti live reali va aggiunto un estrattore ad hoc.
function parseSourceBody(body) {
  try {
    const parsed = JSON.parse(body);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((x) => x && typeof x.name === 'string')
        .map((x) => ({ name: x.name, category: x.category, technique: x.technique }));
    }
  } catch {
    // non è JSON: nessun pattern estraibile senza parser dedicato
  }
  return [];
}

async function main() {
  const outDir = path.join(__dirname, 'data');
  fs.mkdirSync(outDir, { recursive: true });
  const live = await fetchPatternsFromSources(SOURCES);
  const merged = mergePatterns([SEED, live]);
  fs.writeFileSync(path.join(outDir, 'motion-reference.json'), generateCatalog(merged));
}

if (require.main === module) {
  main();
}

module.exports = {
  normalizePattern,
  generateCatalog,
  mergePatterns,
  fetchPatternsFromSources,
  fetchWithTimeout,
  parseSourceBody,
  SEED,
  SOURCES
};
