(function () {
    module.exports = function (config) {
        return config.set({
            basePath: '',
            frameworks: ['jasmine'],
            files: [
                "../src/common/data/js/lib/ecma-nacl.min.js",
                "../src/common/data/js/lib/sha512.min.js",
                "../src/common/data/js/lib/sha256.min.js",
                "../src/common/data/js/lib/uuid.js",
                "../src/common/data/js/lib/jquery.min.js",
                "../src/common/data/js/lib/datatables.min.js",
                "../src/common/data/js/lib/snap.min.js",
                "../src/common/data/js/lib/jquery-ui.min.js",
                "../src/common/data/js/lib/sortable.min.js",
                "../src/common/data/js/lib/lokijs.min.js",
                "../src/common/data/js/lib/qrcode.min.js",
                "../src/common/data/js/lib/password-generator.js",
                "../src/common/data/js/lib/angular.min.js",
                "../src/common/data/js/lib/angular-animate.min.js",
                "../src/common/data/js/lib/angular-complexify.min.js",
                "../src/common/data/js/lib/loading-bar.min.js",
                "../src/common/data/js/lib/angular-route.min.js",
                "../src/common/data/js/lib/angular-sanitize.min.js",
                "../src/common/data/js/lib/angular-local-storage.min.js",
                "../src/common/data/js/lib/angular-snap.min.js",
                "../src/common/data/js/lib/ui-bootstrap-tpls.min.js",
                "../src/common/data/js/lib/ngdraggable.js",
                "../src/common/data/js/angular-tree-view.js",
                "../src/common/data/js/lib/angular-ui-select.js",
                "../src/common/data/js/lib/ng-context-menu.js",
                "../src/common/data/js/lib/angular-datatables.js",
                "../src/common/data/js/main.js",
                "../src/common/data/js/widgets/widget-datastore.js",
                "../src/common/data/js/widgets/widget-shareusers.js",
                "../src/common/data/js/widgets/widget-accept-share.js",
                "../src/common/data/js/service/api-client.js",
                "../src/common/data/js/service/helper.js",
                "../src/common/data/js/service/message.js",
                "../src/common/data/js/service/item-blueprint.js",
                "../src/common/data/js/service/share-blueprint.js",
                "../src/common/data/js/service/crypto-library.js",
                "../src/common/data/js/service/storage.js",
                "../src/common/data/js/service/account.js",
                "../src/common/data/js/service/settings.js",
                "../src/common/data/js/service/manager-base.js",
                "../src/common/data/js/service/manager.js",
                "../src/common/data/js/service/manager-widget.js",
                "../src/common/data/js/service/manager-datastore.js",
                "../src/common/data/js/service/manager-secret-link.js",
                "../src/common/data/js/service/manager-share-link.js",
                "../src/common/data/js/service/manager-secret.js",
                "../src/common/data/js/service/manager-share.js",
                "../src/common/data/js/service/manager-datastore-password.js",
                "../src/common/data/js/service/manager-datastore-user.js",
                "../src/common/data/js/service/manager-datastore-setting.js",
                "../src/common/data/js/service/browser-client.js",
                "../src/common/data/js/service/password-generator.js",
                "../src/common/data/view/templates.js",

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
            browsers: ['PhantomJS'],
            singleRun: true,
            concurrency: Infinity
        });
    };

}).call(this);

