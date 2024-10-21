import {
  Animated,
  AppState,
  AppStateStatus,
  Button,
  Image,
  Linking,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { Modal, Portal } from "react-native-paper";
import React, { useContext, useEffect, useRef, useState } from "react";
import { height, width } from "../src/util/screenDimensions";
import {
  onPressMoveSystemSetting,
  requestUserPermission,
  updateDate,
} from "../App";

import ArrowClick from "../assets/arrowClick.png";
import CommonModal from "../src/components/CommonModal";
import DeviceInfo from "react-native-device-info";
import { MessageButton } from "../src/components/MessageButton";
import { Storage } from "../src/util/storage";
import messaging from "@react-native-firebase/messaging";
import styled from "styled-components";
import { taptic } from "../src/util/taptic";
import { useNavigation } from "@react-navigation/native";
import usePush from "../src/hooks/usePush";

const Container = styled(View)`
  margin-right: 0px;
  margin-left: 0px;
`;

function Main() {
  const navigation = useNavigation<any>();
  const [message, setMessage] = useState(undefined);
  const { isPush, setIsPush } = usePush();
  // const [msgData, setMsgData] = useRecoilState(getMessageState)

  const appState = useRef(AppState.currentState);

  const [backgroundTime, setBackgroundTime] = useState<number>(0);
  const [foregroundTime, setForegroundTime] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [pushModalVisible, setPushModalVisible] = useState(false);
  const pushOnOffCheck = async () => {
    const isPushState = await requestUserPermission();
    // TODO: 푸시 알림 체크 서버로 전송
    setIsPush(isPushState);
  };

  // TODO: 모달 온오프 함수
  const pushOnModal = async () => {
    const isPushState = await requestUserPermission();
    // const isPushState = true;
    if (!isPushState) {
      setPushModalVisible(true);
    }
  };

  // TODO: 유저 접속 시간 로직 추가
  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (
      // appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("foreground 전환");

      await pushOnOffCheck();
      await pushOnModal();
      // TODO: 푸시 알림 체크 서버로 전송

      setForegroundTime(Date.now());
      getMessageHandle();
      await updateDate();
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

    pushOnOffCheck();

    Linking.getInitialURL() // 최초 실행 시에 Universal link 또는 URL scheme요청이 있었을 때 여기서 찾을 수 있음
      .then(async (value) => {
        const url = value ? value : "https://haewooso.web.app/";
        const secretCode = url?.split("haewooso://params/?secret_code=")?.[1];

        if (secretCode) {
          navigation.navigate("Tabs", {
            screen: "Main",
            animation: "fade",
          });
          navigation.navigate("StackModal", {
            screen: "PushScreen",
            params: { secretCode: secretCode },
            animation: "fade",
          });
        }
      });

    const urlListener = Linking.addEventListener("url", async (e) => {
      // 앱이 실행되어있는 상태에서 요청이 왔을 때 처리하는 이벤트 등록
      const value = e.url;

      const url = value ? value : "https://haewooso.web.app/";
      let secretCode;
      if (url.includes("secret_code=")) {
        secretCode = url?.split("secret_code=")?.[1];
      }

      if (secretCode) {
        navigation.navigate("Tabs", {
          screen: "Main",
          animation: "fade",
        });
        navigation.navigate("StackModal", {
          screen: "PushScreen",
          params: { secretCode: secretCode },
          animation: "fade",
        });
      }
    });

    return () => {
      urlListener.remove();
      appStateListener.remove();
    };
  }, []);

  useEffect(() => {
    const subscribeToMessages = messaging().onMessage(async (remoteMessage) => {
      console.log("Main subscribeToMessages", remoteMessage);
      setMessage({
        body: remoteMessage?.notification?.body,
        title: remoteMessage?.notification?.title,
      });
      setModalVisible(true);
    });

    return () => subscribeToMessages();
  }, []);

  const InAppMessageModal = () => {
    const currentValue = -120;
    const translateY = useRef(new Animated.Value(currentValue)).current; // 초기 위치 설정

    useEffect(() => {
      if (modalVisible) {
        // 모달이 열릴 때 애니메이션 실행
        Animated.timing(translateY, {
          toValue: 60, // 최종 위치
          duration: 300, // 애니메이션 시간
          useNativeDriver: true,
        }).start();

        // 3초 후에 모달을 닫고 애니메이션을 다시 실행
        const timer = setTimeout(() => {
          Animated.timing(translateY, {
            toValue: currentValue, // 원래 위치로 돌아가기
            duration: 300,
            useNativeDriver: true,
          }).start(() => setModalVisible(false)); // 애니메이션이 끝난 후 모달 닫기
        }, 3000);

        return () => clearTimeout(timer); // 클린업
      }
    }, [modalVisible]);

    return (
      <>
        {/* Portal을 사용하여 모달을 렌더링 */}
        <Portal>
          {/* TODO: 모달 디자인 해야함 노치 / 노치 없는 버전 둘 다 */}
          <Animated.View
            style={{
              transform: [{ translateY }],
              zIndex: 100000,
              alignItems: "center",
              backgroundColor: "transparent",
              position: "absolute", // 위치를 절대적으로 설정
              top: -60,
              width: "100%", // 전체 너비
            }}
          >
            <Pressable
              onPress={() => {
                setMessage(undefined);
                setModalVisible(false);
              }}
              style={{
                height: DeviceInfo.hasNotch() ? 140 : 100,
                padding: 20,
                paddingTop: 60,
                width: width,
                backgroundColor: "#222222",
                justifyContent: "center",
              }}
            >
              <View style={DeviceInfo.hasNotch() ? {} : { bottom: 20 }}>
                <Text style={{ color: "#fff", marginBottom: 5 }}>
                  {message?.title}{" "}
                </Text>
                <Text
                  numberOfLines={2}
                  ellipsizeMode={"tail"}
                  style={{ color: "#fff" }}
                >
                  {message?.body}
                </Text>
              </View>
            </Pressable>
          </Animated.View>
        </Portal>
      </>
    );
  };

  const handlePress = () => {
    onPressMoveSystemSetting();
  };
  return (
    <>
      <CommonModal
        title="알림 설정이 안되어 있어요! 🥲"
        description={`알림 설정이 안되어 있어요! 🥲 \n알림 설정을 해야 즐길 수 있어요.!!`}
        children={
          <View>
            <Text style={{ marginBottom: 5 }}>
              알림 설정이 안되어 있네요! 🥲
            </Text>
            <Text>알림 설정을 해야 의미가(?) 있어요.!!</Text>
          </View>
        }
        type="alert"
        confirmText="알림 설정 할게요..!"
        closeText="싫어요."
        visible={pushModalVisible}
        onConfirm={handlePress}
        onClose={() => {
          setPushModalVisible(false);
        }}
      />

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
          <InAppMessageModal />
          {/* <PushOnModal /> */}
          <View style={{ position: "relative" }}>
            <View
              style={{
                position: "absolute",
                top: Platform.select({ ios: 26, android: 26 }),
                right: Platform.select({ ios: -10, android: -10 }),
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
                  top: Platform.select({ ios: -18, android: -18 }),
                  right: Platform.select({ ios: -25, android: -25 }),
                }}
              >
                click!
              </Text>
            </View>
            <MessageButton />
            {/* <View>
              <Text style={{ marginBottom: 10 }}>그냥 한 번 보내보세요.</Text>
              <Text>누군가에게는 닿을 거예요.</Text>
            </View> */}
          </View>
        </Container>
      </View>
    </>
  );
}
export default Main;
