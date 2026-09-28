import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hotel } from "@/types/itinerary";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export function HotelCard({ data }: { data: Hotel }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">{data.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-2">
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <MapPin className="h-3 w-3" /> {data.area}
        </p>
        <p className="text-xs">{data.description}</p>
        <div className="flex justify-between items-center pt-2">
          <span className="font-bold">{data.cost}</span>
          <span className="text-sm">Rating: {data.rating}</span>
        </div>
        <Button asChild className="w-full mt-2" variant="outline">
          <a href={data.bookingUrl} target="_blank" rel="noopener noreferrer">
            Book Now
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
