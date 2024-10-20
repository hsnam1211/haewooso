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
  ActivityIndicator,
} from "react-native";
import Transparent from "../assets/transparent.png";
import ArrowClick from "../assets/arrowClick.png";
import styled from "styled-components";

import { width, height } from "../src/util/screenDimensions";

import DeviceInfo from "react-native-device-info";

import { taptic } from "../src/util/taptic";
import { useNavigation } from "@react-navigation/native";
import { HW_URL } from "../src/res/env";
import axios from "axios";

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

function ReceiveMsg({ route }) {
  const { title, uuid } = route.params; // params에서 title과 message 추출
  const navigation = useNavigation();

  const [params, setParams] = useState<any>({
    page: 0,
    size: 10,
  });

  const [messageList, setMessageList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(0); // 총 페이지 수

  const getMessageList = async () => {
    if (loading) return; // 로딩 중이면 종료

    setLoading(true);
    const endPoint = "/board/v1/messages-info/";

    try {
      const response = await axios.get(
        `${HW_URL.APP_API}${endPoint}${uuid}?page=${params.page}&size=${params.size}&sort=id,desc`
      );
      console.log(
        "getMessageList",
        `메시지 리스트 가져오기 성공 ${response.data}`
      );

      // 메시지 리스트 업데이트
      setMessageList((prev) => [...prev, ...response.data.content]);
      setTotalPages(response.data.page.totalPages - 1); // 총 페이지 수 업데이트
    } catch (error) {
      console.error("API 호출 실패", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(params);
    getMessageList();
  }, [params.page]);

  const flatListRef = useRef(null);

  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 헤더의 title을 유동적으로 설정
    navigation.setOptions({ headerTitle: title });
  }, [title, navigation]);

  const renderItem = ({ item, index }) => {
    return (
      <>
        {/* {index === 0 &&
          <MidSection />
        } */}
        <Pressable
          style={{
            padding: 14,
            width: width - 40,
            marginTop: index === 0 ? 20 : 7,
            marginBottom: 7,
            borderRadius: 3,
            borderWidth: 0.5,
            borderColor: "#413d34",
          }}
          onPress={() => {
            taptic();
            // setType((p) => !p)
            navigation.navigate("StackCard", {
              screen: "DetailMessage",
              params: [item, "target"],
            });
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              marginBottom: 10,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  backgroundColor:
                    item.reply_yn === "N" ? "#a83f39" : "#2A2322",
                  marginHorizontal: 2,
                  paddingLeft: 8,
                  paddingRight: 8,
                  paddingTop: 3,
                  paddingBottom: 3,
                  borderRadius: 4,
                }}
              >
                {item.reply_yn === "N" ? (
                  <Text
                    style={{
                      fontSize: Platform.select({ ios: 12, android: 11 }),
                      color: "#ffffff",
                    }}
                  >
                    열람 불가
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontSize: Platform.select({ ios: 12, android: 11 }),
                      color: "#ffffff",
                    }}
                  >
                    열람 가능
                  </Text>
                )}
              </View>
              {item?.secretAt === "S" && (
                <View
                  style={{
                    backgroundColor:
                      item?.secretAt === "S" ? "#a83f39" : "#2A2322",
                    marginHorizontal: 2,
                    paddingLeft: 8,
                    paddingRight: 8,
                    paddingTop: 3,
                    paddingBottom: 3,
                    borderRadius: 4,
                  }}
                >
                  {
                    <Text
                      style={{
                        fontSize: Platform.select({ ios: 12, android: 11 }),
                        color: "#ffffff",
                      }}
                    >
                      시크릿
                    </Text>
                  }
                </View>
              )}
            </View>
          </View>
          <View style={{ position: "relative", marginTop: 8 }}>
            <View
              style={{
                borderRadius: 3,
                backgroundColor: "#ffffff",
                padding: 10,
                zIndex: 1,
              }}
            >
              <Text
                style={{
                  color: "#413d34",
                  fontWeight: "bold",
                  fontSize: Platform.select({ ios: 14, android: 13 }),
                }}
              >
                {item?.secretAt === "S"
                  ? "비밀인데요.. 눌러서 확인해보세요."
                  : item?.content}
              </Text>
            </View>
          </View>
        </Pressable>
      </>
    );
  };

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
          backgroundColor: "#FBF9F4",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          // paddingTop:
          //   Platform.OS === 'ios' ? (DeviceInfo.hasNotch() ? 52 : 0) : 0,
          paddingBottom: 20,
          // marginBottom:
          //   Platform.OS === 'ios' ? (DeviceInfo.hasNotch() ? 92 : 70) : 70,
        }}
      >
        <Container>
          <FlatList
            ref={flatListRef}
            data={messageList}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            onEndReached={() => {
              if (params.page < totalPages) {
                // 총 페이지 수보다 작을 때만 요청
                setParams((prev) => ({ ...prev, page: prev.page + 1 }));
              }
            }}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
              loading ? <ActivityIndicator size="large" /> : null
            }
            extraData={messageList}
          />
        </Container>
      </View>
    </>
  );
}

export default ReceiveMsg;
