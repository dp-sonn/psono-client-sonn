(function(angular, nacl_factory, scrypt_module_factory) {
    'use strict';

    var backend = 'http://dev.sanso.pw:8001';

    var apiClient = function($http) {

        var call = function(type, endpoint, data, headers) {

            var req = {
                method: type,
                url: backend + endpoint,
                data: data
            };
            req.headers = headers;

            return $http(req);
        };
        /**
         * Ajax POST request to the backend with email and authkey for login, saves a token together with user_id
         * and all the different keys of a user in the apidata storage
         *
         * @param email
         * @param authkey
         * @returns {promise} promise
         */
        var login = function(email, authkey) {
            var endpoint = '/authentication/login/';
            var type = "POST";
            var data = {
                email: email,
                authkey: authkey
            };
            var headers = null;

            return call(type, endpoint, data, headers);
        };

        /**
         * Ajax POST request to destroy the token and logout the user
         *
         * @param token
         * @returns {promise}
         */
        var logout = function (token) {
            var endpoint = '/authentication/logout/';
            var type = "POST";
            var data = null;
            var headers = {
                "Authorization": "Token "+ token
            };

            return call(type, endpoint, data, headers);
        };

        /**
         * Ajax POST request to the backend with the email and authkey, returns nothing but an email is sent to the user
         * with an activation_code for the email
         *
         * @param {string} email - email address of the user
         * @param {string} authkey - authkey gets generated by generate_authkey(email, password)
         * @param {string} public_key - public_key of the public/private key pair for asymmetric encryption (sharing)
         * @param {string} private_key - private_key of the public/private key pair, encrypted with encrypt_secret
         * @param {string} private_key_nonce - the nonce for decrypting the encrypted private_key
         * @param {string} secret_key - secret_key for symmetric encryption, encrypted with encrypt_secret
         * @param {string} secret_key_nonce - the nonce for decrypting the encrypted secret_key
         * @returns {promise}
         */
        var register = function (email, authkey, public_key, private_key, private_key_nonce, secret_key, secret_key_nonce) {
            var endpoint = '/authentication/register/';
            var type = "POST";
            var data = {
                email: email,
                authkey: authkey,
                public_key: public_key,
                private_key: private_key,
                private_key_nonce: private_key_nonce,
                secret_key: secret_key,
                secret_key_nonce: secret_key_nonce
            };
            var headers = null;

            return call(type, endpoint, data, headers);
        };

        /**
         * Ajax POST request to the backend with the activation_code for the email, returns nothing. If successful the user
         * can login afterwards
         *
         * @param activation_code
         * @returns {promise}
         */
        var verify_email = function (activation_code) {
            var endpoint = '/authentication/verify-email/';
            var type = "POST";
            var data = {
                activation_code: activation_code
            };
            var headers = null;

            return call(type, endpoint, data, headers);
        };

        /**
         * Ajax GET request with the token as authentication to get the current user's datastore
         *
         * @param {string} token - authentication token of the user, returned by authentication_login(email, authkey)
         * @param {uuid} [datastore_id=null] - the datastore ID
         * @returns {promise}
         */
        var read_datastore = function (token, datastore_id) {

            //optional parameter datastore_id
            if (datastore_id === undefined) { datastore_id = null; }

            var endpoint = '/datastore/' + (datastore_id === null ? '' : datastore_id + '/');
            var type = "GET";
            var headers = {
                "Authorization": "Token "+ token
            };

            return call(type, endpoint, data, headers);
        };


        /**
         * Ajax PUT request to create a datatore with the token as authentication and optional already some data,
         * together with the encrypted secret key and nonce
         *
         * @param {string} token - authentication token of the user, returned by authentication_login(email, authkey)
         * @param {string} [encrypted_data] - optional data for the new datastore
         * @param {string} [encrypted_data_nonce] - nonce for data, necessary if data is provided
         * @param {string} encrypted_data_secret_key - encrypted secret key
         * @param {string} encrypted_data_secret_key_nonce - nonce for secret key
         * @returns {promise}
         */
        var create_datastore = function (token, encrypted_data, encrypted_data_nonce, encrypted_data_secret_key, encrypted_data_secret_key_nonce) {
            var endpoint = '/datastore/';
            var type = "PUT";
            var data = {
                data: encrypted_data,
                data_nonce: encrypted_data_nonce,
                secret_key: encrypted_data_secret_key,
                secret_key_nonce: encrypted_data_secret_key_nonce
            };
            var headers = {
                "Authorization": "Token "+ token
            };

            return call(type, endpoint, data, headers);
        };

        /**
         * Ajax PUT request with the token as authentication and the new datastore content
         *
         * @param {string} token - authentication token of the user, returned by authentication_login(email, authkey)
         * @param {uuid} datastore_id - the datastore ID
         * @param {string} [encrypted_data] - optional data for the new datastore
         * @param {string} [encrypted_data_nonce] - nonce for data, necessary if data is provided
         * @param {string} [encrypted_data_secret_key] - encrypted secret key, wont update on the server if not provided
         * @param {string} [encrypted_data_secret_key_nonce] - nonce for secret key, wont update on the server if not provided
         * @returns {promise}
         */
        var write_datastore = function (token, datastore_id, encrypted_data, encrypted_data_nonce, encrypted_data_secret_key, encrypted_data_secret_key_nonce) {
            var endpoint = '/datastore/' + datastore_id + '/';
            var type = "POST";
            var data = {
                data: encrypted_data,
                data_nonce: encrypted_data_nonce,
                secret_key: encrypted_data_secret_key,
                secret_key_nonce: encrypted_data_secret_key_nonce
            };
            var headers = {
                "Authorization": "Token "+ token
            };

            return call(type, endpoint, data, headers);
        };

        /**
         * Ajax GET request with the token as authentication to get the current user's secret
         *
         * @param {string} token - authentication token of the user, returned by authentication_login(email, authkey)
         * @param {uuid} [secret_id=null] - the secret ID
         * @returns {promise}
         */
        var read_secret = function (token, secret_id) {

            //optional parameter secret_id
            if (secret_id === undefined) { secret_id = null; }

            var endpoint = '/secret/' + (secret_id === null ? '' : secret_id + '/');
            var type = "GET";
            var data = null;
            var headers = {
                "Authorization": "Token "+ token
            };

            return call(type, endpoint, data, headers);
        };


        /**
         * Ajax PUT request to create a datatore with the token as authentication and optional already some data,
         * together with the encrypted secret key and nonce
         *
         * @param {string} token - authentication token of the user, returned by authentication_login(email, authkey)
         * @param {string} [encrypted_data] - optional data for the new secret
         * @param {string} [encrypted_data_nonce] - nonce for data, necessary if data is provided
         * @returns {promise}
         */
        var create_secret = function (token, encrypted_data, encrypted_data_nonce) {
            var endpoint = '/secret/';
            var type = "PUT";
            var data = {
                data: encrypted_data,
                data_nonce: encrypted_data_nonce
            };
            var headers = {
                "Authorization": "Token "+ token
            };

            return call(type, endpoint, data, headers);
        };

        /**
         * Ajax PUT request with the token as authentication and the new secret content
         *
         * @param {string} token - authentication token of the user, returned by authentication_login(email, authkey)
         * @param {uuid} secret_id - the secret ID
         * @param {string} [encrypted_data] - optional data for the new secret
         * @param {string} [encrypted_data_nonce] - nonce for data, necessary if data is provided
         * @param {string} [encrypted_data_secret_key] - encrypted secret key, wont update on the server if not provided
         * @param {string} [encrypted_data_secret_key_nonce] - nonce for secret key, wont update on the server if not provided
         * @returns {promise}
         */
        var write_secret = function (token, secret_id, encrypted_data, encrypted_data_nonce, encrypted_data_secret_key, encrypted_data_secret_key_nonce) {
            var endpoint = '/secret/' + secret_id + '/';
            var type = "POST";
            var data = {
                data: encrypted_data,
                data_nonce: encrypted_data_nonce,
                secret_key: encrypted_data_secret_key,
                secret_key_nonce: encrypted_data_secret_key_nonce
            };
            var headers = {
                "Authorization": "Token "+ token
            };

            return call(type, endpoint, data, headers);
        };

        /**
         * Ajax GET request with the token as authentication to get the current user's share
         *
         * @param {string} token - authentication token of the user, returned by authentication_login(email, authkey)
         * @param {uuid} [share_id=null] - the share ID
         * @returns {promise}
         */
        var read_share = function (token, share_id) {

            //optional parameter share_id
            if (share_id === undefined) { share_id = null; }

            var endpoint = '/share/' + (share_id === null ? '' : share_id + '/');
            var type = "GET";
            var data = null;
            var headers = {
                "Authorization": "Token "+ token
            };

            return call(type, endpoint, data, headers);
        };


        /**
         * Ajax PUT request to create a datastore with the token as authentication and optional already some data,
         * together with the encrypted secret key and nonce
         *
         * @param {string} token - authentication token of the user, returned by authentication_login(email, authkey)
         * @param {string} [encrypted_data] - optional data for the new share
         * @param {string} [encrypted_data_nonce] - nonce for data, necessary if data is provided
         * @param {string} encrypted_data_secret_key - encrypted secret key
         * @param {string} encrypted_data_secret_key_nonce - nonce for secret key
         * @returns {promise}
         */
        var create_share = function (token, encrypted_data, encrypted_data_nonce, encrypted_data_secret_key, encrypted_data_secret_key_nonce) {
            var endpoint = '/share/';
            var type = "PUT";
            var data = {
                data: encrypted_data,
                data_nonce: encrypted_data_nonce,
                secret_key: encrypted_data_secret_key,
                secret_key_nonce: encrypted_data_secret_key_nonce
            };
            var headers = {
                "Authorization": "Token "+ token
            };

            return call(type, endpoint, data, headers);
        };

        /**
         * Ajax PUT request with the token as authentication and the new share content
         *
         * @param {string} token - authentication token of the user, returned by authentication_login(email, authkey)
         * @param {uuid} share_id - the share ID
         * @param {string} [encrypted_data] - optional data for the new share
         * @param {string} [encrypted_data_nonce] - nonce for data, necessary if data is provided
         * @param {string} [encrypted_data_secret_key] - encrypted secret key, wont update on the server if not provided
         * @param {string} [encrypted_data_secret_key_nonce] - nonce for secret key, wont update on the server if not provided
         * @returns {promise}
         */
        var write_share = function (token, share_id, encrypted_data, encrypted_data_nonce, encrypted_data_secret_key, encrypted_data_secret_key_nonce) {
            var endpoint = '/share/' + share_id + '/';
            var type = "POST";
            var data = {
                data: encrypted_data,
                data_nonce: encrypted_data_nonce,
                secret_key: encrypted_data_secret_key,
                secret_key_nonce: encrypted_data_secret_key_nonce
            };
            var headers = {
                "Authorization": "Token "+ token
            };

            return call(type, endpoint, data, headers);
        };

        /**
         * Ajax GET request with the token as authentication to get the users and groups rights of the share
         *
         * @param {string} token - authentication token of the user, returned by authentication_login(email, authkey)
         * @param {uuid} share_id - the share ID
         * @returns {promise}
         */
        var read_share_total = function (token, share_id) {
            var endpoint = '/share/rights/' + share_id + '/';
            var type = "GET";
            var data = null;
            var headers = {
                "Authorization": "Token "+ token
            };

            return call(type, endpoint, data, headers);
        };

        /**
         * Ajax GET request with the token as authentication to get the users and groups rights of the share
         *
         * @param {string} token - authentication token of the user, returned by authentication_login(email, authkey)
         * @param {uuid} share_id - the share ID
         * @param {uuid} user_id - the target user's user ID
         * @param {string} key - the encrypted share secret, encrypted with the public key of the target user
         * @param {string} nonce - the unique nonce for decryption
         * @param {string} token - authentication token of the user, returned by authentication_login(email, authkey)
         * @param {bool} read - read right
         * @param {bool} write - write right
         * @returns {promise}
         */
        var create_share_right = function (token, share_id, user_id, key, nonce, read, write) {
            var endpoint = '/share/rights/' + share_id + '/';
            var type = "PUT";
            var data = {
                user_id: user_id,
                key: key,
                nonce: nonce,
                read: read,
                write: write
            };
            var headers = {
                "Authorization": "Token "+ token
            };

            return call(type, endpoint, data, headers);
        };

        /**
         * Ajax GET request with the token as authentication to get the public key of a user by user_id or user_email
         *
         * @param {string} token - authentication token of the user, returned by authentication_login(email, authkey)
         * @param {uuid} [user_id] - the user ID
         * @param {uuid} [user_email] - the user email
         * @returns {promise}
         */
        var get_users_public_key = function (token, user_id, user_email) {
            var endpoint = '/user/search/';
            var type = "POST";
            var data = {
                user_id: user_id,
                user_email: user_email
            };
            var headers = {
                "Authorization": "Token "+ token
            };

            return call(type, endpoint, data, headers);
        };

        /**
         * Ajax GET request with the token as authentication to get the current user's groups
         *
         * @param {string} token - authentication token of the user, returned by authentication_login(email, authkey)
         * @param {uuid} [group_id=null] - the group ID
         * @returns {promise}
         */
        var read_group = function (token, group_id) {

            //optional parameter group_id
            if (group_id === undefined) { group_id = null; }

            var endpoint = '/group/' + (group_id === null ? '' : group_id + '/');
            var type = "GET";
            var data = null;
            var headers = {
                "Authorization": "Token "+ token
            };

            return call(type, endpoint, data, headers);
        };


        /**
         * Ajax PUT request to create a group with the token as authentication and together with the name of the group
         *
         * @param {string} token - authentication token of the user, returned by authentication_login(email, authkey)
         * @param {string} name - name of the new group
         * @param {string} encrypted_data_secret_key - encrypted secret key
         * @param {string} encrypted_data_secret_key_nonce - nonce for secret key
         * @returns {promise}
         */
        var create_group = function (token, name, encrypted_data_secret_key, encrypted_data_secret_key_nonce) {
            var endpoint = '/group/';
            var type = "PUT";
            var data = {
                name: name,
                secret_key: encrypted_data_secret_key,
                secret_key_nonce: encrypted_data_secret_key_nonce
            };
            var headers = {
                "Authorization": "Token "+ token
            };

            return call(type, endpoint, data, headers);
        };

        return {
            login: login,
            logout: logout,
            register: register,
            verify_email: verify_email,
            read_datastore: read_datastore,
            write_datastore: write_datastore,
            create_datastore: create_datastore,
            read_secret: read_secret,
            write_secret: write_secret,
            create_secret: create_secret,
            read_share:read_share,
            write_share: write_share,
            create_share: create_share,
            read_share_total: read_share_total,
            create_share_right: create_share_right,
            get_users_public_key: get_users_public_key,
            read_group: read_group,
            create_group: create_group
        };
    };

    var app = angular.module('passwordManagerApp');
    app.factory("apiClient", ['$http', apiClient]);

}(angular, nacl_factory, scrypt_module_factory));