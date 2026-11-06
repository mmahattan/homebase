"use client";

import { useEffect, useRef, useState } from "react";
import HotspotTag from "@/components/HotspotTag";
import MatsBook from "@/components/MatsBook";
import PixelCanvas from "@/components/PixelCanvas";
import { BOOK, BOOK_H, BOOK_POS, BOOK_W, ROOM_H, ROOM_W, drawJapaneseRoom } from "@/lib/pixelScenes";
import { BUSINESS_WORLD_DEFINITION } from "@/data/businessWorld";

// The Business World's room: a traditional Japanese room. On arrival a
// game-style dialog types out the definition. Above the kotatsu floats MATS:
// a slowly spinning spellbook with a magical aura. Clicking it flies the book
// open (MatsBook).

const DEFINITION_TEXT = BUSINESS_WORLD_DEFINITION.join("\n\n");

// The canvas draws the room without the book; the book floats on top.
const drawRoom = (ctx: CanvasRenderingContext2D) => drawJapaneseRoom(ctx, 0, 0, { book: false });

const pct = (n: number, of: number) => `${(n / of) * 100}%`;
const CENTER = { x: BOOK_POS.x + BOOK_W / 2, y: BOOK_POS.y + BOOK_H / 2 };

// Sparkles drifting up around the book: [x, y, color, delay]
const SPARKLES: [number, number, string, number][] = [
  [52, 30, "#fff0a8", 0],
  [76, 26, "#c9b8ff", 0.4],
  [58, 18, "#ffffff", 0.9],
  [72, 34, "#fff0a8", 1.3],
  [50, 22, "#c9b8ff", 1.7],
  [78, 19, "#ffffff", 2.1],
  [64, 15, "#fff0a8", 0.6],
  [61, 36, "#c9b8ff", 1.9],
];

// Remembers per browser that MATS was opened: the "click me" bubble only
// shows until then. Kept for routing returning visitors later.
const MATS_VISITED_KEY = "kei:visited:mats";

export default function BusinessWorldRoom({
  onLeave,
  startWith,
}: {
  onLeave: () => void;
  // "mats": arriving from the quick menu, straight into the book.
  startWith?: "mats";
}) {
  const [dialog, setDialog] = useState(startWith !== "mats");
  const [typed, setTyped] = useState(0);
  const [bookFrom, setBookFrom] = useState<DOMRect | null>(null);
  const [bookOpen, setBookOpen] = useState(false);
  const [matsVisited, setMatsVisited] = useState(false);
  const bookRef = useRef<HTMLButtonElement>(null);

  const typing = dialog && typed < DEFINITION_TEXT.length;

  useEffect(() => {
    try {
      setMatsVisited(localStorage.getItem(MATS_VISITED_KEY) === "1");
    } catch {}
  }, []);

  function advance() {
    if (typing) setTyped(DEFINITION_TEXT.length);
    else setDialog(false);
  }

  function openBook() {
    setMatsVisited(true);
    try {
      localStorage.setItem(MATS_VISITED_KEY, "1");
    } catch {}
    setBookFrom(bookRef.current?.getBoundingClientRect() ?? null);
    setBookOpen(true);
  }

  useEffect(() => {
    if (startWith !== "mats") return;
    const id = requestAnimationFrame(openBook);
    return () => cancelAnimationFrame(id);
    // Only on arrival.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Typewriter
  useEffect(() => {
    if (!typing) return;
    const id = setTimeout(() => setTyped((n) => Math.min(n + 2, DEFINITION_TEXT.length)), 18);
    return () => clearTimeout(id);
  }, [typing, typed]);

  // Space advances the dialog; Escape closes it, then leaves the room.
  // (The open book handles its own keys.)
  useEffect(() => {
    if (bookOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === " " && dialog) {
        e.preventDefault();
        advance();
      } else if (e.key === "Escape") {
        if (dialog) setDialog(false);
        else onLeave();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="relative mx-auto max-w-[calc(75vh*16/9)]">
      <div className="relative aspect-video overflow-hidden">
        <PixelCanvas
          width={ROOM_W}
          height={ROOM_H}
          draw={drawRoom}
          label="The Business World: a Japanese room with shoji doors, tatami, a kotatsu with a floating book above it, and a shelf"
          className="absolute inset-0 w-full h-full"
        />
        <svg
          viewBox={`0 0 ${ROOM_W} ${ROOM_H}`}
          shapeRendering="crispEdges"
          className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-500 ${
            bookOpen ? "opacity-0" : "opacity-100"
          }`}
          aria-hidden
        >
          <defs>
            <radialGradient id="mats-aura">
              <stop offset="0%" stopColor="#ffd678" stopOpacity="0.7" />
              <stop offset="45%" stopColor="#b9a2ff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#b9a2ff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx={CENTER.x} cy={CENTER.y} r={17} fill="url(#mats-aura)" className="aura-pulse" />
          {SPARKLES.map(([x, y, color, delay], i) => (
            <rect key={i} x={x} y={y} width={1} height={1} fill={color} className="sparkle" style={{ animationDelay: `${delay}s` }} />
          ))}
          <g className="book-bob">
            <g className="book-spin">
              {BOOK.map(([x, y, w, h, color], i) => (
                <rect key={i} x={BOOK_POS.x + x} y={BOOK_POS.y + y} width={w} height={h} fill={color} />
              ))}
            </g>
          </g>
        </svg>

        {!dialog && !bookOpen && (
          <button
            ref={bookRef}
            onClick={openBook}
            aria-label="Open MATS"
            style={{
              left: pct(BOOK_POS.x - 2, ROOM_W),
              top: pct(BOOK_POS.y - 2, ROOM_H),
              width: pct(BOOK_W + 4, ROOM_W),
              height: pct(BOOK_H + 4, ROOM_H),
            }}
            className="absolute"
          />
        )}
        {!dialog && !bookOpen && !matsVisited && (
          <HotspotTag
            name="MATS"
            onClick={openBook}
            style={{ left: pct(BOOK_POS.x + BOOK_W + 2, ROOM_W), top: pct(BOOK_POS.y + 2, ROOM_H) }}
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
          role="dialog"
          aria-label="the business world"
          className="pixel-in mt-4 sm:mt-0 sm:absolute sm:inset-x-[7%] sm:top-[12%] bg-[#f4efe2] text-[#2b1d16] border-4 border-[#2b1d16] shadow-[6px_6px_0_#2b1d16]"
        >
          <div className="flex items-center justify-between gap-4 border-b-4 border-[#2b1d16] px-4 py-2">
            <span className="pixel-font text-[9px]">the business world</span>
            <button
              onClick={() => setDialog(false)}
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

      {bookOpen && <MatsBook from={bookFrom} onClose={() => setBookOpen(false)} />}
    </div>
  );
}
