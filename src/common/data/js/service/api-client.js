(function(angular, scrypt_module_factory) {
    'use strict';


    var apiClient = function($http, $q, $rootScope, storage) {

        /**
         * wrapper function for the actual $http request
         *
         * @param type
         * @param endpoint
         * @param data
         * @param headers
         * @returns *
         */
        var call = function(type, endpoint, data, headers) {

            var server = storage.find_one('config', {'key': 'server'});

            if (server === null) {
                return $q(function(resolve, reject) {
                    return reject({
                        status: -1
                    })
                });
            }

            var backend = server['value']['url'];

            var req = {
                method: type,
                url: backend + endpoint,
                data: data
            };

            req.headers = headers;


            return $q(function(resolve, reject) {

                var onSuccess = function(data) {
                    return resolve(data);
                };

                var onError = function(data) {
                    if (data.status === 401) {
                        $rootScope.$broadcast('force_logout', '');
                    }
                    return reject(data);
                };

                $http(req)
                    .then(onSuccess, onError);

            });
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
            var connection_type = "POST";
            var data = {
                email: email,
                authkey: authkey
            };
            var headers = null;

            return call(connection_type, endpoint, data, headers);
        };

        /**
         * Ajax POST request to destroy the token and logout the user
         *
         * @param token
         * @returns {promise}
         */
        var logout = function (token) {
            var endpoint = '/authentication/logout/';
            var connection_type = "POST";
            var data = null;
            var headers = {
                "Authorization": "Token "+ token
            };

            return call(connection_type, endpoint, data, headers);
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
         * @param {string} user_sauce - the random user sauce used
         * @param {string} base_url - the base url for the activation link creation
         * @returns {promise}
         */
        var register = function (email, authkey, public_key, private_key, private_key_nonce, secret_key, secret_key_nonce, user_sauce, base_url) {
            var endpoint = '/authentication/register/';
            var connection_type = "POST";
            var data = {
                email: email,
                authkey: authkey,
                public_key: public_key,
                private_key: private_key,
                private_key_nonce: private_key_nonce,
                secret_key: secret_key,
                secret_key_nonce: secret_key_nonce,
                user_sauce: user_sauce,
                base_url: base_url
            };
            var headers = null;

            return call(connection_type, endpoint, data, headers);
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
            var connection_type = "POST";
            var data = {
                activation_code: activation_code
            };
            var headers = null;

            return call(connection_type, endpoint, data, headers);
        };

        /**
         * AJAX POST request to the backend with new user informations like for example a new password (means new
         * authkey) or new public key
         *
         * @param {string} token - authentication token of the user, returned by authentication_login(email, authkey)
         * @param email
         * @param authkey
         * @param authkey_old
         * @param private_key
         * @param private_key_nonce
         * @param secret_key
         * @param secret_key_nonce
         * @param user_sauce
         *
         * @returns {promise}
         */
        var update_user = function(token, email, authkey, authkey_old, private_key, private_key_nonce, secret_key, secret_key_nonce, user_sauce) {
            var endpoint = '/user/update/';
            var connection_type = "POST";
            var data = {
                email: email,
                authkey: authkey,
                authkey_old: authkey_old,
                private_key: private_key,
                private_key_nonce: private_key_nonce,
                secret_key: secret_key,
                secret_key_nonce: secret_key_nonce,
                user_sauce: user_sauce
            };
            var headers = {
                "Authorization": "Token "+ token
            };

            return call(connection_type, endpoint, data, headers);
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
            var connection_type = "GET";
            var data = null;
            var headers = {
                "Authorization": "Token "+ token
            };

            return call(connection_type, endpoint, data, headers);
        };


        /**
         * Ajax PUT request to create a datatore with the token as authentication and optional already some data,
         * together with the encrypted secret key and nonce
         *
         * @param {string} token - authentication token of the user, returned by authentication_login(email, authkey)
         * @param {string} type - the type of the datastore
         * @param {string} description - the description of the datastore
         * @param {string} [encrypted_data] - optional data for the new datastore
         * @param {string} [encrypted_data_nonce] - nonce for data, necessary if data is provided
         * @param {string} encrypted_data_secret_key - encrypted secret key
         * @param {string} encrypted_data_secret_key_nonce - nonce for secret key
         * @returns {promise}
         */
        var create_datastore = function (token, type, description, encrypted_data, encrypted_data_nonce, encrypted_data_secret_key, encrypted_data_secret_key_nonce) {
            var endpoint = '/datastore/';
            var connection_type = "PUT";
            var data = {
                type: type,
                description: description,
                data: encrypted_data,
                data_nonce: encrypted_data_nonce,
                secret_key: encrypted_data_secret_key,
                secret_key_nonce: encrypted_data_secret_key_nonce
            };
            var headers = {
                "Authorization": "Token "+ token
            };

            return call(connection_type, endpoint, data, headers);
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
            var connection_type = "POST";
            var data = {
                data: encrypted_data,
                data_nonce: encrypted_data_nonce,
                secret_key: encrypted_data_secret_key,
                secret_key_nonce: encrypted_data_secret_key_nonce
            };
            var headers = {
                "Authorization": "Token "+ token
            };

            return call(connection_type, endpoint, data, headers);
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
            var connection_type = "GET";
            var data = null;
            var headers = {
                "Authorization": "Token "+ token
            };

            return call(connection_type, endpoint, data, headers);
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
            var connection_type = "PUT";
            var data = {
                data: encrypted_data,
                data_nonce: encrypted_data_nonce
            };
            var headers = {
                "Authorization": "Token "+ token
            };

            return call(connection_type, endpoint, data, headers);
        };

        /**
         * Ajax PUT request with the token as authentication and the new secret content
         *
         * @param {string} token - authentication token of the user, returned by authentication_login(email, authkey)
         * @param {uuid} secret_id - the secret ID
         * @param {string} [encrypted_data] - optional data for the new secret
         * @param {string} [encrypted_data_nonce] - nonce for data, necessary if data is provided
         * @returns {promise}
         */
        var write_secret = function (token, secret_id, encrypted_data, encrypted_data_nonce) {
            var endpoint = '/secret/' + secret_id + '/';
            var connection_type = "POST";
            var data = {
                data: encrypted_data,
                data_nonce: encrypted_data_nonce
            };
            var headers = {
                "Authorization": "Token "+ token
            };

            return call(connection_type, endpoint, data, headers);
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
            var connection_type = "GET";
            var data = null;
            var headers = {
                "Authorization": "Token "+ token
            };

            return call(connection_type, endpoint, data, headers);
        };


        /**
         * Ajax PUT request to create a datastore with the token as authentication and optional already some data,
         * together with the encrypted secret key and nonce
         *
         * @param {string} token - authentication token of the user, returned by authentication_login(email, authkey)
         * @param {string} [encrypted_data] - optional data for the new share
         * @param {string} [encrypted_data_nonce] - nonce for data, necessary if data is provided
         * @returns {promise}
         */
        var create_share = function (token, encrypted_data, encrypted_data_nonce) {
            var endpoint = '/share/';
            var connection_type = "PUT";
            var data = {
                data: encrypted_data,
                data_nonce: encrypted_data_nonce
            };
            var headers = {
                "Authorization": "Token "+ token
            };

            return call(connection_type, endpoint, data, headers);
        };

        /**
         * Ajax PUT request with the token as authentication and the new share content
         *
         * @param {string} token - authentication token of the user, returned by authentication_login(email, authkey)
         * @param {uuid} share_id - the share ID
         * @param {string} [encrypted_data] - optional data for the new share
         * @param {string} [encrypted_data_nonce] - nonce for data, necessary if data is provided
         * @returns {promise}
         */
        var write_share = function (token, share_id, encrypted_data, encrypted_data_nonce) {
            var endpoint = '/share/' + share_id + '/';
            var connection_type = "POST";
            var data = {
                data: encrypted_data,
                data_nonce: encrypted_data_nonce
            };
            var headers = {
                "Authorization": "Token "+ token
            };

            return call(connection_type, endpoint, data, headers);
        };

        /**
         * Ajax GET request with the token as authentication to get the users and groups rights of the share
         *
         * @param {string} token - authentication token of the user, returned by authentication_login(email, authkey)
         * @param {uuid} share_id - the share ID
         * @returns {promise}
         */
        var read_share_total = function (token, share_id) {
            var endpoint = '/share/right/' + share_id + '/';
            var connection_type = "GET";
            var data = null;
            var headers = {
                "Authorization": "Token "+ token
            };

            return call(connection_type, endpoint, data, headers);
        };

        /**
         * Ajax GET request with the token as authentication to get the users and groups rights of the share
         *
         * @param {string} token - authentication token of the user, returned by authentication_login(email, authkey)
         * @param {uuid} title - the title shown to the user before he accepts
         * @param {uuid} type - the type of the share
         * @param {uuid} share_id - the share ID
         * @param {uuid} user_id - the target user's user ID
         * @param {string} key - the encrypted share secret, encrypted with the public key of the target user
         * @param {string} key_nonce - the unique nonce for decryption
         * @param {bool} read - read right
         * @param {bool} write - write right
         * @param {bool} grant - grant right
         * @returns {promise}
         */
        var create_share_right = function (token, title, type, share_id, user_id, key, key_nonce, read, write, grant) {
            var endpoint = '/share/right/';
            var connection_type = "PUT";
            var data = {
                title: title,
                type: type,
                share_id: share_id,
                user_id: user_id,
                key: key,
                key_nonce: key_nonce,
                read: read,
                write: write,
                grant: grant
            };
            var headers = {
                "Authorization": "Token "+ token
            };

            return call(connection_type, endpoint, data, headers);
        };

        /**
         * Ajax GET request with the token as authentication to get the public key of a user by user_id or user_email
         *
         * @param {string} token - authentication token of the user, returned by authentication_login(email, authkey)
         * @param {uuid} [user_id] - the user ID
         * @param {email} [user_email] - the user email
         * @returns {promise}
         */
        var get_users_public_key = function (token, user_id, user_email) {
            var endpoint = '/user/search/';
            var connection_type = "POST";
            var data = {
                user_id: user_id,
                user_email: user_email
            };
            var headers = {
                "Authorization": "Token "+ token
            };

            return call(connection_type, endpoint, data, headers);
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
            var connection_type = "GET";
            var data = null;
            var headers = {
                "Authorization": "Token "+ token
            };

            return call(connection_type, endpoint, data, headers);
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
            var connection_type = "PUT";
            var data = {
                name: name,
                secret_key: encrypted_data_secret_key,
                secret_key_nonce: encrypted_data_secret_key_nonce
            };
            var headers = {
                "Authorization": "Token "+ token
            };

            return call(connection_type, endpoint, data, headers);
        };

        return {
            login: login,
            logout: logout,
            register: register,
            verify_email: verify_email,
            update_user: update_user,
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
    app.factory("apiClient", ['$http', '$q', '$rootScope', 'storage', apiClient]);

}(angular, scrypt_module_factory));
