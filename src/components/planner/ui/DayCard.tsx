import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Day } from "@/types/itinerary";
import { ActivityAccordion } from "./ActivityAccordion";
import { RestaurantCard } from "./RestaurantCard";

export function DayCard({ data }: { data: Day }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-xl">
          Day {data.day}: {data.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm">{data.summary}</p>
        
        {data.activities && data.activities.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-2">Activities</h4>
            <ActivityAccordion activities={data.activities} />
          </div>
        )}

        {(data.restaurants ?? []).length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-2">Dining</h4>
            <div className="grid gap-2 sm:grid-cols-2">
              {data.restaurants.map((res, i) => (
                <RestaurantCard key={i} data={res} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
