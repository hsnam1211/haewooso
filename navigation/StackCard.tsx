import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button, Platform, Pressable, Alert, View } from "react-native";
import {
  CommonActions,
  StackActions,
  useNavigation,
} from "@react-navigation/native";

import { useRecoilState } from "recoil";
import OnboardingScreen from "../screens/OnboardingScreen";
import DetailMessage from "../screens/DetailMessage";
import ReceiveMsg from "../screens/ReceiveMsg";
import SvgIcon from "../src/components/SvgIcon";

const NativeStack = createNativeStackNavigator();
export function CustomBackButton() {
  const navigation = useNavigation();

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.dispatch(StackActions.pop(1));
    } else {
      navigation.dispatch(CommonActions.goBack());
    }
  };

  return (
    <Pressable
      style={{
        backgroundColor: "transparent",
        width: 50,
        height: 50,
        paddingLeft: 10,
        right: 10,
        bottom: Platform.OS === "ios" ? 4 : undefined,
        justifyContent: "center",
      }}
      onPress={handleGoBack}
    >
      <SvgIcon
        styleProps={{ transform: [{ rotate: "180deg" }] }}
        name="arrow"
        stroke={"#333639"}
        strokeWidth={0.8}
        size={20}
      />
    </Pressable>
  );
}
const StackCard = () => {
  return (
    <NativeStack.Navigator
      screenOptions={{
        headerBackTitleVisible: true,
        headerTitleAlign: "center",
        gestureEnabled: true,
      }}
    >
      <NativeStack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{
          headerLeft: () => <CustomBackButton />,
          gestureEnabled: true,
          animation: "default",
        }}
      />
      <NativeStack.Screen
        name="DetailMessage"
        component={DetailMessage}
        options={{
          headerLeft: () => <CustomBackButton />,
          // headerShown: false,
          headerTitle: "근심 상세",
          gestureEnabled: true,
          animation: "default",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#FBF9F4",
          },
          headerTitleStyle: {
            color: "#413d34",
            fontSize: 20,
            fontWeight: "500",
          },
        }}
      />
      <NativeStack.Screen
        name="ReceiveMsg"
        component={ReceiveMsg}
        options={{
          headerLeft: () => <CustomBackButton />,
          headerTitle: "받은 메시지",
          headerShown: true,
          gestureEnabled: true,
          animation: "default",
          headerStyle: {
            backgroundColor: "#FBF9F4",
          },
          headerTitleStyle: {
            color: "#413d34",
            fontSize: 20,
            fontWeight: "500",
          },
        }}
      />
    </NativeStack.Navigator>
  );
};

export default StackCard;
