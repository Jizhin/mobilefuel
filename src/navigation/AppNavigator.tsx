import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigateScreen } from '../screens/NavigateScreen';
import { StationsScreen } from '../screens/StationsScreen';
import { ScanScreen } from '../screens/ScanScreen';
import { MoreScreen } from '../screens/MoreScreen';

const Tab = createBottomTabNavigator();

function HistoryScreen() {
  const { top } = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 48 }}>📍</Text>
      <Text style={{ fontSize: 18, fontWeight: '800', color: '#111827', marginTop: 12 }}>Trip History</Text>
      <Text style={{ fontSize: 13, color: '#9CA3AF', marginTop: 6, textAlign: 'center', maxWidth: 240 }}>
        Your fuel stop history will appear here after your first trip.
      </Text>
    </View>
  );
}

function TabIcon({ label, emoji, focused }: { label: string; emoji: string; focused: boolean }) {
  const isScan = label === 'Scan';

  if (isScan) {
    return (
      <View style={styles.scanBtn}>
        <Text style={{ fontSize: 22 }}>{emoji}</Text>
      </View>
    );
  }

  if (focused) {
    return (
      <View style={styles.activePill}>
        <Text style={{ fontSize: 14 }}>{emoji}</Text>
        <Text style={styles.activeLabel}>{label}</Text>
      </View>
    );
  }

  return (
    <View style={{ alignItems: 'center', gap: 2 }}>
      <Text style={{ fontSize: 20 }}>{emoji}</Text>
      <Text style={styles.inactiveLabel}>{label}</Text>
    </View>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarShowLabel: false,
        }}
      >
        <Tab.Screen
          name="Navigate"
          component={NavigateScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon label="Navigate" emoji="🧭" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="Stations"
          component={StationsScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon label="Fuel Stops" emoji="⛽" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="Scan"
          component={ScanScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon label="Scan" emoji="🔌" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="History"
          component={HistoryScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon label="History" emoji="🕐" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="More"
          component={MoreScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon label="More" emoji="⚙️" focused={focused} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#1C1C1E',
    borderTopWidth: 0,
    height: 72,
    paddingBottom: 8,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 20,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#16A34A',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  activeLabel: {
    color: '#fff', fontSize: 12, fontWeight: '700',
  },
  inactiveLabel: {
    color: '#6B7280', fontSize: 10, fontWeight: '500',
  },
  scanBtn: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#16A34A',
    alignItems: 'center', justifyContent: 'center',
    marginTop: -16,
    shadowColor: '#16A34A', shadowOpacity: 0.5, shadowRadius: 12, elevation: 8,
  },
});
