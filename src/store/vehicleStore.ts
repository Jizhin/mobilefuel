import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Vehicle {
  brand: string;
  model: string;
  fuelType: 'petrol' | 'diesel' | 'cng' | 'electric';
  mileage: number;
  tankCapacity: number;
  fuelPercent: number;
}

interface VehicleState {
  vehicle: Vehicle;
  userName: string;
  setupComplete: boolean;
  setFuelPercent: (pct: number) => void;
  setUserName: (name: string) => void;
  completeSetup: (v: Vehicle, name: string) => void;
  resetSetup: () => void;
}

const DEFAULT: Vehicle = {
  brand: '',
  model: '',
  fuelType: 'petrol',
  mileage: 16.5,
  tankCapacity: 45,
  fuelPercent: 50,
};

export const useVehicleStore = create<VehicleState>()(
  persist(
    (set) => ({
      vehicle: DEFAULT,
      userName: 'Driver',
      setupComplete: false,
      setFuelPercent: (pct) =>
        set((s) => ({
          vehicle: { ...s.vehicle, fuelPercent: Math.max(0, Math.min(100, pct)) },
        })),
      setUserName: (userName) => set({ userName }),
      completeSetup: (vehicle, userName) =>
        set({ vehicle, userName, setupComplete: true }),
      resetSetup: () =>
        set({ vehicle: DEFAULT, userName: 'Driver', setupComplete: false }),
    }),
    {
      name: 'fuelsafe-vehicle-v1',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
