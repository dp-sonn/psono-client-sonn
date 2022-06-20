/**
 * Service to handle all secret related tasks
 */

import i18n from "../i18n";
import cryptoLibrary from "../services/crypto-library";
import apiClient from "../services/api-client";
import browserClient from "../services/browser-client";
import offlineCache from "../services/offline-cache";
import store from "./store";
import storage from "./storage";
import notification from "./notification";

/**
 * Encrypts the content and creates a new secret out of it.
 *
 * @param {object} content The content of the new secret
 * @param {uuid} linkId the local id of the share in the data structure
 * @param {uuid|undefined} [parentDatastoreId] (optional) The id of the parent datastore, may be left empty if the share resides in a share
 * @param {uuid|undefined} [parentShareId] (optional) The id of the parent share, may be left empty if the share resides in the datastore
 * @param {string} callbackUrl The callback ULR
 * @param {string} callbackUser The callback user
 * @param {string} callbackPass The callback password
 *
 * @returns {Promise} Returns a promise with the new secret_id
 */
function createSecret(content, linkId, parentDatastoreId, parentShareId, callbackUrl, callbackUser, callbackPass) {
    const token = store.getState().user.token;
    const sessionSecretKey = store.getState().user.sessionSecretKey;
    const secretKey = cryptoLibrary.generateSecretKey();

    const jsonContent = JSON.stringify(content);

    const c = cryptoLibrary.encryptData(jsonContent, secretKey);

    const onError = function (result) {
        // pass
    };

    const onSuccess = function (response) {
        browserClient.emit("secrets-changed", content);
        return { secret_id: response.data.secret_id, secret_key: secretKey };
    };

    return apiClient
        .createSecret(
            token,
            sessionSecretKey,
            c.text,
            c.nonce,
            linkId,
            parentDatastoreId,
            parentShareId,
            callbackUrl,
            callbackUser,
            callbackPass
        )
        .then(onSuccess, onError);
}

/**
 * Reads a secret and decrypts it. Returns the decrypted object
 *
 * @param {uuid} secretId The secret id one wants to fetch
 * @param {string} secretKey The secret key to decrypt the content
 *
 * @returns {Promise} Returns a promise withe decrypted content of the secret
 */
function readSecret(secretId, secretKey) {
    const token = store.getState().user.token;
    const sessionSecretKey = store.getState().user.sessionSecretKey;
    const onError = function (result) {
        return Promise.reject(result);
    };

    const onSuccess = function (content) {
        const secret = JSON.parse(cryptoLibrary.decryptData(content.data.data, content.data.data_nonce, secretKey));
        secret["create_date"] = content.data["create_date"];
        secret["write_date"] = content.data["write_date"];
        secret["callback_url"] = content.data["callback_url"];
        secret["callback_user"] = content.data["callback_user"];
        secret["callback_pass"] = content.data["callback_pass"];
        return secret;
    };
    return apiClient.readSecret(token, sessionSecretKey, secretId).then(onSuccess, onError);
}

/**
 * Encrypts some content and updates a secret with it. returns the secret id
 *
 * @param {uuid} secretId The id of the secret
 * @param {string} secretKey The secret key of the secret
 * @param {object} content The new content for the given secret
 * @param {string} callbackUrl The callback ULR
 * @param {string} callbackUser The callback user
 * @param {string} callbackPass The callback password
 *
 * @returns {Promise} Returns a promise with the secret id
 */
function writeSecret(secretId, secretKey, content, callbackUrl, callbackUser, callbackPass) {
    const token = store.getState().user.token;
    const sessionSecretKey = store.getState().user.sessionSecretKey;

    const jsonContent = JSON.stringify(content);

    const c = cryptoLibrary.encryptData(jsonContent, secretKey);

    const onError = function (result) {
        console.log(result);
    };

    const onSuccess = function (response) {
        browserClient.emit("secrets-changed", content);
        return { secret_id: response.data.secret_id };
    };

    return apiClient
        .writeSecret(token, sessionSecretKey, secretId, c.text, c.nonce, callbackUrl, callbackUser, callbackPass)
        .then(onSuccess, onError);
}

/**
 * Fetches and decrypts a secret and initiates the redirect for the secret
 *
 * @param {string} type The type of the secret
 * @param {uuid} secretId The id of the secret to read
 */
