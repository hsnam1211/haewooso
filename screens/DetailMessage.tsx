import { Platform, Pressable, ScrollView, Text, View } from "react-native";
import React, { useState } from "react";
import { height, width } from "../src/util/screenDimensions";

import CommonModal from "../src/components/CommonModal";
import SvgIcon from "../src/components/SvgIcon";
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

  // 횟수 0일 때 광고 호출
  const adHandlePress = async () => {
    // axios 호출
    setNumber(5);
    setModalVisible(false);
    //   axios.post('http://15.165.155.62:8080/v1/push', {
    //     title: truncateDescription(description),
    //     description: description,
    //     sender_uuid: await Storage.getItem('uuid'),
    //     main_view_yn: mainCheck ? 'Y' : 'N',
    //     reply_yn: receiveCheck ? 'Y' : 'N'
    //   })
    //     .then(response => {
    //       // 성공적으로 요청을 처리한 경우
    //       console.log(response.data);
    //     })
    //     .catch(error => {
    //       // 요청 처리 중에 오류가 발생한 경우
    //       console.error(error);
    //     });
  };
  return (
    <>
      <CommonModal
        title="새로 날아온 근심"
        description="더이상 메시지를 보낼 수 없어요. 광고보고 횟수를 채워보세요."
        type="alert"
        confirmText="네, 광고보고 올래요"
        closeText=""
        visible={modalVisible}
        onConfirm={adHandlePress}
        onClose={() => {
          console.log("팝업을 닫았습니다.");
          setModalVisible(false);
        }}
      />
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
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  backgroundColor:
                    data?.secretAt === "S" ? "#2A2322" : "#a83f39",
                  marginHorizontal: 2,
                  paddingLeft: 8,
                  paddingRight: 8,
                  paddingTop: 3,
                  paddingBottom: 3,
                  borderRadius: 4,
                }}
              >
                {data?.secretAt === "S" ? (
                  <Text
                    style={{
                      fontSize: Platform.select({ ios: 12, android: 11 }),
                      color: "#ffffff",
                    }}
                  >
                    메시지 전송 가능
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontSize: Platform.select({ ios: 12, android: 11 }),
                      color: "#ffffff",
                    }}
                  >
                    메시지 전송 불가
                  </Text>
                )}
              </View>
              {data.reply_yn === "N" && (
                <View
                  style={{
                    backgroundColor: "lightgray",
                    marginHorizontal: 2,
                    paddingLeft: 8,
                    paddingRight: 8,
                    paddingTop: 3,
                    paddingBottom: 3,
                    borderRadius: 4,
                  }}
                >
                  <Text
                    style={{
                      fontSize: Platform.select({ ios: 12, android: 11 }),
                      color: "#000000",
                    }}
                  >
                    답변 완료
                  </Text>
                </View>
              )}
            </View>
            {data.reply_yn === "Y" && (
              <View
                style={{
                  backgroundColor: "#575241",
                  marginHorizontal: 2,
                  paddingLeft: 8,
                  paddingRight: 8,
                  paddingTop: 3,
                  paddingBottom: 3,
                  borderRadius: 50,
                }}
              >
                <Text
                  style={{
                    fontSize: Platform.select({ ios: 12, android: 11 }),
                    color: "#ffffff",
                  }}
                >
                  남은 답변 횟수 : 1/3
                </Text>
              </View>
            )}
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
                  marginBottom: Platform.select({ ios: 7, android: 13 }),
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
        </View>

        {data?.secretAt === "S" && (
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
              // if (number >= 1) {
              //   navigation.navigate("StackModal", {
              //     screen: "PushScreen",
              //     animation: "fade",
              //   });
              //   setNumber(p => p - 1);
              // } else {
              //   adAlert();
              // }
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
