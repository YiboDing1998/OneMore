import React from 'react';
import { Tabs } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const PRIMARY = '#22c55e';
const INACTIVE = '#94a3b8';

function TabIcon({
  focused,
  icon,
  label,
}: {
  focused: boolean;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
}) {
  return (
    <View style={styles.tabItem}>
      <MaterialCommunityIcons name={icon} size={23} color={focused ? PRIMARY : INACTIVE} />
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.85}
        style={[styles.tabLabel, focused && styles.tabLabelActive]}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => <View style={styles.tabBarBg} />,
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="explore" options={{ href: null }} />

      <Tabs.Screen
        name="training"
        options={{
          title: 'Training',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="dumbbell" label="Training" />,
        }}
      />

      <Tabs.Screen
        name="record"
        options={{
          title: 'History',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="calendar-month" label="History" />,
        }}
      />

      <Tabs.Screen
        name="ai-coach"
        options={{
          title: 'AI Coach',
          tabBarButton: ({ onPress, accessibilityState }) => {
            const focused = accessibilityState?.selected;
            return (
              <Pressable onPress={onPress} style={styles.centerWrap}>
                <View style={[styles.centerBtn, focused && styles.centerBtnActive]}>
                  <MaterialCommunityIcons name="brain" size={28} color={focused ? '#0f172a' : '#ffffff'} />
                </View>
                <Text numberOfLines={1} style={[styles.centerLabel, focused && styles.centerLabelActive]}>
                  AI Coach
                </Text>
              </Pressable>
            );
          },
        }}
      />

      <Tabs.Screen
        name="community"
        options={{
          title: 'Social',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="account-group" label="Social" />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="account" label="Profile" />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: 'rgba(255,255,255,0.94)',
    height: 92,
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  tabBarBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.96)',
  },
  tabItem: {
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  tabLabel: {
    marginTop: 1,
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '700',
    color: INACTIVE,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  tabLabelActive: {
    color: PRIMARY,
  },
  centerWrap: {
    width: 78,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: -24,
  },
  centerBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: PRIMARY,
    borderWidth: 4,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 8,
  },
  centerBtnActive: {
    backgroundColor: '#0df259',
  },
  centerLabel: {
    marginTop: 4,
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '700',
    color: INACTIVE,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  centerLabelActive: {
    color: PRIMARY,
  },
});
