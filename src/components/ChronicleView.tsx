"use client";

import { useState } from "react";
import Timeline from "./Timeline";
import WorldMap from "./WorldMap";

type View = "timeline" | "map";

export default function ChronicleView() {
  const [view, setView] = useState<View>("timeline");

  return (
    <div className="space-y-6 pt-4">
      {/* Toggle */}
      <div className="flex items-center gap-1 text-xs">
        <button
          onClick={() => setView("timeline")}
          className={`transition-colors ${
            view === "timeline"
              ? "text-[var(--foreground)]"
              : "text-[var(--muted)] hover:text-[var(--foreground)]"
          }`}
        >
          timeline
        </button>
        <span className="text-[var(--muted)] px-1">·</span>
        <button
          onClick={() => setView("map")}
          className={`transition-colors ${
            view === "map"
              ? "text-[var(--foreground)]"
              : "text-[var(--muted)] hover:text-[var(--foreground)]"
          }`}
        >
          map
        </button>
      </div>

      {view === "timeline" ? <Timeline /> : <WorldMap />}
    </div>
  );
}
