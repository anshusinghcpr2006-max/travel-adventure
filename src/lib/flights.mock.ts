export type MockFlightSegment = {
  departure_airport: { name: string; id: string; time: string };
  arrival_airport: { name: string; id: string; time: string };
  duration: number;
  airplane: string;
  airline: string;
  airline_logo: string;
  travel_class: string;
  flight_number: string;
  legroom: string;
  extensions: string[];
  overnight?: boolean;
};

export type MockFlightOption = {
  flights: MockFlightSegment[];
  layovers?: { duration: number; name: string; id: string }[];
  total_duration: number;
  carbon_emissions: {
    this_flight: number;
    typical_for_this_route: number;
    difference_percent: number;
  };
  price: number;
  type: string;
  airline_logo: string;
  booking_token: string;
};

export const MOCK_FLIGHTS: { best_flights: MockFlightOption[] } = {
  best_flights: [
    {
      flights: [
        {
          departure_airport: {
            name: "Indira Gandhi International Airport",
            id: "DEL",
            time: "2026-05-27 23:30",
          },
          arrival_airport: { name: "Suvarnabhumi Airport", id: "BKK", time: "2026-05-28 05:25" },
          duration: 265,
          airplane: "Boeing 777",
          airline: "THAI",
          airline_logo: "https://www.gstatic.com/flights/airline_logos/70px/TG.png",
          travel_class: "Economy",
          flight_number: "TG 316",
          legroom: "32 in",
          extensions: [
            "Above average legroom (32 in)",
            "In-seat power & USB outlets",
            "On-demand video",
            "Carbon emissions estimate: 278 kg",
          ],
          overnight: true,
        },
        {
          departure_airport: { name: "Suvarnabhumi Airport", id: "BKK", time: "2026-05-28 17:50" },
          arrival_airport: {
            name: "Noi Bai International Airport",
            id: "HAN",
            time: "2026-05-28 19:40",
          },
          duration: 110,
          airplane: "Airbus A320",
          airline: "THAI",
          airline_logo: "https://www.gstatic.com/flights/airline_logos/70px/TG.png",
          travel_class: "Economy",
          flight_number: "TG 564",
          legroom: "30 in",
          extensions: [
            "Average legroom (30 in)",
            "Stream media to your device",
            "Carbon emissions estimate: 126 kg",
          ],
        },
      ],
      layovers: [{ duration: 745, name: "Suvarnabhumi Airport", id: "BKK" }],
      total_duration: 1120,
      carbon_emissions: {
        this_flight: 405000,
        typical_for_this_route: 217000,
        difference_percent: 87,
      },
      price: 384,
      type: "One way",
      airline_logo: "https://www.gstatic.com/flights/airline_logos/70px/TG.png",
      booking_token: "mock-token-1",
    },
    {
      flights: [
        {
          departure_airport: {
            name: "Indira Gandhi International Airport",
            id: "DEL",
            time: "2026-05-27 01:20",
          },
          arrival_airport: {
            name: "Noi Bai International Airport",
            id: "HAN",
            time: "2026-05-27 07:20",
          },
          duration: 270,
          airplane: "Airbus A320neo",
          airline: "Air India",
          airline_logo: "https://www.gstatic.com/flights/airline_logos/70px/AI.png",
          travel_class: "Economy",
          flight_number: "AI 2390",
          legroom: "28 in",
          extensions: [
            "Below average legroom (28 in)",
            "In-seat USB outlet",
            "Stream media to your device",
            "Carbon emissions estimate: 224 kg",
          ],
          overnight: true,
        },
      ],
      total_duration: 270,
      carbon_emissions: {
        this_flight: 225000,
        typical_for_this_route: 217000,
        difference_percent: 4,
      },
      price: 406,
      type: "One way",
      airline_logo: "https://www.gstatic.com/flights/airline_logos/70px/AI.png",
      booking_token: "mock-token-2",
    },
  ],
};

export function formatDuration(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}
