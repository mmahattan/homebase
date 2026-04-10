"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme, type Theme } from "./ThemeProvider";

const modes: { value: Theme; label: string }[] = [
  { value: "light", label: "light" },
  { value: "dark", label: "dark" },
  { value: "auto", label: "auto" },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
      >
        for your eyes
      </button>

      {open && (
        <div className="absolute right-0 top-6 flex flex-col gap-1 bg-[var(--background)] border border-[var(--border)] rounded py-2 px-3 min-w-[80px]">
          {modes.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => { setTheme(value); setOpen(false); }}
              className={`text-left text-xs transition-colors ${
                theme === value
                  ? "text-[var(--foreground)]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
