import * as Animatable from "react-native-animatable";

import { Image, Platform, Pressable, Text, View } from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { onPressMoveSystemSetting, requestUserPermission } from "../App";

import ArrowClick from "../assets/arrowClick.png";
import CheckBox from "@react-native-community/checkbox";
import CommonModal from "../src/components/CommonModal";
import { HW_URL } from "../src/res/env";
import InfoModal from "../src/components/InfoModal";
import { Share } from "react-native";
import { Storage } from "../src/util/storage";
import SvgIcon from "../src/components/SvgIcon";
import axios from "axios";
import { getMessageState } from "../src/recoil/atoms";
import { isEmptyDescription } from "./PushScreen";
import { set } from "react-native-reanimated";
import { taptic } from "../src/util/taptic";
import { useNavigation } from "@react-navigation/native";
import usePush from "../src/hooks/usePush";
import { useRecoilState } from "recoil";

function Setting({ route }) {
  const [msgData, setMsgData] = useRecoilState(getMessageState);
  const data = route.params;
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [secretCode, setSecretCode] = useState<string>("");
  const [mainCheck, setMainCheck] = useState(true);
  const [description, setDescription] = useState("");
  const { isPush, setIsPush, updatePushState } = usePush();

  const prevIsPushRef = useRef<any>();

  useEffect(() => {
    // 이전 값과 현재 값을 비교
    if (
      prevIsPushRef.current !== isPush &&
      prevIsPushRef.current !== undefined
    ) {
      updatePushState(isPush);
    }
    // 현재 값을 ref에 저장
    prevIsPushRef.current = isPush;
  }, [isPush]);

  useEffect(() => {
    getStorageSecretCode();
  }, []);

  const handlePress = () => {
    onPressMoveSystemSetting();
    setModalVisible(false);
  };

  const getStorageSecretCode = async () => {
    const secretCode = await Storage.getItem("secretCode");
    if (secretCode) {
      setSecretCode(secretCode);
    }
  };

  const getSecretCode = async () => {
    const uuid = await Storage.getItem("uuid");
    const endPoint = "/secret/v1/secret-code";
    axios
      .post(`${HW_URL.APP_API}${endPoint}`, {
        uuid: uuid,
      })
      .then(async (response) => {
        // 성공적으로 요청을 처리한 경우
        console.log("getSecretCode", response.data);
        setSecretCode(response.data);
        await Storage.setItem("secretCode", response.data);
      })
      .catch(async (error) => {
        // 요청 처리 중에 오류가 발생한 경우
        console.error(error);
        console.error(endPoint);
      });
  };

  const CustomCheckBox = ({ checkState, setCheckState, callback }) => {
    return (
      <View>
        <Pressable
          style={{
            borderWidth: 1,
            borderRadius: 4,
            width: 16,
            height: 16,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 5,
          }}
          onPress={async () => {
            if (!checkState) {
              if (!(await requestUserPermission())) {
                onPressMoveSystemSetting();
                return;
              }
              setCheckState((prev) => !prev);
              return;
            }

            setModalVisible(true);
          }}
        >
          {checkState && (
            <SvgIcon name={"check"} strokeWidth={1} stroke={"#000"} size={15} />
          )}
        </Pressable>
      </View>
    );
  };

  const [codeViewWidth, setCodeViewWidth] = useState<number>(0);
  const handleLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    console.log(width);
    setCodeViewWidth(width);
  };

  return (
    <>
      <CommonModal
        title="새로 날아온 근심"
        description="알림을 받아야 하는데요.."
        type="alert"
        confirmText="끌래요"
        closeText="그냥 둘게요"
        visible={modalVisible}
        onConfirm={handlePress}
        onClose={() => {
          setModalVisible(false);
        }}
      />
      <InfoModal
        visible={infoModalVisible}
        onClose={() => {
          setInfoModalVisible(false);
        }}
      >
        <View style={{ marginBottom: 10 }}>
          <Text style={{ fontWeight: "600", marginBottom: 10 }}>
            시크릿 코드는요..
          </Text>
          <Text>
            시크릿 코드를 친구에게 공유하고, 친구와 비밀 메시지를 주고
            받아보세요.
          </Text>
          <View
            style={{
              borderWidth: 1,
              borderRadius: 4,
              borderColor: "gray",
              marginTop: 15,
              padding: 10,
            }}
          >
            <Text
              style={{ marginBottom: 4, color: "gray" }}
            >{`1. 시크릿 코드를 발급 받으세요.`}</Text>
            <Text style={{ marginBottom: 4, color: "gray" }}>
              {`2. 발급된 시크릿 코드의 오른쪽에 위치한 공유 아이콘을 누르세요.`}
            </Text>
            <Text style={{ color: "gray" }}>
              {`3. 카카오톡 또는 메시지로 친구에게 공유하세요.`}
            </Text>
          </View>
        </View>
      </InfoModal>
      <View style={{ flex: 1, backgroundColor: "#FBF9F4", paddingLeft: 12 }}>
        <View
          style={{
            marginTop: 30,
            marginBottom: Platform.select({ ios: 10, android: 10 }),
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 13 }}>
            푸시 알림 설정
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginLeft: Platform.select({ ios: 4, android: 0 }),
          }}
        >
          <CustomCheckBox
            callback={() => {}}
            checkState={isPush}
            setCheckState={setIsPush}
          />
          <Text
            style={{
              textAlignVertical: "center",
              fontSize: Platform.select({ ios: 14, android: 13 }),
              position: "relative",
              top: Platform.select({ ios: 0, android: -2 }),
            }}
          >
            푸시 알림을 받을래요.
          </Text>
        </View>
        <View
          style={{
            marginTop: 30,
            marginBottom: Platform.select({ ios: 10, android: 3 }),
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 13 }}>시크릿 코드</Text>
          <Pressable
            style={{
              position: "relative",
              top: Platform.select({ ios: -1, android: 1 }),
            }}
            onPress={() => {
              setInfoModalVisible(true);
            }}
          >
            <SvgIcon width={20} height={20} name="warning" />
          </Pressable>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginLeft: Platform.select({ ios: 4, android: 0 }),
            position: "relative",
          }}
        >
          <View
            style={{
              position: "absolute",
              top: 0,
              left: codeViewWidth + 8,
              flexDirection: "row",
            }}
          >
            <Image
              style={{
                transform: [{ rotate: "200deg" }],
                width: 17,
                height: 17,
              }}
              source={ArrowClick}
            />
            <Text
              style={{
                transform: [{ rotate: "10deg" }],
                left: 5,
                fontSize: 14,
              }}
            >
              {!isEmptyDescription(secretCode) ? "click!" : secretCode}
            </Text>
            {isEmptyDescription(secretCode) && (
              <Pressable
                onPress={async () => {
                  await Share.share({
                    // message:
                    //   "누군가의 시크릿 코드를 받았어요. \n시크릿 메시지를 보내보세요.",
                    message: `https://haewooso.web.app?secret_code=${secretCode}`,
                  });
                }}
                style={{
                  transform: [{ rotate: "13deg" }],
                  left: 5,
                  top: 7,
                }}
              >
                <SvgIcon
                  name="share"
                  width={15}
                  height={15}
                  stroke={"#222222"}
                  strokeWidth={1.5}
                />
              </Pressable>
            )}
          </View>
          <Pressable
            onLayout={handleLayout}
            onPressIn={() => {
              taptic();
            }}
            onPressOut={async () => {
              taptic();
              await getSecretCode();
            }}
            style={{
              marginTop: Platform.select({ android: 10, ios: 0 }),
              borderRadius: 4,
              borderWidth: 1,
              paddingTop: 10,
              paddingRight: 20,
              paddingBottom: 10,
              paddingLeft: 20,
            }}
          >
            <Text
              style={{
                position: "relative",
                top: Platform.select({ android: -3 }),
              }}
            >
              {!isEmptyDescription(secretCode)
                ? "시크릿 코드 발급 받기"
                : "시크릿 코드 재발급 받기"}
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

export default Setting;
