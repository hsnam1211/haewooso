import React, { useEffect, useState, useContext, useRef } from 'react';

import {
  View, Text, Pressable, AppState, Image, AppStateStatus, FlatList, Platform, Animated, VirtualizedList, SectionList,
  StyleSheet,
  ScrollView,
} from 'react-native';
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
import Toast from 'react-native-toast-message';
import { useRecoilState } from 'recoil';


const Container = styled(View)`
  margin-right: 0px;
  margin-left: 0px;
`;

const data = [
  {
    id: 1,
    title: '유튜브 조회수 폭발! 유독성 있는 방법 공개?!',
    description: '유튜브 조회수가 쉽게 폭발할 수 있는 유독성 있는 방법을 알려드립니다!'
  },
  {
    id: 2,
    title: '정말 대단한 개발자의 비밀!',
    description: '실제로 있는 개발자의 비밀을 공개합니다. 도대체 무슨 비밀일까요?'
  },
  {
    id: 3,
    title: '실력 향상을 위한 새로운 해결책!',
    description: '벌써 4시가 다가오는데 해결해야 할 문제들과 방법을 알려드립니다. 꼭 필요한 정보입니다!'
  },
  {
    id: 4,
    title: '초능력자들의 일상에 대한 고백',
    description: '초능력을 가진 사람들이 말하는 힘들었던 일상과 그들만의 비밀스러운 이야기를 공개합니다.'
  },
  {
    id: 5,
    title: '자고 일찍 일어나는 비밀!',
    description: '아침 일찍 일어나는 방법과 그에 따른 놀라운 효과를 알려드립니다. 진짜 가능할까요?'
  },
  {
    id: 6,
    title: '유튜브의 역사적인 기록을 경신했다!',
    description: '유튜브 조회수를 무시할 수 없는 방법으로 기록을 경신했습니다. 그 방법은 과연 무엇일까요?'
  },
  {
    id: 7,
    title: '마법처럼 동작하는 아이템!',
    description: 'Item 3은 실제 마법처럼 동작하는 아이템입니다. 여러분도 이 아이템을 경험해보세요!'
  },
  {
    id: 8,
    title: '감탄사가 절로 나오는 Item 4',
    description: 'Item 4는 너무나도 놀라운 기능을 가지고 있어 감탄사가 절로 나오게 만듭니다!'
  },
  {
    id: 9,
    title: '환상적인 세계로 초대하는 Item 5',
    description: 'Item 5는 훌륭한 상상력을 자극하며, 환상적인 세계로 여러분을 초대합니다.'
  },
  {
    id: 10,
    title: '로또 번호 예측기?!',
    description: '로또 번호를 예측하는 비밀스러운 방법을 알려드립니다. 로또 당첨을 위한 비밀이 밝혀집니다!'
  }
];


