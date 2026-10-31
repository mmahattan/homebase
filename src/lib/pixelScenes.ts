// 32-bit-era pixel art for the House of Kei, drawn once onto small canvases
// and scaled up with crisp pixels. Richer palette than the 8-bit chrome:
// dithered gradients, wood/brick/tatami textures, light and transparency.
// The house and every room are 16:9, so zooming into a room fills the frame.

export const HOUSE_W = 448;
export const HOUSE_H = 252;
export const ROOM_W = 128;
export const ROOM_H = 72;
export const ZOOM = HOUSE_W / ROOM_W; // 3.5, same as HOUSE_H / ROOM_H

export type RoomSlot = { x: number; y: number; open?: boolean };

export const ROOMS: RoomSlot[] = [
  { x: 24, y: 80 },
  { x: 160, y: 80 },
  { x: 296, y: 80 },
  { x: 24, y: 160 },
  { x: 160, y: 160, open: true },
  { x: 296, y: 160 },
];

type Ctx = CanvasRenderingContext2D;
type Wood = { base: string; dark: string; light: string };

// ── Drawing helpers ──

// Seeded random, so textures look the same on every visit.
function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

function rect(c: Ctx, x: number, y: number, w: number, h: number, color: string) {
  c.fillStyle = color;
  c.fillRect(x, y, w, h);
}

function dot(c: Ctx, x: number, y: number, color: string) {
  rect(c, x, y, 1, 1, color);
}

function tint(c: Ctx, x: number, y: number, w: number, h: number, color: string, alpha: number) {
  c.globalAlpha = alpha;
  rect(c, x, y, w, h, color);
  c.globalAlpha = 1;
}

// Vertical gradient between color stops: solid bands, ordered-dithered only
// in a narrow strip where one band meets the next, like SNES/PS1 skies.
function vgrad(c: Ctx, x: number, y: number, w: number, h: number, stops: string[]) {
  const n = stops.length - 1;
  for (let r = 0; r < h; r++) {
    const t = (r / Math.max(1, h - 1)) * n;
    const i = Math.min(Math.floor(t), n - 1);
    const f = Math.min(1, Math.max(0, (t - i - 0.75) / 0.25));
    for (let k = 0; k < w; k++) {
      dot(c, x + k, y + r, f * 16 > BAYER[(r % 4) * 4 + (k % 4)] ? stops[i + 1] : stops[i]);
    }
  }
}

function speckle(c: Ctx, x: number, y: number, w: number, h: number, colors: string[], density: number, seed: number) {
  const r = rng(seed);
  const count = Math.floor(w * h * density);
  for (let i = 0; i < count; i++) {
    dot(c, x + Math.floor(r() * w), y + Math.floor(r() * h), colors[Math.floor(r() * colors.length)]);
  }
}

function wood(c: Ctx, x: number, y: number, w: number, h: number, tone: Wood, seed: number, vertical = false) {
  rect(c, x, y, w, h, tone.base);
  const r = rng(seed);
  const streaks = Math.floor((w * h) / 9);
  for (let i = 0; i < streaks; i++) {
    const len = 2 + Math.floor(r() * 6);
    const color = r() < 0.7 ? tone.dark : tone.light;
    const sx = x + Math.floor(r() * w);
    const sy = y + Math.floor(r() * h);
    if (vertical) rect(c, sx, sy, 1, Math.min(len, y + h - sy), color);
    else rect(c, sx, sy, Math.min(len, x + w - sx), 1, color);
  }
}

function glow(c: Ctx, cx: number, cy: number, radius: number, rgb: string, alpha: number, w: number, h: number) {
  const g = c.createRadialGradient(cx, cy, 0, cx, cy, radius);
  g.addColorStop(0, `rgba(${rgb}, ${alpha})`);
  g.addColorStop(1, `rgba(${rgb}, 0)`);
  c.fillStyle = g;
  c.fillRect(0, 0, w, h);
}

function vignette(c: Ctx, w: number, h: number, alpha: number) {
  const g = c.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.75);
  g.addColorStop(0, "rgba(20, 10, 4, 0)");
  g.addColorStop(1, `rgba(20, 10, 4, ${alpha})`);
  c.fillStyle = g;
  c.fillRect(0, 0, w, h);
}

