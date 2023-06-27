import React, { useEffect, useState } from 'react';
import {
  Alert,
  Linking,
  StatusBar,
  Text,
  View,
  AppState,
  Platform,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Root from './navigation/Root';
import { PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import { RecoilRoot } from 'recoil';
import { v4 as uuidv4 } from "uuid";
import { Storage } from './src/util/storage';

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

async function getUUID() {
  const uuid = await Storage.getItem('uuid');
  if (!uuid) {
    await Storage.setItem('uuid', uuidv4());
  }
}

async function onDisplayNotification({ title = '', body = '' }) {
  const channelId = await notifee.createChannel({
    id: 'channelId',
    name: 'channelName',
  });

  await notifee.displayNotification({
    title,
    body,
    android: {
      channelId,
    },
  });
}

async function getFcmToken() {
  try {
    let platform = Platform.OS
    // console.log platform / token
    console.log({ platform }, await messaging().getToken());
    const storedToken = await Storage.getItem('fcmToken');
    if (!storedToken) {
      await messaging().registerDeviceForRemoteMessages();
      const fcmToken = await messaging().getToken();
      console.log('[FCM Token]', fcmToken);
      await Storage.setItem('fcmToken', fcmToken);

      const uuid = await Storage.getItem('uuid');
      await saveUUIDAndTokenToServer(uuid, fcmToken);

    } else {
      const currentToken = await messaging().getToken();
      if (currentToken !== storedToken) {
        await messaging().registerDeviceForRemoteMessages();
        const newToken = await messaging().getToken();
        await Storage.setItem('fcmToken', newToken);

        const uuid = await Storage.getItem('uuid');
        await saveUUIDAndTokenToServer(uuid, newToken);
      }
    }
  } catch (error) {
    console.log('Failed to get FCM token:', error);
  }
}


async function saveUUIDAndTokenToServer(uuid, fcmToken) {
  // 서버에 UUID와 FCM 토큰을 저장하는 API 호출
  console.log('Saving UUID and FCM Token to server:', uuid, fcmToken);
  // 실패 시 
  // await Storage.setItem('fcmToken', undefined);
  // await Storage.setItem('uuid', undefined);
  // await getFcmToken()
}

async function scheduleFCMTokenRefresh() {
  try {
    const refreshInterval = 24 * 60 * 60 * 1000; // 24 hours
    setInterval(getFcmToken, refreshInterval);
  } catch (error) {
    console.log('Failed to schedule FCM token refresh:', error);
  }
}

export default function App() {
  useEffect(() => {
    const initialize = async () => {
      if (Platform.OS === 'ios') {
        await requestUserPermission();
      } else {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
      }
      await getUUID();
      await getFcmToken();
      scheduleFCMTokenRefresh();
    };

    initialize();

    // const subscribeToMessages = messaging().onMessage(
    //   async (remoteMessage) => {
    //     console.log('App.js: ', remoteMessage)
    //     const { title, body } = remoteMessage?.notification || {};
    //     // 포그라운드 메시지
    //     // await onDisplayNotification({ title, body });
    //   }
    // );

    // return () => subscribeToMessages();
  }, []);

  if (Platform.OS === 'ios') StatusBar.setBarStyle('dark-content', true);

  return (
    <RecoilRoot>
      <NavigationContainer>
        <Root />
      </NavigationContainer>
    </RecoilRoot>
  );
}
