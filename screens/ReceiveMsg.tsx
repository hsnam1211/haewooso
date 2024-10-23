import {
  ActivityIndicator,
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

import DeviceInfo from "react-native-device-info";
import { HW_URL } from "../src/res/env";
import axios from "axios";
import styled from "styled-components";
import { taptic } from "../src/util/taptic";
import { useHeaderHeight } from "@react-navigation/elements";

const Container = styled(View)`
  margin-right: 0px;
  margin-left: 0px;
`;

function ReceiveMsg({ route }) {
  const { title, uuid } = route.params; // params에서 title과 message 추출
  const navigation = useNavigation<any>();

  const [params, setParams] = useState<any>({
    page: 0,
    size: 10,
  });

  const [messageList, setMessageList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(0); // 총 페이지 수
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();
  const getMessageList = async (isRefresh?: string) => {
    if (loading) return; // 로딩 중이면 종료

    setLoading(true);
    const endPoint = "/board/v1/messages-info/";
    const queryString =
      isRefresh === "refresh"
        ? `page=0&size=10&sort=id,desc`
        : `page=${params.page}&size=${params.size}&sort=id,desc`;
    if (isRefresh === "refresh") {
      setRefreshing(true); // 새로고침 시작
    }
    try {
      console.log(`${HW_URL.APP_API}${endPoint}${uuid}?${queryString}`);
      const response = await axios.get(
        `${HW_URL.APP_API}${endPoint}${uuid}?${queryString}`
      );
      console.log(
        "getMessageList",
        `메시지 리스트 가져오기 성공 ${response.data}`
      );

      // 메시지 리스트 업데이트
      if (isRefresh === "refresh") {
        setMessageList([...response.data.content]);
        setParams({ page: 0, size: 10 });
        setTotalPages(response.data.page.totalPages - 1);
      } else {
        setMessageList(prev => [...prev, ...response.data.content]);
        setTotalPages(response.data.page.totalPages - 1); // 총 페이지 수 업데이트
      }
    } catch (error) {
      console.error("API 호출 실패", error);
    } finally {
      if (isRefresh === "refresh") {
        setRefreshing(false); // 새로고침 종료
      }
      setLoading(false);
    }
  };

  useEffect(() => {
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
          key={item?.content}
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
                      position: "relative",
                      top: Platform.select({ android: -2 }),
                    }}
                  >
                    열람 불가
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontSize: Platform.select({ ios: 12, android: 11 }),
                      color: "#ffffff",
                      position: "relative",
                      top: Platform.select({ android: -2 }),
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
                        position: "relative",
                        top: Platform.select({ android: -2, ios: 1 }),
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
          paddingBottom: 20,
        }}
      >
        <Container>
          <FlatList
            ref={flatListRef}
            data={messageList}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            onEndReached={() => {
              if (loading) return;
              if (params.page < totalPages) {
                // 총 페이지 수보다 작을 때만 요청
                console.log(params.page);
                setParams(prev => ({ ...prev, page: prev.page + 1 }));
              }
            }}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
              loading ? <ActivityIndicator size="large" /> : null
            }
            extraData={messageList}
            refreshing={refreshing} // 새로고침 상태
            onRefresh={() => getMessageList("refresh")} // 새로고침 함수
          />
        </Container>
      </View>
    </>
  );
}

export default ReceiveMsg;
