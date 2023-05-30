import AsyncStorage from '@react-native-async-storage/async-storage';
// import EncryptedStorage from 'react-native-encrypted-storage';

export const Storage = {
    getItem: async (key: string) => {
        // console.log('Async Storage getItem: ' + key);
        try {
            let result = await AsyncStorage.getItem(key);
            return result ? JSON.parse(result) : null;
        } catch (e) {
            throw e;
        }
    },
    setItem: async (key: string, value: string | boolean) => {
        // console.log('Async Storage setItem: ' + key);
        try {
            const item = JSON.stringify(value);
            return await AsyncStorage.setItem(key, item);
        } catch (e) {
            throw e;
        }
    },
    removeItem: async (key: string) => {
        // console.log('Async Storage removeItem: ' + key);
        try {
            await AsyncStorage.removeItem(key);
        } catch (e) {
            throw e;
        }
    },
};

// export const EncStorage = {
//   getItem: async (key: string) => {
//     // console.log('Encrypted Storage getItem: ' + key);
//     try {
//       let result = await EncryptedStorage.getItem(key);
//       return result ? JSON.parse(result) : null;
//     } catch (e) {
//       throw e;
//     }
//   },
//   setItem: async (key: string, value: string | boolean) => {
//     // console.log('Encrypted Storage setItem: ' + key);
//     try {
//       const item = JSON.stringify(value);
//       return await EncryptedStorage.setItem(key, item);
//     } catch (e) {
//       throw e;
//     }
//   },
//   removeItem: async (key: string) => {
//     // console.log('Encrypted Storage removeItem: ' + key);
//     try {
//       await EncryptedStorage.removeItem(key);
//     } catch (e) {
//       throw e;
//     }
//   },
// };