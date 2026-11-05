"use client";

import { useEffect, useState } from "react";
import HotspotTag from "@/components/HotspotTag";
import PixelCanvas from "@/components/PixelCanvas";
import {
  DONABE_LID,
  LID_AJAR,
  ROOM_H,
  ROOM_W,
  drawJapaneseRoom,
} from "@/lib/pixelScenes";
import { BUSINESS_WORLD_DEFINITION, MATS_COPY } from "@/data/businessWorld";

// The Business World's room: a traditional Japanese room. On arrival a
// game-style dialog types out the definition. Then the hotpot on the kotatsu
// becomes MATS: click it to lift the lid and page through what MATS offers.

type Dialog = { title: string; pages: string[] };

const WORLD_DIALOG: Dialog = {
  title: "the business world",
  pages: [BUSINESS_WORLD_DEFINITION.join("\n\n")],
};

const MATS_DIALOG: Dialog = {
  title: "mats",
  pages: [
    [MATS_COPY.intro, ...MATS_COPY.services.map((service) => `▸ ${service}`)].join("\n"),
    MATS_COPY.paragraphs[0],
    MATS_COPY.paragraphs.slice(1).join("\n\n"),
  ],
};

// The canvas draws the room with the lid off; the lid and steam are drawn on
// top so they can move.
const drawRoom = (ctx: CanvasRenderingContext2D) => drawJapaneseRoom(ctx, 0, 0, { lid: false });

// The pot's clickable area, in room pixels.
const POT = { x: 49, y: 22, w: 31, h: 18 };
const pct = (n: number, of: number) => `${(n / of) * 100}%`;

// Three columns of steam, two staggered puffs each: from the gap under the
// ajar lid and from around the knob.
const STEAM: { x: number; y: number; delay: number }[] = [
  { x: 54, y: 27, delay: 0 },
  { x: 54, y: 27, delay: 1.1 },
  { x: 57, y: 25, delay: 0.4 },
  { x: 57, y: 25, delay: 1.5 },
  { x: 65, y: 22, delay: 0.8 },
  { x: 65, y: 22, delay: 1.9 },
];

// Remembers per browser that MATS was opened: the "click me" bubble only
// shows until then. Kept for routing returning visitors later.
const MATS_VISITED_KEY = "kei:visited:mats";

