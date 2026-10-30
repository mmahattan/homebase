// Shared 8-bit art for the House of Kei: the house shell and its rooms.
// Everything is drawn in "pixels" (SVG units) with crisp edges. The house and
// every room are 16:9, so zooming into a room fills the frame exactly.

export type Px = [x: number, y: number, w: number, h: number, fill: string];

export const HOUSE_W = 224;
export const HOUSE_H = 126;
export const ROOM_W = 64;
export const ROOM_H = 36;
export const ZOOM = HOUSE_W / ROOM_W; // 3.5, same as HOUSE_H / ROOM_H

export const INK = "#2b1d16";
const WOOD = "#6b4a35";

export function Pixels({ px }: { px: Px[] }) {
  return (
    <>
      {px.map(([x, y, w, h, fill], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill={fill} />
      ))}
    </>
  );
}

// ── The Business World: a traditional Japanese room ──
export const japaneseRoom: Px[] = (() => {
  const wall = "#d8c9a8";
  const frame = "#8a5a33";
  const paper = "#f4efe2";
  const kumiko = "#cdb894";
  const px: Px[] = [
    [0, 0, 64, 36, wall],
    [0, 0, 64, 2, WOOD],
    // Shoji: four paper panels in a wooden frame
    [4, 3, 41, 21, frame],
  ];
  for (let i = 0; i < 4; i++) {
    const x = 5 + i * 10;
    px.push([x, 4, 9, 19, paper]);
    for (const y of [8, 13, 18]) px.push([x, y, 9, 1, kumiko]);
    px.push([x + 4, 4, 1, 19, kumiko]);
  }
  px.push(
    // Tatami floor, laid in a staggered pattern
    [0, 24, 64, 12, "#cfc785"],
    [0, 24, 64, 1, WOOD],
    [0, 30, 64, 1, "#ada45f"],
    [16, 25, 1, 5, "#ada45f"],
    [40, 25, 1, 5, "#ada45f"],
    [28, 31, 1, 5, "#ada45f"],
    [52, 31, 1, 5, "#ada45f"],
    [0, 35, 64, 1, "#4f5d33"],
    // Small shelf on the right
    [48, 8, 13, 16, WOOD],
    [49, 9, 11, 14, "#a07850"],
    [49, 13, 11, 1, WOOD],
    [49, 18, 11, 1, WOOD],
    [50, 10, 1, 3, "#3f6e8c"],
    [51, 9, 1, 4, "#b8443a"],
    [52, 10, 1, 3, "#e0b04a"],
    [55, 11, 3, 2, paper],
    [50, 14, 5, 2, "#5f8f3e"],
    [51, 16, 3, 2, "#b5651d"],
    [56, 14, 2, 1, "#5a8fae"],
    [56, 15, 2, 3, "#3f6e8c"],
    [50, 20, 4, 1, "#b8443a"],
    [50, 21, 4, 2, "#e8dcc4"],
    [56, 20, 3, 3, kumiko],
    // Zabuton cushions
    [12, 30, 6, 2, "#3f6e8c"],
    [46, 30, 6, 2, "#3f6e8c"],
    // Kotatsu: futon blanket under a wooden tabletop
    [20, 22, 24, 9, "#b8443a"],
    [20, 26, 24, 1, "#d4655a"],
    [20, 30, 24, 1, "#8e3029"],
    [18, 20, 28, 2, "#7a4b2a"],
    [18, 20, 28, 1, "#9a6438"],
    // A mikan and a cup of tea on top
    [30, 18, 2, 2, "#f08a24"],
    [31, 17, 1, 1, "#5f8f3e"],
    [36, 18, 2, 2, paper],
    [36, 18, 2, 1, "#7fa65a"],
  );
  return px;
})();

// ── Unopened rooms: bare studs, caution tape, a cone and some planks ──
export const constructionRoom: Px[] = (() => {
  const px: Px[] = [
    [0, 0, 64, 36, "#4a403a"],
    [0, 28, 64, 8, "#3a312c"],
    [0, 0, 64, 2, WOOD],
  ];
  for (const x of [6, 22, 38, 54]) px.push([x, 2, 2, 26, WOOD]);
  for (let i = 0; i < 16; i++) px.push([i * 4, 12, 4, 3, i % 2 ? INK : "#f2c230"]);
  px.push(
    [8, 24, 2, 1, "#e8742a"],
    [7, 25, 4, 1, "#f4efe2"],
    [6, 26, 6, 2, "#e8742a"],
    [5, 28, 8, 1, "#c45a1e"],
    [42, 24, 14, 2, "#a07850"],
    [40, 26, 18, 2, "#b98a56"],
  );
  return px;
})();

// ── The house shell ──
export const house: Px[] = (() => {
  const px: Px[] = [
    // Chimney, drawn first so the roof overlaps its base
    [156, 4, 12, 16, "#8a4b3a"],
    [154, 2, 16, 3, "#5a3d2b"],
  ];
  for (let r = 0; r < 9; r++) {
    const half = 16 + r * 12;
    px.push([112 - half, r * 4, half * 2, 4, r % 2 ? "#8e3226" : "#a33b2b"]);
  }
  px.push(
    [0, 35, 224, 1, "#5e2219"],
    [8, 36, 208, 84, "#5a3d2b"],
    [8, 116, 208, 4, "#8d8378"],
    [0, 120, 224, 6, "#7a5a3a"],
    [0, 120, 224, 2, "#6a9a4a"],
  );
  return px;
})();
