"use client";

import { useEffect, useRef, useState } from "react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import { places, type Place } from "@/data/places";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const W = 800;
const H = 400;

type GeoFeature  = GeoJSON.Feature<GeoJSON.Geometry>;
type Transform   = { x: number; y: number; k: number };
type MousePos    = { x: number; y: number };

export default function WorldMap() {
  const [geos, setGeos]         = useState<GeoFeature[]>([]);
  const [isDark, setIsDark]     = useState(false);
  const [hovered, setHovered]   = useState<{ place: Place; cityIndex: number } | null>(null);
  const [focused, setFocused]   = useState<Place | null>(null);
  const [tf, setTf]             = useState<Transform>({ x: 0, y: 0, k: 1 });
  const [mousePos, setMousePos] = useState<MousePos>({ x: 0, y: 0 });
  const tfRef                   = useRef<Transform>({ x: 0, y: 0, k: 1 });
  const containerRef            = useRef<HTMLDivElement>(null);
  const mapRef                  = useRef<SVGSVGElement>(null);
  const dragRef                 = useRef<{ startX: number; startY: number; tx: number; ty: number } | null>(null);
  const [dragging, setDragging] = useState(false);

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

  useEffect(() => {
    const svg = mapRef.current;
    if (!svg) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const { x, y, k } = tfRef.current;
      const delta = e.ctrlKey ? -e.deltaY * 0.02 : -e.deltaY * 0.001;
      const newK  = Math.max(1, Math.min(10, k * Math.exp(delta)));
      const rect  = svg.getBoundingClientRect();
      const mx    = ((e.clientX - rect.left) / rect.width) * W;
      const my    = ((e.clientY - rect.top)  / rect.height) * H;
      const next  = { x: mx - (mx - x) * (newK / k), y: my - (my - y) * (newK / k), k: newK };
      tfRef.current = next;
      setTf(next);
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, []);

  function onMouseDown(e: React.MouseEvent<SVGSVGElement>) {
    dragRef.current = { startX: e.clientX, startY: e.clientY, tx: tfRef.current.x, ty: tfRef.current.y };
    setDragging(true);
  }

  function onMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    // Track cursor position relative to the container for popup placement
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });

    if (!dragRef.current) return;
    const dx   = e.clientX - dragRef.current.startX;
    const dy   = e.clientY - dragRef.current.startY;
    const next = { ...tfRef.current, x: dragRef.current.tx + dx, y: dragRef.current.ty + dy };
    tfRef.current = next;
    setTf(next);
  }

  function onMouseUp() {
    dragRef.current = null;
    setDragging(false);
  }

  const projection   = geoNaturalEarth1().scale(140).translate([W / 2, H / 2]);
  const path         = geoPath().projection(projection);
  const land         = isDark ? "#222222" : "#e8e8e8";
  const stroke       = isDark ? "#111111" : "#ffffff";
  const dotOn        = isDark ? "#ffffff" : "#111111";
  const dotOff       = isDark ? "#444444" : "#cccccc";
  const hasFocus     = focused !== null;
  const hoveredPlace = hovered?.place ?? null;
  const hoveredCity  = hovered != null ? hovered.place.cities[hovered.cityIndex] : null;

  // Flip popup left if cursor is in right half of container
  const containerW   = containerRef.current?.getBoundingClientRect().width ?? 600;
  const popupLeft    = mousePos.x > containerW * 0.6;

  function handleLegendClick(place: Place) {
    setFocused(place);
    mapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <div className="space-y-4">
      {/* Map container — relative so popup can be absolutely positioned */}
      <div ref={containerRef} className="relative">
        <svg
          ref={mapRef}
          viewBox={`0 0 ${W} ${H}`}
          style={{ width: "100%", height: "auto", cursor: dragging ? "grabbing" : "grab", userSelect: "none" }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={() => { onMouseUp(); setHovered(null); }}
        >
          <g transform={`translate(${tf.x},${tf.y}) scale(${tf.k})`}>
            {geos.map((geo) => {
              const d = path(geo);
              if (!d) return null;
              return (
                <path
                  key={String(geo.id ?? "")}
                  d={d}
                  fill={land}
                  stroke={stroke}
                  strokeWidth={0.5 / tf.k}
                />
              );
            })}

            {places.map((place) =>
              place.cities.map((city, i) => {
                const proj = projection([city.lon, city.lat]);
                if (!proj) return null;
                const [cx, cy] = proj;
                const isHov  = hoveredPlace?.isoNumeric === place.isoNumeric && hovered?.cityIndex === i;
                const isFoc  = focused?.isoNumeric === place.isoNumeric;
                const active = isHov || isFoc;
                const color  = hasFocus ? (isFoc ? dotOn : dotOff) : dotOn;
                const innerR = (active ? 3.5 : 2.5) / tf.k;
                const outerR = (active ? 7   : 5.5) / tf.k;
                const sw     = (active ? 1.2 : 0.8) / tf.k;
                return (
                  <g
                    key={`${place.isoNumeric}-${city.city}`}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setHovered({ place, cityIndex: i })}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <circle cx={cx} cy={cy} r={outerR} fill="none" stroke={color} strokeWidth={sw} opacity={active ? 0.6 : 0.4} style={{ transition: "all 0.2s ease" }} />
                    <circle cx={cx} cy={cy} r={innerR} fill={color} style={{ transition: "all 0.2s ease" }} />
                  </g>
                );
              })
            )}
          </g>
        </svg>

        {/* Floating popup */}
        {hoveredCity && (
          <div
            className="absolute z-10 pointer-events-none"
            style={{
              top:   mousePos.y - 12,
              left:  popupLeft ? mousePos.x - 16 : mousePos.x + 16,
              transform: popupLeft ? "translate(-100%, -100%)" : "translateY(-100%)",
            }}
          >
            <div className="bg-[var(--background)] border border-[var(--border)] rounded px-3 py-2.5 shadow-sm space-y-1 min-w-[160px]">
              <div>
                <p className="text-sm font-medium leading-tight">{hoveredCity.city}</p>
                <p className="text-xs text-[var(--muted)]">{hoveredPlace?.country}</p>
              </div>
              {hoveredCity.dates && (
                <p className="text-xs text-[var(--muted)]">{hoveredCity.dates}</p>
              )}
              {hoveredCity.note && (
                <p className="text-xs text-[var(--muted)] opacity-70 italic">{hoveredCity.note}</p>
              )}
              {/* Photos slot — populate in the future */}
            </div>
          </div>
        )}
      </div>

      {/* Hint */}
      <p className="text-xs text-[var(--muted)]">
        {focused
          ? `${focused.country} — click background to clear`
          : "hover a dot · scroll to zoom · drag to pan · click a country below to focus"}
      </p>

      {/* Legend */}
      <div
        className="border-t border-[var(--border)] pt-4 grid grid-cols-2 gap-x-8 gap-y-3"
        onClick={() => setFocused(null)}
      >
        {places.map((p) => (
          <div
            key={p.isoNumeric}
            className={`space-y-0.5 cursor-pointer transition-opacity duration-200 ${
              hasFocus && focused?.isoNumeric !== p.isoNumeric ? "opacity-30" : "opacity-100"
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
