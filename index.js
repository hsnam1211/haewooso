import { registerRootComponent } from 'expo';

import App from './App';
import messaging from '@react-native-firebase/messaging';
import { Storage } from './src/util/storage'

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message background!', remoteMessage);
  console.log('Message background!', remoteMessage?.notification?.title);
  console.log('Message background!', remoteMessage?.notification?.body);

  // const notificationString = JSON.stringify(remoteMessage);

  const notificationString = remoteMessage;
  await Storage.setItem('message', notificationString);
  // await Storage.setItem('message', notificationString);
});
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
