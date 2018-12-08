(function () {
    module.exports = function (config) {
        return config.set({
            basePath: '',
            frameworks: ['jasmine'],
            files: [
                "../src/common/data/js/lib/ecma-nacl.min.js",
                "../src/common/data/js/lib/openpgp.min.js",
                "../src/common/data/js/lib/sha512.min.js",
                "../src/common/data/js/lib/sha256.min.js",
                "../src/common/data/js/lib/sha1.min.js",
                "../src/common/data/js/lib/uuid.js",
                "../src/common/data/js/lib/chart.min.js",
                "../src/common/data/js/lib/jquery.min.js",
                "../src/common/data/js/lib/client.min.js",
                "../src/common/data/js/lib/datatables.min.js",
                "../src/common/data/js/lib/snap.min.js",
                "../src/common/data/js/lib/jquery-ui.min.js",
                "../src/common/data/js/lib/lokijs.min.js",
                "../src/common/data/js/lib/qrcode.min.js",
                "../src/common/data/js/lib/fastclick.js",
                "../src/common/data/js/lib/password-generator.js",
                "../src/common/data/js/lib/papaparse.min.js",
                "../src/common/data/js/lib/fast-xml-parser.js",
                "../src/common/data/js/lib/angular.min.js",
                "../src/common/data/js/lib/raven.min.js",
                "../src/common/data/js/raven.js",
                "../src/common/data/js/lib/angular-cookies.min.js",
                "../src/common/data/js/lib/angular-animate.min.js",
                "../src/common/data/js/lib/angular-touch.min.js",
                "../src/common/data/js/lib/angular-complexify.min.js",
                "../src/common/data/js/lib/loading-bar.min.js",
                "../src/common/data/js/lib/angular-chart.min.js",
                "../src/common/data/js/lib/angular-route.min.js",
                "../src/common/data/js/lib/angular-sanitize.min.js",
                "../src/common/data/js/lib/angular-local-storage.min.js",
                "../src/common/data/js/lib/angular-snap.min.js",
                "../src/common/data/js/lib/angular-translate.min.js",
                "../src/common/data/js/lib/angular-translate-storage-cookie.min.js",
                "../src/common/data/js/lib/angular-translate-loader-url.min.js",
                "../src/common/data/js/lib/angular-translate-loader-static-files.min.js",
                "../src/common/data/js/lib/ui-bootstrap-tpls.min.js",
                "../src/common/data/js/lib/angular-ui-select.js",
                "../src/common/data/js/lib/ng-context-menu.js",
                "../src/common/data/js/lib/angular-datatables.js",
                "../src/common/data/js/module/ng-tree.js",
                "../src/common/data/js/main.js",
                "../src/common/data/js/service-worker-load.js",
                "../src/common/data/js/directive/fileReader.js",
                "../src/common/data/js/directive/treeView.js",
                "../src/common/data/js/directive/treeViewNode.js",
                "../src/common/data/js/controller/AcceptShareCtrl.js",
                "../src/common/data/js/controller/ChooseFolderCtrl.js",
                "../src/common/data/js/controller/ChooseSecretsCtrl.js",
                "../src/common/data/js/controller/AccountCtrl.js",
                "../src/common/data/js/controller/ActivationCtrl.js",
                "../src/common/data/js/controller/DatastoreCtrl.js",
                "../src/common/data/js/controller/SecurityReportCtrl.js",
                "../src/common/data/js/controller/LoginCtrl.js",
                "../src/common/data/js/controller/GPGDecryptMessageCtrl.js",
                "../src/common/data/js/controller/GPGEncryptMessageCtrl.js",
                "../src/common/data/js/controller/LostPasswordCtrl.js",
                "../src/common/data/js/controller/ActivateEmergencyCodeCtrl.js",
                "../src/common/data/js/controller/MainCtrl.js",
                "../src/common/data/js/controller/modal/AcceptShareCtrl.js",
                "../src/common/data/js/controller/modal/ChooseFolderCtrl.js",
                "../src/common/data/js/controller/modal/ChooseSecretsCtrl.js",
                "../src/common/data/js/controller/modal/ConfigureGoogleAuthenticatorCtrl.js",
                "../src/common/data/js/controller/modal/DeleteOtherSessionsCtrl.js",
                "../src/common/data/js/controller/modal/AddGPGReceiverCtrl.js",
                "../src/common/data/js/controller/modal/ConfigureDuoCtrl.js",
                "../src/common/data/js/controller/modal/ConfigureYubiKeyOTPCtrl.js",
                "../src/common/data/js/controller/modal/CreateDatastoreCtrl.js",
                "../src/common/data/js/controller/modal/CreateAPIKeyCtrl.js",
                "../src/common/data/js/controller/modal/EditAPIKeyCtrl.js",
                "../src/common/data/js/controller/modal/EditDatastoreCtrl.js",
                "../src/common/data/js/controller/modal/DeleteDatastoreCtrl.js",
                "../src/common/data/js/controller/modal/DatastoreNewEntryCtrl.js",
                "../src/common/data/js/controller/modal/DisplayShareRightsCtrl.js",
                "../src/common/data/js/controller/modal/EditEntryCtrl.js",
                "../src/common/data/js/controller/modal/EditFolderCtrl.js",
                "../src/common/data/js/controller/modal/GoOfflineCtrl.js",
                "../src/common/data/js/controller/modal/HistoryCtrl.js",
                "../src/common/data/js/controller/modal/NewFolderCtrl.js",
                "../src/common/data/js/controller/modal/VerifyCtrl.js",
                "../src/common/data/js/controller/modal/NewGroupCtrl.js",
                "../src/common/data/js/controller/modal/PickUserCtrl.js",
                "../src/common/data/js/controller/modal/EditGroupCtrl.js",
                "../src/common/data/js/controller/modal/EncryptMessageGPGCtrl.js",
                "../src/common/data/js/controller/modal/DecryptMessageGPGCtrl.js",
                "../src/common/data/js/controller/modal/EditGPGUserCtrl.js",
                "../src/common/data/js/controller/modal/GenerateNewMailGPGKeyCtrl.js",
                "../src/common/data/js/controller/modal/ImportMailGPGKeyAsTextCtrl.js",
                "../src/common/data/js/controller/modal/ShareEditEntryCtrl.js",
                "../src/common/data/js/controller/modal/ShareEntryCtrl.js",
                "../src/common/data/js/controller/modal/ShareNewEntryCtrl.js",
                "../src/common/data/js/controller/modal/ShowEmergencyCodesCtrl.js",
                "../src/common/data/js/controller/modal/ShowRecoverycodeCtrl.js",
                "../src/common/data/js/controller/modal/UnlockOfflineCacheCtrl.js",
                "../src/common/data/js/controller/modal/DeleteAccountCtrl.js",
                "../src/common/data/js/controller/EditEntryBigCtrl.js",
                "../src/common/data/js/controller/OpenSecretCtrl.js",
                "../src/common/data/js/controller/OtherCtrl.js",
                "../src/common/data/js/controller/SessionsCtrl.js",
                "../src/common/data/js/controller/KnownHostsCtrl.js",
                "../src/common/data/js/controller/OtherDatastoreCtrl.js",
                "../src/common/data/js/controller/OtherAPIKeyCtrl.js",
                "../src/common/data/js/controller/ExportCtrl.js",
                "../src/common/data/js/controller/ImportCtrl.js",
                "../src/common/data/js/controller/PanelCtrl.js",
                "../src/common/data/js/controller/RegisterCtrl.js",
                "../src/common/data/js/controller/SettingsCtrl.js",
                "../src/common/data/js/controller/ShareCtrl.js",
                "../src/common/data/js/controller/ShareusersCtrl.js",
                "../src/common/data/js/controller/GroupsCtrl.js",
                "../src/common/data/js/controller/WrapperCtrl.js",
                "../src/common/data/js/controller/Enforce2FaCtrl.js",
                "../src/common/data/js/service/api-client.js",
                "../src/common/data/js/service/api-pwnedpasswords.js",
                "../src/common/data/js/service/helper.js",
                "../src/common/data/js/service/device.js",
                "../src/common/data/js/service/message.js",
                "../src/common/data/js/service/item-blueprint.js",
                "../src/common/data/js/service/share-blueprint.js",
                "../src/common/data/js/service/crypto-library.js",
                "../src/common/data/js/service/converter.js",
                "../src/common/data/js/service/openpgp.js",
                "../src/common/data/js/service/storage.js",
                "../src/common/data/js/service/offline-cache.js",
                "../src/common/data/js/service/account.js",
                "../src/common/data/js/service/settings.js",
                "../src/common/data/js/service/manager-base.js",
                "../src/common/data/js/service/language-picker.js",
                "../src/common/data/js/service/manager.js",
                "../src/common/data/js/service/manager-widget.js",
                "../src/common/data/js/service/manager-datastore.js",
                "../src/common/data/js/service/manager-api-keys.js",
                "../src/common/data/js/service/manager-secret-link.js",
                "../src/common/data/js/service/manager-share-link.js",
                "../src/common/data/js/service/manager-export.js",
                "../src/common/data/js/service/manager-hosts.js",
                "../src/common/data/js/service/manager-import.js",
                "../src/common/data/js/service/manager-security-report.js",
                "../src/common/data/js/service/import-chrome-csv.js",
                "../src/common/data/js/service/import-psono-pw-json.js",
                "../src/common/data/js/service/import-lastpass-com-csv.js",
                "../src/common/data/js/service/import-keepassx-org-csv.js",
                "../src/common/data/js/service/import-keepass-info-csv.js",
                "../src/common/data/js/service/import-keepass-info-xml.js",
                "../src/common/data/js/service/manager-status.js",
                "../src/common/data/js/service/manager-secret.js",
                "../src/common/data/js/service/manager-share.js",
                "../src/common/data/js/service/manager-datastore-password.js",
                "../src/common/data/js/service/manager-datastore-user.js",
                "../src/common/data/js/service/manager-datastore-gpg-user.js",
                "../src/common/data/js/service/manager-groups.js",
                "../src/common/data/js/service/manager-history.js",
                "../src/common/data/js/service/manager-datastore-setting.js",
                "../src/common/data/js/service/browser-client.js",
                "../src/common/data/js/service/drop-down-menu-watcher.js",
                "../src/common/data/view/templates.js",

                "../src/common/data/js/service/manager-background.js",
                "../src/common/data/js/controller/BackgroundCtrl.js",

                "../unittests/data/js/lib/angular-mocks.js",

                '../unittests/tests/*.js',
                '../unittests/tests/**/*.js'
            ],
            exclude: [],
            preprocessors: {
                '../src/**/!(*lib)/*.js': ['coverage']
            },
            coverageReporter: {
                type : 'text-summary',
                dir : 'coverage/'
            },
            reporters: ['progress', 'coverage'],
            port: 9876,
            colors: true,
            browserNoActivityTimeout: 100000,
            logLevel: config.LOG_INFO,
            autoWatch: true,
            browsers: ['Chrome_headless'],
            singleRun: true,
            customLaunchers: {
                Chrome_headless: {
                    base: 'Chrome',
                    flags: [
                        '--disable-gpu',
                        '--headless',
                        '--no-sandbox',
                        '--remote-debugging-port=9222'
                    ]
                }
            },
            concurrency: Infinity
        });
    };

}).call(this);

