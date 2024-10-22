import { CustomBackButton } from "./StackCard";
import OnboardingScreen from "../screens/OnboardingScreen";
import { Platform } from "react-native";
import PushScreen from "../screens/PushScreen";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const NativeStack = createNativeStackNavigator();

const StackModal = () => (
  <NativeStack.Navigator
    screenOptions={{
      headerBackTitleVisible: true,
      headerTitleAlign: "center",
      headerShown: false,
    }}
  >
    <NativeStack.Screen
      name="PushScreen"
      options={{
        title: "근심 보내기",
        presentation: "modal",
        headerLeft: () => <CustomBackButton />,
        headerShown: Platform.select({ android: true, ios: false }),
        headerStyle: {
          backgroundColor: "#FBF9F4",
        },
        headerTitleStyle: {
          color: "#413d34",
          fontSize: 20,
          fontWeight: "500",
        },
      }}
      component={PushScreen}
    />
  </NativeStack.Navigator>
);

export default StackModal;
