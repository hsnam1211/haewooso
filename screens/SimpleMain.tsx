import {
  Animated,
  AppState,
  AppStateStatus,
  Button,
  Image,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { Modal, Portal } from "react-native-paper";
import React, { useContext, useEffect, useRef, useState } from "react";
import { height, width } from "../src/util/screenDimensions";
import { onPressMoveSystemSetting, requestUserPermission } from "../App";

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
    if (!isPushState) {
      setPushModalVisible(true);
    }
  };

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("foreground 전환");

      await pushOnOffCheck();
      // TODO: 푸시 알림 체크 서버로 전송

      setForegroundTime(Date.now());
      getMessageHandle();
    } else {
      console.log("background 전환");
      setBackgroundTime(Date.now());
    }

    appState.current = nextAppState;
  };

  const getMessageHandle = async () => {
    await Storage.getItem("message").then(msg => {
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
    pushOnModal();
    return () => {
      appStateListener.remove();
    };
  }, []);

  useEffect(() => {
    const subscribeToMessages = messaging().onMessage(async remoteMessage => {
      alert("foreground");
      console.log("Main subscribeToMessages", remoteMessage);
      setMessage({
        body: remoteMessage?.notification?.body,
        title: remoteMessage?.notification?.title,
      });
      setModalVisible(true);
    });

    return () => subscribeToMessages();
  }, []);

  // TODO: 지워야함
  useEffect(() => {
    setMessage({
      body: "안녕하세요?",
      title: "안녕~",
    });
  }, []);

  const InAppMessageModal = () => {
    const translateY = useRef(new Animated.Value(-100)).current; // 초기 위치 설정

    useEffect(() => {
      if (modalVisible) {
        // 모달이 열릴 때 애니메이션 실행
        Animated.timing(translateY, {
          toValue: 0, // 최종 위치
          duration: 300, // 애니메이션 시간
          useNativeDriver: true,
        }).start();

        // 3초 후에 모달을 닫고 애니메이션을 다시 실행
        const timer = setTimeout(() => {
          Animated.timing(translateY, {
            toValue: -100, // 원래 위치로 돌아가기
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
              top: 10,
              width: "100%", // 전체 너비
            }}
          >
            <Pressable
              onPress={() => {
                setMessage(undefined);
                setModalVisible(false);
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
            {/* TODO: 지워야함 */}
            <Button
              title="Show Modal"
              onPress={() => {
                setModalVisible(true);
              }}
            />
            <MessageButton />
            <View>
              <Text style={{ marginBottom: 10 }}>그냥 한 번 보내보세요.</Text>
              <Text>누군가에게는 닿을 거예요.</Text>
            </View>
          </View>
        </Container>
      </View>
    </>
  );
}
export default Main;
