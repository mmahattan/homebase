"use client";

import { ReactNode, useEffect, useState } from "react";
import { projects } from "@/data/projects";
import ProjectList from "@/components/ProjectList";
import BusinessWorld from "@/components/BusinessWorld";
import BusinessWorldRoom from "@/components/BusinessWorldRoom";
import Dollhouse from "@/components/Dollhouse";
import PixelFolder, { FolderColor, FolderTag } from "@/components/PixelFolder";
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

// A folder either opens into more folders (children) or into a window (content).
// published = already live on the public side; drives the [PUBLISHED] / [WIP] tag.
// Only individual ideas/projects set it — worlds and groups stay untagged.
type Folder = {
  id: string;
  label: string;
  color: FolderColor;
  published?: boolean;
  // A function receives go(path) for content that navigates the drive itself.
  content?: ReactNode | ((go: (path: string[]) => void) => ReactNode);
  children?: Folder[];
};

const BUSINESS_WORLD = "the-business-world";
const FRONT_PAGE_DRAFT = "biz-world-front-page-draft";
const HOUSE_ENTRY = "house-entry-4-public";
const PROJECTS = "projects";

const projectFolders: Folder[] = projects.map((project, i) => ({
  id: project.title,
  label: project.title.toLowerCase(),
  color: palette[i % palette.length],
  published: project.published,
  content: <ProjectList projects={[project]} />,
}));

// Everything inside the imagination station.
const folders: Folder[] = [
  {
    id: BUSINESS_WORLD,
    label: "the business world",
    color: { fill: "#f7d154", shade: "#d9a92a" },
    children: [
      {
        id: "biz-world-front-page",
        label: "biz world front page",
        color: { fill: "#f4a6c0", shade: "#d97a9c" },
        // Live publicly at /mats.
        published: true,
        content: <BusinessWorld />,
      },
      {
        id: FRONT_PAGE_DRAFT,
        label: "front page draft",
        color: { fill: "#9edb9a", shade: "#6cb868" },
        // Staff-only until approved; then it replaces the live front page.
        published: false,
        content: (go) => <BusinessWorldRoom onLeave={() => go([HOUSE_ENTRY])} />,
      },
    ],
  },
  {
    id: HOUSE_ENTRY,
    label: "house entry 4 public",
    color: { fill: "#c3a6f0", shade: "#9a7bd4" },
    // Mock-up of the public House of Kei front page: an 8-bit dollhouse.
    published: false,
    content: (go) => <Dollhouse onEnter={() => go([BUSINESS_WORLD, FRONT_PAGE_DRAFT])} />,
  },
  {
    id: PROJECTS,
    label: "projects",
    color: { fill: "#8ec5f0", shade: "#5a9fd6" },
    children: projectFolders,
  },
];

function tagFor(folder: Folder): FolderTag | undefined {
  if (folder.published === undefined) return undefined;
  return folder.published ? "PUBLISHED" : "WIP";
}

// Walks a path of folder ids from the imagination station down.
function walk(path: string[]): Folder[] {
  const trail: Folder[] = [];
  let level = folders;
  for (const id of path) {
    const next = level.find((f) => f.id === id);
    if (!next) break;
    trail.push(next);
    level = next.children ?? [];
  }
  return trail;
}

type Destination = { view: PrivateView; path: string[] };

const STOP_WORDS = new Set(["the", "and", "for", "with", "from", "into", "open", "show"]);

// Every folder at any depth, with the path that reaches it.
function allFolders(level: Folder[] = folders, parent: string[] = []): { folder: Folder; path: string[] }[] {
  return level.flatMap((folder) => {
    const path = [...parent, folder.id];
    return [{ folder, path }, ...allFolders(folder.children ?? [], path)];
  });
}

