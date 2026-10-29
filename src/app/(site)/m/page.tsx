"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { projects } from "@/data/projects";
import ProjectList from "@/components/ProjectList";
import BusinessWorld from "@/components/BusinessWorld";
import PixelFolder, { FolderColor } from "@/components/PixelFolder";
import PixelWindow from "@/components/PixelWindow";
import { usePrivateSpace, PrivateView } from "@/components/PrivateSpace";

// Change this to whatever passphrase you want
const PRIVATE_KEY = "cWhQ-M4tsT7-qHpGQ";

const palette: FolderColor[] = [
  { fill: "#8ec5f0", shade: "#5a9fd6" },
  { fill: "#f4a6c0", shade: "#d97a9c" },
  { fill: "#9edb9a", shade: "#6cb868" },
  { fill: "#c3a6f0", shade: "#9a7bd4" },
];

type Folder = { id: string; label: string; color: FolderColor; content: ReactNode };

const BUSINESS_WORLD = "the-business-world";

// Everything inside the prototypes folder. The Business World mock sits first.
const folders: Folder[] = [
  {
    id: BUSINESS_WORLD,
    label: "the business world",
    color: { fill: "#f7d154", shade: "#d9a92a" },
    content: <BusinessWorld />,
  },
  ...projects.map((project, i) => ({
    id: project.title,
    label: project.title.toLowerCase(),
    color: palette[i % palette.length],
    content: <ProjectList projects={[project]} />,
  })),
];

type Destination = { view: PrivateView; folder: string | null };

function resolve(input: string): Destination | null {
  const q = input.toLowerCase().trim();
  if (!q) return null;
  if (["business", "mats", "service", "client", "deal", "pitch"].some((k) => q.includes(k))) {
    return { view: "prototypes", folder: BUSINESS_WORLD };
  }
  if (["prototype", "project", "wip", "work", "build", "folder"].some((k) => q.includes(k))) {
    return { view: "prototypes", folder: null };
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
  const [folder, setFolder] = useState<string | null>(null);
  const [opening, setOpening] = useState(false);

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
    setFolder(null);
  }, [isPrivate]);

  function navigate(next: PrivateView, nextFolder: string | null = null) {
    setViewVisible(false);
    setTimeout(() => {
      goTo(next);
      setFolder(nextFolder);
      setOpening(false);
      setViewVisible(true);
    }, 250);
  }

  function openPrototypes() {
    setOpening(true);
    setTimeout(() => navigate("prototypes"), 360);
  }

  function handleQuerySubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = resolve(queryValue);
    if (next) {
      navigate(next.view, next.folder);
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
    const openFolder = folders.find((f) => f.id === folder);
    const crumbs: { label: string; go?: () => void }[] = [
      { label: "house of kei", go: () => navigate("concierge") },
      { label: "prototypes", go: openFolder ? () => navigate("prototypes") : undefined },
      ...(openFolder ? [{ label: openFolder.label }] : []),
    ];

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
              <nav className="pixel-font text-[9px] leading-loose text-[var(--muted)] flex flex-wrap items-center gap-x-2">
                {crumbs.map((crumb, i) => (
                  <span key={crumb.label} className="flex items-center gap-2 whitespace-nowrap">
                    {i > 0 && <span aria-hidden>/</span>}
                    {crumb.go ? (
                      <button onClick={crumb.go} className="hover:text-[var(--foreground)] underline underline-offset-4">
                        {crumb.label}
                      </button>
                    ) : (
                      <span className="text-[var(--foreground)]">{crumb.label}</span>
                    )}
                  </span>
                ))}
              </nav>
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
              <div className="flex flex-col items-center text-center gap-12 py-6">
                <PixelFolder
                  label="prototypes"
                  size="lg"
                  color={{ fill: "#f7d154", shade: "#d9a92a" }}
                  className={opening ? "pixel-pop" : ""}
                  onClick={openPrototypes}
                />

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
                      not sure where to send you — try the folder above
                    </p>
                  )}
                </form>
              </div>
            ) : openFolder ? (
              <PixelWindow title={openFolder.label} onClose={() => navigate("prototypes")}>
                {openFolder.content}
              </PixelWindow>
            ) : (
              <div className="space-y-10">
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  everything here, published and WIP. mark a project published to mirror it publicly.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-10 justify-items-center">
                  {folders.map((f, i) => (
                    <PixelFolder
                      key={f.id}
                      label={f.label}
                      color={f.color}
                      delay={i * 70}
                      className="pixel-in"
                      onClick={() => navigate("prototypes", f.id)}
                    />
                  ))}
                </div>
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
