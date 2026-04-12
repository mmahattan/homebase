"use client";

import { useEffect, useState } from "react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import { places, type Place } from "@/data/places";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const W = 800;
const H = 400;

type GeoFeature = GeoJSON.Feature<GeoJSON.Geometry>;

export default function WorldMap() {
  const [geos, setGeos] = useState<GeoFeature[]>([]);
  const [isDark, setIsDark] = useState(false);
  const [hovered, setHovered] = useState<Place | null>(null);

  useEffect(() => {
    fetch(GEO_URL)
      .then((r) => r.json())
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((world: any) => {
        const countries = feature(world, world.objects.countries);
        setGeos((countries as GeoJSON.FeatureCollection).features);
      });
  }, []);

  useEffect(() => {
    const update = () =>
      setIsDark(document.documentElement.getAttribute("data-theme") === "dark");
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  const projection = geoNaturalEarth1().scale(140).translate([W / 2, H / 2]);
  const path = geoPath().projection(projection);
  const visitedMap = new Map(places.map((p) => [p.isoNumeric, p]));

  const fill = (id: string, isHovered: boolean) => {
    if (isHovered) return isDark ? "#aaaaaa" : "#555555";
    if (visitedMap.has(id)) return isDark ? "#ffffff" : "#111111";
    return isDark ? "#2a2a2a" : "#e5e5e5";
  };

  return (
    <div className="space-y-4">
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
        {geos.map((geo) => {
          const id = String(geo.id ?? "");
          const place = visitedMap.get(id);
          const d = path(geo);
          if (!d) return null;
          return (
            <path
              key={id}
              d={d}
              fill={fill(id, hovered?.isoNumeric === id)}
              stroke={isDark ? "#111111" : "#ffffff"}
              strokeWidth={0.5}
              style={{ transition: "fill 0.2s ease", cursor: place ? "pointer" : "default" }}
              onMouseEnter={() => { if (place) setHovered(place); }}
              onMouseLeave={() => setHovered(null)}
            />
          );
        })}
      </svg>

      {/* Hover tooltip */}
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
