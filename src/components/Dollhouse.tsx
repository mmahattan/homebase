"use client";

import { useEffect, useState } from "react";
import { BUSINESS_WORLD_DEFINITION } from "@/components/BusinessWorldDraft";

// 8-bit dollhouse for the House of Kei front page. Everything is drawn in
// "pixels" (SVG units) with crisp edges. The house and every room are 16:9,
// so zooming into a room fills the frame exactly.

type Px = [x: number, y: number, w: number, h: number, fill: string];

const HOUSE_W = 224;
const HOUSE_H = 126;
const ROOM_W = 64;
const ROOM_H = 36;
const ZOOM = HOUSE_W / ROOM_W; // 3.5, same as HOUSE_H / ROOM_H

const INK = "#2b1d16";
const WOOD = "#6b4a35";

function Pixels({ px }: { px: Px[] }) {
  return (
    <>
      {px.map(([x, y, w, h, fill], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill={fill} />
      ))}
    </>
  );
}

// ── The Business World: a traditional Japanese room ──
const japaneseRoom: Px[] = (() => {
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
const constructionRoom: Px[] = (() => {
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
const house: Px[] = (() => {
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

type Room = { x: number; y: number; open?: boolean };

const rooms: Room[] = [
  { x: 12, y: 40 },
  { x: 80, y: 40 },
  { x: 148, y: 40 },
  { x: 12, y: 80 },
  { x: 80, y: 80, open: true },
  { x: 148, y: 80 },
];
const openRoom = rooms.find((r) => r.open)!;

// Zoom so the open room's center lands in the frame's center at 3.5×.
const originX = ((openRoom.x + ROOM_W / 2) / HOUSE_W) * 100;
const originY = ((openRoom.y + ROOM_H / 2) / HOUSE_H) * 100;
const zoomed = `translate(${50 - originX}%, ${50 - originY}%) scale(${ZOOM})`;

const pct = (n: number, of: number) => `${(n / of) * 100}%`;

const DEFINITION_TEXT = BUSINESS_WORLD_DEFINITION.join("\n\n");

type Phase = "house" | "zoom" | "room" | "unzoom-start" | "unzoom";

export default function Dollhouse() {
  const [phase, setPhase] = useState<Phase>("house");
  const [popup, setPopup] = useState(false);
  const [typed, setTyped] = useState(0);
  const typing = popup && typed < DEFINITION_TEXT.length;

  function enter() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      arrive();
    } else {
      setPhase("zoom");
    }
  }

  function arrive() {
    setPhase("room");
    setTyped(0);
    setPopup(true);
  }

  function leave() {
    setPopup(false);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("house");
    } else {
      setPhase("unzoom-start");
    }
  }

  function advance() {
    if (typing) setTyped(DEFINITION_TEXT.length);
    else setPopup(false);
  }

  // Zooming back out: paint the zoomed house first, then release it.
  useEffect(() => {
    if (phase !== "unzoom-start") return;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setPhase("unzoom"));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [phase]);

  // Typewriter
  useEffect(() => {
    if (!typing) return;
    const id = setTimeout(() => setTyped((n) => Math.min(n + 2, DEFINITION_TEXT.length)), 18);
    return () => clearTimeout(id);
  }, [typing, typed]);

  // Space advances the dialog; Escape closes it, then leaves the room.
  useEffect(() => {
    if (phase !== "room") return;
    function onKey(e: KeyboardEvent) {
      if (e.key === " " && popup) {
        e.preventDefault();
        advance();
      } else if (e.key === "Escape") {
        if (popup) setPopup(false);
        else leave();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const inRoom = phase === "room";
  const houseTransform =
    phase === "zoom" || phase === "unzoom-start" ? zoomed : "none";

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="relative aspect-video overflow-hidden bg-[#9ec9e8]">
          {inRoom ? (
            <svg
              viewBox={`0 0 ${ROOM_W} ${ROOM_H}`}
              shapeRendering="crispEdges"
              className="absolute inset-0 w-full h-full"
              role="img"
              aria-label="The Business World: a Japanese room with shoji doors, tatami, a kotatsu and a shelf"
            >
              <Pixels px={japaneseRoom} />
            </svg>
          ) : (
            <div
              className="absolute inset-0"
              style={{
                transform: houseTransform,
                transformOrigin: `${originX}% ${originY}%`,
                transition: phase === "zoom" || phase === "unzoom" ? "transform 700ms ease-in-out" : "none",
              }}
              onTransitionEnd={() => {
                if (phase === "zoom") arrive();
                if (phase === "unzoom") setPhase("house");
              }}
            >
              <svg
                viewBox={`0 0 ${HOUSE_W} ${HOUSE_H}`}
                shapeRendering="crispEdges"
                className="absolute inset-0 w-full h-full"
                aria-hidden
              >
                <Pixels px={house} />
                {rooms.map((room) => (
                  <svg
                    key={`${room.x}-${room.y}`}
                    x={room.x}
                    y={room.y}
                    width={ROOM_W}
                    height={ROOM_H}
                    viewBox={`0 0 ${ROOM_W} ${ROOM_H}`}
                  >
                    <Pixels px={room.open ? japaneseRoom : constructionRoom} />
                  </svg>
                ))}
              </svg>

              {phase === "house" &&
                rooms.map((room) => {
                  const box = {
                    left: pct(room.x, HOUSE_W),
                    top: pct(room.y, HOUSE_H),
                    width: pct(ROOM_W, HOUSE_W),
                    height: pct(ROOM_H, HOUSE_H),
                  };
                  return room.open ? (
                    <button
                      key="open"
                      onClick={enter}
                      aria-label="Enter the Business World"
                      style={box}
                      className="group absolute outline-[3px] outline-transparent hover:outline-[#f2c230] focus-visible:outline-[#f2c230]"
                    >
                      <span className="pixel-font absolute left-1/2 -translate-x-1/2 -top-7 whitespace-nowrap bg-[#2b1d16] text-[#f4efe2] text-[8px] px-2 py-1 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100">
                        the business world
                      </span>
                    </button>
                  ) : (
                    <div
                      key={`${room.x}-${room.y}`}
                      style={box}
                      className="group absolute cursor-not-allowed"
                    >
                      <span className="pixel-font absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 whitespace-nowrap bg-[#2b1d16] text-[#f2c230] text-[7px] px-2 py-1 opacity-0 group-hover:opacity-100">
                        under construction
                      </span>
                    </div>
                  );
                })}
            </div>
          )}

          {inRoom && (
            <button
              onClick={leave}
              className="pixel-font absolute top-3 left-3 text-[8px] bg-[#2b1d16] text-[#f4efe2] px-2 py-1.5 hover:bg-[#f2c230] hover:text-[#2b1d16]"
            >
              ← house
            </button>
          )}
        </div>

        {inRoom && popup && (
          <div
            role="dialog"
            aria-label="The Business World"
            className="pixel-in mt-4 sm:mt-0 sm:absolute sm:inset-x-[7%] sm:top-[12%] bg-[#f4efe2] text-[#2b1d16] border-4 border-[#2b1d16] shadow-[6px_6px_0_#2b1d16]"
          >
            <div className="flex items-center justify-between gap-4 border-b-4 border-[#2b1d16] px-4 py-2">
              <span className="pixel-font text-[9px]">the business world</span>
              <button
                onClick={() => setPopup(false)}
                aria-label="Close"
                className="pixel-font text-[9px] border-2 border-[#2b1d16] px-1.5 py-0.5 hover:bg-[#2b1d16] hover:text-[#f4efe2]"
              >
                x
              </button>
            </div>
            <p
              onClick={advance}
              className="pixel-font text-[9px] sm:text-[10px] leading-[2.1] whitespace-pre-line px-4 pt-4 min-h-[9rem] cursor-pointer"
            >
              {DEFINITION_TEXT.slice(0, typed)}
            </p>
            <div className="flex justify-end px-4 pb-3 pt-2">
              <button
                onClick={advance}
                className={`pixel-font text-[8px] hover:underline underline-offset-4 ${typing ? "opacity-40" : ""}`}
              >
                continue <span className="text-[#8a5a33]">[space to continue]</span>{" "}
                {!typing && <span className="inline-block animate-pulse">▼</span>}
              </button>
            </div>
          </div>
        )}
      </div>

      {phase === "house" && (
        <p className="pixel-font text-[8px] text-[var(--muted)] text-center">
          click the open room to enter
        </p>
      )}
    </div>
  );
}