function inRoom(c: Ctx, ox: number, oy: number, draw: () => void) {
  c.save();
  c.translate(ox, oy);
  c.beginPath();
  c.rect(0, 0, ROOM_W, ROOM_H);
  c.clip();
  draw();
  c.restore();
}

// ── Palette ──

const WALNUT: Wood = { base: "#5b3a24", dark: "#46301f", light: "#7a5034" };
const FRAME: Wood = { base: "#8a5a33", dark: "#6b4426", light: "#a8723f" };
const STUD: Wood = { base: "#b98a56", dark: "#9c7144", light: "#d1a26c" };
const SHELL: Wood = { base: "#5a3d2b", dark: "#46301f", light: "#6e4c36" };

const RED = "#b8443a";
const RED_D = "#8e3029";
const RED_L = "#d4655a";
const INDIGO = "#2f4f73";
const INDIGO_L = "#45699a";
const CREAM = "#efe2c8";

// ── The Business World: a traditional Japanese room ──

export function drawJapaneseRoom(c: Ctx, ox = 0, oy = 0) {
  inRoom(c, ox, oy, () => {
    // Plaster wall, ceiling beam and corner posts
    rect(c, 0, 0, 128, 48, "#e6d6b8");
    speckle(c, 0, 0, 128, 48, ["#d8c5a3", "#efe2c8"], 0.08, 11);
    wood(c, 0, 0, 128, 6, WALNUT, 12);
    rect(c, 0, 5, 128, 1, WALNUT.light);
    tint(c, 0, 6, 128, 2, "#000", 0.15);
    wood(c, 0, 6, 5, 42, WALNUT, 13, true);
    wood(c, 123, 6, 5, 42, WALNUT, 14, true);
    rect(c, 4, 6, 1, 42, WALNUT.light);

    // Shoji: four backlit paper panels between a lintel and a floor rail
    wood(c, 6, 9, 90, 3, FRAME, 15);
    const paperRects: [number, number][] = [];
    for (let i = 0; i < 4; i++) {
      const x0 = 9 + i * 21;
      rect(c, x0, 12, 21, 34, FRAME.base);
      vgrad(c, x0 + 2, 14, 17, 26, ["#f3ead6", "#fffaf0", "#f6efdf"]);
      wood(c, x0 + 2, 40, 17, 5, FRAME, 16 + i);
      paperRects.push([x0 + 2, x0 + 19]);
    }
    // A branch's shadow falling across the paper
    const shadow = "#e0d3b6";
    const onPaper = (x: number, y: number) =>
      y >= 14 && y < 40 && paperRects.some(([a, b]) => x >= a && x < b);
    const r = rng(7);
    for (let t = 0; t <= 1; t += 0.01) {
      const bx = Math.round(34 + t * 52);
      const by = Math.round(17 + t * 14 + Math.sin(t * 6) * 2);
      if (onPaper(bx, by)) dot(c, bx, by, shadow);
      if (r() < 0.3) {
        const lx = bx + Math.round(r() * 4 - 2);
        const ly = by + Math.round(r() * 4 - 1);
        for (const [dx, dy] of [[0, 0], [1, 0], [1, 1]]) {
          if (onPaper(lx + dx, ly + dy)) dot(c, lx + dx, ly + dy, shadow);
        }
      }
    }
    for (let i = 0; i < 4; i++) {
      const x0 = 9 + i * 21;
      for (const y of [20, 26, 32]) rect(c, x0 + 2, y, 17, 1, "#cbb48d");
      rect(c, x0 + 7, 14, 1, 26, "#cbb48d");
      rect(c, x0 + 13, 14, 1, 26, "#cbb48d");
      rect(c, x0, 12, 1, 34, FRAME.light);
      rect(c, x0 + 20, 12, 1, 34, FRAME.dark);
    }
    rect(c, 6, 46, 90, 2, FRAME.dark);

    // Small shelf on the right
    rect(c, 98, 14, 25, 34, WALNUT.base);
    rect(c, 100, 16, 21, 30, "#7a5536");
    tint(c, 100, 16, 21, 2, "#000", 0.25);
    for (const y of [24, 35]) {
      rect(c, 100, y, 21, 2, WALNUT.base);
      rect(c, 100, y, 21, 1, WALNUT.light);
      tint(c, 100, y + 2, 21, 1, "#000", 0.2);
    }
    // Top: books and a daruma
    let bx = 101;
    for (const [w, h, col, light] of [
      [2, 7, INDIGO, INDIGO_L],
      [3, 8, RED, RED_L],
      [2, 6, "#d9a441", "#ecc46a"],
      [2, 7, "#4c6b3c", "#6a8f55"],
    ] as [number, number, string, string][]) {
      rect(c, bx, 24 - h, w, h, col);
      rect(c, bx, 24 - h, 1, h, light);
      rect(c, bx, 25 - h, w, 1, "#00000033");
      bx += w;
    }
    rect(c, 115, 17, 4, 1, RED);
    rect(c, 114, 18, 6, 5, RED);
    rect(c, 115, 23, 4, 1, RED_D);
    rect(c, 115, 19, 4, 2, "#f4e9d8");
    dot(c, 116, 20, "#1c1c1c");
    dot(c, 118, 20, "#1c1c1c");
    dot(c, 114, 18, RED_L);
    rect(c, 116, 22, 2, 1, "#e0b04a");
    // Middle: a potted plant and a vase with a blossom
    rect(c, 100, 30, 8, 1, "#c46a35");
    rect(c, 101, 31, 6, 4, "#a8572a");
    rect(c, 101, 31, 1, 4, "#c46a35");
    speckle(c, 100, 26, 8, 4, ["#3f6b2e", "#5f8f3e", "#7fb054"], 0.7, 21);
    rect(c, 114, 27, 2, 2, INDIGO);
    rect(c, 113, 29, 4, 6, INDIGO);
    rect(c, 113, 29, 1, 5, INDIGO_L);
    dot(c, 115, 26, "#e89aa8");
    dot(c, 117, 26, "#e89aa8");
    dot(c, 116, 26, "#5b3a24");
    // Bottom: folded cloth and a lidded jar
    rect(c, 101, 40, 8, 2, RED);
    rect(c, 101, 42, 8, 2, CREAM);
    rect(c, 101, 44, 8, 2, INDIGO);
    rect(c, 113, 38, 5, 1, WALNUT.base);
    rect(c, 112, 39, 7, 7, "#cbb48d");
    rect(c, 112, 40, 1, 5, "#e6d6b8");
    rect(c, 112, 42, 7, 1, "#a8906a");

    // Paper lantern over the kotatsu
    rect(c, 64, 6, 1, 4, "#2a1a10");
    rect(c, 62, 9, 5, 1, "#3a2414");
    rect(c, 61, 10, 7, 1, "#e0cfa6");
    rect(c, 60, 11, 9, 5, "#fff4d6");
    rect(c, 60, 13, 9, 1, "#efdfb8");
    rect(c, 61, 16, 7, 1, "#e0cfa6");
    rect(c, 62, 17, 5, 1, "#3a2414");

    // Tatami floor with dark green heri borders
    rect(c, 0, 48, 128, 1, WALNUT.dark);
    vgrad(c, 0, 49, 128, 23, ["#b9b06c", "#cdc586", "#d8d199"]);
    for (let y = 50; y < 72; y += 2) tint(c, 0, y, 128, 1, "#000", 0.05);
    tint(c, 0, 49, 128, 2, "#000", 0.12);
    for (const x of [42, 86]) rect(c, x, 49, 1, 9, "#3e4f2c");
    rect(c, 0, 58, 128, 2, "#3e4f2c");
    for (const x of [22, 64, 106]) rect(c, x, 60, 1, 12, "#3e4f2c");

    // Kotatsu: soft shadow, futon blanket, then the tabletop
    for (let y = 57; y <= 64; y++) {
      const hw = Math.round(32 - Math.abs(y - 60.5) * 3);
      tint(c, 64 - hw, y, hw * 2, 1, "#2a1a10", 0.22);
    }
    rect(c, 38, 43, 52, 18, RED);
    for (let y = 46; y < 58; y += 4) {
      for (let x = 41 + ((y / 4) % 2) * 3; x < 88; x += 6) rect(c, x, y, 2, 1, "#e9c9a8");
    }
    for (const x of [50, 63, 77]) rect(c, x, 45, 1, 14, RED_D);
    rect(c, 38, 43, 1, 17, RED_L);
    rect(c, 88, 43, 2, 18, RED_D);
    rect(c, 38, 58, 52, 2, RED_D);
    for (let x = 38; x < 90; x++) if (x % 6 < 3) dot(c, x, 60, RED_D);
    tint(c, 38, 43, 52, 2, "#000", 0.25);
    wood(c, 34, 38, 60, 3, FRAME, 31);
    rect(c, 34, 38, 60, 1, "#c08a52");
    rect(c, 34, 41, 60, 2, FRAME.dark);
    // A bowl of mikan and a cup of steaming tea
    rect(c, 49, 34, 13, 1, INDIGO_L);
    rect(c, 50, 35, 11, 3, INDIGO);
    for (const [mx, my] of [[51, 31], [56, 31], [53, 29]]) {
      rect(c, mx + 1, my, 2, 1, "#f08a24");
      rect(c, mx, my + 1, 4, 2, "#f08a24");
      dot(c, mx + 1, my + 1, "#ffb35c");
    }
    dot(c, 55, 28, "#5f8f3e");
    rect(c, 72, 34, 5, 4, "#efe6d3");
    rect(c, 72, 34, 5, 1, "#7fa65a");
    rect(c, 76, 35, 1, 3, "#cbbfa6");
    c.globalAlpha = 0.55;
    for (const [sx, sy] of [[73, 32], [74, 31], [74, 30], [73, 29], [74, 27]]) dot(c, sx, sy, "#fff");
    c.globalAlpha = 1;
    // Zabuton cushions
    for (const x of [16, 94]) {
      rect(c, x, 62, 18, 6, INDIGO);
      rect(c, x, 62, 18, 2, INDIGO_L);
      rect(c, x, 67, 18, 1, "#1f3653");
      dot(c, x + 9, 64, "#e9c9a8");
    }

    // Warm lantern light, then a soft vignette
    glow(c, 64, 14, 80, "255, 210, 140", 0.2, 128, 72);
    vignette(c, 128, 72, 0.3);
  });
}

