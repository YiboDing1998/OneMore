import React from 'react';
import { Redirect, Tabs } from 'expo-router';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppStore } from '@/src/business-logic/store/appStore';

const PRIMARY = '#0df259';
const INACTIVE = '#94a3b8';

function TabIcon({
  focused,
  icon,
  label,
}: {
  focused: boolean;
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
}) {
  return (
    <View style={styles.tabItem}>
      <MaterialIcons name={icon} size={22} color={focused ? PRIMARY : INACTIVE} />
      <Text numberOfLines={1} style={[styles.tabLabel, focused && styles.tabLabelActive]}>
        {label}
      </Text>
    </View>
  );
}

function AICoachIcon({ focused }: { focused: boolean }) {
  return (
    <View style={styles.tabItem}>
      <View style={styles.brandMarkWrap}>
        <Text style={[styles.brandMarkOne, focused && styles.brandMarkOneActive]}>1</Text>
        <Text style={[styles.brandMarkPlus, focused && styles.brandMarkPlusActive]}>+</Text>
      </View>
      <Text numberOfLines={1} style={[styles.tabLabel, focused && styles.tabLabelActive]}>
        AI Coach
      </Text>
    </View>
  );
}

export default function TabLayout() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const { width } = useWindowDimensions();
  const capsuleWidth = Math.min(width - 32, 448);

  if (!isAuthenticated) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Tabs
      initialRouteName="training"
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        sceneStyle: styles.scene,
        tabBarStyle: [
          styles.tabBar,
          {
            width: capsuleWidth,
            left: (width - capsuleWidth) / 2,
          },
        ],
        tabBarItemStyle: styles.tabBarItem,
        tabBarBackground: () => <View style={styles.tabBarBg} />,
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="explore" options={{ href: null }} />

      <Tabs.Screen
        name="training"
        options={{
          title: 'Training',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="fitness-center" label="Training" />,
        }}
      />

      <Tabs.Screen
        name="record"
        options={{
          title: 'History',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="history" label="History" />,
        }}
      />

      <Tabs.Screen
        name="ai-coach"
        options={{
          title: 'AI Coach',
          tabBarIcon: ({ focused }) => <AICoachIcon focused={focused} />,
        }}
      />

      <Tabs.Screen
        name="community"
        options={{
          title: 'Social',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="groups" label="Social" />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="person" label="Profile" />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    right: undefined,
    bottom: 32,
    height: 64,
    borderTopWidth: 0,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.70)',
    paddingHorizontal: 10,
    paddingVertical: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 10,
    overflow: 'hidden',
  },
  scene: {
    paddingBottom: 108,
    backgroundColor: '#f8fafc',
  },
  tabBarBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.70)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.30)',
  },
  tabBarItem: {
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  tabItem: {
    width: 62,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
    minWidth: 0,
  },
  tabLabel: {
    marginTop: 2,
    fontSize: 8,
    lineHeight: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.1,
    color: INACTIVE,
    textAlign: 'center',
  },
  tabLabelActive: {
    color: PRIMARY,
  },
  brandMarkWrap: {
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandMarkOne: {
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 20,
    color: INACTIVE,
  },
  brandMarkOneActive: {
    color: PRIMARY,
  },
  brandMarkPlus: {
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 20,
    marginLeft: 1,
    color: INACTIVE,
  },
  brandMarkPlusActive: {
    color: PRIMARY,
  },
});
