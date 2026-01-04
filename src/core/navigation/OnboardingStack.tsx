import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ChoiceScreen } from '../../screens/onboarding/ChoiceScreen';
import { JoinBusinessScreen } from '../../screens/onboarding/JoinBusinessScreen';
import { CreateCompanyScreen } from '../../screens/onboarding/CreateCompanyScreen';
import type { OnboardingStackParamList } from '../../types/navigation';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#0F172A' },
      }}
    >
      <Stack.Screen name="Choice" component={ChoiceScreen} />
      <Stack.Screen name="JoinBusiness" component={JoinBusinessScreen} />
      <Stack.Screen name="CreateCompany" component={CreateCompanyScreen} />
    </Stack.Navigator>
  );
}
