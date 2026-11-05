"use client";

import { useEffect, useState } from "react";
import Dollhouse from "@/components/Dollhouse";
import QuickMenu, { EntryTarget } from "@/components/QuickMenu";

// The House of Kei front door. First visit: the dollhouse. Once a visitor has
// been in, they're asked once whether they want the dollhouse or the quick
// menu; that preference sticks, with a switch to flip to the other.

type Mode = "dollhouse" | "menu";

const VISITED_KEY = "kei:visited:house";
const MODE_KEY = "kei:house-mode";

function read(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

export default function HouseEntry({ onEnter }: { onEnter: (to: EntryTarget) => void }) {
  const [mode, setMode] = useState<Mode>("dollhouse");
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    const saved = read(MODE_KEY);
    if (saved === "dollhouse" || saved === "menu") setMode(saved);
    else if (read(VISITED_KEY) === "1") setAsking(true);
  }, []);

  function choose(next: Mode) {
    setMode(next);
    setAsking(false);
    write(MODE_KEY, next);
  }

  function enter(to: EntryTarget) {
    write(VISITED_KEY, "1");
    onEnter(to);
  }

  return (
    <div className="space-y-3">
      {!asking && (
        <div className="flex justify-end">
          <div className="pixel-font flex text-[8px] border-2 border-[var(--foreground)]" role="group" aria-label="View">
            {(["dollhouse", "menu"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => choose(m)}
                aria-pressed={mode === m}
                className={`px-2 py-1 ${
                  mode === m
                    ? "bg-[var(--foreground)] text-[var(--background)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      )}

      {mode === "menu" && !asking ? (
        <QuickMenu onPick={enter} />
      ) : (
        <div className="relative">
          <div className={asking ? "pointer-events-none opacity-40" : ""}>
            <Dollhouse onEnter={() => enter("world")} />
          </div>
          {asking && (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div
                role="dialog"
                aria-label="Welcome back"
                className="pixel-in w-full max-w-sm bg-[#f4efe2] text-[#2b1d16] border-4 border-[#2b1d16] shadow-[6px_6px_0_#2b1d16]"
              >
                <div className="border-b-4 border-[#2b1d16] px-4 py-2">
                  <span className="pixel-font text-[9px]">welcome back</span>
                </div>
                <div className="px-4 py-4 space-y-4">
                  <p className="pixel-font text-[9px] leading-[2]">how would you like to look around?</p>
                  <div className="flex flex-wrap gap-3">
                    {(["dollhouse", "menu"] as Mode[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => choose(m)}
                        className="pixel-font text-[9px] border-2 border-[#2b1d16] px-3 py-2 hover:bg-[#2b1d16] hover:text-[#f4efe2]"
                      >
                        ▸ {m === "menu" ? "quick menu" : "dollhouse"}
                      </button>
                    ))}
                  </div>
                  <p className="pixel-font text-[7px] text-[#8a5a33]">switch anytime from the top</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
