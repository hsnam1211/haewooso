import { registerRootComponent } from 'expo';

import App from './App';
import messaging from '@react-native-firebase/messaging';
import { Storage } from './src/util/storage'

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message background!', remoteMessage);

  const notificationString = remoteMessage;
  await Storage.setItem('message', notificationString);
});

registerRootComponent(App);
