import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Root from './navigation/Root';
import { PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import { RecoilRoot } from 'recoil';

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

export default function App() {

  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === 'ios') {
        await requestUserPermission();
      } else {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
      }
    };

    const onDisplayNotification = async ({ title = '', body = '' }) => {
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
    };

    // fcm 수신부
    const subscribeToMessages = () => {
      // const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      //   console.log('[Remote Message] ', JSON.stringify(remoteMessage));
      //   await Storage.setItem('message', remoteMessage);
      // });

      messaging().onMessage(async (remoteMessage) => {
        const title = remoteMessage?.notification?.title;
        const body = remoteMessage?.notification?.body;
        await onDisplayNotification({ title, body });
      });
      // return unsubscribe;
    };

    // fcm 토큰 받아오는 함수
    const getFcmToken = async () => {
      try {
        await messaging().registerDeviceForRemoteMessages();
        const fcmToken = await messaging().getToken();
        console.log('[FCM Token] ', fcmToken);
      } catch (error) {
        console.log('Failed to get FCM token:', error);
      }
    };

    const initialize = async () => {
      await requestPermission();
      getFcmToken();
    };

    initialize();

    return subscribeToMessages();
  }, []);

  return (
    <RecoilRoot>
      <NavigationContainer>
        <Root />
      </NavigationContainer>
    </RecoilRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
