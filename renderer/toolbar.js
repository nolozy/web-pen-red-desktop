'use strict';

/* The toolbar window never takes focus, so it is moved by hand over IPC.
   A press that never moves is a click on the button it started and ended on. */

const COLORS = { red: '#FF0000', yellow: '#FFD500', green: '#00C853', blue: '#2979FF', white: '#FFFFFF' };
const tb = document.getElementById('tb');
const penBg = document.getElementById('pen-bg');

const ACTIONS = {
  'b-pen': () => window.bar.setMode('pen'),
  'b-cursor': () => window.bar.setMode('cursor'),
  'b-clear': () => window.bar.clear(),
  'b-close': () => window.bar.close()
};

window.bar.onState((s) => {
  document.body.classList.toggle('pen', s.mode === 'pen');
  document.body.classList.toggle('cursor', s.mode === 'cursor');
  penBg.style.background = COLORS[s.color] || COLORS.red;
  // a white pen needs a dark icon to stay visible
  document.body.style.setProperty('--fg', s.color === 'white' ? '#1c1c1e' : '#ffffff');
});

let startX = 0;
let startY = 0;
let pointerId = null;
let dragging = false;
let pressed = null;

tb.addEventListener('pointerdown', (e) => {
  if (e.button !== 0 || pointerId !== null) return;
  startX = e.screenX;
  startY = e.screenY;
  pointerId = e.pointerId;
  dragging = false;
  pressed = e.target.closest ? e.target.closest('.btn') : null;
  tb.setPointerCapture(pointerId);
  window.bar.dragStart();
});

tb.addEventListener('pointermove', (e) => {
  if (pointerId === null || e.pointerId !== pointerId) return;
  const dx = e.screenX - startX;
  const dy = e.screenY - startY;
  if (!dragging && Math.abs(dx) + Math.abs(dy) < 4) return;
  dragging = true;
  tb.classList.add('dragging');
  window.bar.dragMove(dx, dy);
});

function end(e, activate) {
  if (pointerId === null || e.pointerId !== pointerId) return;
  if (tb.hasPointerCapture(pointerId)) tb.releasePointerCapture(pointerId);
  const wasDragging = dragging;
  const btn = pressed;
  pointerId = null;
  pressed = null;
  dragging = false;
  tb.classList.remove('dragging');
  window.bar.dragEnd();
  if (!activate || wasDragging || !btn) return;
  const under = document.elementFromPoint(e.clientX, e.clientY);
  if (under && under.closest && under.closest('.btn') === btn) ACTIONS[btn.id]();
}
tb.addEventListener('pointerup', (e) => end(e, true));
tb.addEventListener('pointercancel', (e) => end(e, false));
