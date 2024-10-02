import * as Animatable from "react-native-animatable";

import { Image, Platform, Pressable, Text, View } from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { onPressMoveSystemSetting, requestUserPermission } from "../App";

import ArrowClick from "../assets/arrowClick.png";
import CheckBox from "@react-native-community/checkbox";
import CommonModal from "../src/components/CommonModal";
import { HW_URL } from "../src/res/env";
import InfoModal from "../src/components/InfoModal";
import { Storage } from "../src/util/storage";
import SvgIcon from "../src/components/SvgIcon";
import axios from "axios";
import { getMessageState } from "../src/recoil/atoms";
import { isEmptyDescription } from "./PushScreen";
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
      // TODO:
      updatePushState(isPush);
    }
    // 현재 값을 ref에 저장
    prevIsPushRef.current = isPush;
  }, [isPush]);

  const handlePress = () => {
    onPressMoveSystemSetting();
    setModalVisible(false);
  };

  const getSecretCode = async () => {
    const uuid = await Storage.getItem("uuid");
    axios
      .post(`${HW_URL.APP_API}/create/secret_code/api/v1`, {
        uuid: uuid,
      })
      .then(response => {
        // 성공적으로 요청을 처리한 경우
        console.log("getSecretCode", response.data);
        setSecretCode(response.data);
      })
      .catch(async error => {
        // 요청 처리 중에 오류가 발생한 경우
        console.error(error);
        console.error("/create/secret_code/api/v1");
      });
  };

  const CustomCheckBox = ({ checkState, setCheckState, callback }) => {
    return Platform.OS === "ios" ? (
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
              setCheckState(prev => !prev);
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
    ) : (
      <CheckBox
        style={{ transform: [{ scale: 0.8 }] }}
        tintColors={{ true: "black", false: "black" }}
        disabled={false}
        value={checkState}
        onValueChange={newValue => setCheckState(newValue)}
      />
    );
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
        <View>
          <Text>안녕하세요?</Text>
        </View>
      </InfoModal>
      <View style={{ flex: 1, backgroundColor: "#FBF9F4", paddingLeft: 12 }}>
        <View
          style={{
            marginTop: 30,
            marginBottom: Platform.select({ ios: 10, android: 3 }),
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
            style={{ position: "relative", top: -1 }}
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
              top: Platform.select({ ios: 0, android: 4 }),
              right: Platform.select(
                !isEmptyDescription(secretCode)
                  ? { ios: 182, android: 4 }
                  : { ios: 162, android: 4 }
              ),
              // right: Platform.select({ ios: 162, android: 4 }),
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
                top: Platform.select({ ios: -18, android: 4 }),
                right: Platform.select({ ios: -25, android: 4 }),
              }}
            >
              {!isEmptyDescription(secretCode) ? "click!" : secretCode}
            </Text>
          </View>
          <Pressable
            onPressIn={() => {
              taptic();
            }}
            onPressOut={async () => {
              taptic();
              await getSecretCode();
            }}
            style={{
              borderRadius: 4,
              borderWidth: 1,
              paddingTop: 10,
              paddingRight: 20,
              paddingBottom: 10,
              paddingLeft: 20,
            }}
          >
            <Text>시크릿 코드 발급 받기</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

export default Setting;
