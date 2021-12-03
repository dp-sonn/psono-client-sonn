import { LOGOUT, SET_CLIENT_URL, ENABLE_OFFLINE_MODE, DISABLE_OFFLINE_MODE, SET_NOTIFICATION_ON_COPY, SET_PASSWORD_CONFIG } from "../actions/action-types";

const default_url = "";

function client(
    state = {
        url: default_url,
        offlineMode: false,
        notificationOnCopy: true,
    },
    action
) {
    switch (action.type) {
        case LOGOUT:
            return Object.assign({}, state, {
                url: default_url.toLowerCase(),
            });
        case SET_CLIENT_URL:
            return Object.assign({}, state, {
                url: action.url.toLowerCase(),
            });
        case ENABLE_OFFLINE_MODE:
            return Object.assign({}, state, {
                offlineMode: true,
            });
        case DISABLE_OFFLINE_MODE:
            return Object.assign({}, state, {
                offlineMode: false,
            });
        case SET_NOTIFICATION_ON_COPY:
            return Object.assign({}, state, {
                notificationOnCopy: action.notificationOnCopy,
            });
        default:
            return state;
    }
}

export default client;
