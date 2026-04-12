"use client";

import { useState } from "react";
import Timeline from "./Timeline";
import WorldMap from "./WorldMap";
import TravelTimeline from "./TravelTimeline";

type View = "timeline" | "map" | "places";

export default function ChronicleView() {
  const [view, setView] = useState<View>("timeline");

  const tabs: { id: View; label: string }[] = [
    { id: "timeline", label: "timeline" },
    { id: "map",      label: "map"      },
    { id: "places",   label: "places"   },
  ];

  return (
    <div className="space-y-6 pt-4">
      {/* Toggle */}
      <div className="flex items-center gap-1 text-xs">
        {tabs.map((tab, i) => (
          <span key={tab.id} className="flex items-center gap-1">
            {i > 0 && <span className="text-[var(--muted)]">·</span>}
            <button
              onClick={() => setView(tab.id)}
              className={`transition-colors ${
                view === tab.id
                  ? "text-[var(--foreground)]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {tab.label}
            </button>
          </span>
        ))}
      </div>

      {view === "timeline" && <Timeline />}
      {view === "map"      && <WorldMap />}
      {view === "places"   && <TravelTimeline />}
    </div>
  );
}
