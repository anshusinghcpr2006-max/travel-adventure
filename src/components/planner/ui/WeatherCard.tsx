import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Weather } from "@/types/itinerary";
import { CloudSun, Droplets, Sunrise, Sunset, Thermometer } from "lucide-react";

export function WeatherCard({ data }: { data: Weather }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Weather Forecast</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Thermometer className="h-4 w-4" /> {data.temperature}
        </div>
        <div className="flex items-center gap-2">
          <Droplets className="h-4 w-4" /> {data.rainProbability}
        </div>
        <div className="flex items-center gap-2">
          <Sunrise className="h-4 w-4" /> {data.sunrise}
        </div>
        <div className="flex items-center gap-2">
          <Sunset className="h-4 w-4" /> {data.sunset}
        </div>
        <p className="col-span-2 text-sm text-muted-foreground mt-2">{data.advice}</p>
      </CardContent>
    </Card>
  );
}
