import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../../contexts/AuthContext';
import { AuthStack } from './AuthStack';
import { OnboardingStack } from './OnboardingStack';
import { AppStack } from './AppStack';
import { OwnerNavigator } from './OwnerNavigator';
import { EmployeeNavigator } from './EmployeeNavigator';
import { LoadingScreen } from '../../components/screens/LoadingScreen';
import type { RootStackParamList } from '../../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isAuthenticated, companies, isLoading, user } = useAuth();

  // Check if user is owner in ANY company (for now simpler logic)
  const isOwner = companies?.some(c => c.is_owner);

  if (isLoading) {
    return <LoadingScreen message="Loading..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : !companies || companies.length === 0 ? (
          <Stack.Screen name="Onboarding" component={OnboardingStack} />
        ) : isOwner ? (
          <Stack.Screen name="OwnerApp" component={OwnerNavigator} />
        ) : (
          <Stack.Screen name="EmployeeApp" component={EmployeeNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
