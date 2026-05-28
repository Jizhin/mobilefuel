import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function ScanScreen() {
  const { top } = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: top + 16 }]}>
      <Text style={styles.title}>OBD-II Scanner</Text>
      <View style={styles.iconBox}>
        <Text style={{ fontSize: 52 }}>🔌</Text>
      </View>
      <Text style={styles.desc}>
        Connect an ELM327 Bluetooth OBD-II dongle to your car to read real fuel level, speed, and engine data automatically.
      </Text>
      <View style={styles.steps}>
        {[
          'Plug ELM327 dongle into car\'s OBD port (under dashboard)',
          'Enable Bluetooth on your phone',
          'Tap "Connect Device" below',
        ].map((step, i) => (
          <View key={i} style={styles.step}>
            <View style={styles.stepNum}>
              <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800' }}>{i + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>Connect Device (Coming Soon)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 24, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 24 },
  iconBox: {
    width: 96, height: 96, borderRadius: 28, backgroundColor: '#DCFCE7',
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  desc: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  steps: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, width: '100%',
    gap: 12, marginBottom: 24,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  step: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  stepNum: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: '#16A34A',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  stepText: { fontSize: 13, color: '#374151', flex: 1, lineHeight: 20 },
  btn: {
    backgroundColor: '#16A34A', width: '100%', height: 52,
    borderRadius: 16, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#16A34A', shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
  },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
