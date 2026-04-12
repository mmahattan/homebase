export type CityVisit = {
  city: string;
  lat: number;
  lon: number;
  dates?: string;
  note?: string;
  weight?: number; // 1–5: controls dot size, proportional to time/significance
};

export type Place = {
  country: string;
  isoNumeric: string;
  cities: CityVisit[];
};

export const places: Place[] = [
  {
    country: "Thailand",
    isoNumeric: "764",
    cities: [
      { city: "Bangkok",    lat: 13.7563,  lon: 100.5018, dates: "2009 – 2023", note: "Homebase", weight: 5 },
      { city: "Krabi",      lat: 8.0863,   lon: 98.9063,  weight: 2 },
      { city: "Phuket",     lat: 7.8804,   lon: 98.3923,  weight: 2 },
      { city: "Chiang Mai", lat: 18.7883,  lon: 98.9853,  dates: "2018", note: "best class trip ever", weight: 2 },
    ],
  },
  {
    country: "Japan",
    isoNumeric: "392",
    cities: [
      { city: "Tokyo", lat: 35.6762, lon: 139.6503, dates: "2006, 2014, 2016, 2017, 2019", weight: 4 },
    ],
  },
  {
    country: "China",
    isoNumeric: "156",
    cities: [
      { city: "Guangzhou", lat: 23.1291, lon: 113.2644, dates: "2006", weight: 1 },
    ],
  },
  {
    country: "Mexico",
    isoNumeric: "484",
    cities: [
      { city: "Mexico City", lat: 19.4326, lon: -99.1332, dates: "2007 – 2009", weight: 3 },
    ],
  },
  {
    country: "Sweden",
    isoNumeric: "752",
    cities: [
      { city: "Stockholm", lat: 59.3293, lon: 18.0686, dates: "all the time <3", weight: 5 },
    ],
  },
  {
    country: "United Kingdom",
    isoNumeric: "826",
    cities: [
      { city: "London", lat: 51.5074, lon: -0.1278, dates: "2011", weight: 2 },
    ],
  },
  {
    country: "France",
    isoNumeric: "250",
    cities: [
      { city: "Nice",  lat: 43.7102, lon: 7.2620,  dates: "2013", weight: 2 },
      { city: "Paris", lat: 48.8566, lon: 2.3522,  dates: "2013", weight: 3 },
    ],
  },
  {
    country: "Switzerland",
    isoNumeric: "756",
    cities: [
      { city: "Lausanne", lat: 46.5197, lon: 6.6323, dates: "2013", weight: 1 },
    ],
  },
  {
    country: "Singapore",
    isoNumeric: "702",
    cities: [
      { city: "Singapore", lat: 1.3521, lon: 103.8198, dates: "2015, 2016, 2017, 2018, 2019, 2023", weight: 3 },
    ],
  },
  {
    country: "Norway",
    isoNumeric: "578",
    cities: [
      { city: "Tromsø", lat: 69.6489, lon: 18.9551, dates: "2018", weight: 1 },
    ],
  },
  {
    country: "Austria",
    isoNumeric: "040",
    cities: [
      { city: "Vienna",   lat: 48.2082, lon: 16.3738, dates: "2019", weight: 2 },
      { city: "Salzburg", lat: 47.8095, lon: 13.0550, dates: "2019", weight: 1 },
    ],
  },
  {
    country: "Malaysia",
    isoNumeric: "458",
    cities: [
      { city: "Kuala Lumpur", lat: 3.1390, lon: 101.6869, dates: "2023", weight: 1 },
    ],
  },
  {
    country: "Indonesia",
    isoNumeric: "360",
    cities: [
      { city: "Jakarta", lat: -6.2088, lon: 106.8456, dates: "2023", weight: 1 },
    ],
  },
  {
    country: "United States",
    isoNumeric: "840",
    cities: [
      { city: "Los Angeles",       lat: 34.0522, lon: -118.2437, dates: "2023 – present", note: "base_2", weight: 5 },
      { city: "Carmel-by-the-Sea", lat: 36.5552, lon: -121.9233, dates: "2026", weight: 1 },
    ],
  },
];
