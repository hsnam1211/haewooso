import * as Animatable from "react-native-animatable";

import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  InteractionManager,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { height, width } from "../src/util/screenDimensions";

import CheckBox from "@react-native-community/checkbox";
import CommonModal from "../src/components/CommonModal";
import { HW_URL } from "../src/res/env";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Storage } from "../src/util/storage";
import SvgIcon from "../src/components/SvgIcon";
import axios from "axios";
import { sendMessageCount } from "../src/recoil/atoms";
import styled from "styled-components";
import { taptic } from "../src/util/taptic";
import { useNavigation } from "@react-navigation/native";
import { useQueryClient } from "react-query";
import { useRecoilState } from "recoil";

export const isEmptyDescription = (text) => {
  return !(!text || text.trim().length === 0);
};

function PushScreen({ route }: any) {
  const navigation = useNavigation();
  const [receiveCheck, setReceiveCheck] = useState(true);
  const [secretCodeCheck, setSecretCodeCheck] = useState(false);
  const [number, setNumber] = useRecoilState(sendMessageCount);
  const [description, setDescription] = useState("");
  const [secretCode, setSecretCode] = useState(route?.params?.secretCode);
  const [loading, setLoading] = useState(false);
  const maxLength = 100;
  const maxLines = 10;

  useEffect(() => {
    if (route?.params?.secretCode) {
      setSecretCodeCheck(true);
    }
  }, []);

  const truncateDescription = (description) => {
    if (description.length > 15) {
      return description.slice(0, 15) + "...";
    } else {
      return description;
    }
  };

  const handleTextChange = (inputText) => {
    if (
      getNumberOfLines(inputText) <= maxLines &&
      inputText.length <= maxLength
    ) {
      setDescription(inputText);
    }
  };
  const handleSecretCodeChange = (inputText) => {
    setSecretCode(inputText);
  };

  const getNumberOfLines = (text) => {
    return text.split("\n").length;
  };

  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = async () => {
    // axios 호출
    // TODO: 시크릿 코드 유무에 따라서 End Point 분기
    const endPoint = isEmptyDescription(secretCode)
      ? "/secret/v1/send"
      : "/push/v1/send";
    const config = {
      sendUuid: await Storage.getItem("uuid"),
      title: "해우소에서 온 메시지",
      content: description,
      ...(secretCode && { secretCode }),
    };

    console.log(config);

    axios
      .post(`${HW_URL.APP_API}${endPoint}`, config)
      .then((response) => {
        // 성공적으로 요청을 처리한 경우
        console.log(`${HW_URL.APP_API}${endPoint}`);
        console.log(response.data);
        setNumber((p) => p - 1);
        if (response.data === 200) {
        } else {
        }
        navigation.goBack();
      })
      .catch((error) => {
        // 요청 처리 중에 오류가 발생한 경우
        console.log(`${error} ${endPoint}`);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const CustomCheckBox = ({ checkState, setCheckState }) => {
    return Platform.OS === "ios" ? (
      <CheckBox
        onCheckColor={"#000000"}
        tintColor={"#000000"}
        onTintColor={"#000000"}
        boxType={"square"}
        lineWidth={1}
        disabled={false}
        value={checkState}
        onValueChange={(newValue) => setCheckState(newValue)}
        style={{ width: 14, height: 14, marginRight: 7 }}
      />
    ) : (
      <CheckBox
        style={{ transform: [{ scale: 0.8 }] }}
        tintColors={{ true: "black", false: "black" }}
        disabled={false}
        value={checkState}
        onValueChange={(newValue) => setCheckState(newValue)}
      />
    );
  };

  return (
    <>
      {loading && (
        <View
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            zIndex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" />
        </View>
      )}
      <CommonModal
        title="새로 날아온 근심"
        description="익명의 누군가에게 근심을 전달하시겠습니까?"
        type="alert"
        confirmText=""
        closeText=""
        visible={modalVisible}
        onConfirm={handlePress}
        onClose={() => {
          console.log("팝업을 닫았습니다.");
          setModalVisible(false);
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: undefined, android: undefined })}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <View
            style={{
              backgroundColor: "#FBF9F4",
              flex: 1,
              paddingTop: 70,
              alignItems: "center",
              paddingRight: 30,
              paddingLeft: 30,
            }}
          >
            <TextInput
              style={{
                paddingLeft: 5,
                paddingRight: 5,
                paddingBottom: 14,
                paddingTop: 24,
                width: width - 40,
                fontSize: Platform.select({ ios: 14, android: 13 }),
                marginTop: 7,
                marginBottom: 7,
                textAlignVertical: "center",
                borderBottomColor: "#2A2322",
                borderBottomWidth: 0.5,
                lineHeight: 25,
              }}
              value={description}
              maxLength={100}
              onChangeText={handleTextChange}
              placeholder={
                !isEmptyDescription(description)
                  ? "근심을 털어놓아보세요. 익명의 누군가에게 전달되어요."
                  : ""
              }
              multiline={true}
            />
            <Text
              style={{ width: "100%", textAlign: "right", color: "gray" }}
            >{`${description.length}/${maxLength}`}</Text>
            {secretCodeCheck && (
              <View
                style={{
                  width: "100%",
                  left: -10,
                  position: "relative",

                  paddingBottom: 14,
                  paddingTop: 24,
                }}
              >
                <View
                  style={{
                    alignItems: "flex-start",
                    width: "90%",
                    marginTop: 7,
                    marginBottom: 7,
                    flexDirection: "row",
                  }}
                >
                  {isEmptyDescription(secretCode) && <Text>code : </Text>}
                  <TextInput
                    style={{
                      fontSize: Platform.select({ ios: 14, android: 13 }),
                      color: "lightgray",
                      top: -5,
                    }}
                    value={secretCode}
                    maxLength={100}
                    onChangeText={handleSecretCodeChange}
                    placeholder={
                      !isEmptyDescription(secretCode)
                        ? "공유 받은 시크릿 코드 입력하세요."
                        : " "
                    }
                    multiline={true}
                  />
                </View>
              </View>
            )}
            {isEmptyDescription(description) && (
              <View
                style={{
                  borderWidth: 0.5,
                  borderColor: "#2A2322",
                  borderRadius: 3,
                  padding: 20,
                  flexDirection: "row",
                  position: "absolute",
                  bottom: 0,
                  marginBottom: 70,
                  width: width - 40,
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    height: "80%",
                    flexDirection: "column",
                    justifyContent: "space-around",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <CustomCheckBox
                      checkState={secretCodeCheck}
                      setCheckState={setSecretCodeCheck}
                    />
                    <Text
                      style={{
                        textAlignVertical: "center",
                        fontSize: Platform.select({ ios: 14, android: 13 }),
                      }}
                    >
                      시크릿 코드를 입력할게요.
                    </Text>
                  </View>
                  {/* <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <CustomCheckBox
                      checkState={mainCheck}
                      setCheckState={setMainCheck}
                    />
                    <Text
                      style={{
                        textAlignVertical: "center",
                        fontSize: Platform.select({ ios: 14, android: 13 }),
                      }}
                    >
                      메인 화면에 공개할래요.
                    </Text>
                  </View> */}
                </View>
                <Animatable.View
                  animation="pulse"
                  easing="ease-out"
                  iterationCount="infinite"
                  useNativeDriver={true}
                  style={{}}
                >
                  <Pressable
                    onPressIn={() => {
                      taptic();
                    }}
                    onPressOut={() => {
                      taptic();
                      setModalVisible(true);
                    }}
                  >
                    <SvgIcon
                      name="haewoosoLogo"
                      fill="#000000"
                      stroke="#797979"
                      strokeWidth="1.5"
                      size={40}
                    />
                    <Text style={{ textAlign: "center", marginTop: 10 }}>
                      보내기!
                    </Text>
                  </Pressable>
                </Animatable.View>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
}

export default PushScreen;
