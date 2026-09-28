type TripContext = {
  source: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  travellers: number;
  interests?: string;
};

type ChatContext = Partial<TripContext>;

function parseDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function tripDays(startDate: string, endDate: string) {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  if (!start || !end || end < start) return 3;
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.min(14, Math.max(1, Math.round((end.getTime() - start.getTime()) / msPerDay) + 1));
}

function interestList(interests?: string) {
  return interests
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 5);
}

export function buildFallbackItinerary(data: TripContext, reason?: string) {
  const days = tripDays(data.startDate, data.endDate);
  const interests = interestList(data.interests);
  const interestText = interests?.length
    ? interests.join(", ")
    : "local food, landmarks, and relaxed sightseeing";
  const dailyPlans = Array.from({ length: days }, (_, index) => {
    const day = index + 1;
    if (day === 1) {
      return `### Day ${day}: Arrival and easy orientation
- **Morning:** Travel from ${data.source} to ${data.destination}; keep this day light if arrival is late.
- **Afternoon:** Check in, rest, and walk around a central neighborhood near your stay.
- **Evening:** Try a well-reviewed local restaurant and note nearby transport options for the next day.
- **Estimated spend:** Keep this to meals, local transfers, and essentials.`;
    }

    if (day === days) {
      return `### Day ${day}: Final highlights and departure
- **Morning:** Visit one final nearby attraction or market.
- **Afternoon:** Pack, check out, and leave buffer time for airport or station transfer.
- **Evening:** Depart for ${data.source}, or keep the evening free if you are staying longer.
- **Estimated spend:** Prioritize transport buffer and last-minute meals.`;
    }

    return `### Day ${day}: ${interests?.[index % interests.length] ?? "Sightseeing"} focused day
- **Morning:** Start with a major landmark or guided walk before peak crowds.
- **Afternoon:** Add an experience linked to your interests: ${interestText}.
- **Evening:** Choose a local dining area, then keep time for a short walk or viewpoint.
- **Estimated spend:** Balance one paid activity with free/low-cost exploration.`;
  }).join("\n\n");

  return `## ${data.destination} Trip Plan

> The AI provider is temporarily unavailable (rate limit reached). This is a practical offline fallback plan so you can continue using the app.
${reason ? `> Reason: ${reason}` : ""}

### Overview
Travel from **${data.source}** to **${data.destination}** from **${data.startDate}** to **${data.endDate}** for **${data.travellers} traveller${data.travellers === 1 ? "" : "s"}** with a total budget of **${data.budget}**. This plan emphasizes ${interestText}.

### Transport
- Compare flights, trains, or buses based on your route and date.
- Keep arrival day flexible and avoid prepaid activities immediately after landing.
- If flight search is enabled in the form, use the flight table above this itinerary for options.

${dailyPlans}

### Stay Suggestion
- Pick a central, well-reviewed stay close to public transport.
- Match the hotel tier to your budget: hostel/budget hotel for tight budgets, boutique/mid-range for comfort, premium only if transport and activities still fit.

### Budget Split
- **Transport:** 35-45%
- **Stay:** 25-35%
- **Food:** 15-20%
- **Activities/local transport:** 10-20%

### Local Tips
- **Book Early:** Secure key attractions 2-4 weeks in advance for peak season.
- **Offline Maps:** Download Google Maps for ${data.destination} to save data and battery.
- **Connectivity:** Consider an e-SIM or local SIM for reliable navigation.
- **Hydration:** Always carry a reusable water bottle and check if tap water is potable.

### Safety and Etiquette
- **Respect Culture:** Research local dress codes for religious sites (e.g., covering shoulders/knees).
- **Secure Valuables:** Use a cross-body bag and avoid keeping all cash/cards in one place.
- **Emergency Contacts:** Save local emergency numbers and your embassy's contact info.
- **Tipping Norms:** Check if service is included; a small tip is often appreciated but not always mandatory.
- **ID Security:** Keep a digital copy of your passport in a secure cloud folder.`;
}

export function buildFallbackChatReply(
  message: string,
  tripContext?: ChatContext,
  reason?: string,
) {
  const destination = tripContext?.destination || "your destination";
  return `The AI provider is temporarily unavailable (rate limit reached), so I am using a local fallback response.${reason ? `\n\nReason: ${reason}` : ""}

For **${destination}**, here is a practical way to handle your request:

- If you want the plan relaxed, remove one paid attraction per day and keep evenings flexible.
- If you want to reduce cost, prioritize public transport, street/local food, and free walking areas.
- If your question is about food, shortlist places near your stay instead of crossing the city for every meal.
- If your question is about timing, keep at least 60-90 minutes of buffer around transfers and popular attractions.

Your message was: "${message}"

Once the connection is restored, the chat will return personalized AI answers again.`;
}
