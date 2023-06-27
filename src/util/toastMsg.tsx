import React from "react";
import {
  Text,
  View,
  Platform,
} from 'react-native';
import { width, height } from '../../src/util/screenDimensions';

export const toastConfig = {
  tomatoToast: ({ text1, props }) => (
    <View
      style={{
        width: width,
        // paddingTop: 8,
        // paddingBottom: 8,
        // borderRadius: 6,
        // paddingLeft: 20,
        // paddingRight: 20,
        // marginLeft: 20,
        // marginRight: 20,
        // top: 0,
        height: 90,
        // backgroundColor: '#FBF9F4',
        backgroundColor: '#2A2322',
        justifyContent: 'center',
        alignItems: 'center',
        // ...Platform.select({
        //   ios: {
        //     shadowColor: 'rgb(50,50,50)',
        //     shadowOpacity: 0.3,
        //     shadowRadius: 5,
        //     shadowOffset: {
        //       height: -1,
        //       width: 0,
        //     },
        //   },
        //   android: {
        //     elevation: 3,
        //   },
        // }),
      }}
    >
      <Text
        style={
          {
            color: '#2A2322',
            fontSize: 16,
            lineHeight: 22,
            textAlign: 'center',
          }
        }
      >
        {text1}
      </Text>
    </View>
  ),
};