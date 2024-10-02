import React, { useEffect } from "react";

import StackCard from "./StackCard";
import StackModal from "./StackModal";
import { Storage } from "../src/util/storage";
import Tabs from "./Tabs";
import { View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getMessageState } from "../src/recoil/atoms";
import { useNavigation } from "@react-navigation/native";
import { useRecoilState } from "recoil";

const Nav = createNativeStackNavigator();

const Root = () => {
  const navigation = useNavigation<any>();

  useEffect(() => {
    // 앱이 시작되면서 바로 온보딩 화면으로 이동
    // 온보딩 화면이 끝난 후에는 메인 화면으로 이동 가능
    // 이 로직은 온보딩 화면에서 메인 화면으로 이동하는 로직을 적용하면서 변경 가능
    navigateToOnboarding();
  }, []);

  const navigateToOnboarding = () => {
    navigation.navigate("StackCard", {
      screen: "Onboarding",
    });
  };

  return (
    <Nav.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Nav.Screen name="Tabs" component={Tabs} />

      <Nav.Screen
        name="StackModal"
        options={{
          presentation: "modal",
        }}
        component={StackModal}
      />
      <Nav.Screen
        name="StackCard"
        options={{
          presentation: "card",
        }}
        component={StackCard}
      />
    </Nav.Navigator>
  );
};

export default Root;
