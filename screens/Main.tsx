import React, { useEffect, useState, useContext, useRef } from 'react';

import { View, Text, Pressable, AppState, AppStateStatus, FlatList } from 'react-native';
import styled from 'styled-components';
import { Storage } from '../src/util/storage'
import { getMessageState } from '../src/recoil/atoms';
import messaging from '@react-native-firebase/messaging';
import { width, height } from '../src/util/screenDimensions';

const Container = styled(View)`
  margin-right: 0px;
  margin-left: 0px;
`;

function Main() {
  const [message, setMessage] = useState(undefined)
  // const [msgData, setMsgData] = useRecoilState(getMessageState)

  const appState = useRef(AppState.currentState);

  const [backgroundTime, setBackgroundTime] = useState<number>(0);
  const [foregroundTime, setForegroundTime] = useState<number>(0);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      console.log('foreground 전환');
      setForegroundTime(Date.now());
      getMessageHandle()
    } else {
      console.log('background 전환');
      setBackgroundTime(Date.now());
    }

    appState.current = nextAppState;
  };

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

  const data = [
    { id: '1', title: 'Item 1' },
    { id: '2', title: 'Item 2' },
    { id: '3', title: 'Item 3' },
    { id: '4', title: 'Item 4' },
    { id: '5', title: 'Item 5' },
    { id: '6', title: 'Item 1' },
    { id: '7', title: 'Item 2' },
    { id: '8', title: 'Item 3' },
    { id: '9', title: 'Item 4' },
    { id: '10', title: 'Item 5' },
  ];

  const PushCountComponent = () => {
    return (
      <View style={{ padding: 16, backgroundColor: '#002B5B', width: width }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>
          🚽 오늘 해우소 사용 가능 횟수는 총 5회 🚽
        </Text>
      </View>
    );
  };

  const Header = () => {
    return (
      <View>
        <View style={{
          elevation: 5, // 안드로이드 그림자
          shadowColor: '#000', // iOS 그림자 색상
          shadowOffset: { width: 0, height: 3 }, // iOS 그림자 오프셋
          shadowOpacity: 0.8, // iOS 그림자 투명도
          shadowRadius: 4, // iOS 그림자 반경,
          backgroundColor: '#002B5B', width: width - 24, borderRadius: 8, height: 150, marginTop: 15, marginBottom: 10,
          justifyContent: 'center'
        }}>
          <Text style={{ color: 'white', textAlign: 'center', marginBottom: 20 }}>
            해우소 사용 가능 횟수를 다 소진하셨다면...
          </Text>
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>
            광고 보고 다시 근심 털기 📺
          </Text>
        </View>
        <View style={{ marginTop: 20, marginBottom: 10 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 25, }}>
            공개 된 근심 거리
          </Text>
        </View>
      </View>
    );
  };

  const Footer = () => {
    return (
      <View style={{ padding: 16, backgroundColor: 'lightgray' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Footer</Text>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <View style={{ padding: 16, width: width - 24, height: 80, marginTop: 7, marginBottom: 7, backgroundColor: '#E4DCCF', borderRadius: 6 }}>
        <Text>{item.title}</Text>
      </View>
    );
  };

  const MainFlatList = () => {
    return (
      <FlatList
        data={data}
        renderItem={renderItem}
        // ListFooterComponent={<Footer />}
        ListHeaderComponent={<Header />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ marginLeft: 12 }}
      />
    );
  };

  return (
    <View
      style={{
        backgroundColor: '#F9F5EB',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Container>
        <PushCountComponent />
        <MainFlatList />
        {message?.title && <Pressable onPress={() => { setMessage(undefined) }} style={{ borderRadius: 6, padding: 20, width: width - 40, height: 400, backgroundColor: 'gray' }}>
          <Text style={{ color: '#fff' }}>{message?.title}</Text>
          <Text style={{ color: '#fff' }}>{message?.body}</Text>
        </Pressable>}
      </Container>
    </View>
  );
}

export default Main;
