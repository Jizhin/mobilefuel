import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStationsStore } from '../store/stationsStore';
import { StationCard } from '../components/StationCard';

export function StationsScreen() {
  const { top } = useSafeAreaInsets();
  const stations        = useStationsStore((s) => s.stations);
  const selectedStation = useStationsStore((s) => s.selectedStation);
  const setSelected     = useStationsStore((s) => s.setSelected);
  const loading         = useStationsStore((s) => s.loading);

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <View style={[styles.header, { paddingTop: top + 16 }]}>
        <Text style={styles.title}>Fuel Stops</Text>
        <Text style={styles.sub}>{stations.length} stations within range</Text>
      </View>

      {loading && !stations.length && (
        <View style={{ padding: 32, alignItems: 'center' }}>
          <Text style={{ color: '#9CA3AF', fontSize: 14 }}>Finding nearby stations…</Text>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.list}>
          {stations.map((s, i) => (
            <StationCard
              key={s.id}
              station={s}
              selected={selectedStation?.id === s.id}
              recommended={i === 0}
              onPress={() => setSelected(s)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff', paddingHorizontal: 20,
    paddingBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  title: { fontSize: 24, fontWeight: '800', color: '#111827' },
  sub: { fontSize: 13, color: '#9CA3AF', marginTop: 2 },
  list: { backgroundColor: '#fff', marginTop: 12, borderRadius: 16, overflow: 'hidden' },
});
