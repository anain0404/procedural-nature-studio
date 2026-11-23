const $ = (id) => document.getElementById(id);
const canvas = $('canvas');
const ctx = canvas.getContext('2d');

const patterns = {
  canopy: { name: 'Forest canopy', axiom: 'F', rules: 'F = FF-[-F+F+F]+[+F-F-F]', iterations: 4, angle: 23, jitter: 8, length: 10, seed: 31415 },
  willow: { name: 'Weeping willow', axiom: 'X', rules: 'X = F[+X][-X]FX\nF = FF', iterations: 6, angle: 23, jitter: 12, length: 8, seed: 21221 },
  coral: { name: 'Coral branches', axiom: 'X', rules: 'X = F[+X]F[-X]+X\nF = FF', iterations: 6, angle: 29, jitter: 9, length: 7, seed: 7442 },
  fern: { name: 'Fern frond', axiom: 'X', rules: 'X = F+[[X]-X]-F[-FX]+X\nF = FF', iterations: 5, angle: 25, jitter: 3, length: 8, seed: 9090 },
  snowflake: { name: 'Koch snowflake', axiom: 'F--F--F', rules: 'F = F+F--F+F', iterations: 4, angle: 60, jitter: 0, length: 8, seed: 8419 },
  dragon: { name: 'Dragon curve', axiom: 'FX', rules: 'X = X+YF+\nY = -FX-Y', iterations: 11, angle: 90, jitter: 0, length: 9, seed: 46271 }
};

const palettes = {
  sage: { bg: '#17251e', bottom: '#20352b', low: '#55745e', high: '#c7e6a9', grid: '#56735b' },
  autumn: { bg: '#201d1d', bottom: '#352723', low: '#98674f', high: '#f2c77d', grid: '#6b4c3c' },
  blossom: { bg: '#241f2b', bottom: '#39283c', low: '#aa7198', high: '#f7bed1', grid: '#745473' },
  ocean: { bg: '#112632', bottom: '#163749', low: '#3e7d9d', high: '#98ead9', grid: '#3f7793' }
};

const state = { palette: 'sage', segments: [], bounds: null, zoom: 1, panX: 0, panY: 0, symbolCount: 0, iterationCount: 0, segmentLimit: 90000, textLimit: 700000, error: '' };
let drag = null;
let renderQueued = false;

function rng(seed) {
  let n = (seed >>> 0) || 1;
  return () => {
    n ^= n << 13;
    n ^= n >>> 17;
    n ^= n << 5;
    return (n >>> 0) / 4294967296;
  };
}

function grammar() {
  const rules = {};
  for (const raw of $('rules').value.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    const match = line.match(/^(.)(?:\s*)(?:=|:|->)(?:\s*)(.*)$/);
    if (!match) throw new Error(`Invalid rule: ${line}`);
    rules[match[1]] = match[2].replace(/\s/g, '');
  }
  const axiom = $('axiom').value.replace(/\s/g, '');
  if (!axiom) throw new Error('Enter an axiom to generate a pattern.');
  return { axiom, rules };
}

function expand(axiom, rules, iterations) {
  let current = axiom;
  for (let i = 0; i < iterations; i++) {
    const chunks = [];
    let size = 0;
    for (const symbol of current) {
      const next = Object.prototype.hasOwnProperty.call(rules, symbol) ? rules[symbol] : symbol;
      size += next.length;
      if (size > state.textLimit) throw new Error('The grammar is too large. Reduce the generations or simplify the rules.');
      chunks.push(next);
    }
    current = chunks.join('');
  }
  return current;
}

function trace(text, angle, jitter, length, seed) {
  const random = rng(seed);
  const segments = [];
  const stack = [];
  const turns = Math.PI / 180;
  let x = 0, y = 0, direction = -Math.PI / 2, depth = 0;
  let minX = 0, maxX = 0, minY = 0, maxY = 0;
  let invalid = 0;
  for (const symbol of text) {
    if (symbol === 'F' || symbol === 'G' || symbol === 'f') {
      const nx = x + Math.cos(direction) * length;
      const ny = y + Math.sin(direction) * length;
      if (symbol !== 'f') {
        if (segments.length >= state.segmentLimit) throw new Error('Too many segments to display. Try fewer generations.');
        segments.push({ x, y, nx, ny, depth });
      }
      x = nx;
      y = ny;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    } else if (symbol === '+') {
      direction += (angle + (random() * 2 - 1) * jitter) * turns;
    } else if (symbol === '-') {
      direction -= (angle + (random() * 2 - 1) * jitter) * turns;
    } else if (symbol === '[') {
      stack.push({ x, y, direction, depth });
      depth++;
    } else if (symbol === ']') {
      if (!stack.length) { invalid++; continue; }
      const saved = stack.pop();
      x = saved.x;
      y = saved.y;
      direction = saved.direction;
      depth = saved.depth;
    } else if (symbol === '|') {
      direction += Math.PI;
    }
  }
  if (invalid || stack.length) throw new Error('Unbalanced branches. Check the [ and ] symbols in your rules.');
  if (!segments.length) throw new Error('No line segments were generated. Use F to draw a line.');
  return { segments, bounds: { minX, maxX, minY, maxY } };
}

