import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useFaceRecognition } from '../../hooks/useFaceRecognition';
import { DashboardScreen } from '../../screens/app/DashboardScreen';
import { HistoryScreen } from '../../screens/app/HistoryScreen';
import { ProfileScreen } from '../../screens/app/ProfileScreen';
import { AttendanceScreen } from '../../screens/app/AttendanceScreen';
import { FaceRegistrationScreen } from '../../screens/app/FaceRegistrationScreen';
import { THEME } from '../../theme/theme';
import { LayoutDashboard, Calendar, User, Camera } from 'lucide-react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabIcon({ Icon, focused, color }: { Icon: any; focused: boolean; color: string }) {
  return (
    <View style={[styles.iconContainer, focused && styles.iconActive]}>
      <Icon size={24} color={color} />
      {focused && <View style={styles.activeDot} />}
    </View>
  );
}

function EmployeeTabs() {
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
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ focused, color }) => <TabIcon Icon={LayoutDashboard} focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="Attendance"
        component={AttendanceScreen}
        options={{
          tabBarStyle: { display: 'none' }, // Hide tab bar on camera screen
          tabBarIcon: ({ focused, color }) => <TabIcon Icon={Camera} focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ focused, color }) => <TabIcon Icon={Calendar} focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color }) => <TabIcon Icon={User} focused={focused} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export function EmployeeNavigator() {
  const { user } = useAuth();
  // In a real app, you might check user.face_embedding or a flag from API
  // For now, let's assume if it's not present, we force registration
  // const hasFaceData = !!user?.face_embedding; 
  const hasFaceData = true; // Temporary bypass for development flow until integrated

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!hasFaceData ? (
        <Stack.Screen name="FaceRegistration" component={FaceRegistrationScreen} />
      ) : (
        <Stack.Screen name="EmployeeTabs" component={EmployeeTabs} />
      )}
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
