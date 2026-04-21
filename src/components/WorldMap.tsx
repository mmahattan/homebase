"use client";

import { useEffect, useRef, useState } from "react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import { places, type Place } from "@/data/places";
import TravelTimeline from "./TravelTimeline";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const W = 800;
const H = 400;

type GeoFeature  = GeoJSON.Feature<GeoJSON.Geometry>;
type Transform   = { x: number; y: number; k: number };
type MousePos    = { x: number; y: number };
type PinnedCity  = { place: Place; cityIndex: number; pos: { x: number; y: number } };

export default function WorldMap() {
  const [geos, setGeos]             = useState<GeoFeature[]>([]);
  const [isDark, setIsDark]         = useState(false);
  const [hovered, setHovered]       = useState<{ place: Place; cityIndex: number } | null>(null);
  const [focused, setFocused]       = useState<Place | null>(null);
  const [pinnedCity, setPinnedCity] = useState<PinnedCity | null>(null);
  const [tf, setTf]                 = useState<Transform>({ x: 0, y: 0, k: 1 });
  const [mousePos, setMousePos]     = useState<MousePos>({ x: 0, y: 0 });
  const tfRef                       = useRef<Transform>({ x: 0, y: 0, k: 1 });
  const containerRef                = useRef<HTMLDivElement>(null);
  const mapRef                      = useRef<SVGSVGElement>(null);
  const dragRef                     = useRef<{ startX: number; startY: number; tx: number; ty: number } | null>(null);
  const animFrameRef                = useRef<number | null>(null);
  const clearPinRef                 = useRef<() => void>(() => {});
  const [dragging, setDragging]     = useState(false);

  clearPinRef.current = () => setPinnedCity(null);

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
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      clearPinRef.current();
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

  function animateTo(target: Transform) {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    const start = { ...tfRef.current };
    const startTime = performance.now();
    const duration = 550;
    const ease = (t: number) => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;
    function frame(now: number) {
      const t = Math.min((now - startTime) / duration, 1);
      const e = ease(t);
      const next = {
        x: start.x + (target.x - start.x) * e,
        y: start.y + (target.y - start.y) * e,
        k: start.k + (target.k - start.k) * e,
      };
      tfRef.current = next;
      setTf({ ...next });
      if (t < 1) animFrameRef.current = requestAnimationFrame(frame);
    }
    animFrameRef.current = requestAnimationFrame(frame);
  }

  function onMouseDown(e: React.MouseEvent<SVGSVGElement>) {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setPinnedCity(null);
    dragRef.current = { startX: e.clientX, startY: e.clientY, tx: tfRef.current.x, ty: tfRef.current.y };
    setDragging(true);
  }

  function onMouseMove(e: React.MouseEvent<SVGSVGElement>) {
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

  const projection = geoNaturalEarth1().scale(140).translate([W / 2, H / 2]);
  const path       = geoPath().projection(projection);
  const land       = isDark ? "#222222" : "#e8e8e8";
  const stroke     = isDark ? "#111111" : "#ffffff";
  const dotOn      = isDark ? "#ffffff" : "#111111";
  const dotOff     = isDark ? "#444444" : "#cccccc";
  const hasFocus   = focused !== null;

  const hoveredPlace = hovered?.place ?? null;
  const hoveredCity  = hovered != null ? hovered.place.cities[hovered.cityIndex] : null;

  const containerW = containerRef.current?.getBoundingClientRect().width ?? 600;
  const popupLeft  = mousePos.x > containerW * 0.6;

  const popupCity  = hoveredCity ?? (pinnedCity ? pinnedCity.place.cities[pinnedCity.cityIndex] : null);
  const popupPlace = hoveredCity ? hoveredPlace : (pinnedCity?.place ?? null);
  const popupPos   = hoveredCity
    ? { x: mousePos.x, y: mousePos.y - 12, flipLeft: popupLeft }
    : pinnedCity
    ? { x: pinnedCity.pos.x, y: pinnedCity.pos.y, flipLeft: false }
    : null;

  // id of the currently pinned city (to sync TravelTimeline highlight)
  const pinnedId = pinnedCity
    ? `${pinnedCity.place.isoNumeric}-${pinnedCity.place.cities[pinnedCity.cityIndex].city}`
    : undefined;

  function handleCitySelect(place: Place, cityIndex: number, k = 1.5) {
    const city = place.cities[cityIndex];
    const proj = projection([city.lon, city.lat]);
    if (proj) {
      const [cx, cy] = proj;
      animateTo({ x: W / 2 - cx * k, y: H / 2 - cy * k, k });
    }
    const rect = containerRef.current?.getBoundingClientRect();
    const px = (rect?.width  ?? 600) / 2;
    const py = (rect?.height ?? 300) / 2 - 16;
    setFocused(place);
    setPinnedCity({ place, cityIndex, pos: { x: px, y: py } });
    mapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="space-y-4">
      {/* Map */}
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
                const isHov    = hoveredPlace?.isoNumeric === place.isoNumeric && hovered?.cityIndex === i;
                const isPinned = pinnedCity?.place.isoNumeric === place.isoNumeric && pinnedCity?.cityIndex === i;
                const isFoc    = focused?.isoNumeric === place.isoNumeric;
                const active   = isHov || isFoc || isPinned;
                const color    = hasFocus ? (isFoc ? dotOn : dotOff) : dotOn;
                const innerR   = active ? 3.5 : 2.5;
                const outerR   = active ? 7   : 5.5;
                const sw       = (active ? 1.2 : 0.8) / tf.k;
                return (
                  <g
                    key={`${place.isoNumeric}-${city.city}`}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setHovered({ place, cityIndex: i })}
                    onMouseLeave={() => setHovered(null)}
                    onClick={(e) => { e.stopPropagation(); handleCitySelect(place, i, 3); }}
                  >
                    <circle cx={cx} cy={cy} r={outerR} fill="none" stroke={color} strokeWidth={sw} opacity={active ? 0.6 : 0.4} style={{ transition: "all 0.2s ease" }} />
                    <circle cx={cx} cy={cy} r={innerR} fill={color} style={{ transition: "all 0.2s ease" }} />
                  </g>
                );
              })
            )}
          </g>
        </svg>

        {/* Popup */}
        {popupCity && popupPos && (
          <div
            className="absolute z-10 pointer-events-none"
            style={{
              top:       popupPos.y,
              left:      popupPos.flipLeft ? popupPos.x - 16 : popupPos.x + 16,
              transform: popupPos.flipLeft ? "translate(-100%, -100%)" : "translateY(-100%)",
            }}
          >
            <div className="bg-[var(--background)] border border-[var(--border)] rounded px-3 py-2.5 shadow-sm space-y-1 min-w-[160px]">
              <div>
                <p className="text-sm font-medium leading-tight">{popupCity.city}</p>
                <p className="text-xs text-[var(--muted)]">{popupPlace?.country}</p>
              </div>
              {popupCity.dates && (
                <p className="text-xs text-[var(--muted)]">{popupCity.dates}</p>
              )}
              {popupCity.note && (
                <p className="text-xs text-[var(--muted)] opacity-70 italic">{popupCity.note}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Hint */}
      <p className="text-xs text-[var(--muted)]">
        {focused ? (
          <>
            {focused.country} —{" "}
            <button
              className="underline underline-offset-2 hover:text-[var(--foreground)] transition-colors"
              onClick={() => { setFocused(null); setPinnedCity(null); }}
            >
              clear
            </button>
          </>
        ) : (
          "hover a dot · scroll to zoom · drag to pan · click below to navigate"
        )}
      </p>

      {/* Travel timeline replaces legend */}
      <div className="border-t border-[var(--border)] pt-4">
        <TravelTimeline onCityClick={handleCitySelect} activeCity={pinnedId} focusedIso={focused?.isoNumeric} />
      </div>
    </div>
  );
}
