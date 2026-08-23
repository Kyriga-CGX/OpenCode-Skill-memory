const test = require('node:test');
const assert = require('node:assert');
const { hexToRgb, relativeLuminance, contrastRatio, validateDesignMd } = require('./validate.js');

test('hexToRgb', () => {
  assert.deepStrictEqual(hexToRgb('#AABBCC'), { r: 170, g: 187, b: 204 });
  assert.deepStrictEqual(hexToRgb('#fff'), { r: 255, g: 255, b: 255 });
});

test('relativeLuminance', () => {
  assert.ok(Math.abs(relativeLuminance({ r: 255, g: 255, b: 255 }) - 1) < 1e-6);
  assert.ok(Math.abs(relativeLuminance({ r: 0, g: 0, b: 0 })) < 1e-6);
});

test('contrastRatio white/black', () => {
  assert.strictEqual(contrastRatio('#ffffff', '#000000'), 21);
});

test('validateDesignMd ok', () => {
  const md = `---
colors:
  primary: "#000000"
  background: "#ffffff"
typography:
  body: "Inter"
spacing:
  base: "8px"
---`;
  assert.strictEqual(validateDesignMd(md).ok, true);
});

test('validateDesignMd missing keys', () => {
  const md = `---
colors:
  primary: "#000000"
---`;
  const res = validateDesignMd(md);
  assert.strictEqual(res.ok, false);
  assert.ok(res.errors.some(e => e.includes('typography')));
});

test('validateDesignMd low contrast flagged', () => {
  const md = `---
colors:
  primary: "#ffffff"
  background: "#ffffff"
typography:
  body: "Inter"
spacing:
  base: "8px"
---`;
  const res = validateDesignMd(md);
  assert.strictEqual(res.ok, false);
  assert.ok(res.errors.some(e => e.toLowerCase().includes('contrast')));
});
