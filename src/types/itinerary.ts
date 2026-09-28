export interface Activity {
  name: string;
  category: string;
  description: string;
  whyRecommended: string;
  cost: string;
  duration: string;
  coordinates: { lat: number; lng: number };
  bestTime: string;
  tips: string[];
}

export interface Restaurant {
  name: string;
  rating: number;
  cuisine: string;
  mustTry: string[];
  averageCost: string;
  description: string;
}

export interface Day {
  day: number;
  title: string;
  summary: string;
  estimatedCost: string;
  activities: Activity[];
  restaurants: Restaurant[];
  tips: string[];
}

export interface TripOverview {
  destination: string;
  duration: string;
  budget: string;
  travelerType: string;
  travelStyle: string;
  summary: string;
  highlights: string[];
}

export interface Weather {
  temperature: string;
  rainProbability: string;
  humidity: string;
  sunrise: string;
  sunset: string;
  advice: string;
}

export interface Budget {
  flights: string;
  hotels: string;
  food: string;
  transport: string;
  activities: string;
  buffer: string;
  total: string;
}

export interface Hotel {
  name: string;
  rating: string;
  cost: string;
  area: string;
  description: string;
  bookingUrl: string;
}

export interface PackingList {
  documents: string[];
  clothing: string[];
  electronics: string[];
  medicine: string[];
  accessories: string[];
}

export interface TravelTips {
  hiddenGems: string[];
  touristTraps: string[];
  localCustoms: string[];
  scamPrevention: string[];
}

export interface FollowUp {
  title: string;
  description: string;
}

export interface ItineraryData {
  tripOverview: TripOverview;
  weather?: Weather;
  budget: Budget;
  accommodation?: Hotel[];
  days: Day[];
  packingList?: PackingList;
  travelTips?: TravelTips;
  followUps?: FollowUp[];
}
