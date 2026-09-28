import { Card, CardContent } from "@/components/ui/card";
import { Restaurant } from "@/types/itinerary";
import { Utensils } from "lucide-react";

export function RestaurantCard({ data }: { data: Restaurant }) {
  return (
    <Card className="bg-muted/30">
      <CardContent className="p-4 space-y-2">
        <div className="flex justify-between items-start">
          <h4 className="font-semibold flex items-center gap-2">
            <Utensils className="h-4 w-4" /> {data.name}
          </h4>
          <span className="text-xs bg-primary/10 px-2 py-1 rounded">★ {data.rating}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          {data.cuisine} · {data.averageCost}
        </p>
        <p className="text-sm">{data.description}</p>
        <p className="text-xs font-medium">Must Try: {data.mustTry?.join(", ") ?? "N/A"}</p>
      </CardContent>
    </Card>
  );
}
