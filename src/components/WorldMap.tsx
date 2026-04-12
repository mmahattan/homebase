"use client";

import { useEffect, useRef, useState } from "react";
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
  const [hovered, setHovered] = useState<{ place: Place; cityIndex: number } | null>(null);
  const [focused, setFocused] = useState<Place | null>(null);
  const mapRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    fetch(GEO_URL)
      .then((r) => r.json())
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((world: any) => {
        const countries = feature(world, world.objects.countries);
        setGeos((countries as unknown as GeoJSON.FeatureCollection).features);
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

  const landColor   = isDark ? "#222222" : "#e8e8e8";
  const strokeColor = isDark ? "#111111" : "#ffffff";
  const dotDefault  = isDark ? "#ffffff" : "#111111";
  const dotFocused  = isDark ? "#ffffff" : "#111111";
  const dotFaded    = isDark ? "#444444" : "#cccccc";

  function handleLegendClick(place: Place) {
    setFocused(place);
    mapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  const hoveredPlace = hovered?.place ?? null;
  const tooltipCity  = hovered != null ? hovered.place.cities[hovered.cityIndex] : null;

  return (
    <div className="space-y-4">
      {/* Map */}
      <svg ref={mapRef} viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
        {/* Land */}
        {geos.map((geo) => {
          const d = path(geo);
          if (!d) return null;
          return (
            <path
              key={String(geo.id ?? "")}
              d={d}
              fill={landColor}
              stroke={strokeColor}
              strokeWidth={0.5}
            />
          );
        })}

        {/* City dots */}
        {places.map((place) =>
          place.cities.map((city, i) => {
            const proj = projection([city.lon, city.lat]);
            if (!proj) return null;
            const [x, y] = proj;
            const isFocusedPlace = focused?.isoNumeric === place.isoNumeric;
            const isHovered = hoveredPlace?.isoNumeric === place.isoNumeric && hovered?.cityIndex === i;
            const hasFocus = focused !== null;

            const r = isHovered ? 5 : isFocusedPlace ? 4.5 : 3;
            const fill = hasFocus
              ? isFocusedPlace ? dotFocused : dotFaded
              : dotDefault;

            return (
              <circle
                key={`${place.isoNumeric}-${city.city}`}
                cx={x}
                cy={y}
                r={r}
                fill={fill}
                style={{ transition: "all 0.2s ease", cursor: "pointer" }}
                onMouseEnter={() => setHovered({ place, cityIndex: i })}
                onMouseLeave={() => setHovered(null)}
              />
            );
          })
        )}
      </svg>

      {/* Tooltip */}
      <div className="min-h-[2.5rem]">
        {tooltipCity ? (
          <p className="text-sm">
            <span className="font-medium">{tooltipCity.city}</span>
            <span className="text-[var(--muted)] ml-1">{hoveredPlace?.country}</span>
            {tooltipCity.dates && <span className="text-[var(--muted)] ml-2">{tooltipCity.dates}</span>}
            {tooltipCity.note && <span className="text-[var(--muted)] ml-2 opacity-60">— {tooltipCity.note}</span>}
          </p>
        ) : focused ? (
          <p className="text-sm">
            <span className="font-medium">{focused.country}</span>
            <span className="text-[var(--muted)] ml-2 text-xs">click elsewhere to clear</span>
          </p>
        ) : (
          <p className="text-xs text-[var(--muted)]">hover a dot · click a country below to focus</p>
        )}
      </div>

      {/* Legend */}
      <div
        className="border-t border-[var(--border)] pt-4 grid grid-cols-2 gap-x-8 gap-y-3"
        onClick={() => setFocused(null)}
      >
        {places.map((p) => (
          <div
            key={p.isoNumeric}
            className={`space-y-0.5 cursor-pointer transition-opacity duration-200 ${
              focused && focused.isoNumeric !== p.isoNumeric ? "opacity-30" : "opacity-100"
            }`}
            onClick={(e) => { e.stopPropagation(); handleLegendClick(p); }}
          >
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
