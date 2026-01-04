import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, StyleSheet } from 'react-native';
// Placeholder imports - will be replaced by actual screens
import { OwnerDashboardScreen } from '../../screens/owner/OwnerDashboardScreen';
// import { StaffListScreen } from '../../screens/owner/StaffListScreen'; 
// import { ScoringScreen } from '../../screens/owner/ScoringScreen';
// import { FinanceScreen } from '../../screens/owner/FinanceScreen';
import { EmployeeDetailScreen } from '../../screens/owner/EmployeeDetailScreen';

import { THEME } from '../../theme/theme';
import { LayoutGrid, Users, Award, DollarSign } from 'lucide-react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Placeholder components for missing screens
const StaffListScreen = () => <View style={{ flex: 1, backgroundColor: THEME.colors.background }} />;
const ScoringScreen = () => <View style={{ flex: 1, backgroundColor: THEME.colors.background }} />;
const FinanceScreen = () => <View style={{ flex: 1, backgroundColor: THEME.colors.background }} />;

function TabIcon({ Icon, focused, color }: { Icon: any; focused: boolean; color: string }) {
  return (
    <View style={[styles.iconContainer, focused && styles.iconActive]}>
      <Icon size={24} color={color} />
      {focused && <View style={styles.activeDot} />}
    </View>
  );
}

function OwnerTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: THEME.colors.primary,
        tabBarInactiveTintColor: THEME.colors.text.muted,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Overview"
        component={OwnerDashboardScreen}
        options={{
          tabBarIcon: ({ focused, color }) => <TabIcon Icon={LayoutGrid} focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="Staff"
        component={StaffListScreen}
        options={{
          tabBarIcon: ({ focused, color }) => <TabIcon Icon={Users} focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="Scoring"
        component={ScoringScreen}
        options={{
          tabBarIcon: ({ focused, color }) => <TabIcon Icon={Award} focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="Finance"
        component={FinanceScreen}
        options={{
          tabBarIcon: ({ focused, color }) => <TabIcon Icon={DollarSign} focused={focused} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export function OwnerNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OwnerTabs" component={OwnerTabs} />
      <Stack.Screen name="EmployeeDetail" component={EmployeeDetailScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: THEME.colors.card,
    borderTopColor: THEME.colors.border,
    borderTopWidth: 1,
    height: 70,
    paddingTop: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iconActive: {
    transform: [{ scale: 1.1 }],
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: THEME.colors.primary,
    marginTop: 4,
  }
});
