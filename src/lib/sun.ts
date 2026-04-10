/**
 * Returns true if the sun is currently up at the given coordinates.
 * Uses an approximate solar position formula (accurate to ~minutes).
 */
export function isDaytime(lat: number, lon: number): boolean {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86_400_000);

  // Solar declination
  const decl =
    (-23.45 * Math.cos(((360 / 365) * (dayOfYear + 10) * Math.PI) / 180) * Math.PI) / 180;

  const latRad = (lat * Math.PI) / 180;
  const cosH = -Math.tan(latRad) * Math.tan(decl);

  if (cosH > 1) return false; // polar night
  if (cosH < -1) return true; // midnight sun

  const H = (Math.acos(cosH) * 180) / Math.PI; // hour angle at sunrise/sunset

  // Sunrise and sunset in UTC hours
  const sunriseUTC = 12 - H / 15 - lon / 15;
  const sunsetUTC = 12 + H / 15 - lon / 15;

  const nowUTC = now.getUTCHours() + now.getUTCMinutes() / 60;
  return nowUTC >= sunriseUTC && nowUTC <= sunsetUTC;
}
