import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, Platform, Pressable, Alert, View } from 'react-native';
import {
  CommonActions,
  StackActions,
  useNavigation,
} from '@react-navigation/native';

import { useRecoilState } from 'recoil';
import OnboardingScreen from '../screens/OnboardingScreen';
import DetailMessage from '../screens/DetailMessage';
import ReceiveMsg from '../screens/ReceiveMsg';


const NativeStack = createNativeStackNavigator();

const StackCard = () => {
  return (
    <NativeStack.Navigator
      screenOptions={{
        headerBackTitleVisible: true,
        headerTitleAlign: 'center',
        gestureEnabled: true,
      }}
    >
      <NativeStack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{
          gestureEnabled: true,
          animation: 'default'
        }}
      />
      <NativeStack.Screen
        name="DetailMessage"
        component={DetailMessage}
        options={{
          headerShown: false,
          gestureEnabled: true,
          animation: 'default'
        }}
      />
      <NativeStack.Screen
        name="ReceiveMsg"
        component={ReceiveMsg}
        options={{
          headerShown: false,
          gestureEnabled: true,
          animation: 'default'
        }}
      />
    </NativeStack.Navigator>
  );
};

export default StackCard;