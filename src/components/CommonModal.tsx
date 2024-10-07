import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { Children, useEffect, useState } from "react";

import { width } from "../util/screenDimensions";

function CommonModal({
  title,
  description,
  type,
  visible,
  onClose,
  onConfirm,
  closeText,
  confirmText,
  children,
}: any) {
  const [modalVisible, setModalVisible] = useState(visible);

  const handlePress = () => {
    setModalVisible(false);

    if (onClose) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
    setModalVisible(false);
  };

  useEffect(() => {
    setModalVisible(visible);
  }, [visible]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        console.log("Modal has been closed.");
      }}
    >
      <Pressable
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.07)",
          ...Platform.select({
            ios: {
              shadowColor: "rgb(50,50,50)",
              shadowOpacity: 0.3,
              shadowRadius: 2,
              shadowOffset: {
                height: 3,
                width: 0,
              },
            },
          }),
        }}
      >
        <View
          style={{
            width: width - 24,
            marginTop: 7,
            marginBottom: 7,
            borderRadius: 3,
            borderWidth: 0.5,
            borderColor: "#413d34",
            backgroundColor: "#FBF9F4",
            ...Platform.select({
              android: {
                elevation: 3,
              },
            }),
          }}
        >
          <View style={{ padding: 14 }}>
            {children ? children : <Text>{description}</Text>}
          </View>
          <View
            style={{
              flexDirection: "row",
              borderTopWidth: 0.5,
              borderColor: "#413d34",
            }}
          >
            <Pressable
              onPress={handlePress}
              style={{
                padding: 14,
                width: "50%",
                alignItems: "center",
                borderRightWidth: 0.5,
                borderColor: "#413d34",
              }}
            >
              <Text
                style={{
                  position: "relative",
                  top: Platform.select({ android: -3 }),
                }}
              >
                {closeText ? closeText : "아니요"}
              </Text>
            </Pressable>
            <Pressable
              onPress={handleConfirm}
              style={{ padding: 14, width: "50%", alignItems: "center" }}
            >
              <Text
                style={{
                  position: "relative",
                  top: Platform.select({ android: -3 }),
                }}
              >
                {confirmText ? confirmText : "네, 전달할래요"}
              </Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}
export default CommonModal;
