"use client";

import { useState } from "react";
import Timeline from "./Timeline";
import WorldMap from "./WorldMap";

type View = "map" | "timeline";

export default function ChronicleView() {
  const [view, setView] = useState<View>("map");

  return (
    <div className="space-y-6 pt-4">
      <div className="flex items-center gap-1 text-xs">
        <button
          onClick={() => setView("map")}
          className={`transition-colors ${
            view === "map"
              ? "text-[var(--foreground)]"
              : "text-[var(--muted)] hover:text-[var(--foreground)]"
          }`}
        >
          where i&apos;ve been
        </button>
        <span className="text-[var(--muted)] px-1">·</span>
        <button
          onClick={() => setView("timeline")}
          className={`transition-colors ${
            view === "timeline"
              ? "text-[var(--foreground)]"
              : "text-[var(--muted)] hover:text-[var(--foreground)]"
          }`}
        >
          what i&apos;ve done
        </button>
      </div>

      {view === "map" ? <WorldMap /> : <Timeline />}
    </div>
  );
}
