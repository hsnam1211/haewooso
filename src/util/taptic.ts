import {
  Platform,
} from 'react-native';
import { trigger } from "react-native-haptic-feedback";

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: true,
};
export const taptic = () => {
  trigger(Platform.OS === 'ios' ?"rigid": "keyboardTap", options);
} 