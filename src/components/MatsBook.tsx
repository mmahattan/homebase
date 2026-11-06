"use client";

import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { PixelFace } from "@/components/FloatingBook";
import { MATS_COPY } from "@/data/businessWorld";
import { BOOK_FACES, BOOK_H, BOOK_W } from "@/lib/pixelScenes";

// MATS as an open spellbook. It flies in from the floating book in the room,
// spinning as it zooms, swings its cover open, then turns a page per click.
// Two pages at a time on wide screens, one at a time on phones.

type Page = { title?: string; body?: string; menu?: string[] };

const [TAGLINE, MENU_INTRO] = MATS_COPY.intro.split(/(?<=\.)\s+/);

const PAGES: Page[] = [
  { title: "MATS", body: TAGLINE },
  { body: MATS_COPY.paragraphs[0] },
  { body: MATS_COPY.paragraphs[1] },
  { body: MATS_COPY.paragraphs[2] },
  { title: "menu", body: MENU_INTRO },
  { menu: MATS_COPY.services },
];

type Phase = "measure" | "fly-start" | "flying" | "opening" | "open" | "closing";
type Turn = { dir: 1 | -1 } | null;

const TURN_MS = 700;

// The same pixel-art cover as the floating book in the room, just bigger.
function Cover({ side = "front" }: { side?: "front" | "back" }) {
  return (
    <div className="absolute inset-0 shadow-[0_0_60px_rgba(255,214,120,0.45)]">
      <PixelFace px={BOOK_FACES[side]} w={BOOK_W} h={BOOK_H} />
    </div>
  );
}

function Paper({ side, children }: { side: "left" | "right" | "single"; children?: ReactNode }) {
  const spine =
    side === "left"
      ? "linear-gradient(to left, rgba(90,60,30,0.28), transparent 14%)"
      : side === "right"
        ? "linear-gradient(to right, rgba(90,60,30,0.28), transparent 14%)"
        : "none";
  return (
    <div
      className="absolute inset-0 bg-[#f3e7c9] text-[#2b1d16] overflow-hidden"
      style={{
        backgroundImage: `${spine}, repeating-linear-gradient(0deg, rgba(120,90,50,0.035) 0 2px, transparent 2px 5px)`,
      }}
    >
      {children}
    </div>
  );
}

