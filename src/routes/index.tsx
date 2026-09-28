import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Sparkles, Plane, Shield, Globe, Map as MapIcon, ArrowRight, Check } from "lucide-react";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Plane className="h-5 w-5" />
            </div>
            <span className="font-serif text-2xl italic tracking-tight text-foreground">
              Voyage
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/auth/login">Sign In</Link>
            </Button>
            <Button asChild className="rounded-full px-6">
              <Link to="/auth/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 sm:pt-32 sm:pb-24">
        <div className="container relative z-10 mx-auto px-4 text-center sm:px-8">
          <div className="mx-auto mb-6 flex max-w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            <span>Next-gen AI Travel Planning</span>
          </div>
          <h1 className="mx-auto max-w-4xl font-serif text-5xl italic leading-[1.1] tracking-tight text-foreground sm:text-7xl">
            Experience the world, <br />
            <span className="text-primary">perfectly planned.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Your personalized AI travel agent that builds unique itineraries, finds the best
            flights, and guides you through every step of your adventure.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild className="rounded-full px-8 text-lg">
              <Link to="/planner">
                Start Planning Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 text-lg">
              Explore Destinations
            </Button>
          </div>
          <div className="mt-16 flex justify-center">
            <div className="relative w-full max-w-6xl">
              <div className="mb-8 text-center">
                <h2 className="font-serif text-4xl italic text-foreground">See Voyage in Action</h2>
                <p className="mt-2 text-muted-foreground">From a simple destination search to a complete AI-powered travel plan in seconds.</p>
              </div>
              <div className="mb-8 flex flex-wrap justify-center gap-3">
                {["AI Itinerary Generation", "Flight Discovery", "Smart Budget Planning", "Interactive Maps", "PDF Export"].map((badge) => (
                  <div key={badge} className="flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-sm font-medium text-foreground shadow-sm">
                    <Check className="h-4 w-4 text-primary" /> {badge}
                  </div>
                ))}
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {/* Input Preview */}
                <div className="rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                  <h3 className="mb-4 font-semibold text-foreground">Trip Details</h3>
                  <div className="space-y-4 text-sm text-muted-foreground">
                    <div className="flex justify-between border-b pb-2"><span>From</span><span className="font-medium text-foreground">Mumbai</span></div>
                    <div className="flex justify-between border-b pb-2"><span>To</span><span className="font-medium text-foreground">Bali</span></div>
                    <div className="flex justify-between border-b pb-2"><span>Dates</span><span className="font-medium text-foreground">Jun 25 - Jun 29</span></div>
                    <div className="flex justify-between border-b pb-2"><span>Budget</span><span className="font-medium text-foreground">$4000</span></div>
                    <div className="flex justify-between"><span>Interests</span><span className="font-medium text-foreground">Beaches, Culture</span></div>
                  </div>
                </div>
                {/* Itinerary Preview */}
                <div className="rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                  <h3 className="mb-4 font-semibold text-foreground">AI Itinerary</h3>
                  <div className="space-y-4">
                    <div className="rounded-lg bg-primary/5 p-3">
                      <p className="font-medium text-foreground">Day 1: Arrival</p>
                      <p className="text-xs text-muted-foreground">Relax at Uluwatu beach.</p>
                    </div>
                    <div className="rounded-lg bg-primary/5 p-3">
                      <p className="font-medium text-foreground">Day 2: Culture</p>
                      <p className="text-xs text-muted-foreground">Visit Ubud temples.</p>
                    </div>
                  </div>
                </div>
                {/* Map Preview */}
                <div className="relative rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                  <h3 className="mb-4 font-semibold text-foreground">Route Map</h3>
                  <div className="h-32 w-full animate-pulse rounded-lg bg-primary/10"></div>
                  <div className="absolute top-24 left-16 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-xs">A</div>
                  <div className="absolute top-32 right-16 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-xs">B</div>
                </div>
              </div>
              <div className="mt-10 flex justify-center gap-4">
                <Button size="lg" asChild className="rounded-full px-8">
                  <Link to="/planner">Start Planning Free</Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8">
                  Generate Sample Trip
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 -z-10 h-full w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="mb-16 text-center">
            <h2 className="font-serif text-4xl italic text-foreground sm:text-5xl">
              Smart features for smarter travel
            </h2>
            <p className="mt-4 text-muted-foreground">
              Everything you need to plan your next great escape.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard
              icon={<Sparkles className="h-6 w-6" />}
              title="AI Itineraries"
              description="Get day-by-day plans tailored to your interests, budget, and travel style."
            />
            <FeatureCard
              icon={<MapIcon className="h-6 w-6" />}
              title="Interactive Maps"
              description="Visualize your trip with built-in maps and optimized routes between attractions."
            />
            <FeatureCard
              icon={<Globe className="h-6 w-6" />}
              title="Real-time Flights"
              description="Find and compare the best flight options directly within your itinerary."
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="Weather Aware"
              description="Receive smart activity suggestions based on local weather forecasts."
            />
            <FeatureCard
              icon={<Plane className="h-6 w-6" />}
              title="Expert Tips"
              description="Get curated advice on local etiquette, packing, and hidden gems."
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="Offline Access"
              description="Export your plans to PDF or save them for offline access during your trip."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4 text-center sm:px-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Plane className="h-6 w-6 text-primary" />
            <span className="font-serif text-2xl italic tracking-tight">Voyage</span>
          </div>
          <p className="text-muted-foreground">© 2026 Voyage Travel AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border bg-card p-8 shadow-sm transition-all hover:shadow-md">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-foreground">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
