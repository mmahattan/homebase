import { NextResponse } from "next/server";

const CLIENT_ID     = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;

const PLAYLIST_IDS = [
  "1KZ7x4sG5rlDySvbWHDfDh",
  "7rN87AkZGx83YTFBsyEin0",
  "57BX3znSZLv4xLyT21Bne8",
];

async function getAccessToken(): Promise<string> {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
    next: { revalidate: 3600 },
  });
  const data = await res.json();
  return data.access_token;
}

export async function GET() {
  try {
    const token = await getAccessToken();
    const playlists = await Promise.all(
      PLAYLIST_IDS.map((id) =>
        fetch(
          `https://api.spotify.com/v1/playlists/${id}?fields=name,images,external_urls`,
          { headers: { Authorization: `Bearer ${token}` }, next: { revalidate: 3600 } }
        ).then((r) => r.json())
      )
    );
    return NextResponse.json(
      playlists.map((p) => ({
        id:    p.id,
        name:  p.name,
        image: p.images?.[0]?.url ?? null,
        url:   p.external_urls?.spotify,
      }))
    );
  } catch {
    return NextResponse.json({ error: "Failed to fetch playlists" }, { status: 500 });
  }
}
