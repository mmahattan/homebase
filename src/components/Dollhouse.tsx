"use client";

import { useState } from "react";
import PixelCanvas from "@/components/PixelCanvas";
import { HOUSE_H, HOUSE_W, ROOMS, ROOM_H, ROOM_W, ZOOM, drawHouse } from "@/lib/pixelScenes";

// Dollhouse for the House of Kei front page. Clicking the open room
// zooms the camera in, then hands off to that room (onEnter).

const rooms = ROOMS;
const openRoom = rooms.find((r) => r.open)!;

// Zoom so the open room's center lands in the frame's center at 3.5×.
const originX = ((openRoom.x + ROOM_W / 2) / HOUSE_W) * 100;
const originY = ((openRoom.y + ROOM_H / 2) / HOUSE_H) * 100;
const zoomed = `translate(${50 - originX}%, ${50 - originY}%) scale(${ZOOM})`;

const pct = (n: number, of: number) => `${(n / of) * 100}%`;

export default function Dollhouse({ onEnter }: { onEnter: () => void }) {
  const [zooming, setZooming] = useState(false);

  function enter() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) onEnter();
    else setZooming(true);
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-video mx-auto max-w-[calc(75vh*16/9)] overflow-hidden bg-[#9ec9e8]">
        <div
          className="absolute inset-0"
          style={{
            transform: zooming ? zoomed : "none",
            transformOrigin: `${originX}% ${originY}%`,
            transition: "transform 700ms ease-in-out",
          }}
          onTransitionEnd={() => zooming && onEnter()}
        >
          <PixelCanvas
            width={HOUSE_W}
            height={HOUSE_H}
            draw={drawHouse}
            className="absolute inset-0 w-full h-full"
          />

          {!zooming &&
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
                <div key={`${room.x}-${room.y}`} style={box} className="group absolute cursor-not-allowed">
                  <span className="pixel-font absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 whitespace-nowrap bg-[#2b1d16] text-[#f2c230] text-[7px] px-2 py-1 opacity-0 group-hover:opacity-100">
                    under construction
                  </span>
                </div>
              );
            })}
        </div>
      </div>

      <p className={`pixel-font text-[8px] text-[var(--muted)] text-center ${zooming ? "invisible" : ""}`}>
        click the open room to enter
      </p>
    </div>
  );
}