function PageView({ index, side }: { index: number; side: "left" | "right" | "single" }) {
  const page = PAGES[index];
  if (!page) return <Paper side={side} />;
  return (
    <Paper side={side}>
      <div className="absolute inset-0 flex flex-col p-6 sm:p-9">
        <div className="flex-1 flex flex-col justify-center gap-6">
          {page.title && (
            <h3 className={`pixel-font ${page.title === "MATS" ? "text-xl sm:text-2xl text-[#8a5a33]" : "text-sm sm:text-base"}`}>
              {page.title}
            </h3>
          )}
          {page.body && <p className="pixel-font text-[9px] sm:text-[10px] leading-[2.2]">{page.body}</p>}
          {page.menu && (
            <ul className="space-y-6">
              {page.menu.map((item) => (
                <li key={item} className="flex items-end gap-2">
                  <span className="pixel-font text-[9px] sm:text-[10px] leading-[2]">{item}</span>
                  <span className="flex-1 mb-2 border-b-2 border-dotted border-[#8a5a33]/50" />
                  <span className="pixel-font text-[10px] text-[#8a5a33]">✦</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <span className="pixel-font text-[7px] text-[#8a5a33] text-center">{index + 1}</span>
      </div>
    </Paper>
  );
}

// One sheet turning over its spine, with something printed on each side.
function Leaf({
  area,
  from,
  to,
  front,
  back,
  onDone,
}: {
  area: "left" | "right" | "single";
  from: number;
  to: number;
  front: ReactNode;
  back: ReactNode;
  onDone: () => void;
}) {
  const [deg, setDeg] = useState(from);
  useEffect(() => {
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setDeg(to));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [to]);
  return (
    <div
      className="absolute top-0 h-full z-10"
      style={{
        left: area === "right" ? "50%" : 0,
        width: area === "single" ? "100%" : "50%",
        transformStyle: "preserve-3d",
        transformOrigin: area === "left" ? "right center" : "left center",
        transform: `rotateY(${deg}deg)`,
        transition: `transform ${TURN_MS}ms cubic-bezier(0.4, 0.1, 0.2, 1)`,
      }}
      onTransitionEnd={(e) => e.target === e.currentTarget && onDone()}
    >
      <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
        {front}
      </div>
      <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
        {back}
      </div>
    </div>
  );
}

export default function MatsBook(props: { from: DOMRect | null; onClose: () => void }) {
  // Rendered at the top of the page: the private space's slide-in transform
  // would otherwise trap this full-screen overlay inside the window.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? createPortal(<Book {...props} />, document.body) : null;
}

function Book({ from, onClose }: { from: DOMRect | null; onClose: () => void }) {
  const [single, setSingle] = useState(false);
  const [phase, setPhase] = useState<Phase>("measure");
  const [index, setIndex] = useState(0);
  const [turn, setTurn] = useState<Turn>(null);
  const [flyFrom, setFlyFrom] = useState("none");
  const coverRef = useRef<HTMLDivElement>(null);

  const step = single ? 1 : 2;
  const canNext = index + step < PAGES.length;
  const canPrev = index > 0;

  useLayoutEffect(() => {
    setSingle(window.matchMedia("(max-width: 639px)").matches);
  }, []);

  // Measure where the cover will land, start it on top of the floating book,
  // then let it fly and spin into place.
  useLayoutEffect(() => {
    if (phase !== "measure" || !coverRef.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!from || reduce) {
      setPhase("open");
      return;
    }
    const to = coverRef.current.getBoundingClientRect();
    const dx = from.left + from.width / 2 - (to.left + to.width / 2);
    const dy = from.top + from.height / 2 - (to.top + to.height / 2);
    setFlyFrom(`translate(${dx}px, ${dy}px) scale(${from.width / to.width}) rotateY(0deg)`);
    setPhase("fly-start");
  }, [phase, from, single]);

  useEffect(() => {
    if (phase !== "fly-start") return;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setPhase("flying"));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [phase]);

  function next() {
    if (phase === "open" && !turn && canNext) setTurn({ dir: 1 });
  }
  function prev() {
    if (phase === "open" && !turn && canPrev) setTurn({ dir: -1 });
  }
  function close() {
    setPhase("closing");
    setTimeout(onClose, 250);
  }
  function finishTurn() {
    if (!turn) return;
    setIndex((i) => i + turn.dir * step);
    setTurn(null);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === " " || e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "Escape") {
        close();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const flying = phase === "measure" || phase === "fly-start" || phase === "flying";
  const coverTransform =
    phase === "fly-start" ? flyFrom : phase === "flying" ? "translate(0px, 0px) scale(1) rotateY(720deg)" : "none";

  // What lies under a turning sheet
  const leftUnder = turn?.dir === -1 ? index - 2 : index;
  const rightUnder = turn?.dir === 1 ? index + 3 : index + 1;

  return (
    <div
      className={`fixed inset-0 z-[60] flex flex-col items-center justify-center gap-4 p-4 bg-[#140c08]/75 transition-opacity duration-300 ${
        phase === "closing" ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        className="relative"
        style={{
          width: single ? "min(380px, 88vw)" : "min(880px, 92vw)",
          aspectRatio: single ? "3 / 4" : "3 / 2",
          perspective: "1800px",
        }}
      >
        {/* The cover, flying in from the room */}
        {flying && (
          <div
            ref={coverRef}
            className="absolute top-0 h-full"
            style={{
              left: single ? 0 : "50%",
              width: single ? "100%" : "50%",
              transform: coverTransform,
              transition: phase === "flying" ? "transform 1000ms cubic-bezier(0.3, 0.1, 0.2, 1)" : "none",
              visibility: phase === "measure" ? "hidden" : "visible",
              transformStyle: "preserve-3d",
            }}
            onTransitionEnd={(e) => e.target === e.currentTarget && phase === "flying" && setPhase("opening")}
          >
            {/* Two-sided, so the back cover shows as it spins */}
            <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
              <Cover />
            </div>
            <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
              <Cover side="back" />
            </div>
          </div>
        )}

        {/* The cover swinging open */}
        {phase === "opening" && (
          <>
            <div className="absolute top-0 h-full" style={{ left: single ? 0 : "50%", width: single ? "100%" : "50%" }}>
              <PageView index={single ? 0 : 1} side={single ? "single" : "right"} />
            </div>
            <Leaf
              area={single ? "single" : "right"}
              from={0}
              to={-180}
              front={<Cover />}
              back={single ? <Paper side="single" /> : <PageView index={0} side="left" />}
              onDone={() => setPhase("open")}
            />
          </>
        )}

        {/* The open book */}
        {(phase === "open" || phase === "closing") &&
          (single ? (
            <>
              <button className="absolute inset-0 text-left" onClick={next} aria-label="Turn the page">
                <PageView index={turn?.dir === 1 ? index + 1 : index} side="single" />
              </button>
              {turn && (
                <Leaf
                  key={`${index}-${turn.dir}`}
                  area="single"
                  from={turn.dir === 1 ? 0 : -180}
                  to={turn.dir === 1 ? -180 : 0}
                  front={<PageView index={turn.dir === 1 ? index : index - 1} side="single" />}
                  back={<Paper side="single" />}
                  onDone={finishTurn}
                />
              )}
            </>
          ) : (
            <>
              <button className="absolute top-0 left-0 w-1/2 h-full text-left" onClick={prev} aria-label="Previous page">
                <PageView index={leftUnder} side="left" />
              </button>
              <button className="absolute top-0 left-1/2 w-1/2 h-full text-left" onClick={next} aria-label="Next page">
                <PageView index={rightUnder} side="right" />
              </button>
              {turn && (
                <Leaf
                  key={`${index}-${turn.dir}`}
                  area={turn.dir === 1 ? "right" : "left"}
                  from={0}
                  to={turn.dir === 1 ? -180 : 180}
                  front={<PageView index={turn.dir === 1 ? index + 1 : index} side={turn.dir === 1 ? "right" : "left"} />}
                  back={<PageView index={turn.dir === 1 ? index + 2 : index - 1} side={turn.dir === 1 ? "left" : "right"} />}
                  onDone={finishTurn}
                />
              )}
            </>
          ))}

        {!flying && (
          <button
            onClick={close}
            aria-label="Close the book"
            className="pixel-font absolute -top-9 right-0 text-[9px] border-2 border-[#f3e7c9] text-[#f3e7c9] px-1.5 py-0.5 hover:bg-[#f3e7c9] hover:text-[#2b1d16]"
          >
            x
          </button>
        )}
      </div>

      <p className={`pixel-font text-[8px] text-[#d8c9a8] ${phase === "open" ? "" : "invisible"}`}>
        {canNext ? "click to turn the page [space]" : "x or [esc] to close"}
      </p>
    </div>
  );
}
