export interface GeocodeResult {
  lat: number;
  lon: number;
  display_name: string;
}

export async function geocode(query: string): Promise<GeocodeResult | null> {
  if (!query) return null;

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "VoyageTravelAI/1.0",
      },
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        display_name: data[0].display_name,
      };
    }
    return null;
  } catch (err) {
    console.error("Geocoding failed:", err);
    return null;
  }
}
