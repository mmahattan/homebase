import { NextResponse } from "next/server";

const CLIENT_ID     = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;

const ITEMS: { id: string; type: "playlist" | "album" }[] = [
  { id: "3IZS6O7BgxDIuvCPUbkGxR", type: "playlist" },
  { id: "5gkQaUoBKuMPltRNgdjaZP", type: "playlist" },
  { id: "2233LC6uuoi67lGcO2OaBm", type: "album" },
  { id: "1KZ7x4sG5rlDySvbWHDfDh", type: "playlist" },
  { id: "7rN87AkZGx83YTFBsyEin0", type: "playlist" },
  { id: "57BX3znSZLv4xLyT21Bne8", type: "playlist" },
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
    const items = await Promise.all(
      ITEMS.map(({ id, type }) =>
        fetch(
          `https://api.spotify.com/v1/${type}s/${id}?fields=name,images,external_urls`,
          { headers: { Authorization: `Bearer ${token}` }, next: { revalidate: 3600 } }
        ).then((r) => r.json())
      )
    );
    return NextResponse.json(
      items.map((p) => ({
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
