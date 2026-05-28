import { haversineKm, fuelAfterArrival, reachability, estimatedRange } from './fuelCalc';

export interface Station {
  id: string;
  name: string;
  brand: string;
  lat: number;
  lon: number;
  distanceKm: number;
  etaMin: number;
  fuelAfterArrivalPct: number;
  reachability: 'reachable' | 'caution' | 'unreachable';
}

const BRAND_MAP: Record<string, string> = {
  'Indian Oil': 'IndianOil',
  'IndianOil': 'IndianOil',
  'HPCL': 'HPCL',
  'HP': 'HPCL',
  'Hindustan Petroleum': 'HPCL',
  'BPCL': 'BPCL',
  'Bharat Petroleum': 'BPCL',
  'BP': 'BPCL',
  'Reliance': 'Reliance',
  'Shell': 'Shell',
  'Essar': 'Essar',
};

function normalizeBrand(raw: string | undefined): string {
  if (!raw) return 'Fuel Station';
  return BRAND_MAP[raw] ?? raw;
}

export async function fetchNearbyStations(
  lat: number,
  lon: number,
  radiusM = 15000,
  mileage = 16.5,
  tankCapacity = 45,
  fuelPercent = 50
): Promise<Station[]> {
  const query = `
    [out:json][timeout:20];
    node["amenity"="fuel"](around:${radiusM},${lat},${lon});
    out body;
  `;

  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: query,
  });

  if (!res.ok) throw new Error('Overpass API error');
  const data = await res.json();
  const rangeKm = estimatedRange(mileage, tankCapacity, fuelPercent);

  const stations: Station[] = (data.elements ?? [])
    .filter((e: any) => e.lat && e.lon)
    .map((e: any) => {
      const distKm = parseFloat(
        haversineKm(lat, lon, e.lat, e.lon).toFixed(2)
      );
      const etaMin = Math.round((distKm / 40) * 60);
      const foaPct = parseFloat(
        fuelAfterArrival(distKm, mileage, tankCapacity, fuelPercent).toFixed(1)
      );
      const reach = reachability(distKm, rangeKm);
      const brand = normalizeBrand(
        e.tags?.brand ?? e.tags?.name ?? e.tags?.operator
      );
      return {
        id: `osm-${e.id}`,
        name: e.tags?.name ?? brand,
        brand,
        lat: e.lat,
        lon: e.lon,
        distanceKm: distKm,
        etaMin,
        fuelAfterArrivalPct: foaPct,
        reachability: reach,
      };
    })
    .sort((a: Station, b: Station) => a.distanceKm - b.distanceKm)
    .slice(0, 30);

  return stations;
}
