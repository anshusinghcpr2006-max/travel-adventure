import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Budget } from "@/types/itinerary";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export function BudgetCard({ data }: { data: Budget }) {
  const breakdown = [
    { label: "Flights", value: data.flights },
    { label: "Hotels", value: data.hotels },
    { label: "Food", value: data.food },
    { label: "Transport", value: data.transport },
    { label: "Activities", value: data.activities },
    { label: "Buffer", value: data.buffer },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Budget Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {breakdown.map((row) => (
              <TableRow key={row.label}>
                <TableCell>{row.label}</TableCell>
                <TableCell className="text-right font-medium">{row.value}</TableCell>
              </TableRow>
            ))}
            <TableRow className="border-t-2">
              <TableCell className="font-bold">Total</TableCell>
              <TableCell className="text-right font-bold text-lg">{data.total}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
