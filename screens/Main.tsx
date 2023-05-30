import React, { useEffect, useState, useContext } from 'react';

import { View, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQueryClient } from 'react-query';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { Storage } from '../src/util/storage'
import { getMessageState } from '../src/recoil/atoms';
import messaging from '@react-native-firebase/messaging';


function Main() {
  const [message, setMessage] = useState()
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
      <Text style={{ color: '#fff' }}>{message?.title}</Text>
      <Text style={{ color: '#fff' }}>{message?.body}</Text>
    </View>
  );
}

export default Main;
