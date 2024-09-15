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
import { useIsFocused, useNavigation } from "@react-navigation/native";

import CheckBox from "@react-native-community/checkbox";
import CommonModal from "../src/components/CommonModal";
import LinearGradient from "react-native-linear-gradient";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Storage } from "../src/util/storage";
import SvgIcon from "../src/components/SvgIcon";
import axios from "axios";
import { getMessageState } from "../src/recoil/atoms";
import styled from "styled-components";
import { taptic } from "../src/util/taptic";
import usePush from "../src/hooks/usePush";
import { useRecoilState } from "recoil";

function Setting({ route }) {
  const [msgData, setMsgData] = useRecoilState(getMessageState);
  const data = route.params;
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
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
            // callback={async (newValue: boolean) => {
            //   if (!newValue) {
            //     // alert(newValue);
            //     setModalVisible(true);
            //     return false;
            //   } else {
            //     // alert(newValue);
            // if (!(await requestUserPermission())) {
            //   onPressMoveSystemSetting();
            // }
            //     return false;
            //     // return true;
            //   }
            // }}
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
