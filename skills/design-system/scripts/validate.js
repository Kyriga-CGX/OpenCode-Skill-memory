'use strict';

function hexToRgb(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const n = parseInt(h, 16);
  if (Number.isNaN(n)) throw new Error(`Invalid hex: ${hex}`);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function relativeLuminance({ r, g, b }) {
  const c = [r, g, b].map(v => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

function contrastRatio(hexA, hexB) {
  const l1 = relativeLuminance(hexToRgb(hexA));
  const l2 = relativeLuminance(hexToRgb(hexB));
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
}

function parseFrontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const out = {};
  let section = null;
  for (const line of m[1].split('\n')) {
    const header = line.match(/^(\w[\w-]*):\s*$/);
    if (header) {
      section = header[1];
      if (typeof out[section] === 'undefined') out[section] = '';
      continue;
    }
    const flat = line.match(/^(\w[\w-]*):\s*"?(.*?)"?\s*$/);
    if (flat && flat[2]) {
      out[flat[1]] = flat[2];
      continue;
    }
    if (section && /^\s/.test(line)) {
      const val = line.match(/:\s*"?(#[0-9a-fA-F]+)"?\s*$/);
      const v = val ? val[1] : true;
      out[section] = out[section] ? `${out[section]}:${v}` : v;
    }
  }
  return out;
}

function validateDesignMd(content) {
  const errors = [];
  const fm = parseFrontmatter(content);
  for (const key of ['colors', 'typography', 'spacing']) {
    if (!fm[key]) errors.push(`missing frontmatter key: ${key}`);
  }
  const colors = fm.colors || '';
  const colorPairs = colors.split(',').map(s => s.trim()).filter(Boolean);
  for (const pair of colorPairs) {
    const [a, b] = pair.split(':').map(s => s && s.trim());
    if (/^#[0-9a-fA-F]{3,8}$/.test(a) && /^#[0-9a-fA-F]{3,8}$/.test(b)) {
      const ratio = contrastRatio(a, b);
      if (ratio < 4.5) errors.push(`low contrast: ${a} vs ${b} = ${ratio}`);
    }
  }
  return { ok: errors.length === 0, errors };
}

if (require.main === module) {
  const filePath = process.argv[2] || require('path').join(process.cwd(), 'DESIGN.md');
  let content;
  try {
    content = require('fs').readFileSync(filePath, 'utf8');
  } catch (err) {
    console.error(`error reading ${filePath}: ${err.message}`);
    process.exit(1);
  }
  const result = validateDesignMd(content);
  if (result.ok) {
    console.log(`PASS: DESIGN.md is well-formed`);
  } else {
    for (const message of result.errors) {
      console.error(message);
    }
    console.error(`FAIL: ${result.errors.length} error(s) in ${filePath}`);
    process.exit(1);
  }
}

module.exports = { hexToRgb, relativeLuminance, contrastRatio, validateDesignMd };
