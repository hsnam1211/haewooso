import React, { useEffect, useState, useContext } from 'react';

import { View, Text, Pressable } from 'react-native';
import styled from 'styled-components';
import { Storage } from '../src/util/storage'
import { getMessageState } from '../src/recoil/atoms';
import messaging from '@react-native-firebase/messaging';
import { width, height } from '../src/util/screenDimensions';


function Main() {
  const [message, setMessage] = useState(undefined)
  // const [msgData, setMsgData] = useRecoilState(getMessageState)
  messaging().onMessage(async (remoteMessage) => {
    setMessage({
      body: remoteMessage?.notification?.body,
      title: remoteMessage?.notification?.title
    })
  });
  const getMessageHandle = async () => {
    await Storage.getItem('message').then((msg) => {
      if (msg) {
        setMessage({
          body: msg?.notification?.body,
          title: msg?.notification?.title
        })
      }
      Storage.setItem('message', null);
    })
  }
  useEffect(() => {
    getMessageHandle()
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
