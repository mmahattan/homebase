"use client";

import { useEffect, useRef, useState } from "react";
import { places } from "@/data/places";
import type { Place } from "@/data/places";

type CityEntry = {
  id: string;
  city: string;
  country: string;
  dates?: string;
  note?: string;
  startYear: number | null;
  ongoing: boolean;
  isHome: boolean;
  place: Place;
  cityIndex: number;
};

type Props = {
  onCityClick?: (place: Place, cityIndex: number) => void;
  activeCity?: string; // id of pinned city from map
};

const HOME_CITIES = new Set(["Bangkok", "Stockholm"]);

function extractMinYear(dates?: string): number | null {
  if (!dates) return null;
  const matches = [...dates.matchAll(/\d{4}/g)].map((m) => parseInt(m[0]));
  return matches.length > 0 ? Math.min(...matches) : null;
}

function buildEntries(): CityEntry[] {
  const all: CityEntry[] = [];
  for (const place of places) {
    place.cities.forEach((city, i) => {
      const baseId = `${place.isoNumeric}-${city.city}`;
      // Detect comma-separated year list e.g. "2006, 2014, 2016"
      const isMultiYear = /^\d{4}(,\s*\d{4})+$/.test(city.dates ?? "");
      if (isMultiYear && city.dates) {
        city.dates.split(",").map((y) => y.trim()).forEach((year) => {
          all.push({
            id: `${baseId}-${year}`,
            city: city.city,
            country: place.country,
            dates: year,
            note: city.note,
            startYear: parseInt(year),
            ongoing: false,
            isHome: HOME_CITIES.has(city.city),
            place,
            cityIndex: i,
          });
        });
      } else {
        all.push({
          id: baseId,
          city: city.city,
          country: place.country,
          dates: city.dates,
          note: city.note,
          startYear: extractMinYear(city.dates),
          ongoing: city.dates?.includes("present") ?? false,
          isHome: HOME_CITIES.has(city.city),
          place,
          cityIndex: i,
        });
      }
    });
  }
  return all;
}

const allEntries = buildEntries();

const homeEntries = ["Bangkok", "Stockholm"].map(
  (name) => allEntries.find((e) => e.city === name)!
);

const otherEntries = allEntries
  .filter((e) => !e.isHome)
  .sort((a, b) => {
    if (a.startYear === null && b.startYear === null) return 0;
    if (a.startYear === null) return 1;
    if (b.startYear === null) return -1;
    return a.startYear - b.startYear;
  });

export default function TravelTimeline({ onCityClick, activeCity }: Props) {
  const [activeId, setActiveId]     = useState<string | null>(null);
  const refs                        = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollContainerRef          = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = scrollContainerRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (observed) => {
        observed.forEach((entry) => {
          if (entry.isIntersecting)
            setActiveId(entry.target.getAttribute("data-id"));
        });
      },
      { root, rootMargin: "-35% 0px -35% 0px", threshold: 0 }
    );
    Object.values(refs.current).forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  function scrollToEntry(id: string) {
    const container = scrollContainerRef.current;
    const el = refs.current[id];
    if (!container || !el) return;
    const offset = el.offsetTop - container.clientHeight / 2 + el.clientHeight / 2;
    container.scrollTo({ top: offset, behavior: "smooth" });
  }

  // When map pins a city, sync highlight and scroll to entry
  useEffect(() => {
    if (!activeCity) return;
    const all = [...homeEntries, ...otherEntries];
    const match = all.find((e) => e.id === activeCity || e.id.startsWith(activeCity + "-"));
    if (match) {
      setActiveId(match.id);
      scrollToEntry(match.id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCity]);

  function renderEntry(entry: CityEntry) {
    const isActive = activeId === entry.id;
    return (
      <div
        key={entry.id}
        data-id={entry.id}
        ref={(el) => { refs.current[entry.id] = el; }}
        onClick={() => {
          setActiveId(entry.id);
          scrollToEntry(entry.id);
          onCityClick?.(entry.place, entry.cityIndex);
        }}
        className={`relative pl-7 pb-10 last:pb-2 transition-all duration-500 ease-out cursor-pointer ${
          activeId === null || isActive ? "opacity-100" : "opacity-25"
        }`}
      >
        {/* dot */}
        <div
          className={`absolute -left-[5px] top-1 rounded-full border-2 transition-all duration-500 ${
            isActive ? "w-3.5 h-3.5 -left-[6px]" : "w-2.5 h-2.5"
          } ${
            entry.ongoing || entry.isHome
              ? "border-[var(--foreground)] bg-[var(--foreground)]"
              : "border-[var(--muted)] bg-[var(--background)]"
          }`}
        />
        <div
          className={`transition-all duration-500 ease-out ${
            isActive ? "translate-x-2" : "translate-x-0"
          }`}
        >
          {entry.dates && (
            <span className="text-xs text-[var(--muted)]">{entry.dates}</span>
          )}
          <p
            className={`leading-snug transition-all duration-500 ${
              isActive ? "text-base font-semibold mt-0.5" : "text-sm font-medium mt-0.5"
            }`}
          >
            {entry.city}
          </p>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            {entry.country}
            {entry.note && (
              <span className="ml-1.5 opacity-70 italic">— {entry.note}</span>
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={scrollContainerRef}
      className="overflow-y-auto h-[420px] pr-2"
      style={{ scrollbarWidth: "none" }}
    >
    <div className="relative border-l border-[var(--border)] ml-1.5">
      {/* Home section */}
      <div className="pl-7 pb-3 pt-1">
        <span className="text-xs uppercase tracking-widest text-[var(--muted)]">home</span>
      </div>
      {homeEntries.map(renderEntry)}

      {/* Divider */}
      <div className="pl-7 pb-3 pt-2">
        <div className="border-t border-[var(--border)] w-full" />
      </div>

      {/* Chronological entries */}
      {otherEntries.map(renderEntry)}
    </div>
    </div>
  );
}
