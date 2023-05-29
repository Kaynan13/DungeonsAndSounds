import {createStore} from "vuex"

import tableModule from "./modules/tableModule"

const store = createStore({
    modules: {
        tableModule
    }
});

export default store;