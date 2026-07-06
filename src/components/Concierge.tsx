"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const chips = [
  { label: "AI front desk for my business", href: "/start" },
  { label: "just browsing", href: "/projects" },
  { label: "it's me, Mats", href: "/m" },
];

const routeMap: [string[], string][] = [
  [["business", "ai", "line", "instagram", "bot", "front desk", "assistant", "sme", "thai", "startup", "service", "chat", "help"], "/start"],
  [["project", "portfolio", "work", "build", "code", "browse", "look"], "/projects"],
  [["about", "who", "chronicle", "journey", "story", "background", "resume", "cv"], "/about"],
  [["music", "passion", "lately", "vibe", "spotify", "playlist", "listen", "song"], "/passions"],
  [["brain", "idea", "thought", "mind", "note"], "/brain"],
  [["mats", "kei", "me", "admin", "private", "login"], "/m"],
];

function resolve(input: string): string | null {
  const q = input.toLowerCase().trim();
  if (!q) return null;
  for (const [keywords, href] of routeMap) {
    if (keywords.some((k) => q.includes(k))) return href;
  }
  return null;
}

export default function Concierge() {
  const [value, setValue] = useState("");
  const [miss, setMiss] = useState(false);
  const router = useRouter();

  function go(href: string) {
    router.push(href);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const href = resolve(value);
    if (href) {
      go(href);
    } else {
      setMiss(true);
      setTimeout(() => setMiss(false), 2500);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[55vh] text-center gap-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-normal tracking-tight">Hey, it&apos;s Kei.</h1>
        <p className="text-[var(--muted)]">Where can I take you?</p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {chips.map(({ label, href }) => (
          <button
            key={href}
            onClick={() => go(href)}
            className="text-sm text-[var(--muted)] border border-[var(--border)] rounded-full px-4 py-2 hover:text-[var(--foreground)] hover:border-[var(--muted)] transition-colors"
          >
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <div className="flex items-center gap-3 border-b border-[var(--border)] pb-2">
          <input
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setMiss(false);
            }}
            placeholder="or type anything..."
            className="flex-1 bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] outline-none"
          />
          <button
            type="submit"
            className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors shrink-0"
            aria-label="Go"
          >
            →
          </button>
        </div>
        {miss && (
          <p className="text-xs text-[var(--muted)] mt-3">
            not sure where to send you — try one of the options above
          </p>
        )}
      </form>
    </div>
  );
}
