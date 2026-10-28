"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { projects } from "@/data/projects";
import ProjectList from "@/components/ProjectList";
import BusinessWorld from "@/components/BusinessWorld";
import { usePrivateSpace, PrivateView } from "@/components/PrivateSpace";

// Change this to whatever passphrase you want
const PRIVATE_KEY = "cWhQ-M4tsT7-qHpGQ";

const chips: { label: string; view: PrivateView }[] = [
  { label: "prototypes", view: "prototypes" },
  { label: "the business world", view: "business" },
];

function resolve(input: string): PrivateView | null {
  const q = input.toLowerCase().trim();
  if (!q) return null;
  if (["business", "mats", "service", "client", "deal", "pitch"].some((k) => q.includes(k))) {
    return "business";
  }
  if (["prototype", "project", "wip", "work", "build"].some((k) => q.includes(k))) {
    return "prototypes";
  }
  return null;
}

export default function Private() {
  const router = useRouter();
  const { isPrivate, view, enter, exit, goTo } = usePrivateSpace();
  const [input, setInput] = useState("");
  const [leaving, setLeaving] = useState(false);
  const [homeVisible, setHomeVisible] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [viewVisible, setViewVisible] = useState(true);
  const [queryValue, setQueryValue] = useState("");
  const [miss, setMiss] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim() === PRIVATE_KEY) {
      setLeaving(true);
      setTimeout(() => enter(), 450);
    } else {
      setWrong(true);
      setTimeout(() => setWrong(false), 2000);
      setInput("");
    }
  }

  useEffect(() => {
    if (isPrivate) {
      const id = requestAnimationFrame(() => setHomeVisible(true));
      return () => cancelAnimationFrame(id);
    }
    setHomeVisible(false);
    setLeaving(false);
  }, [isPrivate]);

  function goToView(next: PrivateView) {
    setViewVisible(false);
    setTimeout(() => {
      goTo(next);
      setViewVisible(true);
    }, 250);
  }

  function handleQuerySubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = resolve(queryValue);
    if (next) {
      goToView(next);
    } else {
      setMiss(true);
      setTimeout(() => setMiss(false), 2500);
    }
  }

  function eject() {
    exit();
    router.push("/");
  }

  if (isPrivate) {
    return (
      <>
        {/* Rendered outside the animated wrapper below so position: fixed is
            relative to the viewport, not the wrapper's transform. */}
        <div
          className="hidden xl:block fixed top-9 z-50"
          style={{ left: "calc(50% + 21rem + 1.5rem)" }}
        >
          <span className="inline-block bg-red-600 text-white text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full shadow-lg whitespace-nowrap">
            private working space
          </span>
        </div>

        <div className="fixed bottom-6 inset-x-0 flex justify-center z-50">
          <button
            onClick={eject}
            className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] bg-[var(--background)] border border-[var(--border)] hover:border-[var(--muted)] rounded-full px-4 py-2 shadow-lg transition-colors"
          >
            eject ↩
          </button>
        </div>

        <div
          className={`space-y-16 pb-20 transition-all duration-700 ease-out ${
            homeVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex items-start justify-between gap-6">
            {view === "concierge" ? (
              <div className="space-y-2">
                <h1 className="text-3xl font-normal tracking-tight">Hey Staff, it&apos;s Kei.</h1>
                <p className="text-[var(--muted)]">You&apos;re in.</p>
              </div>
            ) : (
              <button
                onClick={() => goToView("concierge")}
                className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                ← back
              </button>
            )}
            <span className="xl:hidden text-xs text-[var(--muted)] tracking-widest uppercase border border-red-600 text-red-600 rounded-full px-3 py-1.5 whitespace-nowrap shrink-0 font-bold">
              private working space
            </span>
          </div>

          <div
            className={`transition-all duration-300 ease-out ${
              viewVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            {view === "concierge" ? (
              <div className="flex flex-col items-center text-center gap-10 py-10">
                <div className="flex flex-wrap justify-center gap-3">
                  {chips.map(({ label, view: v }) => (
                    <button
                      key={label}
                      onClick={() => goToView(v)}
                      className="text-sm text-[var(--muted)] border border-[var(--border)] rounded-full px-4 py-2 hover:text-[var(--foreground)] hover:border-[var(--muted)] transition-colors"
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleQuerySubmit} className="w-full max-w-xs">
                  <div className="flex items-center gap-3 border-b border-[var(--border)] pb-2">
                    <input
                      value={queryValue}
                      onChange={(e) => {
                        setQueryValue(e.target.value);
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
                      not sure where to send you — try the option above
                    </p>
                  )}
                </form>
              </div>
            ) : view === "business" ? (
              <div className="space-y-10 border-t border-[var(--border)] pt-10">
                <h2 className="text-xs tracking-widest uppercase text-[var(--muted)]">the business world</h2>
                <BusinessWorld />
              </div>
            ) : (
              <div className="space-y-6 border-t border-[var(--border)] pt-10">
                <h2 className="text-xs tracking-widest uppercase text-[var(--muted)]">prototypes</h2>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  everything here, published and WIP. mark a project published to mirror it publicly.
                </p>
                <ProjectList projects={projects} />
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[55vh] gap-5 transition-all duration-[450ms] ease-in ${
        leaving ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"
      }`}
    >
      <p className="text-xs text-[var(--muted)] tracking-widest uppercase">private</p>
      <form onSubmit={handleSubmit} className="flex items-center gap-3 border-b border-[var(--border)] pb-2 w-full max-w-xs">
        <input
          type="password"
          name="kei-house-passphrase"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setWrong(false);
          }}
          placeholder="passphrase"
          autoFocus
          className="flex-1 bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] outline-none"
        />
        <button
          type="submit"
          className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors shrink-0"
          aria-label="Unlock"
        >
          →
        </button>
      </form>
      {wrong && (
        <p className="text-xs text-[var(--muted)]">not quite</p>
      )}
    </div>
  );
}