function redirectSecret(type, secretId) {
    return storage.findKey("datastore-password-leafs", secretId).then(function (leaf) {
        const onError = function (result) {
            // pass
        };

        const onSuccess = function (content) {
            if (type === "website_password") {
                browserClient.emitSec("fillpassword", {
                    username: content.website_password_username,
                    password: content.website_password_password,
                    authority: content.website_password_url_filter,
                    auto_submit: content.website_password_auto_submit,
                });
                window.location.href = content.website_password_url;
            } else if (type === "bookmark") {
                window.location.href = content.bookmark_url;
            } else {
                window.location.href = "index.html#!/datastore/search/" + secretId;
            }
        };

        return readSecret(secretId, leaf.secret_key).then(onSuccess, onError);
    });
}

/**
 * Handles item clicks and triggers redirects for website passwords and bookmarks
 *
 * @param {object} item The item one has clicked on
 */
function onItemClick(item) {
    if (
        item.hasOwnProperty("urlfilter") &&
        item["urlfilter"] !== "" &&
        ["website_password", "bookmark"].indexOf(item.type) !== -1
    ) {
        browserClient.openTab("open-secret.html#!/secret/" + item.type + "/" + item.secret_id).then(function (window) {
            window.psono_offline_cache_encryption_key = offlineCache.getEncryptionKey();
        });
    }
}

/**
 * Copies the username of a given secret to the clipboard
 *
 * @param {object} item The item of which we want to load the username into our clipboard
 */
async function copyUsername(item) {
    const decryptedSecret = await readSecret(item.secret_id, item.secret_key);

    if (item["type"] === "application_password") {
        browserClient.copyToClipboard(decryptedSecret["application_password_username"]);
    } else if (item["type"] === "website_password") {
        browserClient.copyToClipboard(decryptedSecret["website_password_username"]);
    }

    notification.push("username_copy", i18n.t("USERNAME_COPY_NOTIFICATION"));
}

/**
 * Copies the password of a given secret to the clipboard
 *
 * @param {object} item The item of which we want to load the password into our clipboard
 */
async function copyPassword(item) {
    const decryptedSecret = await readSecret(item.secret_id, item.secret_key);

    if (item["type"] === "application_password") {
        browserClient.copyToClipboard(decryptedSecret["application_password_password"]);
    } else if (item["type"] === "website_password") {
        browserClient.copyToClipboard(decryptedSecret["website_password_password"]);
    }

    notification.push("password_copy", i18n.t("PASSWORD_COPY_NOTIFICATION"));
}

/**
 * Copies the TOTP token of a given secret to the clipboard
 *
 * @param {object} item The item of which we want to load the TOTP token into our clipboard
 */
async function copyTotpToken(item) {
    const decryptedSecret = await readSecret(item.secret_id, item.secret_key);

    const totpCode = decryptedSecret["totp_code"];
    let totpPeriod, totpAlgorithm, totpDigits;
    if (decryptedSecret.hasOwnProperty("totp_period")) {
        totpPeriod = decryptedSecret["totp_period"];
    }
    if (decryptedSecret.hasOwnProperty("totp_algorithm")) {
        totpAlgorithm = decryptedSecret["totp_algorithm"];
    }
    if (decryptedSecret.hasOwnProperty("totp_digits")) {
        totpDigits = decryptedSecret["totp_digits"];
    }
    browserClient.copyToClipboard(cryptoLibrary.getTotpToken(totpCode, totpPeriod, totpAlgorithm, totpDigits));

    notification.push("totp_token_copy", i18n.t("TOTP_TOKEN_COPY_NOTIFICATION"));
}

// registrations

// itemBlueprint.register('copy_username', copyUsername);
// itemBlueprint.register('copy_password', copyPassword);
// itemBlueprint.register('copy_totp_token', copyTotpToken);

const secretService = {
    createSecret: createSecret,
    readSecret: readSecret,
    writeSecret: writeSecret,
    redirectSecret: redirectSecret,
    onItemClick: onItemClick,
    copyUsername: copyUsername,
    copyPassword: copyPassword,
    copyTotpToken: copyTotpToken,
};

export default secretService;