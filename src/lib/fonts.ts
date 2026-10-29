import { Press_Start_2P } from "next/font/google";

// preload: false — the public site never uses this face, so it only downloads
// once the staff side applies it.
export const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
  preload: false,
});
