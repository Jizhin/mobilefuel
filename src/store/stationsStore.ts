import { create } from 'zustand';
import { Station } from '../services/overpass';

interface StationsState {
  stations: Station[];
  selectedStation: Station | null;
  loading: boolean;
  error: string | null;
  setStations: (s: Station[]) => void;
  setSelected: (s: Station | null) => void;
  setLoading: (v: boolean) => void;
  setError: (e: string | null) => void;
}

export const useStationsStore = create<StationsState>((set) => ({
  stations: [],
  selectedStation: null,
  loading: false,
  error: null,
  setStations: (stations) => set({ stations }),
  setSelected: (selectedStation) => set({ selectedStation }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
