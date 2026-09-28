import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { ItineraryData } from "@/types/itinerary";

export function exportItineraryPDF(itinerary: ItineraryData): { success: boolean, error?: any } {
  try {
    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = margin;

    // Title Page / Header
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("AI Travel Itinerary", pageWidth / 2, y, { align: "center" });
    y += 15;
    doc.setFontSize(18);
    doc.setFont("helvetica", "normal");
    doc.text(itinerary.tripOverview.destination, pageWidth / 2, y, { align: "center" });
    y += 10;
    doc.setFontSize(12);
    doc.text(`${itinerary.tripOverview.duration} Trip`, pageWidth / 2, y, { align: "center" });
    y += 20;

    // Trip Overview
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Trip Overview", margin, y);
    y += 10;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Destination: ${itinerary.tripOverview.destination}`, margin, y);
    y += 6;
    doc.text(`Duration: ${itinerary.tripOverview.duration}`, margin, y);
    y += 6;
    doc.text(`Budget: ${itinerary.tripOverview.budget}`, margin, y);
    y += 6;
    doc.text(`Travel Style: ${itinerary.tripOverview.travelStyle}`, margin, y);
    y += 6;
    doc.text(`Summary: ${itinerary.tripOverview.summary}`, margin, y, { maxWidth: pageWidth - 2 * margin });
    y += 15;

    // Budget Breakdown
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Budget Breakdown", margin, y);
    y += 5;
    autoTable(doc, {
      startY: y,
      head: [["Category", "Amount"]],
      body: [
        ["Flights", itinerary.budget.flights],
        ["Hotels", itinerary.budget.hotels],
        ["Food", itinerary.budget.food],
        ["Transport", itinerary.budget.transport],
        ["Activities", itinerary.budget.activities],
        ["Miscellaneous Expenses", itinerary.budget.buffer],
        ["Total", itinerary.budget.total],
      ],
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] },
    });
    
    // @ts-expect-error - jspdf-autotable stores last table Y
    y = doc.lastAutoTable.finalY + 15;

    // Daily Itinerary
    doc.setFontSize(16);
    doc.text("Daily Itinerary", margin, y);
    y += 10;
    
    itinerary.days.forEach((day) => {
      if (y > 250) {
        doc.addPage();
        y = margin;
      }
      doc.setFontSize(14);
      doc.text(`Day ${day.day}: ${day.title}`, margin, y);
      y += 7;
      doc.setFontSize(11);
      doc.text(day.summary, margin, y, { maxWidth: pageWidth - 2 * margin });
      y += 10;

      // Activities
      doc.setFontSize(12);
      doc.text("Activities:", margin, y);
      y += 6;
      day.activities.forEach(act => {
        doc.setFontSize(10);
        doc.text(`• ${act.name} (${act.category}) - Cost: ${act.cost}, Duration: ${act.duration}`, margin + 5, y);
        y += 5;
      });
      y += 5;

      // Restaurants
      doc.setFontSize(12);
      doc.text("Restaurants:", margin, y);
      y += 6;
      day.restaurants.forEach(res => {
        doc.setFontSize(10);
        doc.text(`• ${res.name} (${res.cuisine}, Rating: ${res.rating}) - Avg Cost: ${res.averageCost}`, margin + 5, y);
        y += 5;
      });
      y += 10;
    });

    doc.save("travel-itinerary.pdf");
    return { success: true };
  } catch (err) {
    console.error("PDF Generation Failed:", err);
    return { success: false, error: err };
  }
}
