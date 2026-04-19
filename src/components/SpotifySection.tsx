"use client";

import { useEffect, useState } from "react";

const PLAYLISTS = [
  "1KZ7x4sG5rlDySvbWHDfDh",
  "7rN87AkZGx83YTFBsyEin0",
  "57BX3znSZLv4xLyT21Bne8",
];

const USER = "mats_swimz";

export default function SpotifySection() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const update = () =>
      setIsDark(document.documentElement.getAttribute("data-theme") === "dark");
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  const theme = isDark ? "0" : "1";

  return (
    <div className="space-y-4">
      {/* Profile follow button */}
      <iframe
        src={`https://open.spotify.com/follow/1/?uri=spotify:user:${USER}&size=detail&theme=${isDark ? "dark" : "light"}`}
        width="100%"
        height="56"
        scrolling="no"
        frameBorder="0"
        style={{ border: "none", overflow: "hidden" }}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      />

      {/* Playlists */}
      {PLAYLISTS.map((id) => (
        <iframe
          key={id}
          src={`https://open.spotify.com/embed/playlist/${id}?utm_source=generator&theme=${theme}`}
          width="100%"
          height="352"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          style={{ borderRadius: "12px" }}
        />
      ))}
    </div>
  );
}