// ── Unopened rooms: bare studs, insulation, caution tape and tools ──

function cone(c: Ctx, x: number, y: number) {
  const orange = "#e8742a";
  const white = "#f4efe2";
  rect(c, x + 3, y - 9, 2, 1, orange);
  rect(c, x + 2, y - 8, 4, 2, orange);
  rect(c, x + 2, y - 6, 4, 1, white);
  rect(c, x + 1, y - 5, 6, 2, orange);
  rect(c, x + 1, y - 3, 6, 1, white);
  rect(c, x + 1, y - 2, 6, 1, orange);
  rect(c, x - 1, y - 1, 10, 2, "#c45a1e");
}

function planks(c: Ctx, x: number, y: number) {
  for (const [dx, dy, w, col] of [
    [0, 2, 26, "#b98a56"],
    [3, 4, 22, "#a8794a"],
    [1, 6, 24, "#c79a66"],
  ] as [number, number, number, string][]) {
    rect(c, x + dx, y - dy, w, 2, col);
    rect(c, x + dx, y - dy, w, 1, "#d8b07c");
    rect(c, x + dx, y - dy, 1, 2, "#7d5a36");
  }
}

function bucket(c: Ctx, x: number, y: number) {
  rect(c, x, y - 7, 8, 7, "#8a8f94");
  rect(c, x, y - 7, 8, 1, "#b5babf");
  rect(c, x, y - 7, 1, 7, "#a3a8ad");
  rect(c, x + 2, y - 6, 1, 3, "#3f6e8c");
  rect(c, x + 5, y - 6, 1, 2, "#3f6e8c");
}

