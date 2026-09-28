import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { useServerFn } from "@tanstack/react-start";
import { planTrip } from "@/lib/travel.functions";
import { searchFlights, type FlightOption } from "@/lib/flights.functions";
import { resolveAirport, searchAirports } from "@/lib/airports";
import { chatWithAgent } from "@/lib/chat.functions";
import { formatDuration } from "@/lib/flights.mock";
import { geocode } from "@/lib/geocoding";
import { createClient } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import type { ItineraryData } from "@/types/itinerary";
import { TripOverviewCard } from "@/components/planner/ui/TripOverviewCard";
import { BudgetCard } from "@/components/planner/ui/BudgetCard";
import { DayCard } from "@/components/planner/ui/DayCard";

const TripMap = lazy(() => import("@/components/planner/Map"));
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Loader2,
  Plane,
  MapPin,
  Calendar,
  Wallet,
  Users,
  Heart,
  Sparkles,
  ExternalLink,
  Send,
  MessageCircle,
  Copy,
  RotateCcw,
  Check,
  Moon,
  Sun,
  Trash2,
  FileDown,
} from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { exportItineraryPDF } from "@/lib/pdf";

// ... (rest of the file)

type ChatMsg = { role: "user" | "assistant"; content: string };

export const Route = createFileRoute("/planner/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Voyage — AI Travel Planner" },
      {
        name: "description",
        content: "Plan personalized trips with an AI travel agent.",
      },
    ],
  }),
});

