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
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { height, width } from "../src/util/screenDimensions";
import { onPressMoveSystemSetting, requestUserPermission } from "../App";

import CheckBox from "@react-native-community/checkbox";
import CommonModal from "../src/components/CommonModal";
import LinearGradient from "react-native-linear-gradient";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import SvgIcon from "../src/components/SvgIcon";
import axios from "axios";
import { getMessageState } from "../src/recoil/atoms";
import styled from "styled-components";
import { taptic } from "../src/util/taptic";
import { useNavigation } from "@react-navigation/native";
import { useRecoilState } from "recoil";

function Setting({ route }) {
  const [msgData, setMsgData] = useRecoilState(getMessageState);
  const data = route.params;
  const navigation = useNavigation();

  const [receiveCheck, setReceiveCheck] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [mainCheck, setMainCheck] = useState(true);
  const [description, setDescription] = useState("");

  async function pushPermissionCheck() {
    const isPush = await requestUserPermission();
    setReceiveCheck(isPush);
  }

  useEffect(() => {
    pushPermissionCheck();
  }, []);

  useEffect(() => {
    // pushPermissionCheck();
    // onPressMoveSystemSetting();
  }, [receiveCheck]);

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

  const handlePress = () => {
    // axios 호출
    axios
      .post("http://15.165.155.62:8080/v1/push", {
        title: truncateDescription(description),
        description: description,
        sender: "uuid",
      })
      .then(response => {
        // 성공적으로 요청을 처리한 경우
        console.log(response.data);
      })
      .catch(error => {
        // 요청 처리 중에 오류가 발생한 경우
        console.error(error);
        console.log('/v1/push')
      });
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const CustomCheckBox = ({ checkState, setCheckState, callback }) => {
    callback();

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
      <View style={{ flex: 1, backgroundColor: "#FBF9F4", paddingLeft: 12 }}>
        {/* <View style={{ marginTop: 30, marginBottom: 10 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 13 }}>
          내 메시지
        </Text>
      </View>
      <View style={{ width: width, flexDirection: 'row' }}>
        <Pressable
          style={[styles.messageBox, { marginRight: 2 }]}
          onPressIn={() => {
            taptic()
          }}
          onPressOut={() => {
            taptic()
            navigation.navigate('StackCard', {
              screen: 'ReceiveMsg',
              animation: 'fade'
            });
          }}
        >
          <View style={[styles.receiveMessage, { backgroundColor: msgData ? '#413d34' : 'transparent', }]}>
            <Text style={{ color: '#FBF9F4', bottom: Platform.select({ ios: 0, android: 2 }), fontSize: Platform.select({ ios: 14, android: 12 }) }}>!</Text>
          </View>
          <Text style={{ fontSize: Platform.select({ ios: 14, android: 13 }) }}>
            받은 메시지 보기
          </Text>
        </Pressable>
        <Pressable
          style={[styles.messageBox, { marginLeft: 2 }]}
          onPressIn={() => {
            taptic()
          }}
          onPressOut={() => {
            taptic()
            navigation.navigate('StackModal', {
              screen: 'PushScreen',
              animation: 'fade'
            });
          }}
        >
          <Text style={{ fontSize: Platform.select({ ios: 14, android: 13 }) }}>
            보낸 메시지 보기
          </Text>
        </Pressable>
      </View> */}

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
          callback={()={
            
          }}
            checkState={receiveCheck}
            setCheckState={setReceiveCheck}
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
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  receiveMessage: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: 15,
    height: 15,
    borderRadius: 50,
    right: 32,
    top: 28,
  },
  messageBox: {
    height: 100,
    width: (width - 26) / 2,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#413d34",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Setting;
