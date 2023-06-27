import React, { useEffect, useState, useContext, useRef } from 'react';

import { View, Text, Pressable, AppState, Image, AppStateStatus, FlatList, Platform, Animated, VirtualizedList, SectionList } from 'react-native';
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
import ArrowClick from '../assets/arrowClick.png';

const Container = styled(View)`
  margin-right: 0px;
  margin-left: 0px;
`;

function Main() {
  const navigation = useNavigation()
  const [message, setMessage] = useState(undefined)
  // const [msgData, setMsgData] = useRecoilState(getMessageState)

  const data = [
    { title: 'pass', data: [{ id: 1 }] },
    {
      title: 'Header',
      data: [
        {
          title: '유튜브 조회수가 너무 안나와.. 잘 되는 방법 좀 ㅋㅋ',
          description: `유튜브 조회수가 너무 안나와.. 잘 되는 방법 좀 알려줘`
        },
        { title: 'asdasd', description: '리 자야' },
        {
          title: '벌써 4시다.. ', description: `내일 할 거 : 
        1. SEND_MSG 테이블에 성공한 알람 데이터 INSERT
        2. 랜덤 수신자 토큰 조회 쿼리 작성
        3. putAllData 방법 분석` },
        { title: '넘 힘들다!', description: 'ㅜㅜ' },
        { title: '일찍 자는 방법', description: '빨리 자야하는데' },
        { title: '유튜브', description: '유튜브 조회수가 너무 안나와.. 잘 되는 방법 좀 ㅋㅋ' },
        { title: 'Item 3' },
        { title: 'Item 4' },
        { title: 'Item 5' },
        { title: '로또 번호 좀여', description: '로또 번호 좀 알려주세여~' }
      ]
    },
  ];

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


  const scrollY = useRef(new Animated.Value(0)).current;

  const HeaderComponent = () => {
    return (
      <View style={{
        paddingLeft: 16,
        marginTop: 20,
      }}
      >
        <Text
          style={{
            color: '#413d34',
            fontSize: 22,
            textAlign: 'left',
            marginBottom: 16,
          }}
        >
          안녕하세요.
        </Text>
        <Text
          style={{
            color: '#413d34',
            fontSize: 26,
            textAlign: 'left',
            fontWeight: 'bold',
            marginBottom: 8,
          }}
        >
          당신의 근심 해소공간
        </Text>
      </View>
    )
  }
  const renderSectionHeader = ({ section }) => {
    if (section.title !== 'pass') {
      return (<View>
        <View style={{
          paddingLeft: 16,
          paddingTop: Platform.OS === 'ios' ? 13 : 13,
          backgroundColor: '#FBF9F4',
        }}
        >
          <View style={{ flexDirection: 'row' }}>
            <View style={{ position: 'relative' }}>
              <View style={{
                backgroundColor: '#413d34',
                justifyContent: 'center',
                alignItems: 'center',
                width: 15,
                height: 15,
                borderRadius: 50,
                right: -30,
                top: -6
              }}>
                <Text style={{ color: '#FBF9F4', bottom: Platform.select({ ios: 0, android: 2 }), fontSize: Platform.select({ ios: 14, android: 12 }) }}>!</Text>
              </View>
              <Pressable
                style={{ top: -15 }}
                onPressIn={() => {
                  taptic()
                }}
                onPressOut={() => {
                  taptic()
                  navigation.navigate('StackModal', {
                    screen: 'PushScreen',
                    animation: 'fade'
                  });
                }}
              >
                <SvgIcon
                  name='haewoosoLogo'
                  stroke='#797979'
                  strokeWidth='1.5'
                  fill='#000000'
                  size={40}
                />
              </Pressable>
            </View>
            <Text
              style={{
                paddingLeft: 10,
                color: '#413d34',
                fontSize: 26,
                textAlign: 'left',
                fontWeight: 'bold',
                top: Platform.OS === 'ios' ? 9 : 0,
              }}
            >
              해우소
            </Text>
            <Text
              style={{
                color: '#413d34',
                fontSize: 26,
                textAlign: 'left',
                fontWeight: 'bold',
                marginBottom: 8,
                top: Platform.OS === 'ios' ? 7 : 0,
              }}
            >
              입니다.
            </Text>
          </View>
        </View>
      </View>)
    } else {
      return <></>
    }
  }

  const MidSection = () => {
    return (
      <>
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
                screen: 'PushScreen',
                animation: 'fade'
              });
            }}
          >
            <Text style={{ color: 'rgba(60, 50, 48, 0.6)', textAlign: 'center', paddingLeft: 15, paddingRight: 15, paddingTop: 10, paddingBottom: 10, fontSize: 12, fontWeight: 'bold' }}>
              💩 메시지 보내기 (5/5)
            </Text>
          </Pressable>
          <View
            style={{ position: 'absolute', right: 64, top: Platform.select({ ios: 13, android: 9 }), flexDirection: 'row' }}
          >
            <Image
              style={{ transform: [{ rotate: '200deg' }], width: 17, height: 17, top: Platform.select({ ios: 2, android: 4 }) }}
              source={ArrowClick}
            />
            <Text style={{ marginLeft: 4, transform: [{ rotate: '10deg' }], fontSize: Platform.select({ ios: 13, android: 12 }) }}>click!</Text>
          </View>
        </View>
        <View style={{ marginTop: 5, marginBottom: 10 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 13 }}>
            공개 된 메시지
          </Text>
        </View>
      </>
    )
  }

  const renderItem = ({ item, index }) => {
    if (item.id !== 1) {
      return (
        <>
          {index === 0 &&
            <MidSection />
          }
          <Pressable style={{
            padding: 14,
            width: width - 24,
            marginTop: 7,
            marginBottom: 7,
            borderRadius: 3,
            borderWidth: 0.5,
            borderColor: '#413d34'
          }}
            onPress={() => {
              taptic()
              navigation.navigate('StackCard', {
                screen: 'DetailMessage',
                params: item,
              });
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 10 }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ backgroundColor: '#2A2322', marginHorizontal: 2, paddingLeft: 8, paddingRight: 8, paddingTop: 3, paddingBottom: 3, borderRadius: 4 }}>
                  <Text style={{ fontSize: Platform.select({ ios: 12, android: 11 }), color: '#ffffff' }}>
                    메시지 전송 가능
                  </Text>
                </View>
                <View style={{ backgroundColor: 'lightgray', marginHorizontal: 2, paddingLeft: 8, paddingRight: 8, paddingTop: 3, paddingBottom: 3, borderRadius: 4 }}>
                  <Text style={{ fontSize: Platform.select({ ios: 12, android: 11 }), color: '#000000' }}>
                    답변 완료
                  </Text>
                </View>
              </View>
              <View style={{ backgroundColor: '#575241', marginHorizontal: 2, paddingLeft: 8, paddingRight: 8, paddingTop: 3, paddingBottom: 3, borderRadius: 50 }}>
                <Text style={{ fontSize: Platform.select({ ios: 12, android: 11 }), color: '#ffffff' }}>
                  남은 답변 횟수 : 1/3
                </Text>
              </View>
            </View>
            {/* <Text style={{ color: '#413d34', fontWeight: 'bold', padding: 2, fontSize: Platform.select({ ios: 14, android: 13 }) }}>{item.title}</Text> */}
            <View style={{ borderRadius: 3, backgroundColor: '#ffffff', padding: 10, marginTop: 8 }}>
              <Text style={{ color: '#413d34', fontWeight: 'bold', fontSize: Platform.select({ ios: 14, android: 13 }) }}>{item.description}</Text>
            </View>
          </Pressable>
        </>)
    } else {
      return (
        <HeaderComponent />
      )
    }
  }

  const ListEmptyComponent = () => {
    return (
      <View style={{ padding: 16, flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
        <Text style={{ color: 'rgba(42, 35, 34, .4)', fontSize: Platform.select({ ios: 14, android: 13 }), fontWeight: 'bold' }}>아직 공개 된 근심이 없어요.</Text>
      </View>
    );
  };

  const MainFlatList = () => {
    return (
      <SectionList
        sections={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => item + index}
        stickySectionHeadersEnabled={true}
        renderSectionHeader={renderSectionHeader}
        showsVerticalScrollIndicator={false}
        onScroll={(event) => {
          const scrollOffset = event.nativeEvent.contentOffset.y;
        }}
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
          </Animated.View>}
        <MainFlatList />
      </Container>
    </View>
  );
}

export default Main;
