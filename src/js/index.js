import React, { Suspense } from "react";

import { render } from "react-dom";
import { HashLoader } from "react-spinners";
import { I18nextProvider } from "react-i18next";
import { HashRouter } from "react-router-dom";
import { createBrowserHistory } from "history";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import DateFnsUtils from "@date-io/date-fns";

import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { initStore } from "./services/store";
import datastoreSettingService from "./services/datastore-setting";
import i18n from "./i18n";
import theme from "./theme";
import { initSentry } from './var/sentry'

initSentry()

import IndexView from "./views/index";
import DownloadBanner from "./components/download-banner";



const channel = new BroadcastChannel("account");
// Add an event listener to handle incoming messages
channel.onmessage = function (event) {
    if (!event.data.hasOwnProperty("event")) {
        return;
    }
    if (event.data.event === 'reinitialize-app') {
        initAndRenderApp()
    }
};

/**
 * Loads the datastore
 * @param dispatch
 * @param getState
 */
function loadSettingsDatastore(dispatch, getState) {
    const state = getState();
    if (state.user.isLoggedIn) {
        datastoreSettingService.getSettingsDatastore();
    }
}
const customHistory = createBrowserHistory();

let currentPersistor = null;
let currentStore = null;

async function initAndRenderApp() {
    const store = await initStore();
    let persistor = persistStore(store, null, () => {
        store.dispatch(loadSettingsDatastore);
    });
    currentStore = store;
    currentPersistor = persistor;

    const App = () => {
        return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Provider store={store}>
                    <Suspense fallback="loading...">
                        <PersistGate loading={<HashLoader />} persistor={persistor}>
                            <I18nextProvider i18n={i18n}>
                                <ThemeProvider theme={theme}>
                                    <CssBaseline />
                                    <HashRouter history={customHistory} hashType={"hashbang"}>
                                        <DownloadBanner />
                                        <IndexView />
                                    </HashRouter>
                                </ThemeProvider>
                            </I18nextProvider>
                        </PersistGate>
                    </Suspense>
                </Provider>
            </MuiPickersUtilsProvider>
        );
    };

    const container = document.getElementById("app");
    render(<App />, container);
}

initAndRenderApp();

console.log("%cDanger:", "color:red;font-size:40px;");
console.log(
    "%cDo not type or paste anything here. This feature is for developers and typing or pasting something here can compromise your account.",
    "font-size:20px;"
);
