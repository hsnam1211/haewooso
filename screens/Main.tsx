import React, { useEffect, useState, useContext, useRef } from 'react';

import { View, Text, Pressable, AppState, AppStateStatus, FlatList } from 'react-native';
import styled from 'styled-components';
import { Storage } from '../src/util/storage'
import { getMessageState } from '../src/recoil/atoms';
import messaging from '@react-native-firebase/messaging';
import { width, height } from '../src/util/screenDimensions';
import * as Animatable from "react-native-animatable";

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
    { id: '1', title: '로또 번호 좀여', description: '로또 번호 좀 알려주세여~' },
    { id: '2', title: '유튜브 조회수가 너무 안나와.. 잘 되는 방법 좀 ㅋㅋ', description: '유튜브 조회수가 너무 안나와.. 잘 되는 방법 좀 ㅋㅋ' },
    { id: '3', title: '', description: '유튜브 조회수가 너무 안나와.. 잘 되는 방법 좀 ㅋㅋ' },
    { id: '4', title: '유튜브 조회수가 너무 안나와.. 잘 되는 방법 좀 ㅋㅋ', description: '유튜브 조회수가 너무 안나와.. 잘 되는 방법 좀 ㅋㅋ' },
    { id: '5', title: '유튜브 조회수가 너무 안나와.. 잘 되는 방법 좀 ㅋㅋ', description: '유튜브 조회수가 너무 안나와.. 잘 되는 방법 좀 ㅋㅋ' },
    { id: '6', title: '유튜브 조회수가 너무 안나와.. 잘 되는 방법 좀 ㅋㅋ', description: '유튜브 조회수가 너무 안나와.. 잘 되는 방법 좀 ㅋㅋ' },
    { id: '7', title: '유튜브 조회수가 너무 안나와.. 잘 되는 방법 좀 ㅋㅋ', description: '유튜브 조회수가 너무 안나와.. 잘 되는 방법 좀 ㅋㅋ' },
    { id: '8', title: 'Item 3' },
    { id: '9', title: 'Item 4' },
    { id: '10', title: 'Item 5' },
  ];

  const PushCountComponent = () => {
    return (
      <View style={{ padding: 16, width: width, marginTop: 16}}>
        <Text style={{ color: '#413d34', fontSize: 22, textAlign: 'left', marginBottom: 16 }}>
          안녕하세요.
        </Text>
        <Text style={{ color: '#2A2322', fontSize: 26, textAlign: 'left', fontWeight: 'bold', marginBottom: 8 }}>
          당신의 근심 해소공간
        </Text>
        <Text style={{ color: '#2A2322', fontSize: 26, textAlign: 'left', fontWeight: 'bold', marginBottom: 8 }}>
          해우소입니다.
        </Text>
      </View>
    );
    // return (
    //   <View style={{ padding: 16, backgroundColor: '#002B5B', width: width }}>
    //     <Text style={{ color: 'white', textAlign: 'center' }}>
    //       🚽 오늘 해우소 사용 가능 횟수는 총 5회 🚽
    //     </Text>
    //   </View>
    // );
  };

  const Header = () => {
    return (
      <View>
        <View style={{ padding: 16, width: width, marginTop: 18}}>
          <Text style={{ color: '#413d34', fontSize: 22, textAlign: 'left', marginBottom: 16 }}>
            안녕하세요.
          </Text>
          <Text style={{ color: '#413d34', fontSize: 26, textAlign: 'left', fontWeight: 'bold', marginBottom: 8 }}>
            당신의 근심 해소공간
          </Text>
          <Text style={{ color: '#413d34', fontSize: 26, textAlign: 'left', fontWeight: 'bold', marginBottom: 8 }}>
            해우소입니다.
          </Text>
        </View>
        <View style={{
          // elevation: 5, // 안드로이드 그림자
          // shadowColor: '#000', // iOS 그림자 색상
          // shadowOffset: { width: 0, height: 3 }, // iOS 그림자 오프셋
          // shadowOpacity: 0.8, // iOS 그림자 투명도
          // shadowRadius: 4, // iOS 그림자 반경,
          backgroundColor: '#2A2322', width: width - 24, borderRadius: 10, height: 100, marginTop: 15, marginBottom: 10,
          justifyContent: 'center'
        }}>
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, marginBottom: 10 }}>
            광고 보고 더 머물다 가세요.
          </Text>
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>
            여기예요 📺
          </Text>
        </View>
        <View style={{ marginTop: 30, marginBottom: 10 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 13 }}>
            공개 된 근심
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
      <View style={{ 
        padding: 14,
        width: width - 24,
        // height: 120,
        marginTop: 7,
        marginBottom: 7,
        // backgroundColor: '#FBF9F4',
        // backgroundColor: '#ffffff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#413d34'
      }}>
        <Text style={{color: '#413d34', fontSize: 16, fontWeight: 'bold', padding: 2}}>{item.title}</Text>
        <View style={{borderRadius: 6, backgroundColor: '#ffffff', padding: 10, marginTop: 8}}>
          <Text style={{color: '#413d34', fontSize: 12, fontWeight: 'bold'}}>{item.description}</Text>
        </View>
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
        backgroundColor: '#FBF9F4',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Container>
        {/* <PushCountComponent /> */}
        {/* <View >
          <Animatable.Text animation="fadeInUp" iterationCount={1} duration={2000} direction="alternate">Up and down you go</Animatable.Text>
          <Animatable.Text animation="pulse" easing="ease-out" iterationCount="infinite" style={{ textAlign: 'center' }}>❤️</Animatable.Text>
        </View> */}
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
