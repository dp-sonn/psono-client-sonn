/**
 * Service to talk to an S3 compatible storage and upload or download files
 */

import axios from "axios";
import converterService from "./converter";

function call(signed_url, method, endpoint, data, headers, transformRequest, responseType) {
    if (!transformRequest) {
        transformRequest = axios.defaults.transformRequest;
    }

    const req = {
        method: method,
        url: signed_url + endpoint,
        data: data,
        transformRequest: transformRequest,
        responseType: responseType,
    };

    req.headers = headers;

    return new Promise(function (resolve, reject) {
        const onSuccess = function (data) {
            return resolve(data);
        };

        const onError = function (data) {
            return reject(data);
        };

        axios(req).then(onSuccess, onError);
    });
}

/**
 * Ajax PUT request to upload a file chunk to AWS S3
 *
 * @param {string} signed_url The signed ulr
 * @param {object} fields Array of fields that need to be part of the request
 * @param {Blob} chunk The content of the chunk to upload
 *
 * @returns {Promise} promise
 */
function upload(signed_url, fields, chunk) {
    const endpoint = ""; // the signed url already has everything
    const method = "POST";
    const data = new FormData();
    for (let field_name in fields) {
        if (!fields.hasOwnProperty(field_name)) {
            continue;
        }
        data.append(field_name, fields[field_name]);
    }
    data.append("file", chunk);
    const headers = {
        "Content-Type": undefined,
    };

    return call(signed_url, method, endpoint, data, headers);
}

/**
 * Ajax GET request to download a file chunk from AWS S3
 *
 * @param {string} signed_url The signed ulr
 *
 * @returns {Promise} promise with the data
 */
function download(signed_url) {
    const endpoint = ""; // the signed url already has everything
    const method = "GET";
    const data = null;

    const headers = {};

    return call(signed_url, method, endpoint, data, headers, undefined, "arraybuffer").then(
        function (data) {
            return data;
        },
        function (data) {
            if (data.status === 400) {
                data.data = JSON.parse(converterService.bytesToString(data.data));
            }
            return Promise.reject(data);
        }
    );
}

const apiOtherS3Service = {
    upload: upload,
    download: download,
};

export default apiOtherS3Service;