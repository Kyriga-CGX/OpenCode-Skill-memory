'use strict';

const TIMING = {
  tooltip: { durationMs: 100, easing: 'cubic-bezier(0.2,0,0,1)', direction: 'decelerate' },
  button: { durationMs: 150, easing: 'cubic-bezier(0.25,0.1,0.25,1)', direction: 'decelerate' },
  icon: { durationMs: 200, easing: 'cubic-bezier(0.2,0,0,1)', direction: 'decelerate' },
  card: { durationMs: 270, easing: 'cubic-bezier(0.05,0.7,0.1,1)', direction: 'decelerate' },
  modal: { durationMs: 350, easing: 'cubic-bezier(0.2,0,0,1)', direction: 'decelerate' },
  page: { durationMs: 500, easing: 'cubic-bezier(0.05,0.7,0.1,1)', direction: 'decelerate' },
  dramatic: { durationMs: 900, easing: 'cubic-bezier(0.05,0.7,0.1,1)', direction: 'decelerate' }
};

const RANGES = {
  tooltip: [80, 120], button: [120, 180], icon: [150, 250], card: [200, 350],
  modal: [300, 400], page: [400, 600], dramatic: [600, 1200]
};

function lookupTiming(elementType) {
  const key = (elementType || '').toLowerCase();
  return TIMING[key] || TIMING.page;
}

function validateTiming({ durationMs, easing, direction, isSpatial }) {
  const errors = [];
  const key = Object.keys(RANGES).find(k => durationMs >= RANGES[k][0] && durationMs <= RANGES[k][1]);
  if (!key) errors.push(`duration ${durationMs}ms outside documented ranges`);
  if (isSpatial && easing === 'linear') errors.push('linear easing on spatial movement is an anti-pattern');
  if (!['decelerate', 'accelerate'].includes(direction)) errors.push(`invalid direction: ${direction}`);
  return { ok: errors.length === 0, errors };
}

module.exports = { lookupTiming, validateTiming };
