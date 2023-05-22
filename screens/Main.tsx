import React, { useEffect, useLayoutEffect, useState } from 'react';

import {
  ScrollView,
  RefreshControl,
  Dimensions,
  View,
  Platform,
  Image,
  Text,
  InteractionManager,
  Pressable,
  Linking,
} from 'react-native';
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
      <Text style={{ color: '#fff' }}>안녕</Text>
    </View>
  );
}

export default Main;
