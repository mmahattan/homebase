export type CityVisit = {
  city: string;
  dates?: string;
  note?: string;
};

export type Place = {
  country: string;
  isoNumeric: string; // ISO 3166-1 numeric — used to highlight on the map
  cities: CityVisit[];
};

export const places: Place[] = [
  {
    country: "Thailand",
    isoNumeric: "764",
    cities: [
      { city: "Bangkok", dates: "2009 – 2023", note: "Homebase" },
      { city: "Krabi" },
      { city: "Phuket" },
      { city: "Chiang Mai", dates: "2018", note: "best class trip ever" },
    ],
  },
  {
    country: "Japan",
    isoNumeric: "392",
    cities: [{ city: "Tokyo", dates: "2006, 2014, 2016, 2017, 2019" }],
  },
  {
    country: "China",
    isoNumeric: "156",
    cities: [{ city: "Guangzhou", dates: "2006" }],
  },
  {
    country: "Mexico",
    isoNumeric: "484",
    cities: [{ city: "Mexico City", dates: "2007 – 2009" }],
  },
  {
    country: "Sweden",
    isoNumeric: "752",
    cities: [{ city: "Stockholm", dates: "all the time <3" }],
  },
  {
    country: "United Kingdom",
    isoNumeric: "826",
    cities: [{ city: "London", dates: "2011" }],
  },
  {
    country: "France",
    isoNumeric: "250",
    cities: [
      { city: "Nice", dates: "2013" },
      { city: "Paris", dates: "2013" },
    ],
  },
  {
    country: "Switzerland",
    isoNumeric: "756",
    cities: [{ city: "Lausanne", dates: "2013" }],
  },
  {
    country: "Singapore",
    isoNumeric: "702",
    cities: [{ city: "Singapore", dates: "2015, 2016, 2017, 2018, 2019, 2023" }],
  },
  {
    country: "Norway",
    isoNumeric: "578",
    cities: [{ city: "Tromsø", dates: "2018" }],
  },
  {
    country: "Austria",
    isoNumeric: "040",
    cities: [
      { city: "Vienna", dates: "2019" },
      { city: "Salzburg", dates: "2019" },
    ],
  },
  {
    country: "Malaysia",
    isoNumeric: "458",
    cities: [{ city: "Kuala Lumpur", dates: "2023" }],
  },
  {
    country: "Indonesia",
    isoNumeric: "360",
    cities: [{ city: "Jakarta", dates: "2023" }],
  },
  {
    country: "United States",
    isoNumeric: "840",
    cities: [
      { city: "Los Angeles", dates: "2023 – present", note: "base_2" },
      { city: "Carmel-by-the-Sea", dates: "2026" },
    ],
  },
];
