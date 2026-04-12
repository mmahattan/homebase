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
      all.push({
        id: `${place.isoNumeric}-${city.city}`,
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
  const [activeId, setActiveId] = useState<string | null>(null);
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (observed) => {
        observed.forEach((entry) => {
          if (entry.isIntersecting)
            setActiveId(entry.target.getAttribute("data-id"));
        });
      },
      { rootMargin: "-35% 0px -35% 0px", threshold: 0 }
    );
    Object.values(refs.current).forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  // When map pins a city, sync activeId
  useEffect(() => {
    if (activeCity) setActiveId(activeCity);
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
  );
}
