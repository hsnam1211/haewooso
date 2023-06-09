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

const NativeStack = createNativeStackNavigator();

const StackCard = () => {
  return (
    <NativeStack.Navigator
      screenOptions={{
        headerBackTitleVisible: true,
        headerTitleAlign: 'center',
      }}
    >
      <NativeStack.Screen
        name="Onboarding"
        component={OnboardingScreen}
      />
    </NativeStack.Navigator>
  );
};

export default StackCard;
