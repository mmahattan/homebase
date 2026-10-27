"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { projects } from "@/data/projects";
import ProjectList from "@/components/ProjectList";

// Change this to whatever passphrase you want
const PRIVATE_KEY = "cWhQ-M4tsT7-qHpGQ";

type Stage = "gate" | "leaving" | "home";

export default function Private() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [stage, setStage] = useState<Stage>("gate");
  const [homeVisible, setHomeVisible] = useState(false);
  const [wrong, setWrong] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim() === PRIVATE_KEY) {
      setStage("leaving");
      setTimeout(() => setStage("home"), 450);
    } else {
      setWrong(true);
      setTimeout(() => setWrong(false), 2000);
      setInput("");
    }
  }

  useEffect(() => {
    if (stage === "home") {
      const id = requestAnimationFrame(() => setHomeVisible(true));
      return () => cancelAnimationFrame(id);
    }
  }, [stage]);

  if (stage === "home") {
    return (
      <div
        className={`space-y-16 transition-all duration-700 ease-out ${
          homeVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-normal tracking-tight">Hey Staff, it&apos;s Kei.</h1>
            <p className="text-[var(--muted)]">You&apos;re in.</p>
          </div>
          <span className="text-xs text-[var(--muted)] tracking-widest uppercase border border-[var(--border)] rounded-full px-3 py-1.5 whitespace-nowrap shrink-0">
            private working space
          </span>
        </div>

        <div className="space-y-6 border-t border-[var(--border)] pt-10">
          <h2 className="text-xs tracking-widest uppercase text-[var(--muted)]">prototypes</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            everything here, published and WIP. mark a project published to mirror it publicly.
          </p>
          <ProjectList projects={projects} />
        </div>

        <div className="flex justify-center pt-4">
          <button
            onClick={() => router.push("/")}
            className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--muted)] rounded-full px-4 py-2 transition-colors"
          >
            eject ↩
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[55vh] gap-5 transition-all duration-[450ms] ease-in ${
        stage === "leaving" ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"
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
