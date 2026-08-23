const test = require('node:test');
const assert = require('node:assert');
const { normalizeBrand, generateCatalog } = require('./reference-sync.js');

test('normalizeBrand basic', () => {
  const b = normalizeBrand({ name: 'linear', category: 'saas', direction: 'modern-minimal' });
  assert.strictEqual(b.name, 'linear');
  assert.strictEqual(b.direction, 'modern-minimal');
  assert.ok(b.inspiredBy.length > 0);
});

test('normalizeBrand defaults direction', () => {
  const b = normalizeBrand({ name: 'stripe', category: 'fintech' });
  assert.strictEqual(b.direction, 'editorial-restraint');
});

test('generateCatalog produces JSON array', () => {
  const out = JSON.parse(generateCatalog([{ name: 'a', category: 'x' }, { name: 'b', category: 'y' }]));
  assert.ok(Array.isArray(out));
  assert.strictEqual(out.length, 2);
});
