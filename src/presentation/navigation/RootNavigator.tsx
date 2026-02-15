import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ROUTES } from '../../core/constants';

export type RootStackParamList = {
  [ROUTES.LOGIN]: undefined;
  [ROUTES.REGISTER]: undefined;
  [ROUTES.FORGOT_PASSWORD]: undefined;
  [ROUTES.HOME]: undefined;
  [ROUTES.TRAINING]: undefined;
  [ROUTES.COMMUNITY]: undefined;
  [ROUTES.PROFILE]: undefined;
  [ROUTES.AI_COACH]: undefined;
  [ROUTES.WORKOUT_DETAIL]: { workoutId: string };
  [ROUTES.WORKOUT_EXECUTE]: { workoutId: string };
  [ROUTES.WORKOUT_COMPLETE]: { workoutId: string; duration: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const PlaceholderScreen = () => null;

export const RootNavigator = ({ isSignedIn }: { isSignedIn: boolean }) => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isSignedIn ? (
        <Stack.Screen name={ROUTES.HOME} component={PlaceholderScreen} />
      ) : (
        <Stack.Screen name={ROUTES.LOGIN} component={PlaceholderScreen} />
      )}
    </Stack.Navigator>
  </NavigationContainer>
);
