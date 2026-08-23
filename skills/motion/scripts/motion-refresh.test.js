const test = require('node:test');
const assert = require('node:assert');
const { normalizePattern, generateCatalog, mergePatterns, fetchPatternsFromSources, SEED } = require('./motion-refresh.js');

test('normalizePattern basic', () => {
  const p = normalizePattern({ name: 'page-transition', category: 'navigation', technique: 'slide' });
  assert.strictEqual(p.name, 'page-transition');
  assert.strictEqual(p.technique, 'slide');
  assert.ok(p.source.length > 0);
});

test('normalizePattern defaults source', () => {
  const p = normalizePattern({ name: 'card-hover', category: 'hover' });
  assert.ok(p.source.length > 0);
});

test('generateCatalog produces JSON array', () => {
  const out = JSON.parse(generateCatalog([{ name: 'a', category: 'x' }, { name: 'b', category: 'y' }]));
  assert.ok(Array.isArray(out));
  assert.strictEqual(out.length, 2);
});

test('mergePatterns dedups by name and source', () => {
  const a = [{ name: 'hero-parallax', category: 'scroll', technique: 'parallax' }];
  const b = [{ name: 'hero-parallax', category: 'scroll', technique: 'parallax' }, { name: 'modal', category: 'panel' }];
  const merged = mergePatterns([a, b]);
  assert.strictEqual(merged.length, 2);
  assert.deepStrictEqual(merged.find(p => p.name === 'modal'), normalizePattern({ name: 'modal', category: 'panel' }));
});

test('mergePatterns keeps order of first occurrence', () => {
  const a = [{ name: 'first', category: 'x' }];
  const b = [{ name: 'second', category: 'y' }];
  const merged = mergePatterns([a, b]);
  assert.strictEqual(merged[0].name, 'first');
  assert.strictEqual(merged[1].name, 'second');
});

test('fetchPatternsFromSources uses injected fetcher results', async () => {
  const fetcher = async () => JSON.stringify([{ name: 'card-stagger', category: 'card', technique: 'stagger' }]);
  const out = await fetchPatternsFromSources([{ name: 'mock', url: 'https://mock.test' }], fetcher);
  assert.strictEqual(out.length, 1);
  assert.strictEqual(out[0].name, 'card-stagger');
  assert.strictEqual(out[0].source, 'mock');
});

test('fetchPatternsFromSources falls back to SEED on fetcher failure', async () => {
  const fetcher = async () => { throw new Error('network down'); };
  const out = await fetchPatternsFromSources([{ name: 'mock', url: 'https://mock.test' }], fetcher);
  assert.ok(Array.isArray(out));
  assert.ok(out.length >= SEED.length);
});
