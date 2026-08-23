const test = require('node:test');
const assert = require('node:assert');
const { lookupTiming, validateTiming } = require('./timing.js');

test('lookupTiming button', () => {
  const t = lookupTiming('button');
  assert.strictEqual(t.durationMs, 150);
  assert.ok(t.easing.length > 0);
  assert.ok(['decelerate', 'accelerate'].includes(t.direction));
});

test('lookupTiming unknown defaults', () => {
  const t = lookupTiming('unknown');
  assert.ok(t.durationMs >= 80 && t.durationMs <= 600);
});

test('validateTiming ok', () => {
  const res = validateTiming({ durationMs: 150, easing: 'cubic-bezier(0.2,0,0,1)', direction: 'decelerate', isSpatial: false });
  assert.strictEqual(res.ok, true);
});

test('validateTiming linear spatial flagged', () => {
  const res = validateTiming({ durationMs: 150, easing: 'linear', direction: 'decelerate', isSpatial: true });
  assert.strictEqual(res.ok, false);
  assert.ok(res.errors.some(e => e.toLowerCase().includes('linear')));
});

test('validateTiming bad direction flagged', () => {
  const res = validateTiming({ durationMs: 150, easing: 'cubic-bezier(0.2,0,0,1)', direction: 'bounce', isSpatial: false });
  assert.strictEqual(res.ok, false);
  assert.ok(res.errors.some(e => e.toLowerCase().includes('direction')));
});

test('validateTiming duration out of range', () => {
  const res = validateTiming({ durationMs: 9999, easing: 'cubic-bezier(0.2,0,0,1)', direction: 'decelerate', isSpatial: true });
  assert.strictEqual(res.ok, false);
  assert.ok(res.errors.some(e => e.includes('duration')));
});
