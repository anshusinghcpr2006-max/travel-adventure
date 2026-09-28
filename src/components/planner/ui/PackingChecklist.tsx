import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PackingList } from "@/types/itinerary";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function PackingChecklist({ data }: { data: PackingList }) {
  const items = Object.entries(data ?? {});

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Packing Checklist</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map(([category, list]) => (
          <div key={category}>
            <h4 className="font-semibold text-sm capitalize mb-2">{category}</h4>
            <div className="space-y-2">
              {Array.isArray(list) && list.map((item: string, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <Checkbox id={`${category}-${i}`} />
                  <Label htmlFor={`${category}-${i}`} className="text-sm cursor-pointer">
                    {item}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
