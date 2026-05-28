import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useVehicleStore } from '../store/vehicleStore';
import { estimatedRange, fuelRiskLevel } from '../services/fuelCalc';

export function MoreScreen() {
  const { top } = useSafeAreaInsets();
  const vehicle     = useVehicleStore((s) => s.vehicle);
  const userName    = useVehicleStore((s) => s.userName);
  const setUserName = useVehicleStore((s) => s.setUserName);
  const setFuelPct  = useVehicleStore((s) => s.setFuelPercent);
  const resetSetup  = useVehicleStore((s) => s.resetSetup);

  const [name, setName]   = useState(userName);
  const [fuel, setFuel]   = useState(String(vehicle.fuelPercent));

  const risk  = fuelRiskLevel(vehicle.fuelPercent);
  const color = risk === 'safe' ? '#16A34A' : risk === 'low' ? '#F59E0B' : '#EF4444';
  const range = Math.round(estimatedRange(vehicle.mileage, vehicle.tankCapacity, vehicle.fuelPercent));

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <View style={[styles.header, { paddingTop: top + 16 }]}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>PROFILE</Text>
        <View style={styles.card}>
          <Text style={styles.fieldLabel}>Your Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            onBlur={() => setUserName(name)}
            style={styles.input}
            placeholder="Enter your name"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>VEHICLE</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.fieldLabel}>Make / Model</Text>
            <Text style={styles.fieldValue}>{vehicle.brand} {vehicle.model}</Text>
          </View>
          <View style={[styles.row, { marginTop: 10 }]}>
            <Text style={styles.fieldLabel}>Mileage</Text>
            <Text style={styles.fieldValue}>{vehicle.mileage} km/L</Text>
          </View>
          <View style={[styles.row, { marginTop: 10 }]}>
            <Text style={styles.fieldLabel}>Tank Capacity</Text>
            <Text style={styles.fieldValue}>{vehicle.tankCapacity} L</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>FUEL</Text>
        <View style={styles.card}>
          <Text style={styles.fieldLabel}>Current Fuel Level</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 }}>
            <TextInput
              value={fuel}
              onChangeText={setFuel}
              onBlur={() => {
                const n = parseFloat(fuel);
                if (!isNaN(n)) setFuelPct(n);
              }}
              keyboardType="numeric"
              style={[styles.input, { flex: 1 }]}
            />
            <Text style={{ fontSize: 13, color: '#6B7280' }}>%</Text>
          </View>
          <View style={styles.fuelBar}>
            <View style={[styles.fuelFill, { width: `${vehicle.fuelPercent}%` as any, backgroundColor: color }]} />
          </View>
          <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 6 }}>
            Est. range: <Text style={{ color, fontWeight: '700' }}>{range} km</Text>
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.resetBtn} onPress={resetSetup}>
          <Text style={styles.resetText}>Reset Vehicle Setup</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff', paddingHorizontal: 20, paddingBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  title: { fontSize: 24, fontWeight: '800', color: '#111827' },
  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionLabel: {
    fontSize: 11, fontWeight: '700', color: '#9CA3AF',
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8,
  },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fieldLabel: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  fieldValue: { fontSize: 13, color: '#111827', fontWeight: '600' },
  input: {
    height: 44, borderRadius: 12, borderWidth: 1.5, borderColor: '#E5E7EB',
    paddingHorizontal: 12, fontSize: 15, color: '#111827', backgroundColor: '#F9FAFB',
    marginTop: 6,
  },
  fuelBar: {
    height: 6, borderRadius: 3, backgroundColor: '#F3F4F6', overflow: 'hidden', marginTop: 10,
  },
  fuelFill: { height: '100%', borderRadius: 3 },
  resetBtn: {
    backgroundColor: '#FEF2F2', borderRadius: 14, height: 50,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#FECACA',
    marginBottom: 40,
  },
  resetText: { color: '#EF4444', fontSize: 14, fontWeight: '700' },
});
