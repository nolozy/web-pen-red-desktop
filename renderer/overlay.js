'use strict';

const COLORS = { red: '#FF0000', yellow: '#FFD500', green: '#00C853', blue: '#2979FF', white: '#FFFFFF' };
const KEYS = { r: 'red', y: 'yellow', g: 'green', b: 'blue', w: 'white' };
const LINE_WIDTH = 3;

const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');

let strokes = []; // each: { points: [{x, y}], color }
let current = null;
let mode = 'pen';
let colorName = 'red';

function resize() {
  const dpr = window.devicePixelRatio || 1;
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  redraw();
}

function setup() {
  const dpr = window.devicePixelRatio || 1;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = LINE_WIDTH;
}

function drawStroke(stroke) {
  const pts = stroke.points;
  if (pts.length === 0) return;
  ctx.strokeStyle = stroke.color;
  ctx.beginPath();
  if (pts.length === 1) {
    ctx.moveTo(pts[0].x, pts[0].y);
    ctx.lineTo(pts[0].x + 0.01, pts[0].y);
  } else {
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
  }
  ctx.stroke();
}

function redraw() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setup();
  for (const s of strokes) drawStroke(s);
}

/* ---------- drawing ---------- */

canvas.addEventListener('pointerdown', (e) => {
  if (mode !== 'pen' || e.button !== 0) return;
  e.preventDefault();
  current = { points: [{ x: e.clientX, y: e.clientY }], color: COLORS[colorName] };
  strokes.push(current);
  try {
    canvas.setPointerCapture(e.pointerId);
  } catch (_) {
    /* the pointer may already be gone; drawing still works */
  }
  drawStroke(current);
});

canvas.addEventListener('pointermove', (e) => {
  if (!current) return;
  e.preventDefault();
  const pts = current.points;
  const prev = pts[pts.length - 1];
  const pt = { x: e.clientX, y: e.clientY };
  pts.push(pt);
  ctx.strokeStyle = current.color;
  ctx.beginPath();
  ctx.moveTo(prev.x, prev.y);
  ctx.lineTo(pt.x, pt.y);
  ctx.stroke();
});

function endStroke(e) {
  if (!current) return;
  if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
  current = null;
}
canvas.addEventListener('pointerup', endStroke);
canvas.addEventListener('pointercancel', endStroke);

// Right-click clears everything (on every display), instantly.
canvas.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  if (mode === 'pen') window.pen.clear();
});

/* ---------- keys (pen mode: the overlay has the keyboard) ---------- */

// Tab switches Pen <-> Cursor. The switch happens when Tab is RELEASED: the
// overlay still owns the keyboard at that moment, so the key-up never leaks to
// the app underneath (a replay, a game) once focus goes back to it.
let toggleHeld = false;
window.addEventListener('blur', () => {
  toggleHeld = false;
});
window.addEventListener(
  'keyup',
  (e) => {
    if (e.key !== 'Tab' || !toggleHeld) return;
    toggleHeld = false;
    e.preventDefault();
    window.pen.setMode(mode === 'pen' ? 'cursor' : 'pen');
  },
  true
);

window.addEventListener(
  'keydown',
  (e) => {
    if (e.repeat || e.ctrlKey || e.altKey || e.metaKey) return;
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      toggleHeld = true;
      return;
    }
    if (mode !== 'pen' || e.shiftKey) return;
    const name = KEYS[e.key.toLowerCase()];
    if (name) {
      e.preventDefault();
      window.pen.setColor(name);
    }
  },
  true
);

/* ---------- state from the main process ---------- */

window.pen.onState((s) => {
  mode = s.mode;
  colorName = s.color;
  current = null;
  document.body.classList.toggle('cursor-mode', mode === 'cursor');
});
window.pen.onClear(() => {
  strokes = [];
  current = null;
  redraw();
});

window.addEventListener('resize', resize);
resize();