function ladder(c: Ctx, x: number, y: number) {
  rect(c, x, y - 40, 2, 40, "#b98a56");
  rect(c, x + 10, y - 40, 2, 40, "#b98a56");
  for (let yy = y - 36; yy < y; yy += 6) rect(c, x + 2, yy, 8, 1, "#a8794a");
}

function sawhorse(c: Ctx, x: number, y: number) {
  rect(c, x, y - 12, 24, 3, "#b98a56");
  rect(c, x, y - 12, 24, 1, "#d8b07c");
  for (const lx of [2, 20]) rect(c, x + lx, y - 9, 2, 9, "#a8794a");
  rect(c, x + 4, y - 5, 16, 1, "#9c7144");
}

function toolbox(c: Ctx, x: number, y: number) {
  rect(c, x, y - 7, 12, 1, RED_D);
  rect(c, x, y - 6, 12, 6, RED);
  rect(c, x, y - 6, 1, 6, RED_L);
  rect(c, x + 4, y - 9, 4, 1, "#2a1a10");
  rect(c, x + 4, y - 9, 1, 2, "#2a1a10");
  rect(c, x + 7, y - 9, 1, 2, "#2a1a10");
}

function tape(c: Ctx, y0: number, y1: number) {
  for (let x = 0; x < 128; x++) {
    const y = Math.round(y0 + ((y1 - y0) * x) / 127);
    rect(c, x, y, 1, 3, Math.floor(x / 5) % 2 ? "#1f1a16" : "#f2c230");
  }
}

