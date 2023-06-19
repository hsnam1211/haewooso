import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

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
  Animated,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { Storage } from '../src/util/storage';
import { taptic } from '../src/util/taptic';

function SamplePushToken() {
  const [copiedText, setCopiedText] = useState('');

  async function getFcmToken() {
    const text = await Storage.getItem('fcmToken');
    setCopiedText(text);
  }
  useEffect(() => {
    getFcmToken()
  }, [])

  const copyToClipboard = () => {
    console.log(copiedText)
    Clipboard.setString(copiedText);
  };

  const fetchCopiedText = async () => {
    const text = await Clipboard.getString();
    setCopiedText(text);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FBF9F4', justifyContent: 'center', alignItems: 'center', marginBottom: 75, paddingRight: 30, paddingLeft: 30 }}>
      <View style={{ alignItems: 'center' }}>
        <Text >{copiedText}</Text>
        <Pressable
          onPressIn={() => {
            taptic()
          }}
          onPressOut={() => {
            taptic()
            copyToClipboard()
            alert('클립보드에 복사되었습니다.')
          }}
          style={{ marginTop: 30, justifyContent: 'center', borderRadius: 4, backgroundColor: '#2A2322', width: '100%', padding: 12, alignItems: 'center' }}>
          <Text style={{ color: 'white' }}>copy</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default SamplePushToken;
