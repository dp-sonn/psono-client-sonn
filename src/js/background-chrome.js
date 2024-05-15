import backgroundService from "./services/background";
import {persistStore} from "redux-persist";
import {initStore} from "./services/store";

const channel = new BroadcastChannel("account");
let alreadyLoaded = false;

// Add an event listener to handle incoming messages
channel.onmessage = function (event) {
    if (!event.data.hasOwnProperty("event")) {
        return;
    }
    if (event.data.event === 'reinitialize-app') {
        activate()
    }
};

function loadAfterStore(dispatch, getState) {
    backgroundService.activate()
}
async function activate() {
    console.log("activate");
    const store = await initStore();
    persistStore(store, null, () => {
        if (!alreadyLoaded) {
            alreadyLoaded = true;
            store.dispatch(loadAfterStore);
        }
    });
}

activate();
