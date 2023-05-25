import React from 'react';

import { View, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQueryClient } from 'react-query';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

function Main() {
  return (
    <View
      style={{
        backgroundColor: '#25282b',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ color: '#fff' }}>해우소</Text>
    </View>
  );
}

export default Main;
