import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useVehicleStore } from '../store/vehicleStore';
import { estimatedRange, fuelRiskLevel } from '../services/fuelCalc';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

interface Props {
  onMenuPress?: () => void;
  weather?: { temp: number; description: string } | null;
}

export function Header({ onMenuPress, weather }: Props) {
  const { top } = useSafeAreaInsets();
  const vehicle  = useVehicleStore((s) => s.vehicle);
  const userName = useVehicleStore((s) => s.userName);
  const rangeKm  = Math.round(estimatedRange(vehicle.mileage, vehicle.tankCapacity, vehicle.fuelPercent));
  const risk     = fuelRiskLevel(vehicle.fuelPercent);
  const riskColor = risk === 'safe' ? '#16A34A' : risk === 'low' ? '#F59E0B' : '#EF4444';

  return (
    <View style={[styles.container, { paddingTop: top + 6 }]}>
      {/* Greeting row */}
      <View style={styles.greetRow}>
        <TouchableOpacity style={styles.iconBtn} onPress={onMenuPress}>
          <Text style={{ fontSize: 18, color: '#374151' }}>☰</Text>
        </TouchableOpacity>

        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.greetName}>{greeting()}, {userName} 👋</Text>
          <Text style={styles.greetSub}>Drive safe. Save fuel. Reach more.</Text>
        </View>

        <TouchableOpacity style={styles.iconBtn}>
          <Text style={{ fontSize: 18 }}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <StatCell label="FUEL" value={`${vehicle.fuelPercent}%`} color={riskColor} bar={vehicle.fuelPercent} />
        <View style={styles.divider} />
        <StatCell label="RANGE" value={`~${rangeKm} km`} />
        <View style={styles.divider} />
        <StatCell label="TRAFFIC" value="Moderate" color="#F59E0B" />
        <View style={styles.divider} />
        <StatCell
          label="WEATHER"
          value={weather ? `${weather.temp}°C` : '—'}
          icon={weather?.description?.includes('rain') ? '🌧' : '☀️'}
        />
      </View>
    </View>
  );
}

function StatCell({
  label, value, color, bar, icon,
}: {
  label: string; value: string; color?: string; bar?: number; icon?: string;
}) {
  return (
    <View style={styles.statCell}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
        {icon ? <Text style={{ fontSize: 13 }}>{icon}</Text> : null}
        <Text style={[styles.statValue, color ? { color } : {}]}>{value}</Text>
      </View>
      {bar !== undefined && (
        <View style={styles.barBg}>
          <View style={[styles.barFill, { width: `${bar}%` as any, backgroundColor: color ?? '#16A34A' }]} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  greetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 10,
  },
  iconBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center', justifyContent: 'center',
  },
  greetName: {
    fontSize: 16, fontWeight: '700', color: '#111827',
  },
  greetSub: {
    fontSize: 12, color: '#9CA3AF', marginTop: 1,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  statCell: {
    flex: 1, paddingVertical: 10, paddingHorizontal: 4,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 9, fontWeight: '700', color: '#9CA3AF',
    textTransform: 'uppercase', letterSpacing: 0.6,
    marginBottom: 3,
  },
  statValue: {
    fontSize: 14, fontWeight: '800', color: '#111827',
  },
  barBg: {
    marginTop: 4, height: 3, width: 28, borderRadius: 2,
    backgroundColor: '#F3F4F6', overflow: 'hidden',
  },
  barFill: {
    height: '100%', borderRadius: 2,
  },
  divider: {
    width: 1, backgroundColor: '#F3F4F6', marginVertical: 8,
  },
});
