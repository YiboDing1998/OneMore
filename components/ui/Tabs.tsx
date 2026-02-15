import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewProps,
} from 'react-native';
import { Design } from '@/src/presentation/theme/design';

interface TabItem {
  value: string;
  label: string;
}

interface TabsProps extends ViewProps {
  items: TabItem[];
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
}

interface TabsContextType {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const TabsContext = React.createContext<TabsContextType | undefined>(
  undefined
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  tabsList: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Design.colors.border,
    backgroundColor: Design.colors.surfaceMuted,
    borderRadius: Design.radius.md,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  tabActive: {
    backgroundColor: Design.colors.primary,
  },
  tabInactive: {
    backgroundColor: 'transparent',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Design.colors.textSecondary,
    fontFamily: Design.typography.fontFamily,
  },
  tabTextActive: {
    color: '#ffffff',
  },
  content: {
    marginTop: 16,
  },
});

export function Tabs({
  items,
  defaultValue,
  onValueChange,
  children,
  style,
  ...props
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue || items[0]?.value || '');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onValueChange?.(value);
  };

  return (
    <TabsContext.Provider value={{ activeTab, onTabChange: handleTabChange }}>
      <View style={[styles.container, style]} {...props}>
        <View style={styles.tabsList}>
          {items.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.tab,
                activeTab === item.value ? styles.tabActive : styles.tabInactive,
              ]}
              onPress={() => handleTabChange(item.value)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === item.value && styles.tabTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.content}>{children}</View>
      </View>
    </TabsContext.Provider>
  );
}

interface TabContentProps extends ViewProps {
  value: string;
  children?: React.ReactNode;
}

export function TabContent({ value, children, style, ...props }: TabContentProps) {
  const context = React.useContext(TabsContext);

  if (!context) {
    throw new Error('TabContent must be used within Tabs');
  }

  if (context.activeTab !== value) {
    return null;
  }

  return (
    <View style={style} {...props}>
      {children}
    </View>
  );
}
