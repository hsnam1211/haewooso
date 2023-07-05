import React from "react";
import {
  Text,
  View,
  Platform,
  Pressable,
} from 'react-native';
import { width, height } from '../../src/util/screenDimensions';
import { taptic } from "./taptic";

export const toastConfig = {
  tomatoToast: ({ text1, onPress }) => {
    return (
      <Pressable
        onPress={onPress}
        style={{
          width: width,
          height: 90,
          backgroundColor: '#FBF9F4',
          justifyContent: 'center',
          alignItems: 'flex-start',
          ...Platform.select({
            ios: {
              shadowColor: 'rgb(50,50,50)',
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
        <View style={{ marginLeft: 20 }}>
          <Text style={{ marginBottom: 10, fontWeight: 'bold', fontSize: Platform.select({ ios: 14, android: 12 }) }}>새로 날아온 근심</Text>
          <Text
            style={{
              color: '#2A2322',
              fontSize: 16,
              lineHeight: 22,
              textAlign: 'center',
            }}
          >
            {text1}
          </Text>
        </View>
      </Pressable>
    );
  },
};
