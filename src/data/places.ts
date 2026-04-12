export type Place = {
  country: string;     // display name
  isoNumeric: string;  // ISO 3166-1 numeric code (used to highlight on the map)
  dates: string;       // e.g. "2019 – 2023" or "Jun 2024"
};

// ISO 3166-1 numeric reference for common countries:
// USA: 840 · Thailand: 764 · UK: 826 · Japan: 392 · France: 250
// Germany: 276 · Singapore: 702 · Australia: 036 · Canada: 124
// South Korea: 410 · Malaysia: 458 · Italy: 380 · Spain: 724

export const places: Place[] = [];
