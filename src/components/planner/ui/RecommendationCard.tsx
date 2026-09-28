import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FollowUp } from "@/types/itinerary";
import { Button } from "@/components/ui/button";

export function RecommendationCard({ data }: { data: FollowUp[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Refinement Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data?.map((rec, i) => (
          <div key={i} className="border-b pb-2 last:border-0 last:pb-0">
            <h4 className="font-semibold text-sm">{rec.title}</h4>
            <p className="text-sm text-muted-foreground">{rec.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
