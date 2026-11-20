// damped spring step response 0 -> 1. w = speed (8 slow, 14 normal, 22 snappy), z = damping (1 = no overshoot)
function spring(t, w = 14, z = 0.82) {
  if (t <= 0) return 0;
  if (z >= 1) return 1 - Math.exp(-w * t) * (1 + w * t);
  const wd = w * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + (z * w / wd) * Math.sin(wd * t));
}
// a value that changes target many times, springing to each: track(start, [[time, value, w?, z?], ...]) -> f(t)
const track = (v0, keys) => t => { let v = v0, p = v0; for (const [tk, val, w, z] of keys) { v += (val - p) * spring(t - tk, w, z); p = val; } return v; };
// precise eased keyframes (best for camera moves): kf([[t0, v0], [t1, v1, easeFn?], ...]) -> f(t)
const kf = keys => t => { if (t <= keys[0][0]) return keys[0][1]; for (let i = 1; i < keys.length; i++) { const [a, va] = keys[i - 1], [b, vb, e = ease] = keys[i]; if (t <= b) return lerp(va, vb, e((t - a) / (b - a))); } return keys[keys.length - 1][1]; };
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = x => (x = clamp(x), x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);   // easeInOutCubic
const lerp = (a, b, k) => a + (b - a) * k;
const seg = (t, a, b) => clamp((t - a) / (b - a));      // 0..1 progress of t through [a, b]
const rng = s => () => (s = (s + 0x6D2B79F5) | 0, s = Math.imul(s ^ (s >>> 15), 1 | s), s ^= s + Math.imul(s ^ (s >>> 7), 61 | s), ((s ^ (s >>> 14)) >>> 0) / 4294967296);
