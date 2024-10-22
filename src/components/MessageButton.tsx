import { Platform, Pressable, Text, View } from "react-native";

import React from "react";
import Toast from "react-native-toast-message";
import { taptic } from "../util/taptic";
import { useNavigation } from "@react-navigation/native";

export const MessageButton = () => {
  const navigation = useNavigation<any>();

  return (
    <View>
      <View
        style={{
          backgroundColor: "trasparent",
          height: 100,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 15,
          marginBottom: 15,
        }}
      >
        <Pressable
          style={{
            borderRadius: 4,
            justifyContent: "center",
            borderWidth: 1,
            borderColor: "#2a2322",
          }}
          onPressIn={() => {
            taptic();
          }}
          onPressOut={() => {
            taptic();
            navigation.navigate("StackModal", {
              screen: "PushScreen",
              animation: "fade",
            });
          }}
        >
          <Text
            style={{
              color: "#2a2322",
              textAlign: "center",
              paddingLeft: 15,
              paddingRight: 15,
              paddingTop: 10,
              paddingBottom: 10,
              fontSize: Platform.select({ android: 12, ios: 14 }),
              fontWeight: "500",
              position: "relative",
              top: Platform.select({ android: -2 }),
            }}
          >
            익명의 누군가에게 나의 근심 보내보기
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
