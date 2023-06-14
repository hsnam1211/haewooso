import React, { useEffect, useState, useContext, useRef } from 'react';

import { View, Text, Pressable, AppState, AppStateStatus, FlatList, Platform, Animated, VirtualizedList } from 'react-native';
import styled from 'styled-components';
import { Storage } from '../src/util/storage'
import { getMessageState } from '../src/recoil/atoms';
import messaging from '@react-native-firebase/messaging';
import { width, height } from '../src/util/screenDimensions';
import * as Animatable from "react-native-animatable";
import DeviceInfo from 'react-native-device-info';
import { Easing } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import SvgIcon from '../src/components/SvgIcon';
import { taptic } from '../src/util/taptic';
import { useNavigation } from '@react-navigation/native';

const Container = styled(View)`
  margin-right: 0px;
  margin-left: 0px;
`;

function Main() {
  const navigation = useNavigation()
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
        alert('fore ground')
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
    { id: '3', title: 'asdasd', description: '유튜브 조회수가 너무 안나와.. 잘 되는 방법 좀 ㅋㅋ' },
    { id: '4', title: '벌써 4시다.. ', description: '얼른 자야하는데...' },
    { id: '5', title: '넘 힘들다!', description: 'ㅜㅜ' },
    { id: '6', title: '일찍 자는 방법', description: '빨리 자야하는데' },
    { id: '7', title: '유튜브', description: '유튜브 조회수가 너무 안나와.. 잘 되는 방법 좀 ㅋㅋ' },
    { id: '8', title: 'Item 3' },
    { id: '9', title: 'Item 4' },
    { id: '10', title: 'Item 5' },
  ];

  const scrollY = useRef(new Animated.Value(0)).current;
  const Header = () => {
    const opacity = scrollY.interpolate({
      inputRange: [0, Platform.OS === 'ios' ? 100 : 110],
      outputRange: [2, 0],
      extrapolate: 'clamp',
    });

    const logoOpacity = scrollY.interpolate({
      inputRange: [0, Platform.OS === 'ios' ? 90 : 100],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    const logoText = scrollY.interpolate({
      inputRange: [0, Platform.OS === 'ios' ? 150 : 160],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <View>
        <Animated.View style={{
          padding: 16,
          width: width,
          marginTop: 20,
        }}
        >
          <Animated.Text
            style={{
              color: '#413d34',
              fontSize: 22,
              opacity: opacity,
              textAlign: 'left',
              marginBottom: 16,
            }}
          >
            안녕하세요.
          </Animated.Text>
          <Animated.Text
            style={{
              color: '#413d34',
              fontSize: 26,
              textAlign: 'left',
              fontWeight: 'bold',
              marginBottom: 8,
              opacity: opacity,
            }}
          >
            당신의 근심 해소공간
          </Animated.Text>
          <View style={{ flexDirection: 'row' }}>
            <Animated.View style={{ opacity: logoOpacity, }}>
              <SvgIcon
                name='haewoosoLogo'
                stroke='#797979'
                strokeWidth='1.5'
                size={40}
              />
            </Animated.View>
            <Animated.Text
              style={{
                paddingLeft: 10,
                color: '#413d34',
                fontSize: 26,
                textAlign: 'left',
                fontWeight: 'bold',
                // marginBottom: 8,
                top: Platform.OS === 'ios' ? 9 : 0,
                opacity: logoOpacity,
              }}
            >
              해우소
            </Animated.Text>
            <Animated.Text
              style={{
                color: '#413d34',
                fontSize: 26,
                textAlign: 'left',
                fontWeight: 'bold',
                marginBottom: 8,
                top: Platform.OS === 'ios' ? 7 : 0,
                opacity: logoText,
              }}
            >
              입니다.
            </Animated.Text>
          </View>
        </Animated.View>

        <View style={{
          backgroundColor: '#413d34', width: width - 24, borderRadius: 3, height: 100, marginTop: 12, marginBottom: 10,
          justifyContent: 'center'
        }}>
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, marginBottom: 10 }}>
            광고 보고 더 머물다 가세요.
          </Text>
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>
            여기예요 📺
          </Text>
        </View>

        <View style={{
          backgroundColor: 'trasparent', height: 100,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 15, marginBottom: 15,
        }}>
          <Pressable
            style={{
              borderRadius: 10,
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: 'rgba(60, 50, 48, 0.2)'
            }}
            onPressIn={() => {
              taptic()
            }}
            onPressOut={() => {
              taptic()
              navigation.navigate('StackModal', {
                screen: 'OnboardingScreen',
                animation: 'fade'
              });
            }}
          >
            <Text style={{ color: 'rgba(60, 50, 48, 0.6)', textAlign: 'center', paddingLeft: 15, paddingRight: 15, paddingTop: 10, paddingBottom: 10, fontSize: 12, fontWeight: 'bold' }}>
              💩 근심 보내기 (5/5)
            </Text>
          </Pressable>
        </View>
        <View style={{ marginTop: 5, marginBottom: 10 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 13 }}>
            공개 된 근심
          </Text>
        </View>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <View style={{
        padding: 14,
        width: width - 24,
        marginTop: 7,
        marginBottom: 7,
        borderRadius: 3,
        borderWidth: 0.5,
        borderColor: '#413d34'
      }}>
        <Text style={{ color: '#413d34', fontWeight: 'bold', padding: 2, fontSize: Platform.select({ ios: 14, android: 13 }) }}>{item.title}</Text>
        <View style={{ borderRadius: 3, backgroundColor: '#ffffff', padding: 10, marginTop: 8 }}>
          <Text style={{ color: '#413d34', fontWeight: 'bold', fontSize: Platform.select({ ios: 14, android: 13 }) }}>{item.description}</Text>
        </View>
      </View>
    );
  };

  // const Footer = () => {
  //   return (
  //     <View style={{ padding: 16, backgroundColor: 'lightgray' }}>
  //       <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Footer</Text>
  //     </View>
  //   );
  // };
  const MainFlatList = () => {
    return (
      <Animated.FlatList
        data={data}
        renderItem={renderItem}
        // ListFooterComponent={<Footer />}
        ListHeaderComponent={<Header />}
        keyExtractor={(item) => item?.id}
        contentContainerStyle={{ marginLeft: 12 }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
      />
    );
  };

  const opacity = scrollY.interpolate({
    inputRange: [0, 250],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  return (
    <View
      style={{
        backgroundColor: '#FBF9F4',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop:
          Platform.OS === 'ios' ? (DeviceInfo.hasNotch() ? 52 : 0) : 0,
        marginBottom:
          Platform.OS === 'ios' ? (DeviceInfo.hasNotch() ? 92 : 70) : 70,
      }}
    >
      <Container>
        {message?.title &&
          <Animated.View style={{ zIndex: 100000, alignItems: 'center', backgroundColor: 'transparent', }}>
            <Pressable onPress={() => { setMessage(undefined) }} style={{ borderBottomRightRadius: 6, borderBottomLeftRadius: 6, padding: 20, width: width, backgroundColor: 'gray' }}>
              <Text style={{ color: '#fff' }}>{message?.title}</Text>
              <Text style={{ color: '#fff' }}>{message?.body}</Text>
              <Text>확인 되었으면 클릭!</Text>
            </Pressable>
          </Animated.View>
        }
        <Animated.View style={{ height: Platform.OS === 'ios' ? 50 : 60, position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100, opacity: opacity }}>
          <View style={{ flexDirection: 'row', zIndex: 100 }}>
            <View style={{ paddingTop: Platform.OS === 'ios' ? 10 : 16, paddingLeft: 28, }}>
              <SvgIcon
                name='haewoosoLogo'
                stroke='#797979'
                strokeWidth='1.5'
                size={40}
              />
            </View>
            <Text style={{ color: 'black', fontSize: 26, fontWeight: 'bold', textAlign: 'left', paddingTop: Platform.OS === 'ios' ? 10 : 16, top: Platform.OS === 'ios' ? 10 : 0, paddingLeft: 10 }}>
              해우소
            </Text>
          </View>
          <LinearGradient
            colors={[
              'rgba(251, 249, 244, 1)',
              'rgba(251, 249, 244, 1)',
              'rgba(251, 249, 244, 1)',
              'rgba(251, 249, 244, 1)',
              'rgba(251, 249, 244, 1)',
              'rgba(251, 249, 244, 1)',
              'rgba(251, 249, 244, 1)',
              'rgba(251, 249, 244, 1)',
              'rgba(251, 249, 244, 1)',
              'rgba(251, 249, 244, 1)',
              'rgba(251, 249, 244, 1)',
              'rgba(251, 249, 244, 0.9)',
              'rgba(251, 249, 244, 0.8)',
              'rgba(251, 249, 244, 0.7)',
              'rgba(251, 249, 244, 0.6)',
              'rgba(251, 249, 244, 0.5)',
              'rgba(251, 249, 244, 0.4)',
              'rgba(251, 249, 244, 0.3)',
              'rgba(251, 249, 244, 0.2)',
              'rgba(251, 249, 244, 0.1)',
              'rgba(251, 249, 244, 0)'
            ]}
            style={{
              height: Platform.OS === 'ios' ? 110 : 130,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
        </Animated.View>
        <MainFlatList />
      </Container>
    </View>
  );
}

export default Main;
