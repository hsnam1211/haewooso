import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

const OnboardingScreen = ({ navigation }) => {
  const isFocused = useIsFocused();

  useEffect(() => {
    // 온보딩 화면이 표시될 때마다 헤더 숨김 처리
    navigation.setOptions({ headerShown: false });
    setTimeout(() => {
      navigation.navigate('Tabs', {
        screen: 'Main',
        animation: 'fade'
      });
    }, 4000)
  }, [isFocused, navigation]);

  return (
    <View style={styles.container}>
      <Text>Onboarding Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});

export default OnboardingScreen;