export function drawConstructionRoom(c: Ctx, ox: number, oy: number, seed: number) {
  inRoom(c, ox, oy, () => {
    rect(c, 0, 0, 128, 54, "#6e5a46");
    speckle(c, 0, 0, 128, 54, ["#7d684f", "#5e4b39", "#86705a"], 0.25, seed * 7);
    const r = rng(seed * 13);
    for (const [bx, bw] of [[14, 28], [46, 28], [78, 28]]) {
      if (r() < 0.5) {
        rect(c, bx, 6, bw, 46, "#d4888a");
        speckle(c, bx, 6, bw, 46, ["#e3a0a0", "#bf7375"], 0.35, seed * 17 + bx);
      }
    }
    wood(c, 0, 0, 128, 4, STUD, seed * 19);
    for (const x of [10, 42, 74, 106]) {
      wood(c, x, 4, 4, 50, STUD, seed * 23 + x, true);
      rect(c, x, 4, 1, 50, STUD.light);
      tint(c, x + 4, 4, 1, 50, "#000", 0.25);
    }
    rect(c, 0, 54, 128, 18, "#4a4743");
    speckle(c, 0, 54, 128, 18, ["#55524d", "#3f3c39"], 0.2, seed * 29);
    rect(c, 0, 54, 128, 1, "#5c5853");
    tint(c, 0, 52, 128, 2, "#000", 0.25);
    tape(c, 10, 40);
    tape(c, 40, 10);

    const variant = seed % 3;
    if (variant === 0) {
      cone(c, 14, 70);
      planks(c, 70, 70);
      bucket(c, 104, 70);
    } else if (variant === 1) {
      ladder(c, 20, 70);
      sawhorse(c, 70, 70);
      cone(c, 108, 70);
    } else {
      toolbox(c, 16, 70);
      bucket(c, 52, 70);
      cone(c, 92, 70);
    }

    // Closed for now: dimmed
    tint(c, 0, 0, 128, 72, "#0a0806", 0.38);
    vignette(c, 128, 72, 0.35);
  });
}

// ── The house ──

function cloud(c: Ctx, x: number, y: number) {
  rect(c, x + 4, y, 10, 3, "#ffffff");
  rect(c, x + 14, y + 1, 8, 3, "#ffffff");
  rect(c, x, y + 3, 24, 3, "#ffffff");
  rect(c, x + 1, y + 6, 22, 1, "#d6e6f0");
}

