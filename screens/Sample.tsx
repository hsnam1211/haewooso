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
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQueryClient } from 'react-query';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import * as Animatable from "react-native-animatable";
import SvgIcon from '../src/components/SvgIcon';

function Sample() {
  const AnimationRef1 = useRef(null);
  const AnimationRef2 = useRef(null);
  const AnimationRef3 = useRef(null);
  const AnimationRef4 = useRef(null);
  const AnimationRef5 = useRef(null);

  const [duration, setDuration] = useState(2000)
  const [easing, setEasing] = useState('ease')
  const [animation, setAnimation] = useState('fadeIn') 

  const onAnimationEnd = (AnimationRef) => {
    setDuration(500)
    if(AnimationRef) {
      setTimeout(() => {
        AnimationRef.current?.fadeOut();
      }, 1500)
    }
  }

  const onAnimationHandle = (AnimationRef) => {
    // setDuration(500)
    // setEasing('ease-out')
    setAnimation('pulse') 
  }

  const calcDelay = (index) => {
    const offset = index - 1
    return 1000 + 4500 * offset
  }
  
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 75, paddingRight: 30, paddingLeft: 30}}>
      <Animatable.Text 
        ref={AnimationRef1}
        animation="fadeInUp"
        iterationCount={1}
        duration={duration}
        onAnimationEnd={() => onAnimationEnd(AnimationRef1)}
        onAnimationBegin={() => setDuration(2000)}
        iterationDelay={calcDelay(1)}
        style={{position: 'absolute', textAlign: 'center'}}
      >
        해우소(解憂所) : ‘근심을 해결하는 장소' 라는 뜻의 사찰에서 화장실을 이르는 말.
      </Animatable.Text>
      <Animatable.Text 
        ref={AnimationRef2}
        animation="fadeInUp"
        iterationCount={1}
        duration={duration}
        onAnimationEnd={() => onAnimationEnd(AnimationRef2)}
        onAnimationBegin={() => setDuration(2000)}
        iterationDelay={calcDelay(2)}
        style={{position: 'absolute'}}
      >
        오늘 하루 당신에게 쌓인 근심을
      </Animatable.Text>
      <Animatable.Text 
        ref={AnimationRef3}
        animation="fadeInUp"
        iterationCount={1}
        duration={duration}
        onAnimationEnd={() => onAnimationEnd(AnimationRef3)}
        onAnimationBegin={() => setDuration(2000)}
        iterationDelay={calcDelay(3)}
        style={{position: 'absolute'}}
      >
        익명의 누군가에게 전달해보는 건 어떨까요?
      </Animatable.Text>      
      <Animatable.Text 
        ref={AnimationRef4}
        animation="fadeInUp"
        iterationCount={1}
        duration={duration}
        onAnimationEnd={() => onAnimationEnd(AnimationRef4)}
        onAnimationBegin={() => setDuration(2000)}
        iterationDelay={calcDelay(4)}
        style={{position: 'absolute'}}
      >
        그리고 익명의 누군가에게 근심에 대한 답장도 받아보세요.
      </Animatable.Text>
      <Animatable.View 
        ref={AnimationRef5}
        animation={animation}
        iterationCount={'infinite'}
        duration={duration}
        onAnimationEnd={() => onAnimationHandle(AnimationRef5)}
        onAnimationBegin={() => setDuration(2000)}
        iterationDelay={calcDelay(5)}
        style={{position: 'absolute', }}
      >
        <SvgIcon
          name='haewoosoLogo'
          stroke='#797979'
          strokeWidth='1.5'
          size={40}
        />
      </Animatable.View>
      
    </View>
  );
}

export default Sample;
