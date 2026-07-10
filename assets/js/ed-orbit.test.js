'use strict';
const assert = require('assert');
const { edOrbitDepth, edOrbitScale, edOrbitXY } = require('./ed-orbit.js');

assert.ok(Math.abs(edOrbitDepth(Math.PI / 2) - 1) < 1e-9);
assert.ok(Math.abs(edOrbitDepth(-Math.PI / 2) - 0) < 1e-9);
assert.ok(Math.abs(edOrbitScale(0) - 0.78) < 1e-9);
assert.ok(Math.abs(edOrbitScale(1) - 1.06) < 1e-9);

const p = edOrbitXY(100, 0, Math.PI / 4);
assert.ok(Math.abs(p.x - 100) < 1e-9);
assert.ok(Math.abs(p.y - 0) < 1e-9);

const q = edOrbitXY(100, Math.PI / 2, Math.PI / 4);
assert.ok(Math.abs(q.x - 0) < 1e-9);
assert.ok(Math.abs(q.y - 100 * Math.sin(Math.PI / 4)) < 1e-9);

console.log('ed-orbit helpers: ok');
