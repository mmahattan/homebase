"use client";

import { useEffect, useState } from "react";

const PLAYLISTS = [
  "1KZ7x4sG5rlDySvbWHDfDh",
  "7rN87AkZGx83YTFBsyEin0",
  "57BX3znSZLv4xLyT21Bne8",
];

const PROFILE = {
  name:      "mats.",
  followers: 56,
  url:       "https://open.spotify.com/user/mats_swimz",
  image:     "/spotify-profile.png",
};

export default function SpotifySection() {
  const [isDark, setIsDark]     = useState(false);
  const [imgOk, setImgOk]       = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const update = () =>
      setIsDark(document.documentElement.getAttribute("data-theme") === "dark");
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const img = new window.Image();
    img.onload  = () => setImgOk(true);
    img.onerror = () => setImgOk(false);
    img.src = PROFILE.image;
  }, []);

  const theme = isDark ? "0" : "1";

  return (
    <div className="space-y-4">
      {/* Profile card */}
      <a
        href={PROFILE.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 border border-[var(--border)] rounded px-4 py-3 hover:border-[var(--muted)] transition-colors w-fit"
      >
        {imgOk ? (
          <img
            src={PROFILE.image}
            alt={PROFILE.name}
            className="rounded-full object-cover shrink-0 w-9 h-9"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-[var(--border)] shrink-0" />
        )}
        <div>
          <p className="text-sm font-medium leading-tight">{PROFILE.name}</p>
          <p className="text-xs text-[var(--muted)]">{PROFILE.followers} followers</p>
        </div>
      </a>

      {/* Compact playlist grid */}
      <div className="grid grid-cols-3 gap-3">
        {PLAYLISTS.map((id) => (
          <div
            key={id}
            onClick={() => setExpanded(id)}
            className="cursor-pointer"
          >
            <iframe
              src={`https://open.spotify.com/embed/playlist/${id}?utm_source=generator&theme=${theme}`}
              width="100%"
              height={80}
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              style={{ borderRadius: "8px", pointerEvents: "none" }}
            />
          </div>
        ))}
      </div>

      {/* Full-width expanded view */}
      {expanded && (
        <div className="relative">
          <button
            onClick={() => setExpanded(null)}
            className="absolute -top-3 right-0 z-10 text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            collapse ↑
          </button>
          <iframe
            src={`https://open.spotify.com/embed/playlist/${expanded}?utm_source=generator&theme=${theme}`}
            width="100%"
            height={352}
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            style={{ borderRadius: "12px" }}
          />
        </div>
      )}
    </div>
  );
}
