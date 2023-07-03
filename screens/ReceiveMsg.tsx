import React, { useState, useRef } from 'react';

import {
  View, Text, Pressable, FlatList, Platform, Animated,
  StyleSheet,

} from 'react-native';
import styled from 'styled-components';

import { width, height } from '../src/util/screenDimensions';

import DeviceInfo from 'react-native-device-info';

import { taptic } from '../src/util/taptic';
import { useNavigation } from '@react-navigation/native';


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


function ReceiveMsg() {
  const navigation = useNavigation()
  const [type, setType] = useState(false)

  const flatListRef = useRef(null);


  const scrollY = useRef(new Animated.Value(0)).current;

  const MidSection = () => {
    return (
      <>
        <View style={{ marginTop: 5, marginBottom: 10 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 13 }}>
            받은 메시지
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



  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event) => {
        const currentScrollY = event.nativeEvent.contentOffset.y;
      },
    }
  );

  return (
    <>
      <View
        style={{
          backgroundColor: '#FBF9F4',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop:
            Platform.OS === 'ios' ? (DeviceInfo.hasNotch() ? 52 : 0) : 0,
          paddingBottom: 20
          // marginBottom:
          //   Platform.OS === 'ios' ? (DeviceInfo.hasNotch() ? 92 : 70) : 70,
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
            scrollEventThrottle={5}
            extraData={data}
          />
        </Container>
      </View>
    </>
  );
}

export default ReceiveMsg;
