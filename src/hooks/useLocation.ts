import { useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { useVehicleStore } from '../store/vehicleStore';

export interface LatLon {
  lat: number;
  lon: number;
}

export function useLocation() {
  const [position, setPosition] = useState<LatLon | null>(null);
  const [heading, setHeading] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const vehicle      = useVehicleStore((s) => s.vehicle);
  const setFuelPct   = useVehicleStore((s) => s.setFuelPercent);
  const prevPosRef   = useRef<LatLon | null>(null);

  useEffect(() => {
    let sub: Location.LocationSubscription | null = null;
    let headingSub: Location.LocationSubscription | null = null;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        return;
      }

      // Get initial position immediately
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setPosition({ lat: loc.coords.latitude, lon: loc.coords.longitude });

      // Watch position — updates every ~3 seconds while moving
      sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 3000,
          distanceInterval: 10,
        },
        (loc) => {
          const next: LatLon = { lat: loc.coords.latitude, lon: loc.coords.longitude };
          setPosition(next);
          if (loc.coords.heading != null) setHeading(loc.coords.heading);

          // Fuel consumption: GPS delta
          const prev = prevPosRef.current;
          if (prev) {
            const R = 6371;
            const dLat = ((next.lat - prev.lat) * Math.PI) / 180;
            const dLon = ((next.lon - prev.lon) * Math.PI) / 180;
            const a =
              Math.sin(dLat / 2) ** 2 +
              Math.cos((prev.lat * Math.PI) / 180) *
                Math.cos((next.lat * Math.PI) / 180) *
                Math.sin(dLon / 2) ** 2;
            const distKm = R * 2 * Math.asin(Math.sqrt(a));

            if (distKm > 0.015) {
              const consumed = distKm / vehicle.mileage;
              const drop = (consumed / vehicle.tankCapacity) * 100;
              const newPct = Math.max(0, vehicle.fuelPercent - drop);
              setFuelPct(Math.round(newPct * 10) / 10);
            }
          }
          prevPosRef.current = next;
        }
      );
    })();

    return () => {
      sub?.remove();
      headingSub?.remove();
    };
  }, []);

  return { position, heading, error };
}
