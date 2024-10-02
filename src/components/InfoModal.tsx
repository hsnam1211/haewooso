import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { Children, useEffect, useState } from "react";

import SvgIcon from "./SvgIcon";
import { width } from "../util/screenDimensions";

function CommonModal({ visible, onClose, children }: any) {
  const [modalVisible, setModalVisible] = useState(visible);

  const handlePress = () => {
    setModalVisible(false);

    if (onClose) {
      onClose();
    }
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
            android: {
              elevation: 3,
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
          }}
        >
          <View style={{ padding: 14 }}>
            <Pressable
              onPress={handlePress}
              style={{ width: "100%", alignItems: "flex-end" }}
            >
              <SvgIcon
                name="close"
                stroke="#000000"
                strokeWidth="1"
                fill="#000000"
                width={15}
                height={15}
              />
            </Pressable>
            {children}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}
export default CommonModal;
