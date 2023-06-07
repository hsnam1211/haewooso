import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, useColorScheme, Platform, Pressable, Image } from 'react-native';

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
        headerShown: true,
        tabBarStyle: {
          // backgroundColor: 'transparent',
          // backgroundColor: BLACK_COLOR,

          backgroundColor: '#002B5B',
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
        tabBarActiveTintColor: '#F9F5EB',
        headerStyle: {
          backgroundColor: '#002B5B',
        },
        headerTitleStyle: {
          // color: BLACK_COLOR,
          color: '#F9F5EB',
          fontSize: 20,
          fontWeight: '500',
        },
        headerTitleAlign: 'center',
      }}
    >
      <Tab.Screen
        name='해우소'
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
          // tabBarLabel: () => { return <Text>dd</Text> },
          headerShadowVisible: false, // applied here
          tabBarLabelStyle: {
            fontSize: 12,
          },
          // headerTitle: () => (
          //   <Image style={{ width: 50, height: 50 }} source={require("./logo.png")} />
          // ),
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