export default function BusinessWorldRoom({
  onLeave,
  startWith,
}: {
  onLeave: () => void;
  // "mats": arriving from the quick menu, straight into MATS.
  startWith?: "mats";
}) {
  const [dialog, setDialog] = useState<Dialog | null>(startWith === "mats" ? null : WORLD_DIALOG);
  const [page, setPage] = useState(0);
  const [typed, setTyped] = useState(0);
  const [lidUp, setLidUp] = useState(false);
  const [matsVisited, setMatsVisited] = useState(false);

  useEffect(() => {
    try {
      setMatsVisited(localStorage.getItem(MATS_VISITED_KEY) === "1");
    } catch {}
  }, []);

  const text = dialog?.pages[page] ?? "";
  const typing = dialog !== null && typed < text.length;
  const lastPage = dialog !== null && page === dialog.pages.length - 1;

  function open(next: Dialog) {
    setDialog(next);
    setPage(0);
    setTyped(0);
  }

  function close() {
    setDialog(null);
    setLidUp(false);
  }

  function advance() {
    if (typing) setTyped(text.length);
    else if (!lastPage) {
      setPage((n) => n + 1);
      setTyped(0);
    } else close();
  }

  function openMats() {
    setMatsVisited(true);
    try {
      localStorage.setItem(MATS_VISITED_KEY, "1");
    } catch {}
    setLidUp(true);
    setTimeout(() => open(MATS_DIALOG), 280);
  }

  useEffect(() => {
    if (startWith === "mats") openMats();
    // Only on arrival.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Typewriter
  useEffect(() => {
    if (!typing) return;
    const id = setTimeout(() => setTyped((n) => Math.min(n + 2, text.length)), 18);
    return () => clearTimeout(id);
  }, [typing, typed, text]);

  // Space advances the dialog; Escape closes it, then leaves the room.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === " " && dialog) {
        e.preventDefault();
        advance();
      } else if (e.key === "Escape") {
        if (dialog) close();
        else onLeave();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const lid = lidUp ? { x: LID_AJAR.x + 2, y: -9 } : LID_AJAR;

  return (
    <div className="relative mx-auto max-w-[calc(75vh*16/9)]">
      <div className="relative aspect-video overflow-hidden">
        <PixelCanvas
          width={ROOM_W}
          height={ROOM_H}
          draw={drawRoom}
          label="The Business World: a Japanese room with shoji doors, tatami, a kotatsu with a hotpot, and a shelf"
          className="absolute inset-0 w-full h-full"
        />
        <svg
          viewBox={`0 0 ${ROOM_W} ${ROOM_H}`}
          shapeRendering="crispEdges"
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden
        >
          {!lidUp &&
            STEAM.map(({ x, y, delay }, i) => (
              // White puff with a warm gray shadow, so it reads against the
              // cream shoji paper behind it.
              <g key={i} className="steam-puff" style={{ animationDelay: `${delay}s` }}>
                <rect x={x} y={y + 1} width={4} height={2} fill="#9c8a70" opacity={0.7} />
                <rect x={x + 1} y={y - 1} width={2} height={1} fill="#9c8a70" opacity={0.7} />
                <rect x={x} y={y} width={3} height={2} fill="#fff" />
                <rect x={x + 1} y={y - 1} width={1} height={1} fill="#fff" />
              </g>
            ))}
          <g
            style={{
              transform: `translate(${lid.x}px, ${lid.y}px)`,
              transition: "transform 260ms steps(3)",
            }}
          >
            <g className={lidUp ? "" : "lid-rattle"}>
              {DONABE_LID.map(([x, y, w, h, color], i) => (
                <rect key={i} x={x} y={y} width={w} height={h} fill={color} />
              ))}
              {/* Match the lantern's warm light on the canvas below */}
              {DONABE_LID.map(([x, y, w, h], i) => (
                <rect key={`glow${i}`} x={x} y={y} width={w} height={h} fill="#ffd28c" opacity={0.18} />
              ))}
            </g>
          </g>
        </svg>

        {!dialog && (
          <button
            onClick={openMats}
            aria-label="Open MATS"
            style={{
              left: pct(POT.x, ROOM_W),
              top: pct(POT.y, ROOM_H),
              width: pct(POT.w, ROOM_W),
              height: pct(POT.h, ROOM_H),
            }}
            className="absolute"
          />
        )}
        {!dialog && !matsVisited && (
          <HotspotTag
            name="MATS"
            onClick={openMats}
            style={{ left: pct(76, ROOM_W), top: pct(25, ROOM_H) }}
          />
        )}

        <button
          onClick={onLeave}
          className="pixel-font absolute top-3 left-3 text-[8px] bg-[#2b1d16] text-[#f4efe2] px-2 py-1.5 hover:bg-[#f2c230] hover:text-[#2b1d16]"
        >
          ← house
        </button>
      </div>

      {dialog && (
        <div
          key={dialog.title}
          role="dialog"
          aria-label={dialog.title}
          className="pixel-in mt-4 sm:mt-0 sm:absolute sm:inset-x-[7%] sm:top-[12%] bg-[#f4efe2] text-[#2b1d16] border-4 border-[#2b1d16] shadow-[6px_6px_0_#2b1d16]"
        >
          <div className="flex items-center justify-between gap-4 border-b-4 border-[#2b1d16] px-4 py-2">
            <span className="pixel-font text-[9px]">{dialog.title}</span>
            <button
              onClick={close}
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
            {text.slice(0, typed)}
          </p>
          <div className="flex items-center justify-between gap-4 px-4 pb-3 pt-2">
            <span className="pixel-font text-[8px] text-[#8a5a33]">
              {dialog.pages.length > 1 ? `${page + 1}/${dialog.pages.length}` : ""}
            </span>
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
  );
}
