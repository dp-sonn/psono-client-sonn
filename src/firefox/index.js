var {ToggleButton} = require('sdk/ui/button/toggle');
var pageWorkers = require("sdk/page-worker");
var panels = require("sdk/panel");
var self = require("sdk/self");
var tabs = require("sdk/tabs");
var mod = require("sdk/page-mod");
var contextMenu = require("sdk/context-menu");

var allDatastoreTabs = {};
var allTabCount = 0;

var button = ToggleButton({
    id: "my-button",
    label: "my button",
    icon: {
        "16": "./img/icon-16.png",
        "32": "./img/icon-32.png",
        "64": "./img/icon-64.png"
    },
    onChange: handleChange
});

var panel = panels.Panel({
    contentURL: self.data.url("main.html"),
    onHide: handleHide,
    height: 250
});


var firstMenuItem = contextMenu.Item({
    label: "Main Menu",
    contentScript: 'self.on("click", function () {' +
    '  console.log("Item clicked!");' +
    '});',
    image: self.data.url("./img/icon-16.png")
});

var secondMenuItem = contextMenu.Menu({
    label: "Main Menu with submenus",
    items: [
        contextMenu.Item({
            label: "Submenu",
            contentScript: 'self.on("click", function () {' +
            '  console.log("Item clicked!");' +
            '});',
            image: self.data.url("./img/icon-16.png")
        })
    ],
    image: self.data.url("./img/icon-16.png")
});


/*
 * Some messaging stuff below
 */

panel.port.on('resize', function (data) {
    panel.resize((data.width), (data.height));
});

var openTab = function (data) {

    var tab = {
        url: "resource://sansopw" + data.url
    };

    tab.onReady = function(tab) {
        var worker = tab.attach({
            contentScriptFile: [
                "./js/lib/nacl_factory.js",
                "./js/lib/scrypt.js",
                "./js/lib/uuid.js",
                "./js/lib/jquery-2.1.4.js",
                "./js/lib/snap.min.js",
                "./js/lib/jquery.ui.js",
                "./js/lib/sortable.js",
                "./js/lib/lokijs.min.js",
                "./js/lib/angular.js",
                "./js/lib/angular-route.js",
                "./js/lib/angular-sanitize.js",
                "./js/lib/angular-local-storage.min.js",
                "./js/lib/angular-snap.min.js",
                "./js/lib/ui-bootstrap-tpls-0.13.4.min.js",
                "./js/lib/angular-tree-view.js",
                "./js/lib/angular-ui-select.js",
                "./js/lib/ng-context-menu.js",
                "./js/lib/angular-dashboard-framework.js",
                "./js/widgets/adf-widget-datastore.js",
                "./js/main.js",
                "./js/service/api-client.js",
                "./js/service/item-blueprint.js",
                "./js/service/crypto-library.js",
                "./js/service/storage.js",
                "./js/service/manager.js",
                "./js/service/browser-client.js",
                "./view/templates.js",
                "./content-script.js"
            ],
            onmessage: function (msg) {console.log("worker received " + msg)}
        });
        worker.port.on('login', onLogin);
        worker.port.on('logout', onLogout);
        worker.port.on('testmsg', function (data) {console.log("received test message")});
        worker.port.on('openTab', openTab);

        tab.worker_id = allTabCount;
        allDatastoreTabs[allTabCount] = worker;
        allTabCount++
    };
    tab.onClose = function(tab) {
        delete allDatastoreTabs[tab.worker_id];
    };

    tabs.open(tab);
};

panel.port.on('openTab', openTab);

function handleChange(state) {
    if (state.checked) {
        panel.show({
            position: button
        });
    }
}

// Test stuff below

var onLogin = function (data) {
    console.log("index.js login");
    panel.port.emit('login', null);
    for (var count in allDatastoreTabs) {
        if (allDatastoreTabs.hasOwnProperty(count)) {
            allDatastoreTabs[count].port.emit('login', null);
        }
    }
};

var onLogout = function (data) {
    console.log("index.js logout");
    panel.port.emit('logout', null);
    for (var count in allDatastoreTabs) {
        if (allDatastoreTabs.hasOwnProperty(count)) {
            allDatastoreTabs[count].port.emit('logout', null);
        }
    }
};

panel.port.on('login', onLogin);
panel.port.on('logout', onLogout);

function handleHide() {
    button.state('window', {checked: false});
}

//var lokijs = require("./data/js/lib/lokijs.min.js");
//var db = new lokijs.loki("password_manager_local_storage");
//var config = db.getCollection('config') || db.addCollection('config');
/*
panel.port.on('lokijs_config_insert', function (data) {
    config.insert(data.items);
});

panel.port.on('lokijs_config_data', function (data) {
    config.insert(data.items);
});
*/