export function drawHouse(c: Ctx) {
  // Sky, clouds and distant hills
  vgrad(c, 0, 0, HOUSE_W, HOUSE_H, ["#5b97d2", "#6aa5da", "#7ab2e1", "#8cbfe7", "#a0cbec", "#b5d8f1", "#cae4f5", "#dcedf8"]);
  for (const [x, y] of [[24, 18], [96, 6], [350, 8], [400, 40]]) cloud(c, x, y);
  for (let x = 0; x < HOUSE_W; x++) {
    const top = Math.round(206 + Math.sin(x * 0.03) * 8 + Math.sin(x * 0.011) * 6);
    rect(c, x, top, 1, 240 - top, "#7fae73");
    rect(c, x, top, 1, 1, "#9cc78e");
  }

  // Brick chimney, behind the roof
  rect(c, 312, 8, 24, 40, "#8a4b3a");
  for (let y = 8; y < 48; y += 4) {
    rect(c, 312, y, 24, 1, "#6e3a2c");
    for (let x = 312 + (((y - 8) / 4) % 2 ? 4 : 0); x < 336; x += 8) rect(c, x, y, 1, 4, "#6e3a2c");
  }
  rect(c, 312, 8, 1, 40, "#a45e4a");
  rect(c, 308, 4, 32, 4, "#4a3a32");
  rect(c, 308, 4, 32, 1, "#6b5a50");

  // Shingled roof
  for (let row = 0; row < 9; row++) {
    const half = 32 + row * 24;
    const x = 224 - half;
    const y = row * 8;
    const w = half * 2;
    rect(c, x, y, w, 8, row % 2 ? "#9a3a2a" : "#a8432f");
    speckle(c, x, y + 1, w, 5, ["#b34c36", "#93362a"], 0.06, 40 + row);
    for (let sx = x + (row % 2 ? 6 : 0); sx < x + w; sx += 12) rect(c, sx, y + 1, 1, 6, "#7d2a1f");
    rect(c, x, y, w, 1, "#c25a42");
    rect(c, x, y + 6, w, 2, "#7d2a1f");
    rect(c, x, y, 2, 8, "#5e2219");
    rect(c, x + w - 2, y, 2, 8, "#5e2219");
  }
  rect(c, 192, 0, 64, 2, "#5e2219");
  rect(c, 0, 72, HOUSE_W, 4, "#4a2f1d");
  rect(c, 0, 72, HOUSE_W, 1, "#6b4a35");

  // Cut-away frame: walls, a floor slab with joists, stone foundation
  wood(c, 16, 76, 416, 164, SHELL, 50);
  tint(c, 16, 76, 416, 3, "#000", 0.25);
  rect(c, 24, 152, 400, 8, "#4f3626");
  rect(c, 24, 152, 400, 1, "#7a5438");
  for (let x = 28; x < 424; x += 16) rect(c, x, 155, 4, 3, "#3a2718");
  rect(c, 16, 232, 416, 8, "#8d8378");
  rect(c, 16, 232, 416, 1, "#a59b8f");
  rect(c, 16, 236, 416, 1, "#6f665c");
  for (let x = 16; x < 432; x += 16) {
    rect(c, x, 232, 1, 4, "#6f665c");
    rect(c, x + 8, 236, 1, 4, "#6f665c");
  }

  // The open room's light spills onto the frame around it
  const open = ROOMS.find((room) => room.open)!;
  glow(c, open.x + ROOM_W / 2, open.y + ROOM_H / 2, 140, "255, 200, 120", 0.28, HOUSE_W, HOUSE_H);

  ROOMS.forEach((room, i) => {
    if (room.open) drawJapaneseRoom(c, room.x, room.y);
    else drawConstructionRoom(c, room.x, room.y, i + 1);
  });

  // Ground: grass, dirt and pebbles
  rect(c, 0, 240, HOUSE_W, 12, "#7a5a3a");
  speckle(c, 0, 243, HOUSE_W, 9, ["#8f6d4a", "#5f442b", "#9a8a7a"], 0.08, 60);
  rect(c, 0, 240, HOUSE_W, 3, "#5f9a42");
  rect(c, 0, 240, HOUSE_W, 1, "#79b456");
  const r = rng(61);
  for (let x = 0; x < HOUSE_W; x += 3 + Math.floor(r() * 5)) {
    dot(c, x, 239, "#5f9a42");
    dot(c, x + 1, 238, "#79b456");
  }
  for (const [x, col] of [[4, "#f2c230"], [9, "#e89aa8"], [438, "#e89aa8"], [443, "#f4efe2"]] as [number, string][]) {
    dot(c, x, 237, col);
    dot(c, x, 238, "#4c7d34");
  }
}
