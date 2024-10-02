import * as Animatable from "react-native-animatable";

import {
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
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Storage } from "../src/util/storage";
import SvgIcon from "../src/components/SvgIcon";
import axios from "axios";
import styled from "styled-components";
import { taptic } from "../src/util/taptic";
import { useNavigation } from "@react-navigation/native";
import { useQueryClient } from "react-query";
import { useRecoilState } from "recoil";

function OnePushScreen() {
  const navigation = useNavigation();
  const [receiveCheck, setReceiveCheck] = useState(true);
  const [mainCheck, setMainCheck] = useState(true);
  const [description, setDescription] = useState("");
  const maxLength = 100;
  const maxLines = 10;

  const isEmptyDescription = text => {
    return !(!text || text.trim().length === 0);
  };

  const truncateDescription = description => {
    if (description.length > 15) {
      return description.slice(0, 15) + "...";
    } else {
      return description;
    }
  };

  const handleTextChange = inputText => {
    if (
      getNumberOfLines(inputText) <= maxLines &&
      inputText.length <= maxLength
    ) {
      setDescription(inputText);
    }
  };

  const getNumberOfLines = text => {
    return text.split("\n").length;
  };

  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = async () => {
    // axios 호출
    axios
      .post("http://15.165.155.62:8080/v1/push", {
        title: truncateDescription(description),
        description: description,
        sender_uuid: await Storage.getItem("uuid"),
        main_view_yn: mainCheck ? "Y" : "N",
        reply_yn: receiveCheck ? "Y" : "N",
      })
      .then(response => {
        // 성공적으로 요청을 처리한 경우
        console.log(response.data);
        navigation.goBack();
      })
      .catch(error => {
        // 요청 처리 중에 오류가 발생한 경우
        console.error(error);
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
        onValueChange={newValue => setCheckState(newValue)}
        style={{ width: 14, height: 14, marginRight: 7 }}
      />
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
              // onChangeText={text => setDescription(text)}
              onChangeText={handleTextChange}
              placeholder={
                !isEmptyDescription(description)
                  ? "근심을 털어놓아보세요. 익명의 누군가에게 전달됩니다."
                  : ""
              }
              multiline={true}
              // onSubmitEditing={handlePress}
              // onContentSizeChange={e => {
              //   if (Platform.OS === 'ios') {

              //     console.log(e.nativeEvent.contentSize.height / 25) // prints number of lines
              //   } else {

              //     console.log(e.nativeEvent.contentSize.height / 26)
              //   }
              // }
              // }
            />
            <Text
              style={{ width: "100%", textAlign: "right", color: "gray" }}
            >{`${description.length}/${maxLength}`}</Text>
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
                      checkState={receiveCheck}
                      setCheckState={setReceiveCheck}
                    />
                    <Text
                      style={{
                        textAlignVertical: "center",
                        fontSize: Platform.select({ ios: 14, android: 13 }),
                      }}
                    >
                      누군가에게 답장을 받고 싶어요.
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                  </View>
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
                      // handlePress()
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
                      send
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

export default OnePushScreen;
