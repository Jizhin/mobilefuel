import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Ellipse, Line, Rect } from 'react-native-svg';
import { useVehicleStore } from '../store/vehicleStore';
import { estimatedRange, fuelRiskLevel } from '../services/fuelCalc';

function CarIcon() {
  return (
    <Svg width={110} height={55} viewBox="0 0 220 110">
      <Ellipse cx={110} cy={102} rx={88} ry={7} fill="#00000010" />
      <Path
        d="M18 72 L18 58 Q18 50 28 50 L52 32 Q72 14 110 14 Q148 14 168 32 L192 50 Q202 50 202 58 L202 72 Q202 80 194 80 L26 80 Q18 80 18 72Z"
        fill="#E2E8F0"
      />
      <Path d="M56 50 L72 30 Q88 16 110 16 Q132 16 148 30 L164 50Z" fill="#CBD5E1" />
      <Path d="M62 50 L76 32 Q90 18 110 18 Q130 18 144 32 L158 50Z" fill="#BFDBFE" opacity={0.85} />
      <Line x1={110} y1={18} x2={110} y2={50} stroke="#94A3B8" strokeWidth={1.5} />
      <Circle cx={52} cy={80} r={16} fill="#1E293B" />
      <Circle cx={52} cy={80} r={8} fill="#64748B" />
      <Circle cx={52} cy={80} r={3} fill="#94A3B8" />
      <Circle cx={168} cy={80} r={16} fill="#1E293B" />
      <Circle cx={168} cy={80} r={8} fill="#64748B" />
      <Circle cx={168} cy={80} r={3} fill="#94A3B8" />
      <Rect x={18} y={60} width={12} height={8} rx={4} fill="#FEF08A" />
      <Rect x={190} y={60} width={12} height={8} rx={4} fill="#FCA5A5" />
    </Svg>
  );
}

export function VehicleCard() {
  const vehicle = useVehicleStore((s) => s.vehicle);
  const rangeKm = Math.round(
    estimatedRange(vehicle.mileage, vehicle.tankCapacity, vehicle.fuelPercent)
  );
  const risk  = fuelRiskLevel(vehicle.fuelPercent);
  const color = risk === 'safe' ? '#16A34A' : risk === 'low' ? '#F59E0B' : '#EF4444';

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.dot} />
        <Text style={styles.headerText}>Your Vehicle</Text>
      </View>

      {/* Fuel % + car */}
      <View style={styles.mainRow}>
        <View>
          <Text style={[styles.fuelPct, { color }]}>{vehicle.fuelPercent}%</Text>
          <Text style={styles.fuelLabel}>Fuel Level</Text>
        </View>
        <CarIcon />
      </View>

      {/* Fuel bar */}
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${vehicle.fuelPercent}%` as any, backgroundColor: color }]} />
      </View>

      {/* E — range — F */}
      <View style={styles.rangeRow}>
        <Text style={styles.endLabel}>E</Text>
        <View style={{ alignItems: 'center' }}>
          <Text style={[styles.rangeKm, { color: '#16A34A' }]}>{rangeKm} km</Text>
          <Text style={styles.rangeLabel}>Safe Range</Text>
        </View>
        <Text style={styles.endLabel}>F</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    left: 12,
    bottom: 20,
    width: 210,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 20,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#16A34A' },
  headerText: { fontSize: 11, fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.6 },
  mainRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, marginBottom: 8 },
  fuelPct: { fontSize: 34, fontWeight: '800', lineHeight: 36 },
  fuelLabel: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
  barBg: { height: 5, borderRadius: 3, backgroundColor: '#F3F4F6', overflow: 'hidden', marginBottom: 6 },
  barFill: { height: '100%', borderRadius: 3 },
  rangeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  endLabel: { fontSize: 10, color: '#9CA3AF', fontWeight: '600' },
  rangeKm: { fontSize: 13, fontWeight: '800' },
  rangeLabel: { fontSize: 9, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5 },
});
