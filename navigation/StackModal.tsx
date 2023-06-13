import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from '../screens/OnboardingScreen';
import PushScreen from '../screens/PushScreen';

const NativeStack = createNativeStackNavigator();

const StackModal = () => (
  <NativeStack.Navigator
    screenOptions={{
      headerBackTitleVisible: true,
      headerTitleAlign: 'center',
      headerShown: false
    }}
  >
    <NativeStack.Screen name='PushScreen' options={{ title: '근심 보내기', presentation: 'modal', }} component={PushScreen} />
  </NativeStack.Navigator>
);

export default StackModal;
