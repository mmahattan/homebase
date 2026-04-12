"use client";

import { useEffect, useRef, useState } from "react";
import { places } from "@/data/places";
import type { Place } from "@/data/places";

type TravelEntry = {
  id: string;
  place: Place;
  startYear: number | null;
  displayDate: string;
  ongoing: boolean;
};

function extractYears(dates?: string): number[] {
  if (!dates) return [];
  return [...dates.matchAll(/\d{4}/g)].map((m) => parseInt(m[0]));
}

function buildEntries(): TravelEntry[] {
  return places
    .map((place) => {
      const allYears = place.cities.flatMap((c) => extractYears(c.dates));
      const ongoing  = place.cities.some((c) => c.dates?.includes("present"));
      const startYear = allYears.length > 0 ? Math.min(...allYears) : null;
      const endYear   = allYears.length > 0 ? Math.max(...allYears) : null;

      let displayDate: string;
      if (allYears.length === 0) {
        displayDate = place.cities.find((c) => c.dates)?.dates ?? "";
      } else if (ongoing) {
        displayDate = `${startYear} – present`;
      } else if (startYear === endYear) {
        displayDate = String(startYear);
      } else {
        displayDate = `${startYear} – ${endYear}`;
      }

      return { id: place.isoNumeric, place, startYear, displayDate, ongoing };
    })
    .sort((a, b) => {
      if (a.startYear === null && b.startYear === null) return 0;
      if (a.startYear === null) return 1;
      if (b.startYear === null) return -1;
      return a.startYear - b.startYear;
    });
}

const entries = buildEntries();

export default function TravelTimeline() {
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

  return (
    <div className="relative border-l border-[var(--border)] ml-1.5">
      {entries.map((entry) => {
        const isActive   = activeId === entry.id;
        const multiCity  = entry.place.cities.length > 1;
        const singleCity = !multiCity ? entry.place.cities[0] : null;

        return (
          <div
            key={entry.id}
            data-id={entry.id}
            ref={(el) => { refs.current[entry.id] = el; }}
            onClick={() => {
              setActiveId(entry.id);
              refs.current[entry.id]?.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
            className={`relative pl-7 pb-12 last:pb-2 transition-all duration-500 ease-out cursor-pointer ${
              activeId === null || isActive ? "opacity-100" : "opacity-25"
            }`}
          >
            {/* dot */}
            <div
              className={`absolute -left-[5px] top-1 rounded-full border-2 transition-all duration-500 ${
                isActive ? "w-3.5 h-3.5 -left-[6px]" : "w-2.5 h-2.5"
              } ${
                entry.ongoing
                  ? "border-[var(--foreground)] bg-[var(--foreground)]"
                  : "border-[var(--muted)] bg-[var(--background)]"
              }`}
            />

            <div
              className={`transition-all duration-500 ease-out ${
                isActive ? "translate-x-2" : "translate-x-0"
              }`}
            >
              <span className="text-xs text-[var(--muted)]">{entry.displayDate}</span>
              <p
                className={`leading-snug transition-all duration-500 ${
                  isActive ? "text-base font-semibold mt-0.5" : "text-sm font-medium mt-0.5"
                }`}
              >
                {entry.place.country}
              </p>

              {/* Single city: subtitle */}
              {singleCity && (
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  {singleCity.city}
                  {singleCity.note && (
                    <span className="ml-1.5 opacity-70 italic">— {singleCity.note}</span>
                  )}
                </p>
              )}

              {/* Multi city: list */}
              {multiCity && (
                <ul className="pt-1.5 space-y-0.5">
                  {entry.place.cities.map((c) => (
                    <li key={c.city} className="text-xs text-[var(--muted)]">
                      {c.city}
                      {c.dates && <span className="ml-1.5">{c.dates}</span>}
                      {c.note && <span className="ml-1.5 opacity-70 italic">— {c.note}</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
