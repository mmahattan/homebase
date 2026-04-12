"use client";

import { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { places, type Place } from "@/data/places";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function WorldMap() {
  const [isDark, setIsDark] = useState(false);
  const [hovered, setHovered] = useState<Place | null>(null);

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
    hovered:   isDark ? "#aaaaaa" : "#555555",
    stroke:    isDark ? "#111111" : "#ffffff",
  };

  return (
    <div className="space-y-4">
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
                  onMouseEnter={() => { if (place) setHovered(place); }}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    default: {
                      fill: isVisited ? colors.visited : colors.unvisited,
                      stroke: colors.stroke,
                      strokeWidth: 0.5,
                      outline: "none",
                      transition: "fill 0.2s ease",
                    },
                    hover: {
                      fill: isVisited ? colors.hovered : colors.unvisited,
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
      <div className="min-h-[3rem]">
        {hovered ? (
          <div className="space-y-1">
            <p className="text-sm font-medium">{hovered.country}</p>
            <ul className="space-y-0.5">
              {hovered.cities.map((c) => (
                <li key={c.city} className="text-xs text-[var(--muted)]">
                  {c.city}
                  {c.dates && <span className="ml-1.5">{c.dates}</span>}
                  {c.note && <span className="ml-1.5 opacity-60">— {c.note}</span>}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-xs text-[var(--muted)]">hover a country</p>
        )}
      </div>

      {/* Legend */}
      <div className="border-t border-[var(--border)] pt-4 grid grid-cols-2 gap-x-8 gap-y-3">
        {places.map((p) => (
          <div key={p.isoNumeric} className="space-y-0.5">
            <p className="text-xs font-medium">{p.country}</p>
            {p.cities.map((c) => (
              <p key={c.city} className="text-xs text-[var(--muted)]">
                {c.city}
                {c.dates && <span className="ml-1.5">{c.dates}</span>}
                {c.note && <span className="ml-1.5 opacity-60">— {c.note}</span>}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