function Main() {
  const navigation = useNavigation()
  const [message, setMessage] = useState(undefined)
  const [msgData, setMsgData] = useRecoilState(getMessageState)
  // const [msgData, setMsgData] = useState(false)
  const [number, setNumber] = useState(5)
  const [type, setType] = useState(false)
  // const HEADER_EXPANDED_HEIGHT = 225; // 헤더가 1단일 때의 높이
  // const HEADER_COLLAPSED_HEIGHT = 110; // 헤더가 2단으로 접힌 후의 높이
  const [headerExpandedHeight, setHeaderExpandedHeight] = useState(225);
  const [headerCollapsedHeight, setHeaderCollapsedHeight] = useState(110);
  const flatListRef = useRef(null);


  const [dataList, setDataList] = useState(data)

  const ToastHandle = (text, type) => {
    Toast.show({
      type: 'tomatoToast',
      position: 'top',
      visibilityTime: 4000,
      text1: text,
      onPress: handlePress,
    });
  };

  const handlePress = () => {
    taptic();
    Toast.hide();
    setMsgData(false);
    navigation.navigate("StackModal", {
      screen: "PushScreen",
      animation: "fade",
    });
  };

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
        setMsgData(true)
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
        console.log('Main subscribeToMessages', remoteMessage)
        ToastHandle(remoteMessage?.notification?.body, 'info');
        // alert(remoteMessage?.notification?.body)
        // setMessage({
        //   body: remoteMessage?.notification?.body,
        //   title: remoteMessage?.notification?.title
        // })
        setMsgData(true)
      }
    );

    return () => subscribeToMessages();
  }, [])

  const scrollY = useRef(new Animated.Value(0)).current;

  const scrollYToShow = headerExpandedHeight - headerCollapsedHeight * 1.4;

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const headerHeight = scrollY.interpolate({
    inputRange: [0, headerExpandedHeight - headerCollapsedHeight],
    outputRange: [headerExpandedHeight, headerCollapsedHeight],
    extrapolate: 'clamp',
  });

  const slowlyMovingMargin = scrollY.interpolate({
    inputRange: [0, 20, scrollYToShow + 40],
    outputRange: [0, -2, -40],
    extrapolate: 'clamp',
  });

  const HeaderComponent = ({ msgData }) => {
    return (
      <View style={{
        paddingLeft: 16,
        marginTop: 60,
      }}
      >
        <Animated.Text
          style={{
            color: '#413d34',
            fontSize: 22,
            textAlign: 'left',
            marginBottom: 16,
            opacity: headerOpacity,
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
            opacity: headerOpacity
          }}
        >
          당신의 근심 해소공간
        </Animated.Text>
        <Animated.View style={{ flexDirection: 'row', marginTop: 10, transform: [{ translateY: slowlyMovingMargin }], }}>
          <View style={{
            position: 'relative'
          }}>
            <View style={{
              backgroundColor: msgData ? '#413d34' : 'transparent',
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
                setMsgData(false)
                navigation.navigate("StackModal", {
                  screen: "PushScreen",
                  animation: "fade",
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
          <Animated.Text
            style={{
              color: '#413d34',
              fontSize: 26,
              textAlign: 'left',
              fontWeight: 'bold',
              marginBottom: 8,
              top: Platform.OS === 'ios' ? 7 : 0,
              opacity: headerOpacity,
            }}
          >
            입니다.
          </Animated.Text>
        </Animated.View>
      </View>
    )
  }

  const MidSection = () => {
    return (
      <>
        <View style={{
          backgroundColor: '#413d34', width: width - 24, borderRadius: 3, height: 100, marginTop: 180, marginBottom: 10,
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
              setNumber((p) => p - 1)
            }}
          >
            <Text style={{ color: 'rgba(60, 50, 48, 0.6)', textAlign: 'center', paddingLeft: 15, paddingRight: 15, paddingTop: 10, paddingBottom: 10, fontSize: 12, fontWeight: 'bold' }}>
              💩 메시지 보내기 ({number}/5)
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
            // setType((p) => !p)
            navigation.navigate('StackCard', {
              screen: 'DetailMessage',
              params: item,
            });
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 10 }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ backgroundColor: '#2A2322', marginHorizontal: 2, paddingLeft: 8, paddingRight: 8, paddingTop: 3, paddingBottom: 3, borderRadius: 4 }}>
                {type ? <Text style={{ fontSize: Platform.select({ ios: 12, android: 11 }), color: '#ffffff' }}>
                  전송 불가
                </Text> :
                  <Text style={{ fontSize: Platform.select({ ios: 12, android: 11 }), color: '#ffffff' }}>
                    메시지 전송 가능
                  </Text>}
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
          <View style={{ borderRadius: 3, backgroundColor: '#ffffff', padding: 10, marginTop: 8 }}>
            <Text style={{ color: '#413d34', fontWeight: 'bold', fontSize: Platform.select({ ios: 14, android: 13 }) }}>{item.description}</Text>
          </View>
        </Pressable>
      </>)
  }

  // const handleScroll = Animated.event(
  //   [{ nativeEvent: { contentOffset: { y: scrollY } } }],
  //   {
  //     useNativeDriver: false,
  //     listener: (event) => {
  //       scrollY.setValue(event.nativeEvent.contentOffset.y);
  //       // 여기에 추가로 실행할 코드를 작성하면 됩니다.
  //     },
  //   }
  // );

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event) => {
        const currentScrollY = event.nativeEvent.contentOffset.y;
      },
    }
  );


  // 스크롤 올라갈 때 shadowOpacity 값 변화
  const shadowOpacityIos = scrollY.interpolate({
    inputRange: [0, 100], // 스크롤 범위 조정 (0에서 200까지)
    outputRange: [0, 0.3], // 변화할 값 (0에서 0.3까지)
    extrapolate: 'clamp', // 범위 밖의 값은 clamp하여 최소값과 최대값으로 고정
  });

  const shadowOpacityAos = scrollY.interpolate({
    inputRange: [0, 100], // 스크롤 범위 조정 (0에서 200까지)
    outputRange: [0, 3], // 변화할 값 (0에서 0.3까지)
    extrapolate: 'clamp', // 범위 밖의 값은 clamp하여 최소값과 최대값으로 고정
  });


  const animateScroll = (value, toValue, duration) => {
    Animated.timing(value, {
      toValue: toValue,
      duration: duration,
      useNativeDriver: false,
    }).start();
  };

  const onScrollEndDrag = (event) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    if (currentScrollY <= 55) {
      console.log('hi')
      // 100 이하일 때 원하는 처리 작업을 여기에 추가하세요
      animateScroll(scrollY, 0, 500);
      if (flatListRef.current) {
        flatListRef.current.scrollToOffset({
          offset: 0, // 이 부분에서 원하는 만큼 스크롤을 변경할 수 있습니다.
          animated: true,
        });
      }
    } else if (currentScrollY > 55 && currentScrollY <= 110) {
      console.log('!')
      // 100 이상일 때 원하는 처리 작업을 여기에 추가하세요
      animateScroll(scrollY, 110, 500);
      if (flatListRef.current) {
        flatListRef.current.scrollToOffset({
          offset: 110, // 이 부분에서 원하는 만큼 스크롤을 변경할 수 있습니다.
          animated: true,
        });
      }
    } else {
      console.log('?')
      return;
    }
  };


  return (
    <>
      <Animated.View style={[styles.header, {
        height: headerHeight,
        ...Platform.select({
          ios: {
            shadowColor: 'rgb(50,50,50)',
            shadowOpacity: shadowOpacityIos,
            shadowRadius: 2,
            shadowOffset: {
              height: 3,
              width: 0,
            },
          },
          android: {
            elevation: shadowOpacityAos,
          },
        }),
      }]}>
        <HeaderComponent msgData={msgData} />
      </Animated.View>
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
          <FlatList
            ref={flatListRef}
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.title + index}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            // onScrollEndDrag={onScrollEndDrag}
            scrollEventThrottle={5}
            extraData={data}
          />
        </Container>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FBF9F4',
    // backgroundColor: 'blue',
    position: 'absolute',
    width: width,
    top: 0,
    left: 0,
    zIndex: 9999,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 24,
    color: 'white',
  },
});


export default Main;
