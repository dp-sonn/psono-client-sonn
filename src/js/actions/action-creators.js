import {
    SET_KNOWN_HOSTS,
    SET_AUTO_APPROVE_PLAINTEXT_PASSWORD,
    SET_USER_USERNAME,
    SET_USER_INFO_1,
    SET_USER_INFO_2,
    SET_USER_INFO_3,
    SET_HAS_TWO_FACTOR,
    LOGOUT,
    SET_SERVER_URL,
    SET_SERVER_STATUS,
    SET_SERVER_INFO,
    SET_CLIENT_URL,
    ENABLE_OFFLINE_MODE,
    DISABLE_OFFLINE_MODE,
    SET_OFFLINE_CACHE_ENCRYPTION_INFO,
    SET_NOTIFICATION_ON_COPY,
    SET_DISABLE_BROWSER_PM,
    SETTINGS_DATASTORE_LOADED,
    SET_PASSWORD_CONFIG,
    SET_GPG_CONFIG,
    SET_ADMIN_CLIENT_CONFIG,
    NOTIFICATION_SEND,
    NOTIFICATION_SET,
    SET_REMOTE_CONFIG_JSON,
    SET_FINGERPRINT,
    SET_EMAIL,
    SET_USER_DATASTORE_OVERVIEW,
    SET_HIDE_DOWNLOAD_BANNER,
    SET_LAST_POPUP_SEARCH,
    SET_REQUESTS_IN_PROGRESS,
} from "./action-types";

import datastoreSettingService from "../services/datastore-setting";
import store from "../services/store";

function setUserUsername(username) {
    return (dispatch) => {
        dispatch({
            type: SET_USER_USERNAME,
            username,
        });
    };
}

function setUserInfo1(rememberMe, trustDevice, authentication) {
    return (dispatch) => {
        dispatch({
            type: SET_USER_INFO_1,
            rememberMe,
            trustDevice,
            authentication,
        });
    };
}
function setUserInfo2(userPrivateKey, userPublicKey, sessionSecretKey, token, userSauce, authentication) {
    return (dispatch) => {
        dispatch({
            type: SET_USER_INFO_2,
            userPrivateKey: userPrivateKey,
            userPublicKey: userPublicKey,
            sessionSecretKey: sessionSecretKey,
            token,
            userSauce: userSauce,
            authentication: authentication,
        });
    };
}
function setUserInfo3(userId, userEmail, userSecretKey) {
    return (dispatch) => {
        dispatch({
            type: SET_USER_INFO_3,
            userId: userId,
            userEmail,
            userSecretKey,
        });
    };
}
function setHasTwoFactor(hasTwoFactor) {
    return (dispatch) => {
        dispatch({
            type: SET_HAS_TWO_FACTOR,
            hasTwoFactor: hasTwoFactor,
        });
    };
}

function setEmail(userEmail) {
    return (dispatch) => {
        dispatch({
            type: SET_EMAIL,
            userEmail,
        });
    };
}

function setUserDatastoreOverview(userDatastoreOverview) {
    return (dispatch) => {
        dispatch({
            type: SET_USER_DATASTORE_OVERVIEW,
            userDatastoreOverview,
        });
    };
}

function logout(rememberMe) {
    return (dispatch) => {
        dispatch({
            type: LOGOUT,
            rememberMe,
        });
    };
}

function setServerInfo(info, verifyKey) {
    return (dispatch) => {
        dispatch({
            type: SET_SERVER_INFO,
            info,
            verifyKey,
        });
    };
}

function setServerUrl(url) {
    return (dispatch) => {
        dispatch({
            type: SET_SERVER_URL,
            url: url,
        });
    };
}

function setServerStatus(status) {
    return (dispatch) => {
        dispatch({
            type: SET_SERVER_STATUS,
            status: status,
        });
    };
}

