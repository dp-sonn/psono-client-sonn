var CACHE_VERSION = '%%PSONOVERSION%%';

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_VERSION).then(function(cache) {
            return cache.addAll([
                './',
                './activate.html',
                './link-share-access.html',
                './background.html',
                './config.json',
                './default_popup.html',
                './enforce-two-fa.html',
                './index.html',
                './lost-password.html',
                './open-secret.html',
                './download-file.html',
                './popup_pgp.html',
                './privacy-policy.html',
                './privacy-policy-content.html',
                './register.html',
                './search.xml',
                './VERSION.txt',
                './css/lib/angular-csp.css',
                './css/lib/angular-datatables.css',
                './css/lib/angular-snap.css',
                './css/lib/angular-ui-select.css',
                './css/lib/bootstrap.css',
                './css/lib/bootstrap-datetimepicker.min.css',
                './css/lib/cssreset-context-min.css',
                './css/lib/datatables.bootstrap.css',
                './css/lib/datatables.min.css',
                './css/lib/font-awesome.min.css',
                './css/lib/fira_code.css',
                './css/lib/loading-bar.min.css',
                './css/lib/opensans.css',
                './css/lib/ui-bootstrap-csp.css',
                './css/angular-tree-view.css',
                './css/contentscript.css',
                './css/datastore.css',
                './css/default_popup.css',
                './css/main.css',
                './css/style.css',

                './fonts/FiraCode-Bold.eot',
                './fonts/FiraCode-Bold.ttf',
                './fonts/FiraCode-Bold.woff',
                './fonts/FiraCode-Bold.woff2',
                './fonts/FiraCode-Light.eot',
                './fonts/FiraCode-Light.ttf',
                './fonts/FiraCode-Light.woff',
                './fonts/FiraCode-Light.woff2',
                './fonts/FiraCode-Medium.eot',
                './fonts/FiraCode-Medium.ttf',
                './fonts/FiraCode-Medium.woff',
                './fonts/FiraCode-Medium.woff2',
                './fonts/FiraCode-Regular.eot',
                './fonts/FiraCode-Regular.ttf',
                './fonts/FiraCode-Regular.woff',
                './fonts/FiraCode-Regular.woff2',
                './fonts/FontAwesome.otf',
                './fonts/fontawesome-webfont.eot?v=4.7.0',
                './fonts/fontawesome-webfont.svg?v=4.7.0',
                './fonts/fontawesome-webfont.ttf?v=4.7.0',
                './fonts/fontawesome-webfont.woff?v=4.7.0',
                './fonts/fontawesome-webfont.woff2?v=4.7.0',
                './fonts/glyphicons-halflings-regular.eot',
                './fonts/glyphicons-halflings-regular.svg',
                './fonts/glyphicons-halflings-regular.ttf',
                './fonts/glyphicons-halflings-regular.woff',
                './fonts/glyphicons-halflings-regular.woff2',
                './fonts/opensans-cyrillic.woff2',
                './fonts/opensans-cyrillic-ext.woff2',
                './fonts/opensans-greek.woff2',
                './fonts/opensans-greek-ext.woff2',
                './fonts/opensans-latin.woff2',
                './fonts/opensans-latin-ext.woff2',
                './fonts/opensans-vietnamese.woff2',

                './img/android-chrome-192x192.png',
                './img/android-chrome-512x512.png',
                './img/apple-touch-icon.png',
                './img/appstore_apple.png',
                './img/appstore_google.png',
                './img/browserconfig.xml',
                './img/favicon.ico',
                './img/favicon-16x16.png',
                './img/favicon-32x32.png',
                './img/icon-16.png',
                './img/icon-32.png',
                './img/icon-48.png',
                './img/icon-64.png',
                './img/icon-128.png',
                './img/logo.png',
                './img/logo-inverse.png',
                './img/mstile-150x150.png',
                './img/psono-decrypt.png',
                './img/psono-encrypt.png',
                './img/sort_asc.png',
                './img/sort_asc_disabled.png',
                './img/sort_both.png',
                './img/sort_desc.png',
                './img/sort_desc_disabled.png',

                './translations/datatables.da.json',
                './translations/datatables.sv.json',
                './translations/datatables.no.json',
                './translations/datatables.he.json',
                './translations/datatables.ar.json',
                './translations/datatables.hi.json',
                './translations/datatables.bn.json',
                './translations/datatables.cs.json',
                './translations/datatables.de.json',
                './translations/datatables.en.json',
                './translations/datatables.es.json',
                './translations/datatables.fi.json',
                './translations/datatables.fr.json',
                './translations/datatables.hr.json',
                './translations/datatables.it.json',
                './translations/datatables.ja.json',
                './translations/datatables.ko.json',
                './translations/datatables.nl.json',
                './translations/datatables.pl.json',
                './translations/datatables.pt.json',
                './translations/datatables.pt-br.json',
                './translations/datatables.ru.json',
                './translations/datatables.vi.json',
                './translations/datatables.zh-cn.json',
                './translations/datatables.zh-hant.json',

                './translations/locale-da.json',
                './translations/locale-sv.json',
                './translations/locale-no.json',
                './translations/locale-he.json',
                './translations/locale-ar.json',
                './translations/locale-hi.json',
                './translations/locale-bn.json',
                './translations/locale-cs.json',
                './translations/locale-de.json',
                './translations/locale-en.json',
                './translations/locale-es.json',
                './translations/locale-fi.json',
                './translations/locale-fr.json',
                './translations/locale-hr.json',
                './translations/locale-it.json',
                './translations/locale-ja.json',
                './translations/locale-ko.json',
                './translations/locale-nl.json',
                './translations/locale-pl.json',
                './translations/locale-pt.json',
                './translations/locale-pt-br.json',
                './translations/locale-ru.json',
                './translations/locale-vi.json',
                './translations/locale-zh-cn.json',
                './translations/locale-zh-hant.json',


                './js/lib/ecma-nacl.min.js',
                './js/lib/openpgp.min.js',
                './js/lib/sha512.min.js',
                './js/lib/sha256.min.js',
                './js/lib/sha1.min.js',
                './js/lib/uuid.js',
                './js/lib/chart.min.js',
                './js/lib/client.min.js',
                './js/lib/FileSaver.min.js',
                './js/lib/text-decoder-polyfill.min.js',
                './js/lib/jquery.min.js',
                './js/lib/datatables.min.js',
                './js/lib/snap.min.js',
                './js/lib/jquery-ui.min.js',
                './js/lib/lokijs.min.js',
                './js/lib/qrcode.min.js',
                './js/lib/fastclick.js',
                './js/lib/papaparse.min.js',
                './js/lib/fast-xml-parser.js',

                './js/lib/angular.min.js',
                './js/lib/raven.min.js',
                './js/raven.js',
                './js/lib/angular-cookies.min.js',
                './js/lib/angular-animate.min.js',
                './js/lib/angular-touch.min.js',
                './js/lib/angular-complexify.min.js',
                './js/lib/moment-with-locales.min.js',
                './js/lib/bootstrap-datetimepicker.min.js',
                './js/lib/loading-bar.min.js',
                './js/lib/angular-chart.min.js',
                './js/lib/angular-route.min.js',
                './js/lib/angular-sanitize.min.js',
                './js/lib/angular-local-storage.min.js',
                './js/lib/angular-snap.min.js',
                './js/lib/angular-translate.min.js',
                './js/lib/angular-eonasdan-datetimepicker.min.js',
                './js/lib/angular-translate-storage-cookie.min.js',
                './js/lib/angular-translate-loader-url.min.js',
                './js/lib/angular-translate-loader-static-files.min.js',
                './js/lib/ui-bootstrap-tpls.min.js',
                './js/lib/angular-datatables.js',
                './js/lib/angular-ui-select.js',
                './js/lib/ng-context-menu.js',

                './js/module/ng-tree.js',

                './js/main.js',
                './js/service-worker-load.js',
                './js/crypto-worker.js',

                './js/directive/autoFocus.js',
                './js/directive/fileReader.js',
                './js/directive/treeView.js',
                './js/directive/treeViewNode.js',

                './js/controller/AcceptShareCtrl.js',
                './js/controller/ChooseFolderCtrl.js',
                './js/controller/ChooseSecretsCtrl.js',
                './js/controller/AccountCtrl.js',
                './js/controller/ActivationCtrl.js',
                './js/controller/ActiveLinkSharesCtrl.js',
                './js/controller/DatastoreCtrl.js',
                './js/controller/SecurityReportCtrl.js',
                './js/controller/LanguagePickerCtrl.js',
                './js/controller/LinkShareAccessCtrl.js',
                './js/controller/LoginCtrl.js',
                './js/controller/GPGDecryptMessageCtrl.js',
                './js/controller/GPGEncryptMessageCtrl.js',
                './js/controller/LostPasswordCtrl.js',
                './js/controller/ActivateEmergencyCodeCtrl.js',
                './js/controller/MainCtrl.js',

                './js/controller/modal/AcceptShareCtrl.js',
                './js/controller/modal/ChooseFolderCtrl.js',
                './js/controller/modal/ChooseSecretsCtrl.js',
                './js/controller/modal/ConfigureGoogleAuthenticatorCtrl.js',
                './js/controller/modal/DeleteOtherSessionsCtrl.js',
                './js/controller/modal/AddGPGReceiverCtrl.js',
                './js/controller/modal/ConfigureDuoCtrl.js',
                './js/controller/modal/ConfigureYubiKeyOTPCtrl.js',
                './js/controller/modal/CreateDatastoreCtrl.js',
                './js/controller/modal/CreateAPIKeyCtrl.js',
                './js/controller/modal/CreateFileRepositoryCtrl.js',
                './js/controller/modal/EditAPIKeyCtrl.js',
                './js/controller/modal/EditDatastoreCtrl.js',
                './js/controller/modal/DeleteDatastoreCtrl.js',
                './js/controller/modal/DatastoreNewEntryCtrl.js',
                './js/controller/modal/DisplayShareRightsCtrl.js',
                './js/controller/modal/EditEntryCtrl.js',
                './js/controller/modal/EditFileRepositoryCtrl.js',
                './js/controller/modal/EditFolderCtrl.js',
                './js/controller/modal/GoOfflineCtrl.js',
                './js/controller/modal/HistoryCtrl.js',
                './js/controller/modal/NewFolderCtrl.js',
                './js/controller/modal/ErrorCtrl.js',
                './js/controller/modal/VerifyCtrl.js',
                './js/controller/modal/NewGroupCtrl.js',
                './js/controller/modal/PickUserCtrl.js',
                './js/controller/modal/RecyclingBinCtrl.js',
                './js/controller/modal/SelectUserCtrl.js',
                './js/controller/modal/EditGroupCtrl.js',
                './js/controller/modal/EncryptMessageGPGCtrl.js',
                './js/controller/modal/DecryptMessageGPGCtrl.js',
                './js/controller/modal/EditGPGUserCtrl.js',
                './js/controller/modal/GenerateNewMailGPGKeyCtrl.js',
                './js/controller/modal/ImportMailGPGKeyAsTextCtrl.js',
                './js/controller/modal/ShareEditEntryCtrl.js',
                './js/controller/modal/CreateLinkShareCtrl.js',
                './js/controller/modal/EditLinkShareCtrl.js',
                './js/controller/modal/ShareEntryCtrl.js',
                './js/controller/modal/ShareNewEntryCtrl.js',
                './js/controller/modal/ShowEmergencyCodesCtrl.js',
                './js/controller/modal/ShowQRClientConfigCtrl.js',
                './js/controller/modal/ShowRecoverycodeCtrl.js',
                './js/controller/modal/UnlockOfflineCacheCtrl.js',
                './js/controller/modal/DeleteAccountCtrl.js',
                './js/controller/EditEntryBigCtrl.js',
                './js/controller/NotificationBannerCtrl.js',
                './js/controller/OpenSecretCtrl.js',
                './js/controller/DownloadFileCtrl.js',
                './js/controller/OtherCtrl.js',
                './js/controller/OtherSessionsCtrl.js',
                './js/controller/OtherKnownHostsCtrl.js',
                './js/controller/OtherDatastoreCtrl.js',
                './js/controller/OtherAPIKeyCtrl.js',
                './js/controller/OtherFileRepositoryCtrl.js',
                './js/controller/OtherExportCtrl.js',
                './js/controller/OtherImportCtrl.js',
                './js/controller/PanelCtrl.js',
                './js/controller/RegisterCtrl.js',
                './js/controller/SettingsCtrl.js',
                './js/controller/ShareCtrl.js',
                './js/controller/ShareusersCtrl.js',
                './js/controller/GroupsCtrl.js',
                './js/controller/WrapperCtrl.js',
                './js/controller/Enforce2FaCtrl.js',

                './js/service/api-client.js',
                './js/service/api-gcp.js',
                './js/service/api-do.js',
                './js/service/api-backblaze.js',
                './js/service/api-aws.js',
                './js/service/api-azure-blob.js',
                './js/service/api-other-s3.js',
                './js/service/api-fileserver.js',
                './js/service/api-pwnedpasswords.js',
                './js/service/helper.js',
                './js/service/device.js',
                './js/service/message.js',
                './js/service/notification.js',
                './js/service/item-blueprint.js',
                './js/service/share-blueprint.js',
                './js/service/crypto-library.js',
                './js/service/converter.js',
                './js/service/openpgp.js',
                './js/service/storage.js',
                './js/service/offline-cache.js',
                './js/service/account.js',
                './js/service/settings.js',
                './js/service/manager-base.js',
                './js/service/language-picker.js',
                './js/service/manager.js',
                './js/service/manager-widget.js',
                './js/service/manager-datastore.js',
                './js/service/manager-api-keys.js',
                './js/service/manager-secret-link.js',
                './js/service/manager-share-link.js',
                './js/service/manager-export.js',
                './js/service/manager-file-transfer.js',
                './js/service/manager-file-link.js',
                './js/service/manager-file-repository.js',
                './js/service/manager-hosts.js',
                './js/service/manager-import.js',
                './js/service/manager-link-share.js',
                './js/service/manager-security-report.js',
                './js/service/import-1password-csv.js',
                './js/service/import-chrome-csv.js',
                './js/service/import-enpass-json.js',
                './js/service/import-psono-pw-json.js',
                './js/service/import-lastpass-com-csv.js',
                './js/service/import-pwsafe-org-csv.js',
                './js/service/import-teampass-net-csv.js',
                './js/service/import-keepassx-org-csv.js',
                './js/service/import-keepass-info-csv.js',
                './js/service/import-keepass-info-xml.js',
                './js/service/manager-status.js',
                './js/service/manager-secret.js',
                './js/service/manager-share.js',
                './js/service/manager-datastore-password.js',
                './js/service/manager-datastore-user.js',
                './js/service/manager-datastore-gpg-user.js',
                './js/service/manager-groups.js',
                './js/service/manager-history.js',
                './js/service/manager-datastore-setting.js',
                './js/service/browser-client.js',
                './js/service/drop-down-menu-watcher.js',

                './view/templates.js',

                './view/account.html',
                './view/datastore.html',
                './view/index-gpg-decrypt.html',
                './view/index-gpg-encrypt.html',
                './view/index-groups.html',
                './view/index-active-link-shares.html',
                './view/index-security-report.html',
                './view/index-share-shares.html',
                './view/index-share-users.html',
                './view/modal/accept-share.html',
                './view/modal/add-gpg-receiver.html',
                './view/modal/add-gpg-user.html',
                './view/modal/create-datastore.html',
                './view/modal/decrypt-message-gpg.html',
                './view/modal/delete-account.html',
                './view/modal/delete-datastore.html',
                './view/modal/delete-other-sessions.html',
                './view/modal/display-share-rights.html',
                './view/modal/edit-datastore.html',
                './view/modal/edit-entry.html',
                './view/modal/edit-folder.html',
                './view/modal/edit-gpg-user.html',
                './view/modal/edit-group.html',
                './view/modal/encrypt-message-gpg.html',
                './view/modal/generate-new-mail-gpg-key.html',
                './view/modal/go-offline.html',
                './view/modal/import-mail-gpg-key-as-text.html',
                './view/modal/new-entry.html',
                './view/modal/new-folder.html',
                './view/modal/new-group.html',
                './view/modal/pick-user.html',
                './view/modal/recycling-bin.html',
                './view/modal/setup-duo.html',
                './view/modal/setup-google-authenticator.html',
                './view/modal/setup-yubikey-otp.html',
                './view/modal/share-entry.html',
                './view/modal/create-link-share.html',
                './view/modal/edit-link-share.html',
                './view/modal/show-recoverycode.html',
                './view/modal/unlock-offline-cache.html',
                './view/modal/verify.html',
                './view/modal/error.html',
                './view/other.html',
                './view/popover-server-select.html',
                './view/settings.html',
                './view/tree-view.html'

            ]);
        })
    );
});

self.addEventListener('fetch', function(event) {
    //console.log(event.request);
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                //console.log(response);
                if (response) {
                    //console.log('Serve from cache');
                    return response;
                } else {
                    return fetch(event.request).then(function (response) {
                        //console.log(response);
                        return response;
                    }, function (response) {
                        //console.log(response);
                    });
                }
        })
    );
});

self.addEventListener('activate', function(event) {
    var cacheWhitelist = [CACHE_VERSION];

    event.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (cacheWhitelist.indexOf(key) !== -1) {
                    return;
                }
                return caches.delete(key);
            }));
        })
    );
});