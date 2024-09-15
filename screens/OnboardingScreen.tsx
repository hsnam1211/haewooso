import * as Animatable from "react-native-animatable";

import {
  Animated,
  Dimensions,
  Image,
  InteractionManager,
  Linking,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  Vibration,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useIsFocused, useNavigation } from "@react-navigation/native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import SvgIcon from "../src/components/SvgIcon";
import styled from "styled-components";
import { taptic } from "../src/util/taptic";
import { trigger } from "react-native-haptic-feedback";
import { useRecoilState } from "recoil";

const calcDelay = index => {
  const offset = index - 1;
  return 1000 + 4500 * offset;
};

const OnboardingScreen = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation<any>();
  const [skip, setSkip] = useState<boolean>(true);

  useEffect(() => {
    // 온보딩 화면이 표시될 때마다 헤더 숨김 처리
    navigation.setOptions({ headerShown: false });
    // setTimeout(() => {
    // navigation.navigate('Tabs', {
    //   screen: 'Main',
    //   animation: 'fade'
    // });
    // }, 4000)
  }, [isFocused, navigation]);

  const AnimationRef1 = useRef(null);
  const AnimationRef2 = useRef(null);
  const AnimationRef3 = useRef(null);
  const AnimationRef4 = useRef(null);
  const AnimationRef5 = useRef(null);

  const [duration, setDuration] = useState(2000);
  const [isPulse, setIsPulse] = useState(false);

  const onAnimationEnd = AnimationRef => {
    setDuration(500);
    if (AnimationRef) {
      setTimeout(() => {
        AnimationRef.current?.fadeOut();
      }, 1500);
    }
  };

  const onAnimationHandle = () => {
    setIsPulse(true);
  };

  return (
    <>
      <View
        style={{
          backgroundColor: "#FBF9F4",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingRight: 30,
          paddingLeft: 30,
        }}
      >
        <Animatable.View
          ref={AnimationRef1}
          animation="fadeInUp"
          iterationCount={1}
          duration={duration}
          onAnimationEnd={() => onAnimationEnd(AnimationRef1)}
          onAnimationBegin={() => setDuration(2000)}
          iterationDelay={calcDelay(1)}
          style={{ position: "absolute" }}
          useNativeDriver={true}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: Platform.select({ ios: 14, android: 12 }),
            }}
          >
            해우소(解憂所) : ‘근심을 해결하는 장소' 라는 뜻의 사찰에서 화장실을
            이르는 말.
          </Text>
        </Animatable.View>
        <Animatable.Text
          ref={AnimationRef2}
          animation="fadeInUp"
          iterationCount={1}
          duration={duration}
          onAnimationEnd={() => onAnimationEnd(AnimationRef2)}
          onAnimationBegin={() => setDuration(2000)}
          iterationDelay={calcDelay(2)}
          style={{
            position: "absolute",
            fontSize: Platform.select({ ios: 14, android: 12 }),
          }}
          useNativeDriver={true}
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
          style={{
            position: "absolute",
            fontSize: Platform.select({ ios: 14, android: 12 }),
          }}
          useNativeDriver={true}
        >
          익명의 누군가에게 전달해보는 건 어떨까요?
        </Animatable.Text>
        {/* <Animatable.Text
        ref={AnimationRef4}
        animation="fadeInUp"
        iterationCount={1}
        duration={duration}
        onAnimationEnd={() => onAnimationEnd(AnimationRef4)}
        onAnimationBegin={() => setDuration(2000)}
        iterationDelay={calcDelay(4)}
        style={{ position: 'absolute', fontSize: Platform.select({ ios: 14, android: 12 }) }}
        useNativeDriver={true}
      >
        그리고 익명의 누군가에게 근심에 대한 답장도 받아보세요.
      </Animatable.Text> */}
        {!isPulse ? (
          <Animatable.View
            ref={AnimationRef5}
            animation={"fadeIn"}
            iterationCount={1}
            duration={500}
            onAnimationEnd={() => {
              onAnimationHandle();
              setSkip(false);
            }}
            iterationDelay={calcDelay(4)}
            style={{ position: "absolute" }}
            useNativeDriver={true}
          >
            <SvgIcon
              name="haewoosoLogo"
              fill="#000000"
              stroke="#797979"
              strokeWidth="1.5"
              size={40}
            />
            <Text
              style={{
                textAlign: "center",
                marginTop: 10,
                fontSize: Platform.select({ ios: 14, android: 12 }),
              }}
            >
              touch!
            </Text>
          </Animatable.View>
        ) : (
          <Animatable.View
            animation="pulse"
            easing="ease-out"
            iterationCount="infinite"
            useNativeDriver={true}
          >
            <Pressable
              onPressIn={() => {
                taptic();
              }}
              onPressOut={() => {
                taptic();
                navigation.navigate("Tabs", {
                  screen: "Main",
                  animation: "fade",
                });
              }}
            >
              <SvgIcon
                name="haewoosoLogo"
                fill="#000000"
                stroke="#797979"
                strokeWidth="1.5"
                size={40}
              />
              <Text style={{ textAlign: "center", marginTop: 10 }}>touch!</Text>
            </Pressable>
          </Animatable.View>
        )}
      </View>
      {skip && (
        <Pressable
          onPressIn={() => {
            taptic();
          }}
          onPressOut={() => {
            taptic();
            navigation.navigate("Tabs", {
              screen: "Main",
              animation: "fade",
            });
          }}
          style={{
            position: "absolute",
            bottom: 50,
            right: 50,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "gray" }}>skip! </Text>
          <Text style={{ color: "gray", fontSize: 11, fontWeight: "800" }}>
            {"〉〉"}
          </Text>
        </Pressable>
      )}
    </>
  );
};
export default OnboardingScreen;
