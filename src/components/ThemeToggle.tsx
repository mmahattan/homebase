"use client";

import { useTheme, type Theme } from "./ThemeProvider";

const modes: Theme[] = ["light", "dark", "auto"];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  function cycle() {
    setTheme(modes[(modes.indexOf(theme) + 1) % modes.length]);
  }

  return (
    <button
      onClick={cycle}
      title={`Switch theme (currently: ${theme})`}
      className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors tabular-nums"
    >
      {theme}
    </button>
  );
}
