<template>
    <!-- Home and tables manager -->
    <tableList ref="tableListRef" v-if="tableSelected == '' && configLoaded" @create="opentableCreate"
        @select="selectTable" />
    <tableCreate ref="tableCreateRef" v-if="tableSelected == '' && configLoaded" @created="updateList" />

    <!-- Sounds and scenes manager -->    
    <soundList v-if="tableSelected !== ''" :tableSelected="tableSelected" @back="tableSelected = ''" />
</template>

<script lang="ts">
import { ref, } from 'vue'
import { useStore } from 'vuex'

// import soundTable from './soundTable.vue'
import tableCreate from '../components/tableCreate.vue'
import tableList from '../components/tableList.vue'
import soundList from '../components/soundTable/soundList.vue'

import fs from 'fs'
import { ipcRenderer } from 'electron'
import { tableActions } from '../store/enums/tableEnum'

export default {
    components: {        
        tableCreate,
        tableList,
        soundList
    },

    setup() {
        const store = useStore()

        const configLoaded = ref(false)

        const resourcePath = `${__dirname.substring(0, __dirname.indexOf('resources') + 10).replaceAll(/\\/g, "/")}`;
        fs.readdir(resourcePath, (err, files) => {
            if (err) {
                console.error(err);
                return
            }

            if (!files.includes('configFile.json'))
                ipcRenderer.send('choosePath')
            else {
                store.dispatch(tableActions.GET_CONFIG_FILE)
                configLoaded.value = true
            }
        })

        ipcRenderer.on('choosedPath', (evt, path) => {
            let model = {
                tablesPath: path
            }
            store.dispatch(tableActions.CREATE_CONFIG_FILE, model)
            store.dispatch(tableActions.SET_FOLDER_DIR_ACTION, path)
            configLoaded.value = true
        })

        const tableSelected = ref('')

        const selectTable = (table: string) => {
            tableSelected.value = table
        }

        const tableListRef = ref()

        const updateList = (table: string) => {
            debugger
            tableListRef.value.getTables()

            tableSelected.value = `${table}.json`
        }

        const tableCreateRef = ref()

        const opentableCreate = () => {
            tableCreateRef.value.openTableCreate()
        }        

        return {
            tableSelected,
            tableListRef,
            tableCreateRef,
            configLoaded,

            selectTable,
            updateList,
            opentableCreate,
        }
    }
}
</script>