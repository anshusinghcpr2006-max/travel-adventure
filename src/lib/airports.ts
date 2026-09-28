// Airport / city → IATA lookup utility.
// Supports city names, airport names, and direct IATA codes.

export type Airport = {
  iata: string;
  city: string;
  name: string;
  country: string;
  aliases?: string[];
};

export const AIRPORTS: Airport[] = [
  // India
  {
    iata: "DEL",
    city: "Delhi",
    name: "Indira Gandhi International",
    country: "India",
    aliases: ["new delhi"],
  },
  {
    iata: "BOM",
    city: "Mumbai",
    name: "Chhatrapati Shivaji Maharaj International",
    country: "India",
    aliases: ["bombay", "mum"],
  },
  {
    iata: "BLR",
    city: "Bangalore",
    name: "Kempegowda International",
    country: "India",
    aliases: ["bengaluru"],
  },
  {
    iata: "MAA",
    city: "Chennai",
    name: "Chennai International",
    country: "India",
    aliases: ["madras"],
  },
  { iata: "HYD", city: "Hyderabad", name: "Rajiv Gandhi International", country: "India" },
  {
    iata: "CCU",
    city: "Kolkata",
    name: "Netaji Subhas Chandra Bose International",
    country: "India",
    aliases: ["calcutta"],
  },
  { iata: "GOI", city: "Goa", name: "Dabolim Airport", country: "India" },
  {
    iata: "COK",
    city: "Kochi",
    name: "Cochin International",
    country: "India",
    aliases: ["cochin"],
  },
  { iata: "JAI", city: "Jaipur", name: "Jaipur International", country: "India" },
  {
    iata: "AMD",
    city: "Ahmedabad",
    name: "Sardar Vallabhbhai Patel International",
    country: "India",
  },
  { iata: "PNQ", city: "Pune", name: "Pune Airport", country: "India" },
  // Asia
  {
    iata: "DPS",
    city: "Bali",
    name: "Ngurah Rai International",
    country: "Indonesia",
    aliases: ["denpasar"],
  },
  { iata: "CGK", city: "Jakarta", name: "Soekarno–Hatta International", country: "Indonesia" },
  { iata: "BKK", city: "Bangkok", name: "Suvarnabhumi Airport", country: "Thailand" },
  { iata: "HKT", city: "Phuket", name: "Phuket International", country: "Thailand" },
  { iata: "SIN", city: "Singapore", name: "Changi Airport", country: "Singapore" },
  { iata: "KUL", city: "Kuala Lumpur", name: "Kuala Lumpur International", country: "Malaysia" },
  { iata: "HAN", city: "Hanoi", name: "Noi Bai International", country: "Vietnam" },
  {
    iata: "SGN",
    city: "Ho Chi Minh City",
    name: "Tan Son Nhat International",
    country: "Vietnam",
    aliases: ["saigon"],
  },
  { iata: "HKG", city: "Hong Kong", name: "Hong Kong International", country: "Hong Kong" },
  { iata: "NRT", city: "Tokyo", name: "Narita International", country: "Japan" },
  { iata: "HND", city: "Tokyo Haneda", name: "Haneda Airport", country: "Japan" },
  { iata: "ICN", city: "Seoul", name: "Incheon International", country: "South Korea" },
  { iata: "PEK", city: "Beijing", name: "Beijing Capital International", country: "China" },
  { iata: "PVG", city: "Shanghai", name: "Shanghai Pudong International", country: "China" },
  {
    iata: "MLE",
    city: "Maldives",
    name: "Velana International",
    country: "Maldives",
    aliases: ["male"],
  },
  { iata: "CMB", city: "Colombo", name: "Bandaranaike International", country: "Sri Lanka" },
  { iata: "KTM", city: "Kathmandu", name: "Tribhuvan International", country: "Nepal" },
  // Middle East
  { iata: "DXB", city: "Dubai", name: "Dubai International", country: "UAE" },
  { iata: "AUH", city: "Abu Dhabi", name: "Abu Dhabi International", country: "UAE" },
  { iata: "DOH", city: "Doha", name: "Hamad International", country: "Qatar" },
  { iata: "IST", city: "Istanbul", name: "Istanbul Airport", country: "Turkey" },
  // Europe
  { iata: "LHR", city: "London", name: "Heathrow Airport", country: "UK" },
  { iata: "LGW", city: "London Gatwick", name: "Gatwick Airport", country: "UK" },
  { iata: "CDG", city: "Paris", name: "Charles de Gaulle", country: "France" },
  { iata: "AMS", city: "Amsterdam", name: "Schiphol Airport", country: "Netherlands" },
  { iata: "FRA", city: "Frankfurt", name: "Frankfurt Airport", country: "Germany" },
  { iata: "MUC", city: "Munich", name: "Munich Airport", country: "Germany" },
  { iata: "BCN", city: "Barcelona", name: "Barcelona–El Prat", country: "Spain" },
  { iata: "MAD", city: "Madrid", name: "Adolfo Suárez Madrid–Barajas", country: "Spain" },
  { iata: "FCO", city: "Rome", name: "Leonardo da Vinci–Fiumicino", country: "Italy" },
  { iata: "ZRH", city: "Zurich", name: "Zurich Airport", country: "Switzerland" },
  // Additional Europe
  { iata: "BER", city: "Berlin", name: "Berlin Brandenburg", country: "Germany" },
  { iata: "DUB", city: "Dublin", name: "Dublin Airport", country: "Ireland" },
  { iata: "LIS", city: "Lisbon", name: "Humberto Delgado Airport", country: "Portugal" },
  { iata: "VIE", city: "Vienna", name: "Vienna International", country: "Austria" },
  { iata: "CPH", city: "Copenhagen", name: "Copenhagen Airport", country: "Denmark" },
  { iata: "ARN", city: "Stockholm", name: "Stockholm Arlanda", country: "Sweden" },
  { iata: "HEL", city: "Helsinki", name: "Helsinki Airport", country: "Finland" },
  { iata: "ATH", city: "Athens", name: "Athens International", country: "Greece" },
  { iata: "PRG", city: "Prague", name: "Václav Havel Airport", country: "Czech Republic" },
  { iata: "BRU", city: "Brussels", name: "Brussels Airport", country: "Belgium" },
  { iata: "MXP", city: "Milan", name: "Milan Malpensa", country: "Italy" },
  // Americas
  {
    iata: "JFK",
    city: "New York",
    name: "John F. Kennedy International",
    country: "USA",
    aliases: ["nyc"],
  },
  { iata: "EWR", city: "Newark", name: "Newark Liberty International", country: "USA" },
  { iata: "LAX", city: "Los Angeles", name: "Los Angeles International", country: "USA" },
  { iata: "SFO", city: "San Francisco", name: "San Francisco International", country: "USA" },
  { iata: "ORD", city: "Chicago", name: "O'Hare International", country: "USA" },
  { iata: "DFW", city: "Dallas", name: "Dallas/Fort Worth International", country: "USA" },
  { iata: "DEN", city: "Denver", name: "Denver International", country: "USA" },
  { iata: "SEA", city: "Seattle", name: "Seattle-Tacoma International", country: "USA" },
  {
    iata: "ATL",
    city: "Atlanta",
    name: "Hartsfield-Jackson Atlanta International",
    country: "USA",
  },
  { iata: "MIA", city: "Miami", name: "Miami International", country: "USA" },
  { iata: "YYZ", city: "Toronto", name: "Toronto Pearson International", country: "Canada" },
  { iata: "YVR", city: "Vancouver", name: "Vancouver International", country: "Canada" },
  // Oceania
  { iata: "SYD", city: "Sydney", name: "Sydney Kingsford Smith", country: "Australia" },
  { iata: "MEL", city: "Melbourne", name: "Melbourne Airport", country: "Australia" },
  { iata: "BNE", city: "Brisbane", name: "Brisbane Airport", country: "Australia" },
  { iata: "AKL", city: "Auckland", name: "Auckland Airport", country: "New Zealand" },
];

