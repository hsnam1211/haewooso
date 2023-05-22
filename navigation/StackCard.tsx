import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, Platform, Pressable, Alert, View } from 'react-native';
import {
  CommonActions,
  StackActions,
  useNavigation,
} from '@react-navigation/native';

import { useRecoilState } from 'recoil';

const NativeStack = createNativeStackNavigator();

const StackCard = () => {
  return (
    <NativeStack.Navigator
      screenOptions={{
        headerBackTitleVisible: true,
        headerTitleAlign: 'center',
      }}
    >
      {/* <NativeStack.Screen
        name=''
        options={{
          title: '상세보기',
          headerLeft: () => <CustomBackButton />,
          headerRight: (e) =>
            isLogin ? <CustomAlarmButton path={'ItemDetail'} /> : null,
        }}
        component={ItemDetail}
      /> */}
    </NativeStack.Navigator>
  );
};

export default StackCard;
