"use client";

import { useEffect, useState } from "react";
import PixelCanvas from "@/components/PixelCanvas";
import {
  DONABE_LID,
  LID_AJAR,
  POT_STEAM,
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

export default function BusinessWorldRoom({ onLeave }: { onLeave: () => void }) {
  const [dialog, setDialog] = useState<Dialog | null>(WORLD_DIALOG);
  const [page, setPage] = useState(0);
  const [typed, setTyped] = useState(0);
  const [lidUp, setLidUp] = useState(false);

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
    setLidUp(true);
    setTimeout(() => open(MATS_DIALOG), 280);
  }

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
            POT_STEAM.map(([x, y], i) => (
              <rect
                key={i}
                x={x}
                y={y}
                width={i % 2 ? 2 : 1}
                height={i % 2 ? 1 : 2}
                fill="#fff"
                className="steam-puff"
                style={{ animationDelay: `${i * 0.6}s` }}
              />
            ))}
          <g
            style={{
              transform: `translate(${lid.x}px, ${lid.y}px)`,
              transition: "transform 260ms steps(3)",
            }}
          >
            {DONABE_LID.map(([x, y, w, h, color], i) => (
              <rect key={i} x={x} y={y} width={w} height={h} fill={color} />
            ))}
            {/* Match the lantern's warm light on the canvas below */}
            {DONABE_LID.map(([x, y, w, h], i) => (
              <rect key={`glow${i}`} x={x} y={y} width={w} height={h} fill="#ffd28c" opacity={0.18} />
            ))}
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
            className="group absolute outline-[3px] outline-transparent hover:outline-[#f2c230] focus-visible:outline-[#f2c230]"
          >
            <span className="pixel-font absolute left-1/2 -translate-x-1/2 -top-8 whitespace-nowrap bg-[#2b1d16] text-[#f4efe2] text-[9px] px-2 py-1 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100">
              mats
            </span>
          </button>
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
