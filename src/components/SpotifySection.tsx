"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const PROFILE = {
  name:      "mats.",
  followers: 56,
  url:       "https://open.spotify.com/user/mats_swimz",
  image:     "/spotify-profile.png",
};

type Playlist = {
  id: string;
  name: string;
  image: string | null;
  url: string;
};

export default function SpotifySection() {
  const [imgOk, setImgOk]         = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    const img = new window.Image();
    img.onload  = () => setImgOk(true);
    img.onerror = () => setImgOk(false);
    img.src = PROFILE.image;
  }, []);

  useEffect(() => {
    fetch("/api/spotify/playlists")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setPlaylists(d); });
  }, []);

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
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-[#1DB954] ml-1 shrink-0">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
      </a>

      {/* Playlist grid */}
      {playlists.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {playlists.map((p) => (
            <a
              key={p.id}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group space-y-2"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-md bg-[var(--border)]">
                {p.image && (
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover transition-opacity duration-200 group-hover:opacity-75"
                  />
                )}
              </div>
              <p className="text-xs font-medium truncate">{p.name}</p>
            </a>
          ))}
        </div>
      )}

      {/* Skeleton while loading */}
      {playlists.length === 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <div className="aspect-square w-full rounded-md bg-[var(--border)] animate-pulse" />
              <div className="h-3 w-2/3 rounded bg-[var(--border)] animate-pulse" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
