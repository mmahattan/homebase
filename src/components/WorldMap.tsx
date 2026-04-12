"use client";

import { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { places } from "@/data/places";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function WorldMap() {
  const [isDark, setIsDark] = useState(false);
  const [tooltip, setTooltip] = useState<{ country: string; dates: string } | null>(null);

  useEffect(() => {
    const update = () =>
      setIsDark(document.documentElement.getAttribute("data-theme") === "dark");
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => obs.disconnect();
  }, []);

  const visitedMap = new Map(places.map((p) => [p.isoNumeric, p]));

  const colors = {
    visited:   isDark ? "#ffffff" : "#111111",
    unvisited: isDark ? "#2a2a2a" : "#e5e5e5",
    hover:     isDark ? "#aaaaaa" : "#555555",
    stroke:    isDark ? "#111111" : "#ffffff",
  };

  return (
    <div className="space-y-3">
      <ComposableMap
        projectionConfig={{ scale: 140 }}
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const place = visitedMap.get(geo.id?.toString());
              const isVisited = !!place;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => {
                    if (place)
                      setTooltip({ country: place.country, dates: place.dates });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                  style={{
                    default: {
                      fill: isVisited ? colors.visited : colors.unvisited,
                      stroke: colors.stroke,
                      strokeWidth: 0.5,
                      outline: "none",
                      transition: "fill 0.2s ease",
                    },
                    hover: {
                      fill: isVisited ? colors.hover : colors.unvisited,
                      stroke: colors.stroke,
                      strokeWidth: 0.5,
                      outline: "none",
                      cursor: isVisited ? "pointer" : "default",
                    },
                    pressed: { outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Tooltip */}
      <div className="h-5">
        {tooltip && (
          <p className="text-sm">
            <span className="font-medium">{tooltip.country}</span>
            <span className="text-[var(--muted)] ml-2">{tooltip.dates}</span>
          </p>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-6 gap-y-1 pt-2">
        {places.map((p) => (
          <span key={p.isoNumeric} className="text-xs text-[var(--muted)]">
            {p.country}
            <span className="ml-1 opacity-60">{p.dates}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
