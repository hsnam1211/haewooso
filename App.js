import {
  Alert,
  AppState,
  Linking,
  Platform,
  StatusBar,
  Text,
  View,
} from "react-native";
import { Modal, Provider as PaperProvider, Portal } from "react-native-paper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

import { HW_URL } from "./src/res/env";
import { NavigationContainer } from "@react-navigation/native";
import { PermissionsAndroid } from "react-native";
import { RecoilRoot } from "recoil";
import Root from "./navigation/Root";
import { Storage } from "./src/util/storage";
import Toast from "react-native-toast-message";
import axios from "axios";
import messaging from "@react-native-firebase/messaging";
import { toastConfig } from "./src/util/toastMsg";
import { v4 as uuidv4 } from "uuid";

/**
 * 알림 설정 창으로 이동
 */
export const onPressMoveSystemSetting = () => {
  Linking.openSettings();
};

/**
 * 알림 설정 체크
 * @returns
 */
let hasRequestedPermission = false; // 권한 요청 여부를 저장하는 플래그

export async function requestUserPermission() {
  let enabled = false;

  if (Platform.OS === "ios") {
    const authStatus = await messaging().requestPermission();

    enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    return enabled;
  } else {
    // 권한이 이미 부여되었는지 체크
    const permissionStatus = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );

    if (!permissionStatus) {
      // 권한이 부여되지 않은 경우에만 요청
      if (!hasRequestedPermission) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );

        console.log(`안드로이드 권한 요청 결과: ${granted}`);
        enabled = granted === PermissionsAndroid.RESULTS.GRANTED;
        hasRequestedPermission = true; // 권한 요청 완료 플래그 설정
      }
      enabled = false;
    } else {
      enabled = true; // 권한이 이미 부여된 경우
    }

    console.log(`권한 허용 여부: ${enabled}`);
    return enabled;
  }
}

async function getUUID() {
  const uuid = await Storage.getItem("uuid");
  if (!uuid) {
    await Storage.setItem("uuid", uuidv4());
  } else {
    // uuid가 있으면 접속일자 업데이트
    updateDate();
  }
}

async function getFcmToken() {
  try {
    // await Storage.removeItem('fcmToken')
    let platform = Platform.OS;
    console.log({ platform }, await messaging().getToken());
    const storedToken = await Storage.getItem("fcmToken");
    if (!storedToken) {
      // await messaging().registerDeviceForRemoteMessages();
      const fcmToken = await messaging().getToken();
      console.log("[FCM Token]", fcmToken);
      await Storage.setItem("fcmToken", fcmToken);

      const uuid = await Storage.getItem("uuid");
      await saveUUIDAndTokenToServer(uuid, fcmToken);
    } else {
      const currentToken = await messaging().getToken();
      if (currentToken !== storedToken) {
        // await messaging().registerDeviceForRemoteMessages();
        const newToken = await messaging().getToken();
        await Storage.setItem("fcmToken", newToken);

        const uuid = await Storage.getItem("uuid");
        await saveUUIDAndTokenToServer(uuid, newToken);
      }
    }
  } catch (error) {
    console.log("Failed to get FCM token:", error);
  }
}

/** 유저 접속 시간 */
export const updateDate = async () => {
  const uuid = await Storage.getItem("uuid");
  const lastUpdateDate = await Storage.getItem("lastUpdateDate");
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD 형식으로 오늘 날짜 가져오기

  // 오늘 날짜와 동일하면 API 호출하지 않음
  if (lastUpdateDate === today) {
    console.log("오늘 이미 업데이트됨");
    return;
  }

  // API 호출
  const endPoint = "/member/v1/last-connect-date";
  try {
    const response = await axios.patch(`${HW_URL.APP_API}${endPoint}`, {
      uuid: uuid,
    });
    console.log("updateDate", `유저 접속 시간 업데이트 성공 ${response.data}`);

    // 로컬 스토리지에 오늘 날짜로 업데이트
    await Storage.setItem("lastUpdateDate", today);
  } catch (error) {
    console.error("API 호출 실패", error);
    console.error(endPoint);
  }
};

const userAdd = async (uuid, fcmToken) => {
  const endPoint = "/member/v1/user";
  axios
    .post(`${HW_URL.APP_API}${endPoint}`, {
      uuid: uuid,
      push_token: fcmToken,
    })
    .then((response) => {
      // 성공적으로 요청을 처리한 경우
      console.log("userAdd", response.data);
    })
    .catch(async (error) => {
      // 요청 처리 중에 오류가 발생한 경우
      console.error(error);
      console.error(endPoint);

      // 실패 시
      // await Storage.setItem('fcmToken', undefined);
      // await Storage.setItem('uuid', undefined);
      // await getFcmToken()
    });
};

async function saveUUIDAndTokenToServer(uuid, fcmToken) {
  // 서버에 UUID와 FCM 토큰을 저장하는 API 호출
  await userAdd(uuid, fcmToken);
  console.log("Saving UUID and FCM Token to server:", uuid, fcmToken);
}

async function scheduleFCMTokenRefresh() {
  try {
    const refreshInterval = 24 * 60 * 60 * 1000; // 24 hours
    setInterval(getFcmToken, refreshInterval);
  } catch (error) {
    console.log("Failed to schedule FCM token refresh:", error);
  }
}

export default function App() {
  const queryClient = new QueryClient();

  useEffect(() => {
    const initialize = async () => {
      await Storage.setItem("setting", false);
      await getUUID();
      await getFcmToken();
      scheduleFCMTokenRefresh();
      await requestUserPermission();
    };

    initialize();
  }, []);

  if (Platform.OS === "ios") StatusBar.setBarStyle("dark-content", true);

  return (
    <>
      <PaperProvider>
        <QueryClientProvider client={queryClient}>
          <RecoilRoot>
            <NavigationContainer>
              <Root />
            </NavigationContainer>
          </RecoilRoot>
          <Toast config={toastConfig} />
        </QueryClientProvider>
      </PaperProvider>
    </>
  );
}