// Matches typed words against folder names, so new projects and ideas are
// searchable as soon as they're added. "multi" finds "multilingual ...".
function matchByName(q: string): string[] | null {
  const words = q.split(/[^a-z0-9]+/).filter((w) => w.length >= 3 && !STOP_WORDS.has(w));
  let best: { path: string[]; score: number } | null = null;
  for (const { folder, path } of allFolders()) {
    const labelWords = folder.label.split(/[^a-z0-9]+/);
    const score = words.filter((w) => labelWords.some((lw) => lw.startsWith(w))).length;
    if (score > 0 && (!best || score > best.score)) best = { path, score };
  }
  return best?.path ?? null;
}

function resolve(input: string): Destination | null {
  const q = input.toLowerCase().trim();
  if (!q) return null;
  const byName = matchByName(q);
  if (byName) return { view: "station", path: byName };
  if (["business", "mats", "service", "client", "deal", "pitch"].some((k) => q.includes(k))) {
    return { view: "station", path: [BUSINESS_WORLD] };
  }
  if (["portfolio"].some((k) => q.includes(k))) {
    return { view: "station", path: [PROJECTS] };
  }
  if (["imagination", "station", "prototype", "wip", "work", "build", "folder"].some((k) => q.includes(k))) {
    return { view: "station", path: [] };
  }
  return null;
}

export default function Private() {
  const { isPrivate, view, enter, eject, goTo } = usePrivateSpace();
  const [input, setInput] = useState("");
  const [leaving, setLeaving] = useState(false);
  const [homeVisible, setHomeVisible] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [viewVisible, setViewVisible] = useState(true);
  const [queryValue, setQueryValue] = useState("");
  const [miss, setMiss] = useState(false);
  const [path, setPath] = useState<string[]>([]);
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
    setPath([]);
  }, [isPrivate]);

  function navigate(next: PrivateView, nextPath: string[] = []) {
    setViewVisible(false);
    setTimeout(() => {
      goTo(next);
      setPath(nextPath);
      setOpening(false);
      setViewVisible(true);
    }, 250);
  }

  function openStation() {
    setOpening(true);
    setTimeout(() => navigate("station"), 360);
  }

  function handleQuerySubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = resolve(queryValue);
    if (next) {
      navigate(next.view, next.path);
    } else {
      setMiss(true);
      setTimeout(() => setMiss(false), 2500);
    }
  }

  if (isPrivate) {
    const trail = walk(path);
    const current = trail[trail.length - 1];
    const visible = current ? current.children : folders;
    const crumbs: { label: string; go?: () => void }[] = [
      { label: "house of kei", go: () => navigate("concierge") },
      { label: "imagination station", go: trail.length ? () => navigate("station") : undefined },
      ...trail.map((f, i) => ({
        label: f.label,
        go: i < trail.length - 1 ? () => navigate("station", path.slice(0, i + 1)) : undefined,
      })),
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
            className="pixel-font text-[10px] font-bold uppercase tracking-widest bg-[var(--foreground)] text-[var(--background)] border-2 border-[var(--foreground)] px-5 py-3 shadow-[4px_4px_0_#dc2626] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#dc2626]"
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
                  label="imagination station"
                  size="lg"
                  color={{ fill: "#f7d154", shade: "#d9a92a" }}
                  className={opening ? "pixel-pop" : ""}
                  onClick={openStation}
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
            ) : current && !visible ? (
              <PixelWindow
                title={current.label}
                tag={tagFor(current)}
                onClose={() => navigate("station", path.slice(0, -1))}
              >
                {typeof current.content === "function"
                  ? current.content((p) => navigate("station", p))
                  : current.content}
              </PixelWindow>
            ) : (
              <div className="space-y-10">
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  everything here, published and WIP. mark a project published to mirror it publicly.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-10 justify-items-center">
                  {(visible ?? []).map((f, i) => (
                    <PixelFolder
                      key={f.id}
                      label={f.label}
                      tag={tagFor(f)}
                      color={f.color}
                      delay={i * 70}
                      className="pixel-in"
                      onClick={() => navigate("station", [...path, f.id])}
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
