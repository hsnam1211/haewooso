import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, useColorScheme, Platform, Pressable } from 'react-native';

import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useRecoilState } from 'recoil';
import DeviceInfo from 'react-native-device-info';
import Main from '../screens/Main';
import Sample from '../screens/Sample';

const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          // backgroundColor: 'transparent',
          // backgroundColor: BLACK_COLOR,

          backgroundColor: '#000',
          position: 'absolute',
          left: 0,
          bottom: 0,
          right: 0,
          height:
            Platform.OS === 'ios' ? (DeviceInfo.hasNotch() ? 92 : 70) : 70,
          paddingTop: Platform.OS === 'ios' ? 6 : 10,
          paddingBottom:
            Platform.OS === 'ios' ? (DeviceInfo.hasNotch() ? 26 : 12) : 12,
        },
        tabBarActiveTintColor: 'white',
        headerStyle: {
          backgroundColor: 'white',
        },
        headerTitleStyle: {
          // color: BLACK_COLOR,
          color: '#000',
          fontSize: 20,
          fontWeight: '500',
        },
        headerTitleAlign: 'center',
      }}
    >
      <Tab.Screen
        name='Main'
        component={Main}
        options={{
          // tabBarIcon: ({ focused, color, size }) => {
          //   return (
          //     <SvgIcon
          //       name='Home'
          //       stroke={focused ? 'white' : '#797979'}
          //       strokeWidth={focused ? 2 : 1.5}
          //     />
          //   );
          // },
          // headerRight: () =>
          //   isLogin ? <CustomAlarmButton path={'Home'} /> : null,
          tabBarLabel: 'MAIN',
          tabBarLabelStyle: {
            fontSize: 12,
          },
        }}
        // listeners={{
        //   tabPress: (e) => {
        //     console.log(e);
        //   },
        // }}
      />
      <Tab.Screen
        name='Sample'
        component={Sample}
        options={{
          tabBarLabel: 'Sample',
          tabBarLabelStyle: {
            fontSize: 12,
          },
        }}
      />
    </Tab.Navigator>
  );
}

export default Tabs;
