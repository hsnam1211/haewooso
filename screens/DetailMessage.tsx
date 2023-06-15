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
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQueryClient } from 'react-query';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import * as Animatable from "react-native-animatable";
import SvgIcon from '../src/components/SvgIcon';
import { height, width } from '../src/util/screenDimensions';
import axios from 'axios';
import { taptic } from '../src/util/taptic';
import CheckBox from '@react-native-community/checkbox';
import { useNavigation } from '@react-navigation/native';

function DetailMessage({ route }) {
  const data = route.params
  const navigation = useNavigation()

  const [receiveCheck, setReceiveCheck] = useState(true)
  const [mainCheck, setMainCheck] = useState(true)
  const [description, setDescription] = useState('');

  const isEmptyDescription = (text) => {
    return !(!text || text.trim().length === 0)
  }

  const truncateDescription = (description) => {
    if (description.length > 15) {
      return description.slice(0, 15) + '...';
    } else {
      return description;
    }
  }

  const handlePress = () => {
    // axios 호출
    axios.post('http://15.165.155.62:8080/v1/push', {
      title: truncateDescription(description),
      description: description,
      sender: 'uuid'
    })
      .then(response => {
        // 성공적으로 요청을 처리한 경우
        console.log(response.data);
      })
      .catch(error => {
        // 요청 처리 중에 오류가 발생한 경우
        console.error(error);
      });
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const CustomCheckBox = ({ checkState, setCheckState }) => {
    return (Platform.OS === 'ios' ?
      <CheckBox
        onCheckColor={'#000000'}
        tintColor={'#000000'}
        onTintColor={'#000000'}
        boxType={'square'}
        lineWidth={1}
        disabled={false}
        value={checkState}
        onValueChange={(newValue) => setCheckState(newValue)}
        style={{ width: 14, height: 14, marginRight: 7 }}
      />
      :
      <CheckBox
        style={{ transform: [{ scale: 0.8 }] }}
        tintColors={{ true: 'black', false: 'black' }}
        disabled={false}
        value={checkState}
        onValueChange={(newValue) => setCheckState(newValue)}
      />)
  }


  return (
    <View
      style={{ flex: 1, }}>
      <View style={{ backgroundColor: '#FBF9F4', flex: 1, paddingTop: 70, alignItems: 'flex-start', paddingRight: 30, paddingLeft: 30 }}>
        <Text
          style={{
            paddingLeft: 5,
            paddingRight: 5,
            paddingBottom: 14,
            width: width - 40,
            fontSize: Platform.select({ ios: 14, android: 13 }),
            marginTop: 7,
            marginBottom: 7,
            paddingTop: 24,
            textAlignVertical: 'center',
            // borderBottomColor: '#2A2322',
            // borderBottomWidth: 0.5,
            lineHeight: 25
          }}
        >
          {data.description}
        </Text>
        <ScrollView>
          <View style={{ width: width - 60 }}>
            <View style={{ flexDirection: 'row', height: 20, top: 3 }}>
              <View style={{ backgroundColor: '#2A2322', borderRadius: 50, width: 15, height: 15, left: 0 }} />
              <Text style={{ marginLeft: 10, bottom: Platform.select({ ios: 0, android: 3 }), fontSize: Platform.select({ ios: 14, android: 13 }), fontWeight: 'bold' }}>첫 번째 익명의 메시지</Text>
            </View>
            <View style={{ flexDirection: 'row', width: width - 80, minHeight: 100 }}>
              <View style={{ borderLeftColor: 'rgba(42, 35, 34, .4)', borderLeftWidth: 0.5, left: 7, bottom: 3, flex: 1 }}>
                <Text style={{ fontSize: Platform.select({ ios: 14, android: 13 }), marginTop: 15, marginBottom: 15, marginLeft: 25, flexWrap: 'wrap' }}>안녕안녕안녕안녕안녕안녕안녕안녕안녕안녕안녕안녕안녕안녕안녕안녕안녕</Text>
              </View>
            </View>
          </View>
          <View style={{ bottom: 6 }}>
            <View style={{ flexDirection: 'row', height: 20, top: 3 }}>
              <View style={{ backgroundColor: '#2A2322', borderRadius: 50, width: 15, height: 15, left: 0 }} />
              <Text style={{ marginLeft: 10, bottom: Platform.select({ ios: 0, android: 3 }), fontSize: Platform.select({ ios: 14, android: 13 }), fontWeight: 'bold' }}>두 번째 익명의 메시지</Text>
            </View>
            <View style={{ flexDirection: 'row', width: width - 80, minHeight: 100 }}>
              <View style={{ borderLeftColor: 'rgba(42, 35, 34, .4)', borderLeftWidth: 0.5, left: 7, bottom: 3, flex: 1 }}>
                <Text style={{ fontSize: Platform.select({ ios: 14, android: 13 }), marginTop: 15, marginBottom: 15, marginLeft: 25, flexWrap: 'wrap' }}>위의 코드에서 Text 컴포넌트에 flexWrap: 'wrap' 속성을 추가하여 텍스트가 넘칠 경우 자동으로 다음 줄로 넘어가도록 설정하였습니다</Text>
              </View>
            </View>
          </View>
          <View style={{ bottom: 12 }}>
            <View style={{ flexDirection: 'row', height: 20, top: 3 }}>
              <View style={{ backgroundColor: '#2A2322', borderRadius: 50, width: 15, height: 15, left: 0 }} />
              <Text style={{ marginLeft: 10, bottom: Platform.select({ ios: 0, android: 3 }), fontSize: Platform.select({ ios: 14, android: 13 }), fontWeight: 'bold' }}>세 번째 익명의 메시지</Text>
            </View>
            <View style={{ flexDirection: 'row', width: width - 80, minHeight: 100 }}>
              <View style={{ borderLeftColor: 'rgba(42, 35, 34, .4)', borderLeftWidth: 0.5, left: 7, bottom: 3, flex: 1 }}>
                <Text style={{ fontSize: Platform.select({ ios: 14, android: 13 }), marginTop: 15, marginBottom: 15, marginLeft: 25, flexWrap: 'wrap' }}>XML 매퍼 작성: MyBatis XML 매퍼 파일에서 SQL 쿼리와 매핑 정보를 작성합니다. UsersMapper 인터페이스와 동일한 이름의 XML 파일을 작성해야 합니다. 예시를 보여드리겠습니다:Service 클래스에서 MyBatis 사용: 변경된 MyBatis 구성을 사용하여 Service 클래스를 수정합니다. 아래는 FCMNotificationService 클래스의 예시입니다:</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
      <Pressable
        onPressIn={() => {
          taptic()
        }}
        onPressOut={() => {
          taptic()
          navigation.navigate('StackModal', {
            screen: 'PushScreen',
            animation: 'fade'
          });
        }} style={{ borderRadius: 50, width: 40, height: 40, position: 'absolute', bottom: 40, right: 40, backgroundColor: '#000000' }}></Pressable>
    </View >
  );
}

export default DetailMessage;
