"use client";

import { useState } from "react";

// Change this to whatever passphrase you want
const PRIVATE_KEY = "cWhQ-M4tsT7-qHpGQ";

export default function Private() {
  const [input, setInput] = useState("");
  const [auth, setAuth] = useState(false);
  const [wrong, setWrong] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input === PRIVATE_KEY) {
      setAuth(true);
    } else {
      setWrong(true);
      setTimeout(() => setWrong(false), 2000);
      setInput("");
    }
  }

  if (auth) {
    return (
      <section className="space-y-10">
        <h1 className="text-2xl font-normal tracking-tight">welcome back, Mats.</h1>
        <p className="text-sm text-[var(--muted)]">
          [ your private content here ]
        </p>
      </section>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[55vh] gap-5">
      <p className="text-xs text-[var(--muted)] tracking-widest uppercase">private</p>
      <form onSubmit={handleSubmit} className="flex items-center gap-3 border-b border-[var(--border)] pb-2 w-full max-w-xs">
        <input
          type="password"
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
