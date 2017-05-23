(function(angular) {
    'use strict';

    /**
     * @ngdoc controller
     * @name psonocli.controller:OtherCtrl
     * @requires $scope
     * @requires $routeParams
     * @requires psonocli.account
     *
     * @description
     * Controller for the Account view
     */
    angular.module('psonocli').controller('OtherCtrl', ['$scope', '$routeParams', 'managerDatastoreUser', 'helper',
        function ($scope, $routeParams, managerDatastoreUser, helper) {

            $scope.delete_open_session = delete_open_session;

            $scope.sessions=[];

            activate();
            function activate() {
                managerDatastoreUser.get_open_sessions().then(function (sessions) {
                    $scope.sessions = sessions;
                });
            }

            /**
             * deletes an open session with given session id
             *
             * @param session_id The session id to delete
             */
            function delete_open_session(session_id) {

                var onSuccess = function () {
                    helper.remove_from_array($scope.sessions, session_id, function(session, session_id) {
                        return session['id'] === session_id;
                    });
                };
                var onError = function () {
                };

                managerDatastoreUser.delete_open_session(session_id).then(onSuccess, onError);
            }
        }]
    );
}(angular));