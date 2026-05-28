import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Station } from '../services/overpass';

const BRAND_BG: Record<string, string> = {
  IndianOil: '#F97316', HPCL: '#1D4ED8', BPCL: '#2563EB',
  Reliance: '#374151', Shell: '#D97706', Essar: '#0369A1',
  'Bharat Petroleum': '#2563EB', 'HP Petrol Pump': '#1D4ED8', 'Fuel Station': '#16A34A',
};
const BRAND_SHORT: Record<string, string> = {
  IndianOil: 'IO', HPCL: 'HP', BPCL: 'BP', Reliance: 'RL',
  Shell: 'SH', Essar: 'ES', 'Bharat Petroleum': 'BP', 'HP Petrol Pump': 'HP', 'Fuel Station': 'FS',
};

function reachColor(r: string) {
  if (r === 'reachable') return '#16A34A';
  if (r === 'caution') return '#D97706';
  return '#DC2626';
}
function reachLabel(r: string) {
  if (r === 'reachable') return 'Can reach';
  if (r === 'caution') return 'Borderline';
  return 'Out of range';
}

interface Props {
  station: Station;
  selected: boolean;
  recommended: boolean;
  onPress: () => void;
}

export function StationCard({ station: s, selected, recommended, onPress }: Props) {
  const bg   = BRAND_BG[s.brand] ?? '#16A34A';
  const rCol = reachColor(s.reachability);

  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Brand badge */}
      <View style={[styles.badge, { backgroundColor: bg }]}>
        <Text style={styles.badgeText}>{BRAND_SHORT[s.brand] ?? 'FS'}</Text>
      </View>

      {/* Info */}
      <View style={{ flex: 1 }}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{s.brand || s.name}</Text>
          {recommended && (
            <View style={styles.recBadge}>
              <Text style={styles.recText}>RECOMMENDED</Text>
            </View>
          )}
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>📍 {s.distanceKm} km</Text>
          <Text style={styles.meta}>  🕐 {s.etaMin} min</Text>
        </View>
      </View>

      {/* Fuel on arrival */}
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={[styles.foa, { color: rCol }]}>
          {Math.max(0, Math.round(s.fuelAfterArrivalPct))}%
        </Text>
        <Text style={[styles.reach, { color: rCol }]}>{reachLabel(s.reachability)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, paddingHorizontal: 16,
    gap: 12, borderBottomWidth: 1, borderBottomColor: '#F9FAFB',
    backgroundColor: '#fff',
  },
  cardSelected: { backgroundColor: '#F0FDF4' },
  badge: {
    width: 46, height: 46, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 6,
    elevation: 3,
  },
  badgeText: { fontSize: 12, fontWeight: '800', color: '#fff' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  name: { fontSize: 14, fontWeight: '700', color: '#111827' },
  recBadge: {
    backgroundColor: '#DCFCE7', borderRadius: 6,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  recText: { fontSize: 9, fontWeight: '800', color: '#16A34A', letterSpacing: 0.5 },
  metaRow: { flexDirection: 'row', marginTop: 3 },
  meta: { fontSize: 12, color: '#9CA3AF' },
  foa: { fontSize: 18, fontWeight: '800', lineHeight: 20 },
  reach: { fontSize: 11, fontWeight: '600', marginTop: 2 },
});
