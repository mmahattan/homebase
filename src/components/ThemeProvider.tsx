"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { isDaytime } from "@/lib/sun";

export type Theme = "light" | "dark" | "auto";

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
}>({ theme: "auto", setTheme: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

function resolveTheme(theme: Theme, coords: GeolocationCoordinates | null): "light" | "dark" {
  if (theme === "light") return "light";
  if (theme === "dark") return "dark";
  if (coords) return isDaytime(coords.latitude, coords.longitude) ? "light" : "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme, coords: GeolocationCoordinates | null) {
  document.documentElement.setAttribute("data-theme", resolveTheme(theme, coords));
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("auto");
  const [coords, setCoords] = useState<GeolocationCoordinates | null>(null);

  const requestCoords = useCallback(
    (t: Theme) => {
      navigator.geolocation?.getCurrentPosition(
        (pos) => {
          setCoords(pos.coords);
          applyTheme(t, pos.coords);
        },
        () => applyTheme(t, null)
      );
    },
    []
  );

  // Load saved preference on mount
  useEffect(() => {
    const saved = (localStorage.getItem("theme") as Theme) || "auto";
    setThemeState(saved);
    if (saved === "auto") {
      requestCoords("auto");
    } else {
      applyTheme(saved, null);
    }
  }, [requestCoords]);

  // Re-check every minute in auto mode in case sun crosses horizon
  useEffect(() => {
    if (theme !== "auto") return;
    const interval = setInterval(() => applyTheme("auto", coords), 60_000);
    return () => clearInterval(interval);
  }, [theme, coords]);

  function setTheme(t: Theme) {
    setThemeState(t);
    localStorage.setItem("theme", t);
    if (t === "auto") {
      requestCoords("auto");
    } else {
      applyTheme(t, null);
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
