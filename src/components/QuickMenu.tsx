"use client";

import { useEffect, useState } from "react";
import PixelCanvas from "@/components/PixelCanvas";
import { HOUSE_H, HOUSE_W, drawHouse } from "@/lib/pixelScenes";

// Game-style start menu over a dimmed view of the house: the fast way in for
// returning visitors.

export type EntryTarget = "world" | "mats";

type Item = { label: string; to?: EntryTarget; indent?: boolean };

const items: Item[] = [
  { label: "the business world", to: "world" },
  { label: "mats", to: "mats", indent: true },
  { label: "under construction" },
];

const selectable = items.map((item, i) => (item.to ? i : -1)).filter((i) => i >= 0);

export default function QuickMenu({ onPick }: { onPick: (to: EntryTarget) => void }) {
  const [cursor, setCursor] = useState(selectable[0]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const at = selectable.indexOf(cursor);
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const step = e.key === "ArrowDown" ? 1 : -1;
        setCursor(selectable[(at + step + selectable.length) % selectable.length]);
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const to = items[cursor].to;
        if (to) onPick(to);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cursor, onPick]);

  return (
    <div className="relative aspect-video mx-auto max-w-[calc(75vh*16/9)] overflow-hidden">
      <PixelCanvas width={HOUSE_W} height={HOUSE_H} draw={drawHouse} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 bg-[#1a110c]/75" />

      <div className="absolute inset-0 flex flex-col justify-center gap-6 px-[8%]">
        <p className="pixel-font text-[11px] sm:text-sm text-[#f2c230] tracking-widest">house of kei</p>
        <ul className="space-y-3 sm:space-y-4">
          {items.map((item, i) => {
            const active = i === cursor;
            return (
              <li key={item.label} className={item.indent ? "pl-6" : ""}>
                {item.to ? (
                  <button
                    onClick={() => onPick(item.to!)}
                    onMouseEnter={() => setCursor(i)}
                    className={`pixel-font text-[9px] sm:text-[11px] flex items-center gap-3 ${
                      active ? "text-[#f4efe2]" : "text-[#b3a593]"
                    }`}
                  >
                    <span className={active ? "" : "invisible"}>▸</span>
                    {item.label}
                  </button>
                ) : (
                  <span className="pixel-font text-[9px] sm:text-[11px] flex items-center gap-3 text-[#6b5d50] cursor-not-allowed">
                    <span className="invisible">▸</span>
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
        <p className="pixel-font text-[7px] sm:text-[8px] text-[#8a7b6c]">↑↓ choose · space to enter</p>
      </div>
    </div>
  );
}
