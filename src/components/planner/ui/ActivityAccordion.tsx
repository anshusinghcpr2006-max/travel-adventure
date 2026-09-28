import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "@/types/itinerary";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function ActivityAccordion({ activities }: { activities: Activity[] }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {activities?.map((act, i) => (
        <AccordionItem key={i} value={`act-${i}`}>
          <AccordionTrigger>
            {act.name} <span className="text-xs text-muted-foreground ml-auto">{act.category}</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-2 text-sm">
            <p>{act.description}</p>
            <p>
              <strong>Why:</strong> {act.whyRecommended}
            </p>
            <div className="flex gap-4 text-xs font-semibold">
              <span>Cost: {act.cost}</span>
              <span>Time: {act.duration}</span>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