function setClientUrl(url) {
    return (dispatch) => {
        dispatch({
            type: SET_CLIENT_URL,
            url: url,
        });
    };
}
function enableOfflineMode() {
    return (dispatch) => {
        dispatch({
            type: ENABLE_OFFLINE_MODE,
        });
    };
}
function disableOfflineMode() {
    return (dispatch) => {
        dispatch({
            type: DISABLE_OFFLINE_MODE,
        });
    };
}
function setOfflineCacheEncryptionInfo(offlineCacheEncryptionKey, offlineCacheEncryptionSalt) {
    return (dispatch) => {
        dispatch({
            type: SET_OFFLINE_CACHE_ENCRYPTION_INFO,
            offlineCacheEncryptionKey,
            offlineCacheEncryptionSalt,
        });
    };
}
function setNotificationOnCopy(notificationOnCopy) {
    return (dispatch) => {
        dispatch({
            type: SET_NOTIFICATION_ON_COPY,
            notificationOnCopy,
        });
    };
}
function setDisableBrowserPm(disableBrowserPm) {
    return (dispatch) => {
        dispatch({
            type: SET_DISABLE_BROWSER_PM,
            disableBrowserPm,
        });
    };
}
function setHideDownloadBanner(hideDownloadBanner) {
    return (dispatch) => {
        dispatch({
            type: SET_HIDE_DOWNLOAD_BANNER,
            hideDownloadBanner,
        });
    };
}
function setLastPopupSearch(lastPopupSearch) {
    return (dispatch) => {
        dispatch({
            type: SET_LAST_POPUP_SEARCH,
            lastPopupSearch,
        });
    };
}
function settingsDatastoreLoaded(data) {
    return (dispatch) => {
        dispatch({
            type: SETTINGS_DATASTORE_LOADED,
            data,
        });
    };
}
function setPasswordConfig(
    passwordLength,
    passwordLettersUppercase,
    passwordLettersLowercase,
    passwordNumbers,
    passwordSpecialChars
) {
    datastoreSettingService.saveSettingsDatastore([
        { key: "setting_password_length", value: passwordLength },
        { key: "setting_password_letters_uppercase", value: passwordLettersUppercase },
        { key: "setting_password_letters_lowercase", value: passwordLettersLowercase },
        { key: "setting_password_numbers", value: passwordNumbers },
        { key: "setting_password_special_chars", value: passwordSpecialChars },
        { key: "gpg_default_key", value: store.getState().settingsDatastore.gpgDefaultKey },
        { key: "gpg_hkp_key_server", value: store.getState().settingsDatastore.gpgHkpKeyServer },
        { key: "gpg_hkp_search", value: store.getState().settingsDatastore.gpgHkpSearch },
    ]);
    return (dispatch) => {
        dispatch({
            type: SET_PASSWORD_CONFIG,
            passwordLength,
            passwordLettersUppercase,
            passwordLettersLowercase,
            passwordNumbers,
            passwordSpecialChars,
        });
    };
}
function setGpgConfig(gpgDefaultKey, gpgHkpKeyServer, gpgHkpSearch) {
    datastoreSettingService.saveSettingsDatastore([
        { key: "setting_password_length", value: store.getState().settingsDatastore.passwordLength },
        {
            key: "setting_password_letters_uppercase",
            value: store.getState().settingsDatastore.passwordLettersUppercase,
        },
        {
            key: "setting_password_letters_lowercase",
            value: store.getState().settingsDatastore.passwordLettersLowercase,
        },
        { key: "setting_password_numbers", value: store.getState().settingsDatastore.passwordNumbers },
        { key: "setting_password_special_chars", value: store.getState().settingsDatastore.passwordSpecialChars },
        { key: "gpg_default_key", value: gpgDefaultKey },
        { key: "gpg_hkp_key_server", value: gpgHkpKeyServer },
        { key: "gpg_hkp_search", value: gpgHkpSearch },
    ]);
    return (dispatch) => {
        dispatch({
            type: SET_GPG_CONFIG,
            gpgDefaultKey,
            gpgHkpKeyServer,
            gpgHkpSearch,
        });
    };
}

function setAdminClientConfig(config) {
    return (dispatch) => {
        dispatch({
            type: SET_ADMIN_CLIENT_CONFIG,
            config: config,
        });
    };
}

function setKnownHosts(knownHosts) {
    return (dispatch) => {
        dispatch({
            type: SET_KNOWN_HOSTS,
            knownHosts: knownHosts,
        });
    };
}

function setAutoApproveLdap(autoApproveLdap) {
    return (dispatch) => {
        dispatch({
            type: SET_AUTO_APPROVE_PLAINTEXT_PASSWORD,
            autoApproveLdap: autoApproveLdap,
        });
    };
}

function setFingerprint(fingerprint) {
    return (dispatch) => {
        dispatch({
            type: SET_FINGERPRINT,
            fingerprint,
        });
    };
}

function setRemoteConfigJson(remoteConfigJson) {
    return (dispatch) => {
        dispatch({
            type: SET_REMOTE_CONFIG_JSON,
            remoteConfigJson: remoteConfigJson,
        });
    };
}

function sendNotification(message, messageType) {
    return (dispatch) => {
        dispatch({
            type: NOTIFICATION_SEND,
            message: message,
            messageType: messageType,
        });
    };
}

function setNotifications(messages) {
    return (dispatch) => {
        dispatch({
            type: NOTIFICATION_SET,
            messages: messages,
        });
    };
}

function setRequestsInProgress(requestCounterOpen, requestCounterClosed) {
    return (dispatch) => {
        dispatch({
            type: SET_REQUESTS_IN_PROGRESS,
            requestCounterOpen: requestCounterOpen,
            requestCounterClosed: requestCounterClosed,
        });
    };
}

const actionCreators = {
    setUserUsername,
    setUserInfo1,
    setUserInfo2,
    setUserInfo3,
    setHasTwoFactor,
    setEmail,
    setUserDatastoreOverview,
    logout,
    setServerInfo,
    setServerUrl,
    setServerStatus,
    setClientUrl,
    disableOfflineMode,
    enableOfflineMode,
    setOfflineCacheEncryptionInfo,
    setNotificationOnCopy,
    setDisableBrowserPm,
    setHideDownloadBanner,
    setLastPopupSearch,
    setPasswordConfig,
    setGpgConfig,
    settingsDatastoreLoaded,
    setAdminClientConfig,
    setKnownHosts,
    setAutoApproveLdap,
    setFingerprint,
    setRemoteConfigJson,
    sendNotification,
    setNotifications,
    setRequestsInProgress,
};

export default actionCreators;
