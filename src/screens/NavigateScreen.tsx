import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Linking, Platform, ActivityIndicator,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStationsStore } from '../store/stationsStore';
import { useVehicleStore } from '../store/vehicleStore';
import { useLocation } from '../hooks/useLocation';
import { fetchNearbyStations, Station } from '../services/overpass';
import { VehicleCard } from '../components/VehicleCard';
import { StationCard } from '../components/StationCard';

const BRAND_BG: Record<string, string> = {
  IndianOil: '#F97316', HPCL: '#1D4ED8', BPCL: '#2563EB',
  Reliance: '#374151', Shell: '#D97706', Essar: '#0369A1',
  'Bharat Petroleum': '#2563EB', 'HP Petrol Pump': '#1D4ED8', 'Fuel Station': '#16A34A',
};

export function NavigateScreen() {
  const mapRef = useRef<MapView>(null);
  const { bottom } = useSafeAreaInsets();
  const { position, heading } = useLocation();

  const vehicle         = useVehicleStore((s) => s.vehicle);
  const stations        = useStationsStore((s) => s.stations);
  const selectedStation = useStationsStore((s) => s.selectedStation);
  const setStations     = useStationsStore((s) => s.setStations);
  const setSelected     = useStationsStore((s) => s.setSelected);
  const setLoading      = useStationsStore((s) => s.setLoading);
  const loading         = useStationsStore((s) => s.loading);

  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [navigating, setNavigating]       = useState(false);

  // Fetch stations when position is available
  useEffect(() => {
    if (!position) return;
    setLoading(true);
    fetchNearbyStations(
      position.lat, position.lon, 15000,
      vehicle.mileage, vehicle.tankCapacity, vehicle.fuelPercent
    )
      .then((s) => { setStations(s); setLoading(false); })
      .catch(() => setLoading(false));
  }, [
    position ? Math.round(position.lat * 100) / 100 : null,
    position ? Math.round(position.lon * 100) / 100 : null,
  ]);

  // Center map on position
  useEffect(() => {
    if (!position || !mapRef.current) return;
    mapRef.current.animateToRegion({
      latitude: position.lat,
      longitude: position.lon,
      latitudeDelta: 0.06,
      longitudeDelta: 0.06,
    }, 800);
  }, [position?.lat, position?.lon]);

  const openMapsNavigation = (station: Station) => {
    const label = encodeURIComponent(station.brand || station.name);
    const url = Platform.select({
      ios: `maps://?daddr=${station.lat},${station.lon}&dirflg=d`,
      android: `google.navigation:q=${station.lat},${station.lon}&mode=d`,
    });
    if (url) {
      Linking.openURL(url).catch(() => {
        // Fallback to Google Maps web
        Linking.openURL(
          `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lon}&travelmode=driving`
        );
      });
    }
    setNavigating(true);
    setSelected(station);
  };

  const recenter = () => {
    if (!position || !mapRef.current) return;
    mapRef.current.animateToRegion({
      latitude: position.lat,
      longitude: position.lon,
      latitudeDelta: 0.04,
      longitudeDelta: 0.04,
    }, 600);
  };

  const target = selectedStation ?? stations[0] ?? null;

  return (
    <View style={{ flex: 1 }}>
      {/* ── MAP ─────────────────────────────────────── */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        initialRegion={{
          latitude: position?.lat ?? 12.9716,
          longitude: position?.lon ?? 77.5946,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}
      >
        {/* Vehicle marker */}
        {position && (
          <Marker
            coordinate={{ latitude: position.lat, longitude: position.lon }}
            anchor={{ x: 0.5, y: 0.5 }}
            rotation={heading}
            flat
          >
            <View style={styles.vehicleMarker}>
              <Text style={{ fontSize: 18 }}>🚗</Text>
            </View>
          </Marker>
        )}

        {/* Station markers */}
        {stations.map((s) => {
          const isSelected = selectedStation?.id === s.id;
          const bg = BRAND_BG[s.brand] ?? '#16A34A';
          return (
            <Marker
              key={s.id}
              coordinate={{ latitude: s.lat, longitude: s.lon }}
              anchor={{ x: 0.5, y: 0.5 }}
              onPress={() => setSelected(s)}
            >
              <View style={[
                styles.stationMarker,
                { backgroundColor: bg, width: isSelected ? 40 : 32, height: isSelected ? 40 : 32, borderRadius: isSelected ? 20 : 16 },
              ]}>
                <Text style={{ fontSize: isSelected ? 11 : 9, fontWeight: '800', color: '#fff' }}>
                  {s.brand === 'HPCL' ? 'HP' : s.brand === 'BPCL' ? 'BP' : s.brand === 'IndianOil' ? 'IO' : 'FS'}
                </Text>
              </View>
            </Marker>
          );
        })}

        {/* Route line to selected station */}
        {target && position && (
          <Polyline
            coordinates={[
              { latitude: position.lat, longitude: position.lon },
              { latitude: target.lat, longitude: target.lon },
            ]}
            strokeColor="#16A34A"
            strokeWidth={3}
            lineDashPattern={[8, 4]}
          />
        )}
      </MapView>

      {/* ── MAP CONTROLS ─────────────────────────── */}
      <View style={styles.mapControls}>
        <TouchableOpacity style={styles.ctrlBtn} onPress={recenter}>
          <Text style={{ fontSize: 18 }}>🎯</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ctrlBtn} onPress={() => mapRef.current?.animateCamera({ altitude: -1 } as any)}>
          <Text style={{ fontSize: 20, fontWeight: '300' }}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ctrlBtn} onPress={() => mapRef.current?.animateCamera({ altitude: 1 } as any)}>
          <Text style={{ fontSize: 20, fontWeight: '300' }}>−</Text>
        </TouchableOpacity>
      </View>

      {/* ── VEHICLE CARD ─────────────────────────── */}
      {!sheetExpanded && <VehicleCard />}

      {/* ── BOTTOM SHEET ─────────────────────────── */}
      <View style={[styles.sheet, { paddingBottom: bottom + 8 }]}>
        {/* Handle */}
        <TouchableOpacity
          style={styles.handleArea}
          onPress={() => setSheetExpanded((v) => !v)}
        >
          <View style={styles.handle} />
        </TouchableOpacity>

        {/* Navigate button */}
        {target && (
          <View style={styles.navRow}>
            <TouchableOpacity
              style={styles.navBtn}
              onPress={() => openMapsNavigation(target)}
              activeOpacity={0.85}
            >
              <Text style={styles.navBtnText}>
                🧭 Navigate to {target.brand || target.name}
              </Text>
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
                Opens Google Maps — {target.distanceKm} km · {target.etaMin} min
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Header row */}
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Nearest Fuel Stop</Text>
          <TouchableOpacity onPress={() => setSheetExpanded((v) => !v)}>
            <Text style={styles.viewAll}>
              {sheetExpanded ? 'Show less' : `View all (${stations.length})`}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Loading */}
        {loading && !stations.length && (
          <View style={{ paddingVertical: 20, alignItems: 'center' }}>
            <ActivityIndicator color="#16A34A" />
            <Text style={{ color: '#9CA3AF', marginTop: 8, fontSize: 13 }}>Finding fuel stations…</Text>
          </View>
        )}

        {/* Station list */}
        {sheetExpanded ? (
          <ScrollView style={{ maxHeight: 340 }} showsVerticalScrollIndicator={false}>
            {stations.map((s, i) => (
              <StationCard
                key={s.id}
                station={s}
                selected={selectedStation?.id === s.id}
                recommended={i === 0}
                onPress={() => { setSelected(s); setSheetExpanded(false); }}
              />
            ))}
          </ScrollView>
        ) : (
          stations.slice(0, 2).map((s, i) => (
            <StationCard
              key={s.id}
              station={s}
              selected={selectedStation?.id === s.id}
              recommended={i === 0}
              onPress={() => setSelected(s)}
            />
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  vehicleMarker: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20, padding: 4,
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4,
    elevation: 5,
  },
  stationMarker: {
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, elevation: 4,
    borderWidth: 2, borderColor: '#fff',
  },
  mapControls: {
    position: 'absolute', right: 14, top: '38%',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12, elevation: 8,
  },
  ctrlBtn: {
    width: 44, height: 44,
    alignItems: 'center', justifyContent: 'center',
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    shadowColor: '#000', shadowOpacity: 0.14, shadowRadius: 24,
    shadowOffset: { width: 0, height: -4 }, elevation: 16,
  },
  handleArea: { alignItems: 'center', paddingVertical: 10 },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#E5E7EB' },
  navRow: { paddingHorizontal: 16, paddingBottom: 12 },
  navBtn: {
    backgroundColor: '#16A34A',
    borderRadius: 16, paddingVertical: 14, paddingHorizontal: 18,
    shadowColor: '#16A34A', shadowOpacity: 0.35, shadowRadius: 10, elevation: 6,
  },
  navBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  sheetHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingBottom: 10,
  },
  sheetTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  viewAll: { fontSize: 13, fontWeight: '600', color: '#16A34A' },
});
