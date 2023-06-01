import React, { useEffect, useState, useContext, useRef } from 'react';

import { View, Text, Pressable, AppState, AppStateStatus } from 'react-native';
import styled from 'styled-components';
import { Storage } from '../src/util/storage'
import { getMessageState } from '../src/recoil/atoms';
import messaging from '@react-native-firebase/messaging';
import { width, height } from '../src/util/screenDimensions';


function Main() {
  const [message, setMessage] = useState(undefined)
  // const [msgData, setMsgData] = useRecoilState(getMessageState)

  const appState = useRef(AppState.currentState);

  // const [backgroundTime, setBackgroundTime] = useState<number>(0);
  // const [foregroundTime, setForegroundTime] = useState<number>(0);

  // const handleAppStateChange = (nextAppState: AppStateStatus) => {
  //   if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
  //     console.log('foreground 전환');
  //     setForegroundTime(Date.now());
  //   } else {
  //     console.log('background 전환');
  //     setBackgroundTime(Date.now());
  //   }

  //   appState.current = nextAppState;
  // };

  const getMessageHandle = async () => {
    await Storage.getItem('message').then((msg) => {
      console.log('background에서 가져온 Message : ', msg)
      if (msg) {
        setMessage({
          body: msg?.notification?.body,
          title: msg?.notification?.title
        })
      }
      Storage.setItem('message', null);
    })
  }

  const handleAppStateChange = nextAppState => {
    console.log('⚽️appState nextAppState', appState.current, nextAppState);
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('⚽️⚽️App has come to the foreground!');
      getMessageHandle()
    }
    if (
      appState.current.match(/inactive|active/) &&
      nextAppState === 'background'
    ) {
      console.log('⚽️⚽️App has come to the background!');
    }
    appState.current = nextAppState;
  };

  useEffect(() => {
    const appStateListener = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      appStateListener.remove();
    };
  }, []);

  useEffect(() => {
    const subscribeToMessages = messaging().onMessage(
      async (remoteMessage) => {
        alert('?@')
        console.log('Main subscribeToMessages', remoteMessage)
        setMessage({
          body: remoteMessage?.notification?.body,
          title: remoteMessage?.notification?.title
        })
      }
    );

    return () => subscribeToMessages();
  }, [])
  
  return (
    <View
      style={{
        backgroundColor: '#25282b',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {message?.title && <Pressable onPress={() => { setMessage(undefined) }} style={{ borderRadius: 6, padding: 20, width: width - 40, height: 400, backgroundColor: 'gray' }}>
        <Text style={{ color: '#fff' }}>{message?.title}</Text>
        <Text style={{ color: '#fff' }}>{message?.body}</Text>
      </Pressable>}
    </View>
  );
}

export default Main;
