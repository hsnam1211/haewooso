import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Tabs from './Tabs';
import StackModal from './StackModal';
import StackCard from './StackCard';
import { View } from 'react-native';
import { useRecoilState } from 'recoil';
import { getMessageState } from '../src/recoil/atoms';
import { Storage } from '../src/util/storage'

const Nav = createNativeStackNavigator();

const Root = () => {

  return (<Nav.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Nav.Screen name='Tabs' component={Tabs} />

    <Nav.Screen
      name='StackModal'
      options={{
        presentation: 'modal',
      }}
      component={StackModal}
    />
    <Nav.Screen
      name='StackCard'
      options={{
        presentation: 'card',
      }}
      component={StackCard}
    />
  </Nav.Navigator>)
};

export default Root;
