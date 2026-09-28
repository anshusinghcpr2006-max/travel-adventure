import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { callGemini } from "./gemini";
import { buildFallbackItinerary } from "./travel.fallback";
import { createClient } from "@supabase/supabase-js";
import { searchFlights } from "./flights.functions";
import { resolveAirport } from "./airports";
import type { ItineraryData } from "../types/itinerary";

const TripInput = z.object({
  source: z.string().min(1).max(100),
  destination: z.string().min(1).max(100),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  budget: z.string().max(100),
  travellers: z.number().int().min(1).max(100),
  interests: z.string().max(1000).optional(),
  tripType: z.enum(["Budget", "Luxury", "Family", "Solo", "Adventure", "Business"]),
  detailLevel: z.enum(["Daily", "Hour-by-hour"]),
});

export const planTrip = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => TripInput.parse(input))
  .handler(async ({ data }) => {
    let flightContext = "No specific flight data available.";
    
    try {
      const dep = resolveAirport(data.source);
      const arr = resolveAirport(data.destination);
      
      if (dep && arr) {
        console.log(`[planTrip] Fetching flight context for ${dep.iata} -> ${arr.iata} on ${data.startDate}`);
        const flightRes = await searchFlights({
          data: {
            departure_id: dep.iata,
            arrival_id: arr.iata,
            outbound_date: data.startDate,
          }
        });
        
        if (flightRes.flights && flightRes.flights.length > 0) {
          const best = flightRes.flights[0];
          flightContext = `Available flight option: ${best.flights[0].airline} for approximately $${best.price}. Total duration: ${best.total_duration} mins.`;
        }
      }
    } catch (e) {
      console.warn("[planTrip] Could not fetch flight context:", e);
    }

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const tripDays =
      Math.ceil(
        (endDate.getTime() - startDate.getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1;

    const prompt = `You are a world-class travel planner. Return ONLY a JSON object that strictly adheres to the following TypeScript interface:

${JSON.stringify({
  tripOverview: {
    destination: "string",
    duration: "string",
    budget: "string",
    travelerType: "string",
    travelStyle: "string",
    summary: "string",
    highlights: ["string"],
  },
  budget: {
    flights: "string",
    hotels: "string",
    food: "string",
    transport: "string",
    activities: "string",
    buffer: "string",
    total: "string",
  },
  days: [
    {
      day: 1,
      title: "string",
      summary: "string",
      estimatedCost: "string",
      activities: [
        {
          name: "string",
          category: "string",
          description: "string",
          whyRecommended: "string",
          cost: "string",
          duration: "string",
          coordinates: { lat: 0, lng: 0 },
          bestTime: "string",
          tips: ["string"],
        },
      ],
      restaurants: [
        {
          name: "string",
          rating: 0,
          cuisine: "string",
          mustTry: ["string"],
          averageCost: "string",
          description: "string",
        },
      ],
      tips: ["string"],
    },
  ],
})}

IMPORTANT:
* Generate up to 5 detailed itinerary days based on trip duration (${tripDays} days).
* Generate 2–3 activities per day.
* Generate 1–2 restaurants per day.
* Activity description: max 30 words.
* Restaurant description: max 25 words.
* Day summary: max 40 words.
* Tips arrays must contain at most 2 items.
* Return concise but informative JSON only.
* Do not include explanations outside JSON.
* Budget rules: Allocate budget realistically based on the chosen trip type (${data.tripType}). Use "Miscellaneous Expenses" instead of "Buffer".
* Style consistency:
  - Budget: Affordable hotels, local restaurants, public transport.
  - Luxury: Premium resorts, private transfers, fine dining.
  - Adventure: Hiking, outdoor activities, nature experiences.
  - Family: Kid-friendly attractions, safe transport, family accommodations.

Generate a premium travel plan for ${data.travellers} traveler(s) to ${data.destination} from ${data.startDate} to ${data.endDate}.
Budget: ${data.budget}. Trip Style: ${data.tripType}. Interests: ${data.interests}.
${flightContext}`;

    try {
      console.log("Calling Gemini API...");
      const response = await callGemini([{ role: "user", content: prompt }]);
      console.log("Gemini API call successful.");
      
      console.log("Response Length:", response.length);
      console.log("Last 1000 characters:");
      console.log(response.slice(-1000));
      
      console.log("Parsing Gemini response as JSON...");
      try {
        const itinerary = JSON.parse(response) as ItineraryData;
        console.log("JSON parsing successful.");
        return { itinerary, error: null };
      } catch (err) {
        console.error("JSON Parse Failed");
        console.error(err);
        return { 
          itinerary: null, 
          error: "Gemini response was truncated before JSON completion." 
        };
      }
    } catch (e) {
      console.error("--- planTrip Error ---");
      console.error(e);
      console.error("----------------------");
      return { itinerary: null, error: e instanceof Error ? e.message : "Failed to generate itinerary." };
    }
  });
