(function(angular) {
    'use strict';

    /**
     * Module for the acceptshare widget
     */
    var module = angular.module('adf.widget.acceptshare', ['adf.provider']);

    /**
     * Config for the acceptshare widget
     */
    module.config(['dashboardProvider', function(dashboardProvider){
        dashboardProvider
            .widget('acceptshare', {
                title: 'Accept Share',
                description: 'provides the accept share',
                templateUrl: 'view/accept-share-view.html',
                controller: 'acceptShareController',
                controllerAs: 'acceptShare',
                edit: {
                    templateUrl: 'view/accept-share-edit.html'
                }
            });
    }]);

    /**
     * Main Controller for the acceptshare widget
     */
    module.controller('acceptShareController', ["$scope", "manager", "managerDatastorePassword",
        "$uibModal", "itemBlueprint", "managerAdfWidget",
        "message", "$timeout",
        function($scope, manager, managerDatastorePassword,
                 $uibModal, itemBlueprint, managerAdfWidget, message,
                 $timeout){

            var contextMenusOpen = 0;

            $scope.contextMenuOnShow = function() {
                contextMenusOpen++;
            };

            $scope.contextMenuOnClose = function() {
                $timeout(function() {
                    contextMenusOpen--;
                }, 0);
            };

            // Modals

            $scope.open_new_folder = function (event) {
                managerAdfWidget.open_new_folder(undefined, [], $scope.structure.data, managerDatastorePassword);
            };

            /**
             * Opens the modal for a new entry
             *
             * @param parent
             * @param path
             * @param size
             */
            var open_new_item = function (parent, path, size) {
                managerAdfWidget.open_new_item($scope.structure.data, parent, path, size);
            };

            $scope.openNewItem = function (event) {
                open_new_item(undefined, []);
            };

            /**
             * Opens the modal to edit a entry
             *
             * @param node
             * @param path
             * @param size
             */
            var open_edit_item = function (node, path, size) {
                managerAdfWidget.open_edit_item($scope.structure.data, node, path, size);
            };

            // Datastore Structure Management
            $scope.structure = { data: {}} ;

            var fill_password_datastore = function(data) {
                $scope.structure.data = data;
            };

            managerDatastorePassword.get_password_datastore()
                .then(fill_password_datastore);


            /**
             * Move an item
             *
             * @param scope the scope
             * @param item_path the path of the item
             * @param target_path the path where we want to put the item
             * @param type type of the item (item or folder)
             */
            var move_item = function(scope, item_path, target_path, type) {
                managerAdfWidget.move_item(scope.structure.data, item_path, target_path, type);
            };

            /**
             * Deletes an item from the datastore
             *
             * @param scope the scope
             * @param item the item
             * @param path the path to the item
             */
            var delete_item = function(scope, item, path) {
                managerAdfWidget.delete_item(scope.structure.data, item, path);
            };

            $scope.options = {
                /**
                 * Triggered once someone selects a node
                 *
                 * @param node
                 * @param breadcrumbs
                 * @param id_breadcrumbs
                 */
                onNodeSelect: function (node, breadcrumbs, id_breadcrumbs) {
                    $scope.breadcrumbs = breadcrumbs;
                    $scope.node = node;
                    message.emit("modal_accept_share_breadcrumbs_update",
                        {'breadcrumbs': breadcrumbs, 'id_breadcrumbs': id_breadcrumbs});
                },
                /**
                 * Triggered once someone clicks the delete node entry
                 *
                 * @param node The node in question
                 * @param path The path to the node
                 */
                onDeleteNode: function (node, path) {
                    return delete_item($scope, node, path);
                },

                /**
                 * Triggered once someone wants to edit a node entry
                 *
                 * @param node The node in question
                 * @param path The path to the node
                 */
                onEditNode: function (node, path) {
                    managerAdfWidget.open_edit_folder(node, path, $scope.structure.data, managerDatastorePassword)
                },

                /**
                 * Triggered once someone wants to delete a node entry
                 *
                 * @param item The item in question
                 * @param path The path to the item
                 */
                onDeleteItem: function (item, path) {
                    return delete_item($scope, item, path);
                },

                /**
                 * Triggered once someone wants to edit a node entry
                 *
                 * @param item The item in question
                 * @param path The path to the item
                 */
                onEditItem: function (item, path) {
                    open_edit_item(item, path);
                },

                /**
                 * Triggered once someone wants to create a new folder
                 *
                 * @param parent The parent for the new folder
                 * @param path The path to the parent
                 */
                onNewFolder: function (parent, path) {
                    managerAdfWidget.open_new_folder(parent, path, $scope.structure.data, managerDatastorePassword);
                },

                /**
                 * Triggered once someone wants to create a new Item
                 *
                 * @param parent The parent for the new item
                 * @param path The path to the parent
                 */
                onNewItem: function (parent, path) {
                    open_new_item(parent, path)
                },

                /**
                 * Triggered once someone clicks on an additional button
                 *
                 * @param item
                 * @param path
                 * @param myFunction
                 */
                onAdditionalButtonItem: function(item, path, myFunction) {
                    myFunction(item,path);
                },

                /**
                 * triggered once someone wants to move an item
                 *
                 * @param item_path
                 * @param target_path
                 */
                onItemDropComplete: function (item_path, target_path) {
                    return move_item($scope, item_path, target_path, 'items');
                },

                /**
                 * Filters out share folders which we cannot read nor write to as possible target for our accept share
                 *
                 * @param node
                 */
                isSelectable: function (node) {
                    if ( ! node.hasOwnProperty('share_rights') || (node.share_rights.read && node.share_rights.write)) {
                        return true;
                    } else {
                        return false;
                    }
                },

                /**
                 * triggered once someone wants to move a folder
                 *
                 * @param item_path
                 * @param target_path
                 */
                onFolderDropComplete: function (item_path, target_path) {
                    return move_item($scope, item_path, target_path, 'folders');
                },
                /**
                 * blocks move if context menus are open
                 *
                 * @returns {boolean}
                 */
                blockMove: function() {
                    return contextMenusOpen > 0;
                },
                contextMenuOnShow: $scope.contextMenuOnShow,
                contextMenuOnClose: $scope.contextMenuOnClose,

                getAdditionalButtons: itemBlueprint.get_additional_functions,
                item_icon: managerAdfWidget.item_icon
            };

        }]);



})(angular);