function hexToRgb(hex) {
  const value = parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function mix(a, b, t) {
  const left = hexToRgb(a), right = hexToRgb(b);
  return `rgb(${left.map((v, i) => Math.round(v + (right[i] - v) * t)).join(',')})`;
}

function setMessage(message, isError = false) {
  $('message').textContent = message;
  $('message').style.color = isError ? '#efb7a8' : '#a8cba9';
}

function generate() {
  try {
    const { axiom, rules } = grammar();
    const generations = Number($('iterations').value);
    const text = expand(axiom, rules, generations);
    const result = trace(text, Number($('angle').value), Number($('jitter').value), Number($('length').value), Number($('seed').value));
    state.segments = result.segments;
    state.bounds = result.bounds;
    state.symbolCount = text.length;
    state.iterationCount = generations;
    state.error = '';
    $('segment-count').textContent = result.segments.length.toLocaleString();
    $('symbol-count').textContent = text.length.toLocaleString();
    $('generation-count').textContent = String(generations);
    setMessage(`${result.segments.length.toLocaleString()} segments generated from ${text.length.toLocaleString()} symbols.`);
    draw();
  } catch (error) {
    state.error = error.message;
    setMessage(error.message, true);
  }
}

function fit() {
  const { minX, maxX, minY, maxY } = state.bounds;
  const w = Math.max(1, maxX - minX), h = Math.max(1, maxY - minY);
  const scale = Math.min((canvas.clientWidth - 90) / w, (canvas.clientHeight - 155) / h);
  return { x: (minX + maxX) / 2, y: (minY + maxY) / 2, scale: Math.max(.0001, scale) * state.zoom };
}

function draw() {
  if (!ctx) return;
  const width = Math.max(1, canvas.clientWidth), height = Math.max(1, canvas.clientHeight);
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const rw = Math.round(width * dpr), rh = Math.round(height * dpr);
  if (canvas.width !== rw || canvas.height !== rh) { canvas.width = rw; canvas.height = rh; }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const colors = palettes[state.palette];
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, colors.bg);
  bg.addColorStop(1, colors.bottom);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
  if ($('show-grid').checked) {
    ctx.strokeStyle = colors.grid;
    ctx.globalAlpha = .22;
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 38) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
    for (let y = 0; y < height; y += 38) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }
    ctx.globalAlpha = 1;
  }
  if (!state.bounds || !state.segments.length) return;
  const frame = fit();
  let maxDepth = 1;
  for (const segment of state.segments) maxDepth = Math.max(maxDepth, segment.depth);
  const gradient = $('color-depth').checked;
  const maxY = state.bounds.maxY, minY = state.bounds.minY;
  const rangeY = Math.max(1, maxY - minY);
  const originX = width / 2 + state.panX, originY = height / 2 + state.panY;
  ctx.save();
  ctx.translate(originX, originY);
  ctx.scale(frame.scale, frame.scale);
  ctx.translate(-frame.x, -frame.y);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const baseWidth = Math.max(.45, Number($('length').value) * .13);
  for (const s of state.segments) {
    const t = Math.min(1, Math.max(0, .68 * ((maxY - (s.y + s.ny) / 2) / rangeY) + .32 * s.depth / maxDepth));
    ctx.strokeStyle = gradient ? mix(colors.low, colors.high, t) : colors.high;
    ctx.lineWidth = Math.max(.45, baseWidth * (1 - .52 * s.depth / maxDepth));
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(s.nx, s.ny);
    ctx.stroke();
  }
  ctx.restore();
}

function queueGenerate() {
  if (renderQueued) return;
  renderQueued = true;
  requestAnimationFrame(() => { renderQueued = false; generate(); });
}

function updateLabels() {
  for (const name of ['iterations', 'angle', 'jitter', 'length']) {
    $(name + '-out').textContent = $(name).value + (name === 'angle' || name === 'jitter' ? '°' : '');
  }
}

function resetView() {
  state.zoom = 1;
  state.panX = 0;
  state.panY = 0;
  draw();
}

function applyPattern(name) {
  const p = patterns[name];
  if (!p) return;
  for (const key of ['axiom', 'rules', 'iterations', 'angle', 'jitter', 'length', 'seed']) $(key).value = p[key];
  $('scene-title').textContent = p.name;
  updateLabels();
  resetView();
  generate();
}

for (const name of ['iterations', 'angle', 'jitter', 'length']) {
  $(name).addEventListener('input', () => { updateLabels(); queueGenerate(); });
}
for (const name of ['axiom', 'rules', 'seed']) $(name).addEventListener('input', queueGenerate);
$('preset').addEventListener('change', () => applyPattern($('preset').value));
$('regenerate').addEventListener('click', generate);
$('randomize').addEventListener('click', () => { $('seed').value = Math.floor(Math.random() * 999999998) + 1; generate(); });
$('reset-view').addEventListener('click', resetView);
$('color-depth').addEventListener('change', draw);
$('show-grid').addEventListener('change', draw);

for (const button of document.querySelectorAll('.palette')) {
  button.addEventListener('click', () => {
    document.querySelectorAll('.palette').forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    state.palette = button.dataset.palette;
    draw();
  });
}

canvas.addEventListener('pointerdown', event => {
  drag = { x: event.clientX, y: event.clientY, panX: state.panX, panY: state.panY };
  canvas.setPointerCapture(event.pointerId);
});
canvas.addEventListener('pointermove', event => {
  if (!drag) return;
  state.panX = drag.panX + event.clientX - drag.x;
  state.panY = drag.panY + event.clientY - drag.y;
  draw();
});
canvas.addEventListener('pointerup', () => { drag = null; });
canvas.addEventListener('pointercancel', () => { drag = null; });
canvas.addEventListener('dblclick', resetView);
canvas.addEventListener('wheel', event => {
  event.preventDefault();
  state.zoom = Math.min(20, Math.max(.12, state.zoom * Math.exp(-event.deltaY * .001)));
  draw();
}, { passive: false });
$('export').addEventListener('click', () => {
  draw();
  const link = document.createElement('a');
  link.download = `procedural-nature-${$('preset').value}-${$('seed').value}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
});

if ('ResizeObserver' in window) new ResizeObserver(draw).observe(canvas);
else window.addEventListener('resize', draw);
applyPattern('canopy');
