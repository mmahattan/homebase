import { DM_Sans, Press_Start_2P } from "next/font/google";

// preload: false — the public site never uses this face, so it only downloads
// once the staff side applies it.
export const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
  preload: false,
});

// The Business World's own face: modern and approachable. Only downloads
// where that world is shown.
export const bizFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-biz",
  preload: false,
});
