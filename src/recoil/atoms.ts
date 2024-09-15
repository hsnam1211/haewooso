import { atom, useRecoilState } from 'recoil';

export const dataLimitState = atom({
    key: 'dataLimit', // unique ID (with respect to other atoms/selectors)
    default: 6, // default value (aka initial value)
});

export const isLoginState = atom({
    key: 'login', // unique ID (with respect to other atoms/selectors)
    default: false, // default value (aka initial value)
});

export const getAddressState = atom({
    key: 'getAddress', // unique ID (with respect to other atoms/selectors)
    default: {
        zone_code: '',
        default_address: '',
    }, // default value (aka initial value)
});

export const isStylemateState = atom({
    key: 'channelConnected', // unique ID (with respect to other atoms/selectors)
    default: false, // default value (aka initial value)
});

export const userIdValue = atom({
    key: 'userId', // unique ID (with respect to other atoms/selectors)
    default: '', // default value (aka initial value)
});

export const userInfoState = atom({
    key: 'userInfo', // unique ID (with respect to other atoms/selectors)
    default: {}, // default value (aka initial value)
});

export const deliveryState = atom({
    key: 'delivery', // unique ID (with respect to other atoms/selectors)
    default: {}, // default value (aka initial value)
});

export const likeBtnState = atom({
    key: 'likeBtn', // unique ID (with respect to other atoms/selectors)
    default: {}, // default value (aka initial value)
});

export const likeProductState = atom({
    key: 'likeProductState', // unique ID (with respect to other atoms/selectors)
    default: {}, // default value (aka initial value)
});

export const likeBrandState = atom({
    key: 'likeBrandState', // unique ID (with respect to other atoms/selectors)
    default: {}, // default value (aka initial value)
});

export const alarmState = atom({
    key: 'alarmState', // unique ID (with respect to other atoms/selectors)
    default: false, // default value (aka initial value)
});

export const gaSetUserState = atom({
    key: 'gaSetUserState', // unique ID (with respect to other atoms/selectors)
    default: true, // default value (aka initial value)
});

export const getMessageState = atom({
    key: 'getMessageState', // unique ID (with respect to other atoms/selectors)
    default: false, // default value (aka initial value)
});

export const sendMessageCount = atom({
    key: 'sendMessageCount', // unique ID (with respect to other atoms/selectors)
    default: 5, // default value (aka initial value)
});

export const isPushState = atom({
    key: 'isPushState', // unique ID (with respect to other atoms/selectors)
    default: undefined, // default value (aka initial value)
});