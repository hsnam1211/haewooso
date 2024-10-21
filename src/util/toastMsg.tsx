import React from "react";
import { Text, View, Platform, Pressable } from "react-native";
import Toast from "react-native-toast-message";
import { width, height } from "../../src/util/screenDimensions";
import { taptic } from "./taptic";

export const toastConfig = {
  tomatoToast: ({ text1, props }) => (
    <View
      style={{
        zIndex: 1000,
        paddingTop: 8,
        paddingBottom: 8,
        borderRadius: 6,
        paddingLeft: 20,
        paddingRight: 20,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: "#252728",
        justifyContent: "center",
        alignItems: "center",
        ...Platform.select({
          ios: {
            shadowColor: "rgb(50,50,50)",
            shadowOpacity: 0.3,
            shadowRadius: 5,
            shadowOffset: {
              height: -1,
              width: 0,
            },
          },
          android: {
            elevation: 3,
          },
        }),
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontSize: 16,
          lineHeight: 22,
          textAlign: "center",
        }}
      >
        {text1}
      </Text>
    </View>
  ),
};

export const ToastHandle = (text: any) => {
  Toast.show({
    type: "tomatoToast",
    position: "bottom",
    bottomOffset: 100,
    visibilityTime: 2000,
    text1: text,
  });
};
