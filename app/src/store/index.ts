import {createStore} from "vuex"

import tableModule from "./modules/tableModule"
import DndModule from "./modules/DndModule"

const store = createStore({
    modules: {
        tableModule,
        DndModule
    }
});

export default store;