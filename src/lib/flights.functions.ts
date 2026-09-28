import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  departure_id: z.string().min(3).max(4),
  arrival_id: z.string().min(3).max(4),
  outbound_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type FlightSegment = {
  departure_airport: { name: string; id: string; time: string };
  arrival_airport: { name: string; id: string; time: string };
  duration: number;
  airline: string;
  airline_logo: string;
  flight_number: string;
};

export type FlightOption = {
  flights: FlightSegment[];
  total_duration: number;
  price: number;
  type: string;
  airline_logo: string;
  booking_token?: string;
};

export const searchFlights = createServerFn({ method: "POST" })
  .inputValidator((input) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    let apiKey = import.meta.env.VITE_SERPAPI_API_KEY?.trim();
    if (apiKey?.startsWith('"') && apiKey?.endsWith('"')) {
      apiKey = apiKey.substring(1, apiKey.length - 1);
    }
    if (!apiKey) {
      return { flights: [] as FlightOption[], error: "SERPAPI_KEY not configured" };
    }

    const url = new URL("https://serpapi.com/search.json");
    url.searchParams.set("engine", "google_flights");
    url.searchParams.set("type", "2"); // one-way
    url.searchParams.set("departure_id", data.departure_id);
    url.searchParams.set("arrival_id", data.arrival_id);
    url.searchParams.set("outbound_date", data.outbound_date);
    url.searchParams.set("currency", "USD");
    url.searchParams.set("hl", "en");
    url.searchParams.set("api_key", apiKey);

    try {
      const res = await fetch(url.toString());
      if (!res.ok) {
        return { flights: [], error: `SerpAPI error (${res.status})` };
      }
      const json = (await res.json()) as {
        best_flights?: FlightOption[];
        other_flights?: FlightOption[];
        error?: string;
      };
      if (json.error) return { flights: [], error: json.error };
      const flights = [...(json.best_flights ?? []), ...(json.other_flights ?? [])];
      return { flights, error: null as string | null };
    } catch (e) {
      console.error("SerpAPI fetch failed", e);
      return { flights: [] as FlightOption[], error: "Failed to reach flight provider" };
    }
  });
