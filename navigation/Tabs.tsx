import {
  Image,
  Platform,
  Pressable,
  Text,
  View,
  useColorScheme,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useIsFocused, useNavigation } from "@react-navigation/native";

import DeviceInfo from "react-native-device-info";
import Sample from "../screens/Sample";
import SamplePushToken from "../screens/SamplePushToken";
import Setting from "../screens/Setting";
import SimpleMain from "../screens/SimpleMain";
import StickyHeaderExample from "../screens/StickyHeaderExample";
import SvgIcon from "../src/components/SvgIcon";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useRecoilState } from "recoil";
import ReceiveUserList from "../screens/ReceiveUserList";

const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: true,
        tabBarStyle: {
          backgroundColor: "#2A2322",
          position: "absolute",
          left: 0,
          bottom: 0,
          right: 0,
          height:
            Platform.OS === "ios" ? (DeviceInfo.hasNotch() ? 92 : 70) : 70,
          paddingTop: Platform.OS === "ios" ? 6 : 10,
          paddingBottom:
            Platform.OS === "ios" ? (DeviceInfo.hasNotch() ? 26 : 12) : 12,
        },
        tabBarActiveTintColor: "#F9F5EB",
        headerStyle: {
          // backgroundColor: '#002B5B',
        },
        headerTitleStyle: {
          color: "#F9F5EB",
          fontSize: 20,
          fontWeight: "500",
        },
        headerTitleAlign: "center",
      }}
    >
      <Tab.Screen
        name="해우소"
        component={SimpleMain}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <SvgIcon
                name="toiletPaper"
                stroke={focused ? "#FBF9F4" : "#797979"}
                fill={focused ? "#FBF9F4" : "#797979"}
                strokeWidth={focused ? 10.5 : 2}
                size={22}
              />
            );
          },
          // headerRight: () =>
          //   isLogin ? <CustomAlarmButton path={'Home'} /> : null,
          // tabBarLabel: () => { return <Text>dd</Text> },
          headerShadowVisible: false, // applied here
          tabBarLabelStyle: {
            fontSize: 12,
          },
          // headerTitle: () => (
          //   <Image
          //     style={{ width: 50, height: 50 }}
          //     source={require("./logo.png")}
          //   />
          // ),
        }}
        // listeners={{
        //   tabPress: (e) => {
        //     console.log(e);
        //   },
        // }}
      />
      <Tab.Screen
        name="근심함"
        component={ReceiveUserList}
        options={{
          tabBarLabel: "근심함",
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <SvgIcon
                name="email"
                stroke={focused ? "#FBF9F4" : "#797979"}
                fill={focused ? "#FBF9F4" : "#797979"}
                strokeWidth={focused ? 10.5 : 2}
                size={24}
              />
            );
          },
          headerStyle: {
            backgroundColor: "#FBF9F4",
          },
          headerTitleStyle: {
            color: "#413d34",
            fontSize: 20,
            fontWeight: "500",
          },
          tabBarLabelStyle: {
            fontSize: 12,
          },
        }}
      />
      <Tab.Screen
        name="설정"
        component={Setting}
        options={{
          tabBarLabel: "설정",
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <SvgIcon
                name="gear"
                stroke={focused ? "#FBF9F4" : "#797979"}
                fill={focused ? "#FBF9F4" : "#797979"}
                strokeWidth={focused ? 10.5 : 2}
                size={22}
              />
            );
          },
          headerStyle: {
            backgroundColor: "#FBF9F4",
          },
          headerTitleStyle: {
            color: "#413d34",
            fontSize: 20,
            fontWeight: "500",
          },
          tabBarLabelStyle: {
            fontSize: 12,
          },
        }}
      />
      {/* <Tab.Screen
        name="SamplePushToken"
        component={SamplePushToken}
        options={{
          tabBarLabel: "SamplePushToken",
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <SvgIcon
                name="heart"
                stroke={focused ? "#FBF9F4" : "#797979"}
                strokeWidth={focused ? 2 : 1.5}
                size={24}
              />
            );
          },
          headerStyle: {
            backgroundColor: "#2A2322",
          },
          headerTitleStyle: {
            // color: BLACK_COLOR,
            color: "#F9F5EB",
            fontSize: 20,
            fontWeight: "500",
          },
          tabBarLabelStyle: {
            fontSize: 12,
          },
        }}
      /> */}
    </Tab.Navigator>
  );
}

export default Tabs;
