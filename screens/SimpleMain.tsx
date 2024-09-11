import React, { useEffect, useState, useContext, useRef } from "react";

import {
  View,
  Text,
  Pressable,
  AppState,
  AppStateStatus,
  Platform,
  Animated,
  Image,
} from "react-native";
import styled from "styled-components";
import { Storage } from "../src/util/storage";

import messaging from "@react-native-firebase/messaging";
import { width, height } from "../src/util/screenDimensions";

import DeviceInfo from "react-native-device-info";

import { taptic } from "../src/util/taptic";
import { useNavigation } from "@react-navigation/native";
import { MessageButton } from "../src/components/MessageButton";
import ArrowClick from "../assets/arrowClick.png";
const Container = styled(View)`
  margin-right: 0px;
  margin-left: 0px;
`;

function Main() {
  const navigation = useNavigation<any>();
  const [message, setMessage] = useState(undefined);
  // const [msgData, setMsgData] = useRecoilState(getMessageState)

  const appState = useRef(AppState.currentState);

  const [backgroundTime, setBackgroundTime] = useState<number>(0);
  const [foregroundTime, setForegroundTime] = useState<number>(0);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("foreground 전환");
      setForegroundTime(Date.now());
      getMessageHandle();
    } else {
      console.log("background 전환");
      setBackgroundTime(Date.now());
    }

    appState.current = nextAppState;
  };

  const getMessageHandle = async () => {
    await Storage.getItem("message").then((msg) => {
      console.log("background에서 가져온 Message : ", msg);
      if (msg) {
        setMessage({
          body: msg?.notification?.body,
          title: msg?.notification?.title,
        });
      }
      Storage.setItem("message", null);
    });
  };

  useEffect(() => {
    const appStateListener = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      appStateListener.remove();
    };
  }, []);

  useEffect(() => {
    const subscribeToMessages = messaging().onMessage(async (remoteMessage) => {
      alert("fore ground");
      console.log("Main subscribeToMessages", remoteMessage);
      setMessage({
        body: remoteMessage?.notification?.body,
        title: remoteMessage?.notification?.title,
      });
    });

    return () => subscribeToMessages();
  }, []);

  return (
    <View
      style={{
        backgroundColor: "#FBF9F4",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop:
          Platform.OS === "ios" ? (DeviceInfo.hasNotch() ? 52 : 0) : 0,
        marginBottom:
          Platform.OS === "ios" ? (DeviceInfo.hasNotch() ? 92 : 70) : 70,
      }}
    >
      <Container>
        {message?.title && (
          <Animated.View
            style={{
              zIndex: 100000,
              alignItems: "center",
              backgroundColor: "transparent",
            }}
          >
            <Pressable
              onPress={() => {
                setMessage(undefined);
              }}
              style={{
                borderBottomRightRadius: 6,
                borderBottomLeftRadius: 6,
                padding: 20,
                width: width,
                backgroundColor: "gray",
              }}
            >
              <Text style={{ color: "#fff" }}>{message?.title}</Text>
              <Text style={{ color: "#fff" }}>{message?.body}</Text>
              <Text>확인 되었으면 클릭!</Text>
            </Pressable>
          </Animated.View>
        )}

        <View style={{ position: "relative" }}>
          <View
            style={{
              position: "absolute",
              top: Platform.select({ ios: 26, android: 4 }),
              right: Platform.select({ ios: -10, android: 4 }),
            }}
          >
            <Image
              style={{
                transform: [{ rotate: "200deg" }],
                width: 17,
                height: 17,
              }}
              source={ArrowClick}
            />
            <Text
              style={{
                transform: [{ rotate: "10deg" }],
                top: Platform.select({ ios: -18, android: 4 }),
                right: Platform.select({ ios: -25, android: 4 }),
              }}
            >
              click!
            </Text>
          </View>
          <MessageButton />
          <View>
            <Text style={{ marginBottom: 10 }}>그냥 한 번 보내보세요.</Text>
            <Text>누군가에게는 닿을 거예요.</Text>
          </View>
        </View>
      </Container>
    </View>
  );
}

export default Main;
