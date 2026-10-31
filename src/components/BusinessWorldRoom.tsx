"use client";

import { useEffect, useState } from "react";
import PixelCanvas from "@/components/PixelCanvas";
import { ROOM_H, ROOM_W, drawJapaneseRoom } from "@/lib/pixelScenes";
import { BUSINESS_WORLD_DEFINITION } from "@/data/businessWorld";

// The Business World's room: a traditional Japanese room. On arrival a
// game-style dialog types out the definition. MATS gets its own space here later.

const DEFINITION_TEXT = BUSINESS_WORLD_DEFINITION.join("\n\n");
const drawRoom = (ctx: CanvasRenderingContext2D) => drawJapaneseRoom(ctx);

export default function BusinessWorldRoom({ onLeave }: { onLeave: () => void }) {
  const [popup, setPopup] = useState(true);
  const [typed, setTyped] = useState(0);
  const typing = popup && typed < DEFINITION_TEXT.length;

  function advance() {
    if (typing) setTyped(DEFINITION_TEXT.length);
    else setPopup(false);
  }

  // Typewriter
  useEffect(() => {
    if (!typing) return;
    const id = setTimeout(() => setTyped((n) => Math.min(n + 2, DEFINITION_TEXT.length)), 18);
    return () => clearTimeout(id);
  }, [typing, typed]);

  // Space advances the dialog; Escape closes it, then leaves the room.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === " " && popup) {
        e.preventDefault();
        advance();
      } else if (e.key === "Escape") {
        if (popup) setPopup(false);
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
          label="The Business World: a Japanese room with shoji doors, tatami, a kotatsu and a shelf"
          className="absolute inset-0 w-full h-full"
        />
        <button
          onClick={onLeave}
          className="pixel-font absolute top-3 left-3 text-[8px] bg-[#2b1d16] text-[#f4efe2] px-2 py-1.5 hover:bg-[#f2c230] hover:text-[#2b1d16]"
        >
          ← house
        </button>
      </div>

      {popup && (
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
  );
}
