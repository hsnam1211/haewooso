import {
  Animated,
  FlatList,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { height, width } from "../src/util/screenDimensions";
import { useIsFocused, useNavigation } from "@react-navigation/native";

import ArrowClick from "../assets/arrowClick.png";
import DeviceInfo from "react-native-device-info";
import { HW_URL } from "../src/res/env";
import Transparent from "../assets/transparent.png";
import axios from "axios";
import styled from "styled-components";
import { taptic } from "../src/util/taptic";
import { useHeaderHeight } from "@react-navigation/elements";

const Container = styled(View)`
  margin-right: 0px;
  margin-left: 0px;
`;

function ReceiveUserList() {
  const [senderList, setSenderList] = useState<any>([]);
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const flatListRef = useRef(null);
  const isFocused = useIsFocused();

  const getSenderList = async (isRefresh?: string) => {
    const endPoint = "/board/v1/uuids";
    if (isRefresh === "refresh") {
      setRefreshing(true); // 새로고침 시작
    }

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
      if (isRefresh === "refresh") {
        setRefreshing(false); // 새로고침 종료
      }
    }
  };

  useEffect(() => {
    if (isFocused) getSenderList();
  }, [isFocused]);

  const renderItem = ({ item, index }) => {
    const name = `익명${item.slice(0, 4)}`;
    return (
      <Pressable
        key={`${item}`}
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
          <Text
            style={{
              position: "relative",
              top: Platform.select({ android: -2 }),
            }}
          >{`${name} 님이 보낸 근심 확인하기`}</Text>
        </View>
      </Pressable>
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
            keyExtractor={item => item}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={5}
            extraData={senderList}
            refreshing={refreshing} // 새로고침 상태
            onRefresh={() => getSenderList("refresh")} // 새로고침 함수
            ListEmptyComponent={renderEmptyComponent} // 빈 상태 컴포넌트
          />
        </Container>
      </View>
    </>
  );
}

export default ReceiveUserList;
