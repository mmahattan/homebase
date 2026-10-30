"use client";

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";

export type PrivateView = "concierge" | "station";

type PrivateSpaceState = {
  isPrivate: boolean;
  view: PrivateView;
  enter: () => void;
  eject: () => void;
  goTo: (view: PrivateView) => void;
};

const PrivateSpaceContext = createContext<PrivateSpaceState | null>(null);

const PRIVATE_PATH = "/m";
const BLOCK = 28;
const DISSOLVE_MS = 520;

type Dissolve = "idle" | "cover" | "wait" | "reveal";

// Fills (cover) or clears (reveal) the canvas one random block at a time.
function dissolveBlocks(canvas: HTMLCanvasElement, mode: "cover" | "reveal", done: () => void) {
  const dpr = window.devicePixelRatio || 1;
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (mode === "cover") {
    canvas.width = w * dpr;
    canvas.height = h * dpr;
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    done();
    return () => {};
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--background").trim();

  const cols = Math.ceil(w / BLOCK);
  const order = Array.from({ length: cols * Math.ceil(h / BLOCK) }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }

  let drawn = 0;
  let raf = 0;
  const start = performance.now();
  const step = (now: number) => {
    const target = Math.min(order.length, Math.ceil(((now - start) / DISSOLVE_MS) * order.length));
    for (; drawn < target; drawn++) {
      const x = (order[drawn] % cols) * BLOCK;
      const y = Math.floor(order[drawn] / cols) * BLOCK;
      if (mode === "cover") ctx.fillRect(x, y, BLOCK, BLOCK);
      else ctx.clearRect(x, y, BLOCK, BLOCK);
    }
    if (drawn < order.length) raf = requestAnimationFrame(step);
    else done();
  };
  raf = requestAnimationFrame(step);
  return () => cancelAnimationFrame(raf);
}

export function PrivateSpaceProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPrivate, setIsPrivate] = useState(false);
  const [view, setView] = useState<PrivateView>("concierge");
  const [dissolve, setDissolve] = useState<Dissolve>("idle");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // The 8-bit staff theme in globals.css keys off this attribute. It's tied to
  // the path too, so a swipe back never shows the public page in 8-bit.
  const staff = isPrivate && pathname === PRIVATE_PATH;
  useLayoutEffect(() => {
    document.documentElement.toggleAttribute("data-staff", staff);
  }, [staff]);

  // Leaving /m any way at all (eject, swipe back, back button) locks the space,
  // so swiping forward again lands on the passphrase.
  useEffect(() => {
    if (isPrivate && pathname !== PRIVATE_PATH) {
      setIsPrivate(false);
      setView("concierge");
    }
  }, [isPrivate, pathname]);

  // Eject: blocks cover the private space, the public page loads underneath,
  // then the blocks clear to reveal it.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (dissolve === "cover") {
      return dissolveBlocks(canvas, "cover", () => {
        setDissolve("wait");
        router.push("/");
      });
    }
    if (dissolve === "reveal") {
      return dissolveBlocks(canvas, "reveal", () => setDissolve("idle"));
    }
  }, [dissolve, router]);

  useEffect(() => {
    if (dissolve === "wait" && pathname !== PRIVATE_PATH) setDissolve("reveal");
  }, [dissolve, pathname]);

  function eject() {
    if (dissolve !== "idle") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push("/");
      return;
    }
    setDissolve("cover");
  }

  return (
    <PrivateSpaceContext.Provider
      value={{
        isPrivate,
        view,
        enter: () => {
          setIsPrivate(true);
          setView("concierge");
        },
        eject,
        goTo: setView,
      }}
    >
      {children}
      {dissolve !== "idle" && (
        <canvas ref={canvasRef} aria-hidden className="fixed inset-0 z-[100] w-screen h-screen" />
      )}
    </PrivateSpaceContext.Provider>
  );
}

export function usePrivateSpace() {
  const ctx = useContext(PrivateSpaceContext);
  if (!ctx) throw new Error("usePrivateSpace must be used within PrivateSpaceProvider");
  return ctx;
}
