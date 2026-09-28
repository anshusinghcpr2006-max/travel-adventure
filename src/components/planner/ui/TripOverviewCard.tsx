import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TripOverview } from "@/types/itinerary";

export function TripOverviewCard({ data }: { data: TripOverview }) {
  return (
    <Card className="w-full shadow-lg border-primary/20">
      <CardHeader>
        <CardTitle className="text-3xl font-serif italic">{data.destination}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{data.duration}</Badge>
          <Badge variant="outline">{data.travelStyle}</Badge>
          <Badge variant="outline">{data.budget}</Badge>
        </div>
        <p className="text-muted-foreground">{data.summary}</p>
        <div className="pt-2">
          <h4 className="font-semibold mb-2">Highlights</h4>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            {data.highlights?.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