const IATA_INDEX = new Map(AIRPORTS.map((a) => [a.iata.toUpperCase(), a]));

function norm(s: string) {
  return s.trim().toLowerCase();
}

/**
 * Resolve a user input (city name, airport name, or IATA code) to an IATA code.
 * Returns null if no confident match found.
 */
export function resolveAirport(input: string): Airport | null {
  const raw = input.trim();
  if (!raw) return null;

  // Direct IATA match (3-letter code)
  if (/^[A-Za-z]{3}$/.test(raw)) {
    const hit = IATA_INDEX.get(raw.toUpperCase());
    if (hit) return hit;
  }

  const q = norm(raw);

  // Exact city / alias match
  for (const a of AIRPORTS) {
    if (norm(a.city) === q) return a;
    if (a.aliases?.some((x) => norm(x) === q)) return a;
  }

  // Starts-with city / alias
  for (const a of AIRPORTS) {
    if (norm(a.city).startsWith(q)) return a;
    if (a.aliases?.some((x) => norm(x).startsWith(q))) return a;
  }

  // Substring in city or airport name
  for (const a of AIRPORTS) {
    if (norm(a.city).includes(q) || norm(a.name).includes(q)) return a;
  }

  return null;
}

export function searchAirports(input: string, limit = 8): Airport[] {
  const q = norm(input);
  if (!q) return [];
  const scored: Array<[number, Airport]> = [];
  for (const a of AIRPORTS) {
    const city = norm(a.city);
    const name = norm(a.name);
    const iata = a.iata.toLowerCase();
    let score = 0;
    if (iata === q) score = 100;
    else if (city === q) score = 95;
    else if (a.aliases?.some((x) => norm(x) === q)) score = 90;
    else if (city.startsWith(q)) score = 80;
    else if (iata.startsWith(q)) score = 75;
    else if (a.aliases?.some((x) => norm(x).startsWith(q))) score = 70;
    else if (city.includes(q)) score = 50;
    else if (name.includes(q)) score = 40;
    if (score > 0) scored.push([score, a]);
  }
  scored.sort((a, b) => b[0] - a[0]);
  return scored.slice(0, limit).map(([, a]) => a);
}
