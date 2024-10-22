import { Platform, Pressable, ScrollView, Text, View } from "react-native";
import React, { useState } from "react";
import { height, width } from "../src/util/screenDimensions";

import CommonModal from "../src/components/CommonModal";
import SvgIcon from "../src/components/SvgIcon";
import { ToastHandle } from "../src/util/toastMsg";
import { sendMessageCount } from "../src/recoil/atoms";
import { taptic } from "../src/util/taptic";
import { useNavigation } from "@react-navigation/native";
import { useRecoilState } from "recoil";

function DetailMessage({ route }) {
  const data = route?.params?.[0] || route?.params;
  const type = route?.params?.[1];
  const navigation = useNavigation<any>();
  const [number, setNumber] = useRecoilState(sendMessageCount);

  // modal control
  const [modalVisible, setModalVisible] = useState(false);

  const adAlert = () => {
    setModalVisible(true);
  };
  const isSecret = () => {
    return data?.secretAt === "S" && data?.secretCode;
  };

  // 횟수 0일 때 광고 호출
  const handlePress = () => {
    setModalVisible(false);

    ToastHandle("신고가 접수되었습니다.", 3000);
    navigation.goBack();
  };
  return (
    <>
      <CommonModal
        title=""
        description=""
        type="alert"
        confirmText="신고하기"
        closeText="취소"
        visible={modalVisible}
        onConfirm={handlePress}
        onClose={() => {
          console.log("팝업을 닫았습니다.");
          setModalVisible(false);
        }}
      >
        <View>
          <Text style={{ marginBottom: -10 }}>
            신고 후 24시간 이내에 해우소 운영진이 검토하여 {"\n"}
          </Text>
          <Text>메시지와 발신인에 대한 조치를 취합니다.</Text>
        </View>
      </CommonModal>
      <View style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: "#FBF9F4",
            flex: 1,
            // paddingTop: Platform.select({ ios: 70, android: 30 }),
            alignItems: "center",
            paddingRight: 20,
            paddingLeft: 20,
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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <View
                style={{
                  backgroundColor: isSecret() ? "#2A2322" : "#a83f39",
                  marginHorizontal: 2,
                  paddingLeft: 8,
                  paddingRight: 8,
                  paddingTop: 3,
                  paddingBottom: 3,
                  borderRadius: 4,
                  marginTop: 20,
                }}
              >
                {isSecret() ? (
                  <Text
                    style={{
                      fontSize: Platform.select({ ios: 12, android: 11 }),
                      color: "#ffffff",
                      position: "relative",
                      top: Platform.select({ android: -1.2 }),
                    }}
                  >
                    메시지 전송 가능
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontSize: Platform.select({ ios: 12, android: 11 }),
                      color: "#ffffff",
                      position: "relative",
                      top: Platform.select({ android: -1.2 }),
                    }}
                  >
                    메시지 전송 불가
                  </Text>
                )}
              </View>
              <Pressable
                onPress={() => {
                  setModalVisible(true);
                }}
                style={{
                  backgroundColor: "transparent",
                  marginHorizontal: 2,
                  paddingLeft: 8,
                  paddingRight: 8,
                  paddingTop: 3,
                  paddingBottom: 3,
                  borderRadius: 4,
                  marginTop: 20,
                  borderStyle: "solid",
                  borderColor: "red",
                  borderWidth: 1,
                }}
              >
                <Text
                  style={{
                    fontSize: Platform.select({ ios: 12, android: 11 }),
                    color: "red",
                    position: "relative",
                    top: Platform.select({ android: -1.2, ios: 0 }),
                  }}
                >
                  신고하기
                </Text>
              </Pressable>
            </View>
          </View>
          <View style={{ alignItems: "center" }}>
            <View
              style={{
                borderBottomColor: "#2A2322",
                borderBottomWidth: 0.5,
                marginTop: Platform.select({ ios: 0, android: 0 }),

                // marginBottom: Platform.select({ ios: 30, android: 30 })
              }}
            >
              <Text
                style={{
                  paddingLeft: 5,
                  paddingRight: 5,
                  paddingBottom: 14,
                  width: width - 40,
                  fontSize: Platform.select({ ios: 14, android: 13 }),
                  marginTop: 7,
                  marginBottom: Platform.select({ ios: 7, android: 7 }),
                  paddingTop: 24,
                  textAlignVertical: "center",
                  lineHeight: 25,
                }}
              >
                {/* 본문 */}
                {data.content}
              </Text>
            </View>
          </View>
          <View
            style={{
              marginTop: Platform.select({ ios: 0, android: 0 }),
            }}
          >
            <Text
              style={{
                paddingLeft: 5,
                paddingRight: 5,
                paddingBottom: 14,
                width: width - 40,
                fontSize: Platform.select({ ios: 14, android: 13 }),
                marginTop: 7,
                marginBottom: Platform.select({ ios: 7, android: 13 }),
                paddingTop: 24,
                textAlignVertical: "center",
                lineHeight: 25,
                color: "gray",
              }}
            >
              * 부적절하거나 불쾌감을 줄 수 있는 메시지를 받으셨다면 신고하기를
              눌러주세요. 신고 내용은 24시간 이내 조치됩니다.
            </Text>
          </View>
        </View>
        {isSecret() && (
          <Pressable
            onPressIn={() => {
              taptic();
            }}
            onPressOut={() => {
              taptic();
              navigation.navigate("StackModal", {
                screen: "PushScreen",
                params: { secretCode: data?.secretCode },
                animation: "fade",
              });
            }}
            style={{
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 50,
              width: 64,
              height: 64,
              position: "absolute",
              bottom: 40,
              right: 40,
              backgroundColor: "#FBF9F4",
              borderWidth: 0.5,
              borderColor: "#000000",
            }}
          >
            <SvgIcon
              name="haewoosoLogo"
              fill="#000000"
              stroke="#ffffff"
              strokeWidth="1.5"
              size={30}
              style={{ zIndex: 100 }}
            />
            <Text
              style={{
                fontSize: Platform.select({ ios: 11, android: 10 }),
                marginTop: 3,
              }}
            >
              {/* {type ? "답장하기" : `(${number}/5)`} */}
              답장하기
            </Text>
          </Pressable>
        )}
      </View>
    </>
  );
}

export default DetailMessage;
