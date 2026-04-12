"use client";

import { useEffect, useRef, useState } from "react";

type TimelineEntry = {
  id: string;
  years: string;
  title: string;
  subtitle: string;
  tag: string;
  details?: string[];
  ongoing?: boolean;
};

const entries: TimelineEntry[] = [
  {
    id: "usc",
    years: "2023 – present",
    title: "University of Southern California, Marshall School of Business",
    subtitle: "Los Angeles, CA · Expected May 2027",
    tag: "education",
    ongoing: true,
    details: [
      "BS Business Administration · Minor in AI Applications",
      "Coursework: Global Strategy, Product Management, Operations Management, Business Finance, Basics in Artificial Intelligence, Applied Python",
    ],
  },
  {
    id: "isa",
    years: "2023 – present",
    title: "International Student Assembly (ISA)",
    subtitle: "USC Undergraduate Student Government · Los Angeles, CA",
    tag: "leadership",
    ongoing: true,
    details: [
      "Executive Director — Apr 2025 – present",
      "Recruitment Director — May 2024 – Apr 2025",
      "Intern — Sep 2023 – May 2024",
    ],
  },
  {
    id: "flavors",
    years: "2024 – present",
    title: "USC Flavors",
    subtitle: "Los Angeles, CA",
    tag: "leadership",
    ongoing: true,
    details: [
      "Events Manager — May 2025 – present",
      "Director of Operations — Nov 2024 – May 2025",
    ],
  },
  {
    id: "ibm",
    years: "2024 – 2025",
    title: "International Business Machines (IBM)",
    subtitle: "Bangkok, Thailand",
    tag: "work",
    details: [
      "BRD Intern, Banking — Jun 2025 – Aug 2025",
      "Technical Business Analyst, Telecom & Banking — May 2024 – Aug 2024",
    ],
  },
  {
    id: "isb",
    years: "2014 – 2023",
    title: "International School Bangkok (ISB)",
    subtitle: "Bangkok, Thailand",
    tag: "education",
    details: [
      "Varsity Swim Team (2019 – 2023) · Captain from 2021",
      "Varsity Orchestra Strings (2019 – 2023) · Captain from 2021",
    ],
  },
];

export default function Timeline() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (observed) => {
        observed.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.getAttribute("data-id"));
          }
        });
      },
      { rootMargin: "-35% 0px -35% 0px", threshold: 0 }
    );

    Object.values(refs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative border-l border-[var(--border)] ml-1.5">
      {entries.map((entry) => {
        const isActive = activeId === entry.id;
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
              activeId === null || isActive
                ? "opacity-100"
                : "opacity-25"
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
              <span className="text-xs text-[var(--muted)]">{entry.years}</span>
              <p
                className={`leading-snug transition-all duration-500 ${
                  isActive ? "text-base font-semibold mt-0.5" : "text-sm font-medium mt-0.5"
                }`}
              >
                {entry.title}
              </p>
              <p className="text-xs text-[var(--muted)] mt-0.5">{entry.subtitle}</p>

              {entry.details && (
                <ul className="pt-2 space-y-0.5">
                  {entry.details.map((d) => (
                    <li key={d} className="text-xs text-[var(--muted)]">{d}</li>
                  ))}
                </ul>
              )}

              <span className="inline-block text-xs text-[var(--muted)] border border-[var(--border)] rounded-full px-2 py-0.5 mt-2">
                {entry.tag}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
