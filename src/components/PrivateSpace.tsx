"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type PrivateView = "concierge" | "prototypes";

type PrivateSpaceState = {
  isPrivate: boolean;
  view: PrivateView;
  enter: () => void;
  exit: () => void;
  goTo: (view: PrivateView) => void;
};

const PrivateSpaceContext = createContext<PrivateSpaceState | null>(null);

export function PrivateSpaceProvider({ children }: { children: ReactNode }) {
  const [isPrivate, setIsPrivate] = useState(false);
  const [view, setView] = useState<PrivateView>("concierge");

  // The 8-bit staff theme in globals.css keys off this attribute, so the
  // public site is untouched until the passphrase is entered.
  useEffect(() => {
    document.documentElement.toggleAttribute("data-staff", isPrivate);
  }, [isPrivate]);

  return (
    <PrivateSpaceContext.Provider
      value={{
        isPrivate,
        view,
        enter: () => {
          setIsPrivate(true);
          setView("concierge");
        },
        exit: () => {
          setIsPrivate(false);
          setView("concierge");
        },
        goTo: setView,
      }}
    >
      {children}
    </PrivateSpaceContext.Provider>
  );
}

export function usePrivateSpace() {
  const ctx = useContext(PrivateSpaceContext);
  if (!ctx) throw new Error("usePrivateSpace must be used within PrivateSpaceProvider");
  return ctx;
}
