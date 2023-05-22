import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const NativeStack = createNativeStackNavigator();

const StackModal = () => (
  <NativeStack.Navigator
    screenOptions={{
      headerBackTitleVisible: true,
      headerTitleAlign: 'center',
    }}
  >
    {/* <NativeStack.Screen name='ChannelGuide' options={ {title: '채널연결가이드', presentation: 'modal',} } component={ChannelGuide} /> */}
  </NativeStack.Navigator>
);

export default StackModal;
