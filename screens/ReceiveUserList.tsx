import React, { useState, useRef, useEffect } from "react";

import {
  View,
  Text,
  Pressable,
  FlatList,
  Platform,
  Animated,
  StyleSheet,
  Image,
  ImageBackground,
} from "react-native";
import Transparent from "../assets/transparent.png";
import ArrowClick from "../assets/arrowClick.png";
import styled from "styled-components";

import { width, height } from "../src/util/screenDimensions";

import DeviceInfo from "react-native-device-info";

import { taptic } from "../src/util/taptic";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { HW_URL } from "../src/res/env";
import { useHeaderHeight } from "@react-navigation/elements";

const Container = styled(View)`
  margin-right: 0px;
  margin-left: 0px;
`;

const data = [
  {
    id: 1,
    title: "유튜브 조회수 폭발! 유독성 있는 방법 공개?!",
    description:
      "유튜브 조회수가 쉽게 폭발할 수 있는 유독성 있는 방법을 알려드립니다!",
  },
  {
    id: 2,
    title: "정말 대단한 개발자의 비밀!",
    description:
      "실제로 있는 개발자의 비밀을 공개합니다. 도대체 무슨 비밀일까요?",
  },
  {
    id: 3,
    title: "실력 향상을 위한 새로운 해결책!",
    description:
      "벌써 4시가 다가오는데 해결해야 할 문제들과 방법을 알려드립니다. 꼭 필요한 정보입니다!",
  },
  {
    id: 4,
    title: "초능력자들의 일상에 대한 고백",
    description:
      "초능력을 가진 사람들이 말하는 힘들었던 일상과 그들만의 비밀스러운 이야기를 공개합니다.",
  },
  {
    id: 5,
    title: "자고 일찍 일어나는 비밀!",
    description:
      "아침 일찍 일어나는 방법과 그에 따른 놀라운 효과를 알려드립니다. 진짜 가능할까요?",
  },
  {
    id: 6,
    title: "유튜브의 역사적인 기록을 경신했다!",
    description:
      "유튜브 조회수를 무시할 수 없는 방법으로 기록을 경신했습니다. 그 방법은 과연 무엇일까요?",
  },
  {
    id: 7,
    title: "마법처럼 동작하는 아이템!",
    description:
      "Item 3은 실제 마법처럼 동작하는 아이템입니다. 여러분도 이 아이템을 경험해보세요!",
  },
  {
    id: 8,
    title: "감탄사가 절로 나오는 Item 4",
    description:
      "Item 4는 너무나도 놀라운 기능을 가지고 있어 감탄사가 절로 나오게 만듭니다!",
  },
  {
    id: 9,
    title: "환상적인 세계로 초대하는 Item 5",
    description:
      "Item 5는 훌륭한 상상력을 자극하며, 환상적인 세계로 여러분을 초대합니다.",
  },
  {
    id: 10,
    title: "로또 번호 예측기?!",
    description:
      "로또 번호를 예측하는 비밀스러운 방법을 알려드립니다. 로또 당첨을 위한 비밀이 밝혀집니다!",
  },
];

function ReceiveUserList() {
  const [senderList, setSenderList] = useState<any>([]);
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const flatListRef = useRef(null);
  const isFocused = useIsFocused();

  const getSenderList = async () => {
    const endPoint = "/board/v1/uuids";
    setRefreshing(true); // 새로고침 시작

    try {
      const response = await axios.get(`${HW_URL.APP_API}${endPoint}`);
      console.log(
        "getSenderList",
        `메시지 보낸 사람 리스트 가져오기 성공 ${response.data}`
      );

      setSenderList(response?.data);
    } catch (error) {
      console.error("API 호출 실패", error);
      console.error(endPoint);
    } finally {
      setRefreshing(false); // 새로고침 종료
    }
  };

  useEffect(() => {
    if (isFocused) getSenderList();
  }, [isFocused]);

  const renderItem = ({ item, index }) => {
    const name = `익명${item.slice(0, 4)}`;
    return (
      <>
        <Pressable
          style={{
            padding: 14,
            width: width - 40,
            marginTop: 10,
            marginBottom: 7,
            borderRadius: 3,
            borderWidth: 0.5,
            borderColor: "#413d34",
          }}
          onPress={() => {
            taptic();
            navigation.navigate("StackCard", {
              screen: "ReceiveMsg",
              params: {
                title: `${name} 님이 보낸 근심`, // title을 포함
                uuid: item,
              },
            });
          }}
        >
          <View style={{ position: "relative" }}>
            <Text>{`${name} 님이 보낸 근심 확인하기`}</Text>
          </View>
        </Pressable>
      </>
    );
  };
  const headerHeight = useHeaderHeight(); // 현재 헤더의 높이를 가져옵니다.
  const renderEmptyComponent = () => (
    <View
      style={{
        flex: 1,
        width: width,
        height:
          height -
          (Platform.OS === "ios" ? (DeviceInfo.hasNotch() ? 92 : 70) : 70) -
          headerHeight -
          65,

        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 16,
          color: "gray",
        }}
      >
        아직 받은 근심이 없어요.
      </Text>
    </View>
  );

  return (
    <>
      <View
        style={{
          backgroundColor: "#FBF9F4",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          // paddingTop:
          //   Platform.OS === 'ios' ? (DeviceInfo.hasNotch() ? 52 : 0) : 0,
          paddingTop: 10,
          paddingBottom: 20,
          // marginBottom:
          //   Platform.OS === 'ios' ? (DeviceInfo.hasNotch() ? 92 : 70) : 70,
        }}
      >
        <Container>
          <FlatList
            ref={flatListRef}
            data={senderList}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.title + index}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={5}
            extraData={senderList}
            refreshing={refreshing} // 새로고침 상태
            onRefresh={getSenderList} // 새로고침 함수
            ListEmptyComponent={renderEmptyComponent} // 빈 상태 컴포넌트
          />
        </Container>
      </View>
    </>
  );
}

export default ReceiveUserList;
