import {
    SETTINGS_DATASTORE_LOADED,
    SET_PASSWORD_CONFIG,
    SET_SHOWN_ENTRIES_CONFIG,
    SET_GPG_CONFIG,
    SET_GPG_DEFAULT_KEY,
} from "../actions/action-types";
import store from "../services/store";

function settingsDatastore(
    state = {
        passwordLength: 16,
        passwordLettersUppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        passwordLettersLowercase: "abcdefghijklmnopqrstuvwxyz",
        passwordNumbers: "0123456789",
        passwordSpecialChars: ",.-;:_#'+*~!\"§$%&/@()=?{[]}\\",
        gpgDefaultKey: null,
        gpgHkpKeyServer: "https://keyserver.ubuntu.com",
        gpgHkpSearch: true,
        showWebsitePassword: true,
        showApplicationPassword: true,
        showTOTPAuthenticator: true,
        showNote: true,
        showEnvironmentVariables: false,
        showSSHKey: false,
        showGPGKey: false,
        showCreditCard: true,
        showBookmark: true,
        showFile: true,
    },
    action
) {
    switch (action.type) {
        case SETTINGS_DATASTORE_LOADED:
            return Object.assign({}, state, {
                passwordLength: action.data.hasOwnProperty("setting_password_length")
                    ? parseInt(action.data.setting_password_length)
                    : 16,
                passwordLettersUppercase: action.data.hasOwnProperty("setting_password_letters_uppercase")
                    ? action.data.setting_password_letters_uppercase
                    : "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                passwordLettersLowercase: action.data.hasOwnProperty("setting_password_letters_lowercase")
                    ? action.data.setting_password_letters_lowercase
                    : "abcdefghijklmnopqrstuvwxyz",
                passwordNumbers: action.data.hasOwnProperty("setting_password_numbers")
                    ? action.data.setting_password_numbers
                    : "0123456789",
                passwordSpecialChars: action.data.hasOwnProperty("setting_password_special_chars")
                    ? action.data.setting_password_special_chars
                    : ",.-;:_#'+*~!\"§$%&/@()=?{[]}\\",
                gpgDefaultKey: action.data.hasOwnProperty("gpg_default_key") ? action.data.gpg_default_key : null,
                gpgHkpKeyServer: action.data.hasOwnProperty("gpg_hkp_key_server")
                    ? action.data.gpg_hkp_key_server
                    : "https://keyserver.ubuntu.com",
                gpgHkpSearch: action.data.hasOwnProperty("gpg_hkp_search") ? action.data.gpg_hkp_search : true,
                showWebsitePassword: action.data.hasOwnProperty("setting_show_website_password") ? action.data.setting_show_website_password : true,
                showApplicationPassword: action.data.hasOwnProperty("setting_show_application_password") ? action.data.setting_show_application_password : true,
                showTOTPAuthenticator: action.data.hasOwnProperty("setting_show_totp") ? action.data.setting_show_totp : true,
                showNote: action.data.hasOwnProperty("setting_show_note") ? action.data.setting_show_note : true,
                showEnvironmentVariables: action.data.hasOwnProperty("setting_show_environment_variables") ? action.data.setting_show_environment_variables : false,
                showSSHKey: action.data.hasOwnProperty("setting_show_ssh_own_key") ? action.data.setting_show_ssh_own_key : false,
                howGPGKey: action.data.hasOwnProperty("setting_show_mail_gpg_own_key") ? action.data.setting_show_mail_gpg_own_key : false,
                showCreditCard: action.data.hasOwnProperty("setting_show_credit_card") ? action.data.setting_show_credit_card : true,
                showBookmark: action.data.hasOwnProperty("setting_show_bookmark") ? action.data.setting_show_bookmark : true,
                showFile: action.data.hasOwnProperty("setting_show_file") ? action.data.setting_show_file : true,
            });
        case SET_PASSWORD_CONFIG:
            return Object.assign({}, state, {
                passwordLength: action.passwordLength,
                passwordLettersUppercase: action.passwordLettersUppercase,
                passwordLettersLowercase: action.passwordLettersLowercase,
                passwordNumbers: action.passwordNumbers,
                passwordSpecialChars: action.passwordSpecialChars,
            });
        case SET_SHOWN_ENTRIES_CONFIG:
            return Object.assign({}, state, {
                showWebsitePassword: action.showWebsitePassword,
                showApplicationPassword: action.showApplicationPassword,
                showTOTPAuthenticator: action.showTOTPAuthenticator,
                showNote: action.showNote,
                showEnvironmentVariables: action.showEnvironmentVariables,
                showSSHKey: action.showSSHKey,
                showGPGKey: action.showGPGKey,
                showCreditCard: action.showCreditCard,
                showBookmark: action.showBookmark,
                showFile: action.showFile,
            });
        case SET_GPG_CONFIG:
            return Object.assign({}, state, {
                gpgDefaultKey: action.gpgDefaultKey,
                gpgHkpKeyServer: action.gpgHkpKeyServer,
                gpgHkpSearch: action.gpgHkpSearch,
            });
        case SET_GPG_DEFAULT_KEY:
            return Object.assign({}, state, {
                gpgDefaultKey: action.gpgDefaultKey,
            });
        default:
            return state;
    }
}

export default settingsDatastore;