function Index() {
  const plan = useServerFn(planTrip);
  const findFlights = useServerFn(searchFlights);
  const chat = useServerFn(chatWithAgent);
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [flights, setFlights] = useState<FlightOption[] | null>(null);
  const [flightsError, setFlightsError] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mapCoords, setMapCoords] = useState<[number, number] | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const supabase = createClient();

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate({ to: "/" });
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatLoading]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const [form, setForm] = useState({
    source: "",
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    travellers: 2,
    interests: "",
    includeTransport: false,
    departureCode: "",
    arrivalCode: "",
    tripType: "Budget" as "Budget" | "Luxury" | "Family" | "Solo" | "Adventure" | "Business",
    detailLevel: "Daily" as "Daily" | "Hour-by-hour",
  });

  const resetForm = () => {
    setForm({
      source: "",
      destination: "",
      startDate: "",
      endDate: "",
      budget: "",
      travellers: 2,
      interests: "",
      includeTransport: false,
      departureCode: "",
      arrivalCode: "",
      tripType: "Budget",
      detailLevel: "Daily",
    });
    setItinerary(null);
    setFlights(null);
    setError(null);
    setFlightsError(null);
    setChatMessages([]);
    toast.success("Form reset");
  };

  const copyItinerary = async () => {
    if (!itinerary) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(itinerary, null, 2));
      setCopied(true);
      toast.success("Itinerary copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy itinerary.");
    }
  };

  const downloadItinerary = () => {
    if (!itinerary) return;
    const result = exportItineraryPDF(itinerary);
    if (!result.success) {
      toast.error("Unable to generate PDF.");
    }
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setItinerary(null);
    setFlights(null);
    setFlightsError(null);
    setChatMessages([]);
    setChatError(null);
    setMapCoords(null);

    try {
      const { includeTransport, departureCode, arrivalCode, ...payload } = form;

      // Geocode destination in parallel
      geocode(form.destination).then((res) => {
        if (res) setMapCoords([res.lat, res.lon]);
      });

      const tasks: Promise<unknown>[] = [
        plan({ data: payload }).then((res) => {
          console.log("!!! ATTENTION: planTrip returned !!!", res);
          if (res.error) {
            setError(res.error);
            toast.error("Failed to plan trip");
          } else {
            setItinerary(res.itinerary);
            toast.success("Itinerary generated!");
          }
        }),
      ];
      if (includeTransport && form.startDate) {
        const depAirport = resolveAirport(departureCode || form.source);
        const arrAirport = resolveAirport(arrivalCode || form.destination);
        if (!depAirport || !arrAirport) {
          setFlightsError(
            `Could not resolve airport for "${!depAirport ? departureCode || form.source : arrivalCode || form.destination}". Try a city name or 3-letter IATA code.`,
          );
        } else {
          console.log("[flights] resolved airports:", {
            from: `${depAirport.city} (${depAirport.iata})`,
            to: `${arrAirport.city} (${arrAirport.iata})`,
          });
          tasks.push(
            findFlights({
              data: {
                departure_id: depAirport.iata,
                arrival_id: arrAirport.iata,
                outbound_date: form.startDate,
              },
            }).then((res) => {
              if (res.error) setFlightsError(res.error);
              setFlights(res.flights);
            }),
          );
        }
      }
      await Promise.all(tasks);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function sendChat(e: React.FormEvent) {
    e.preventDefault();
    const text = chatInput.trim();
    if (!text || !itinerary || chatLoading) return;
    const next: ChatMsg[] = [...chatMessages, { role: "user", content: text }];
    setChatMessages(next);
    setChatInput("");
    setChatLoading(true);
    setChatError(null);
    try {
      const { includeTransport: _it, departureCode: _dc, arrivalCode: _ac, ...tripContext } = form;
      const res = await chat({
        data: {
          itinerary,
          tripContext,
          history: chatMessages,
          message: text,
        },
      });
      if (res.error || !res.reply) {
        setChatError(res.error ?? "No reply.");
      } else {
        setChatMessages([...next, { role: "assistant", content: res.reply }]);
      }
    } catch {
      setChatError("Something went wrong. Please try again.");
    } finally {
      setChatLoading(false);
    }
  }

  console.log("ITINERARY DEBUG:", itinerary);
  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ background: isDark ? "var(--background)" : "var(--gradient-sky)" }}
    >
      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-16">
        <header className="relative mb-10 text-center">
          <div className="absolute right-0 top-0 flex items-center gap-2">
            {user ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="rounded-full border border-border/50 bg-card/40 backdrop-blur"
              >
                Sign Out
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="rounded-full border border-border/50 bg-card/40 backdrop-blur"
              >
                <Link to="/auth/login">Sign In</Link>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDark(!isDark)}
              className="rounded-full border border-border/50 bg-card/40 backdrop-blur"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-slate-700" />
              )}
            </Button>
          </div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3 w-3 text-accent" /> Powered by AI
          </div>
          <div className="mb-4 flex justify-center"></div>
          <h1 className="font-serif text-6xl italic tracking-tight text-foreground sm:text-7xl">
            Voyage
          </h1>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Your AI travel planner. Tell us where, when and what you love — get a tailored itinerary
            in seconds.
          </p>
        </header>

        <Card className="p-6 sm:p-8 shadow-[var(--shadow-soft)] border-border/50">
          <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
            <Field icon={<Plane className="h-4 w-4" />} label="From">
              <Input
                required
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                placeholder="e.g. Mumbai"
              />
            </Field>
            <Field icon={<MapPin className="h-4 w-4" />} label="To">
              <Input
                required
                value={form.destination}
                onChange={(e) => setForm({ ...form, destination: e.target.value })}
                placeholder="e.g. Bali"
              />
            </Field>
            <Field icon={<Calendar className="h-4 w-4" />} label="Start date">
              <Input
                required
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
            </Field>
            <Field icon={<Calendar className="h-4 w-4" />} label="End date">
              <Input
                required
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </Field>
            <Field icon={<Wallet className="h-4 w-4" />} label="Budget (total)">
              <Input
                required
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                placeholder="e.g. $2000"
              />
            </Field>
            <Field icon={<Users className="h-4 w-4" />} label="Travellers">
              <Input
                required
                type="number"
                min={1}
                max={50}
                value={form.travellers}
                onChange={(e) => setForm({ ...form, travellers: Number(e.target.value) })}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field icon={<Heart className="h-4 w-4" />} label="Interests">
                <Textarea
                  value={form.interests}
                  onChange={(e) => setForm({ ...form, interests: e.target.value })}
                  placeholder="beaches, local food, hiking, museums…"
                  rows={2}
                />
              </Field>
            </div>

            <Field icon={<Sparkles className="h-4 w-4" />} label="Trip Style">
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={form.tripType}
                onChange={(e) =>
                  setForm({
                    ...form,
                    tripType: e.target.value as
                      | "Budget"
                      | "Luxury"
                      | "Family"
                      | "Solo"
                      | "Adventure"
                      | "Business",
                  })
                }
              >
                <option value="Budget">Budget</option>
                <option value="Luxury">Luxury</option>
                <option value="Family">Family</option>
                <option value="Solo">Solo</option>
                <option value="Adventure">Adventure</option>
                <option value="Business">Business</option>
              </select>
            </Field>

            <Field icon={<Calendar className="h-4 w-4" />} label="Detail Level">
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={form.detailLevel}
                onChange={(e) =>
                  setForm({
                    ...form,
                    detailLevel: e.target.value as "Daily" | "Hour-by-hour",
                  })
                }
              >
                <option value="Daily">Daily Breakdown</option>
                <option value="Hour-by-hour">Hour-by-hour</option>
              </select>
            </Field>

            <div className="sm:col-span-2 rounded-lg border border-border/60 bg-card/40 p-3 space-y-3">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="includeTransport"
                  checked={form.includeTransport}
                  onCheckedChange={(v) => setForm({ ...form, includeTransport: v === true })}
                />
                <Label
                  htmlFor="includeTransport"
                  className="flex items-center gap-2 cursor-pointer text-foreground/80"
                >
                  <Plane className="h-4 w-4 text-accent" />
                  Include transportation (flight) details
                </Label>
              </div>
              {form.includeTransport && (
                <div className="grid sm:grid-cols-2 gap-3 pl-7">
                  <AirportField
                    label="From (city or IATA)"
                    value={form.departureCode}
                    onChange={(v) => setForm({ ...form, departureCode: v })}
                    listId="dep-airports"
                    placeholder="Mumbai, BOM, Bali…"
                  />
                  <AirportField
                    label="To (city or IATA)"
                    value={form.arrivalCode}
                    onChange={(v) => setForm({ ...form, arrivalCode: v })}
                    listId="arr-airports"
                    placeholder="Hanoi, HAN, Bali…"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-center pt-2 sm:col-span-2 gap-3">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={resetForm}
                className="rounded-full px-6 border-border/50 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30 transition-all"
              >
                <RotateCcw className="mr-2 h-4 w-4" /> Reset
              </Button>
              <Button
                type="submit"
                disabled={loading}
                size="lg"
                className="rounded-full px-8 text-base text-accent-foreground shadow-md hover:opacity-90"
                style={{ background: "var(--gradient-sun)" }}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Planning your trip…
                  </>
                ) : (
                  <>
                    Plan my trip <Plane className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>

        {error && (
          <Card className="mt-6 p-4 border-destructive/40 text-destructive bg-destructive/5">
            {error}
          </Card>
        )}

        {flightsError && (
          <Card className="mt-6 p-4 border-destructive/40 text-destructive bg-destructive/5">
            Flights: {flightsError}
          </Card>
        )}

        {flights && flights.length > 0 && (
          <Card className="mt-8 p-6 sm:p-8 shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-2 mb-5 text-accent">
              <Plane className="h-5 w-5" />
              <h2 className="text-xl font-semibold text-foreground">Best flight options</h2>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Airline</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Departure</TableHead>
                    <TableHead>Arrival</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Stops</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Book</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flights?.map((opt, i) => {
                    const first = opt.flights?.[0];
                    const last = opt.flights?.[(opt.flights?.length ?? 0) - 1];
                    const stops = (opt.flights?.length ?? 1) - 1;

                    if (!first || !last) return null;

                    const AIRLINE_SITES: Record<string, string> = {
                      THAI: "https://www.thaiairways.com",
                      "Thai Airways": "https://www.thaiairways.com",
                      "Air India": "https://www.airindia.com",
                      Emirates: "https://www.emirates.com",
                      Qatar: "https://www.qatarairways.com",
                      "Qatar Airways": "https://www.qatarairways.com",
                      Lufthansa: "https://www.lufthansa.com",
                      "Singapore Airlines": "https://www.singaporeair.com",
                      IndiGo: "https://www.goindigo.in",
                      Vistara: "https://www.airvistara.com",
                      "British Airways": "https://www.britishairways.com",
                      Delta: "https://www.delta.com",
                      "American Airlines": "https://www.aa.com",
                      United: "https://www.united.com",
                    };
                    const airlineSite = AIRLINE_SITES[first.airline];
                    const fallbackSearch = `https://www.skyscanner.com/transport/flights/${first.departure_airport.id.toLowerCase()}/${last.arrival_airport.id.toLowerCase()}/`;
                    const bookingUrl = airlineSite ?? fallbackSearch;

                    let isSafe = false;
                    try {
                      const u = new URL(bookingUrl);
                      isSafe = u.protocol === "https:";
                    } catch {
                      isSafe = false;
                    }

                    return (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <img src={opt.airline_logo} alt="" className="h-6 w-6 rounded" />
                            <span className="font-medium text-foreground">{first.airline}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {opt.flights?.map((f) => f.flight_number).join(" · ")}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-foreground">
                          {first.departure_airport.id} → {last.arrival_airport.id}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {first.departure_airport.time}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {last.arrival_airport.time}
                        </TableCell>
                        <TableCell>{formatDuration(opt.total_duration)}</TableCell>
                        <TableCell>{stops === 0 ? "Non-stop" : `${stops} stop`}</TableCell>
                        <TableCell className="text-right font-semibold text-foreground">
                          ${opt.price}
                        </TableCell>
                        <TableCell className="text-right">
                          {isSafe ? (
                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                              title={
                                airlineSite
                                  ? `Book on ${first.airline}`
                                  : "Search flights on Skyscanner"
                              }
                            >
                              <a href={bookingUrl} target="_blank" rel="noopener noreferrer">
                                {airlineSite ? "Book" : "Search"}{" "}
                                <ExternalLink className="ml-1 h-3 w-3" />
                              </a>
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled
                              title="Booking unavailable"
                            >
                              Booking unavailable
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}

        {itinerary && (
          <div className="mt-8 space-y-8">
            {(() => {
              console.log("--- RENDERING ITINERARY ---");
              console.log("tripOverview", itinerary?.tripOverview);
              console.log("days", itinerary?.days);
              console.log("budget", itinerary?.budget);
              console.log("accommodation", itinerary?.accommodation);
              console.log("packingList", itinerary?.packingList);
              console.log("travelTips", itinerary?.travelTips);
              console.log("followUps", itinerary?.followUps);
              return null;
            })()}
            {mapCoords && (
              <Card className="overflow-hidden p-0 shadow-[var(--shadow-soft)] border-border/50">
                <Suspense
                  fallback={
                    <div className="h-[400px] w-full animate-pulse bg-muted flex items-center justify-center italic text-muted-foreground">
                      Loading interactive map...
                    </div>
                  }
                >
                  <TripMap
                    center={mapCoords}
                    markers={[{ position: mapCoords, label: form.destination }]}
                  />
                </Suspense>
              </Card>
            )}

            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
              {itinerary?.tripOverview && (
                <div className="grid gap-6">
                  <TripOverviewCard data={itinerary.tripOverview} />
                </div>
              )}

              {itinerary?.budget && <BudgetCard data={itinerary.budget} />}

              {itinerary?.days && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Your Itinerary</h2>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={downloadItinerary}>
                        <FileDown className="mr-2 h-4 w-4" /> Download PDF
                      </Button>
                    </div>
                  </div>
                  {itinerary?.days?.map((day) => (
                    <DayCard key={day.day} data={day} />
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setChatOpen(true)}
              className="group mt-8 w-full text-left"
            >
              <Card className="border-accent/30 p-6 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:shadow-lg group-hover:border-accent sm:p-8">
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full transition-transform group-hover:scale-110"
                    style={{ background: "var(--gradient-sun)" }}
                  >
                    <MessageCircle className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">Ask your travel agent</h3>
                    <p className="text-sm text-muted-foreground">
                      {(chatMessages?.length ?? 0) > 0
                        ? `${chatMessages?.length} message${chatMessages?.length === 1 ? "" : "s"} · tap to continue`
                        : "Tweak the plan, swap activities, or get tips."}
                    </p>
                  </div>
                  <Send className="h-5 w-5 text-accent transition-transform group-hover:translate-x-1" />
                </div>
              </Card>
            </button>

            <Dialog open={chatOpen} onOpenChange={setChatOpen}>
              <DialogContent className="max-w-2xl w-[95vw] p-0 gap-0 max-h-[90vh] flex flex-col">
                <DialogHeader className="p-5 border-b border-border">
                  <DialogTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-accent" />
                    Ask your travel agent
                  </DialogTitle>
                  <DialogDescription>
                    Tweak the plan, swap activities, ask for restaurant picks, or get packing tips.
                  </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-5 space-y-3 min-h-[300px]">
                  {(chatMessages?.length ?? 0) === 0 && (
                    <div className="text-sm text-muted-foreground italic">
                      Try: "Make day 2 more relaxed" or "Suggest vegetarian dinner spots".
                    </div>
                  )}
                  {chatMessages?.map((m, i) => (
                    <div
                      key={i}
                      className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                          m.role === "user"
                            ? "bg-accent text-accent-foreground"
                            : "bg-muted border border-border text-foreground"
                        }`}
                      >
                        {m.role === "assistant" ? (
                          <article className="prose prose-sm max-w-none prose-headings:font-semibold prose-headings:text-foreground prose-strong:text-foreground prose-a:text-accent prose-p:my-1 prose-ul:my-1">
                            <ReactMarkdown>{m.content}</ReactMarkdown>
                          </article>
                        ) : (
                          <span className="whitespace-pre-wrap">{m.content}</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="rounded-2xl px-4 py-2 text-sm bg-muted border border-border text-muted-foreground inline-flex items-center gap-2">
                        <Loader2 className="h-3 w-3 animate-spin" /> Thinking…
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {chatError && <div className="px-5 pb-2 text-sm text-destructive">{chatError}</div>}

                <form onSubmit={sendChat} className="p-4 border-t border-border flex gap-2">
                  <Input
                    autoFocus
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask anything about your trip…"
                    disabled={chatLoading}
                  />
                  <Button
                    type="submit"
                    disabled={chatLoading || !chatInput.trim()}
                    className="text-accent-foreground"
                    style={{ background: "var(--gradient-sun)" }}
                  >
                    {chatLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-foreground/80">
        <span className="text-accent">{icon}</span>
        {label}
      </Label>
      {children}
    </div>
  );
}

function AirportField({
  label,
  value,
  onChange,
  listId,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  listId: string;
  placeholder?: string;
}) {
  const suggestions = searchAirports(value, 8);
  const resolved = resolveAirport(value);
  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input
        required
        list={listId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
      />
      <datalist id={listId}>
        {suggestions?.map((a) => (
          <option key={a.iata} value={a.city}>
            {a.iata} — {a.name}, {a.country}
          </option>
        ))}
      </datalist>
      {value && (
        <p className={`text-xs ${resolved ? "text-muted-foreground" : "text-destructive"}`}>
          {resolved
            ? `→ ${resolved.iata} · ${resolved.city}, ${resolved.country}`
            : "No matching airport — try a city name or IATA code."}
        </p>
      )}
    </div>
  );
}
