export type RiskLevel = "safe" | "low" | "critical";

export function estimatedRange(mileage: number, tankCapacity: number, fuelPercent: number): number {
  const litersLeft = (fuelPercent / 100) * tankCapacity;
  return litersLeft * mileage;
}

export function fuelRiskLevel(pct: number): RiskLevel {
  if (pct <= 10) return "critical";
  if (pct <= 25) return "low";
  return "safe";
}

export function haversineKm(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

export function fuelAfterArrival(
  distKm: number,
  mileage: number,
  tankCapacity: number,
  fuelPercent: number
): number {
  const litersLeft = (fuelPercent / 100) * tankCapacity;
  const consumed = distKm / mileage;
  return Math.max(0, ((litersLeft - consumed) / tankCapacity) * 100);
}

export function reachability(
  distKm: number,
  rangeKm: number
): "reachable" | "caution" | "unreachable" {
  if (distKm <= rangeKm * 0.8) return "reachable";
  if (distKm <= rangeKm) return "caution";
  return "unreachable";
}
