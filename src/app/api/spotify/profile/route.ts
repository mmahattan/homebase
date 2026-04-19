import { NextResponse } from "next/server";

const CLIENT_ID     = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const USER_ID       = "mats_swimz";

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
    const res = await fetch(`https://api.spotify.com/v1/users/${USER_ID}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 3600 },
    });
    const user = await res.json();
    return NextResponse.json({
      name:      user.display_name,
      image:     user.images?.[0]?.url ?? null,
      followers: user.followers?.total ?? 0,
      url:       user.external_urls?.spotify,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}
