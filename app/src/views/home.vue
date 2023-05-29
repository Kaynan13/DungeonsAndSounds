<template>
    <div class="play-page" v-if="tableSelected == ''">
        <div class="table-list-container">
            <div :class="['table-box', returnTableClass()]" v-for="item in tables" @click="tableSelected = item.fileName;">                
                <div class="table-name">                
                    {{ item.name }}
                </div>
            </div>
        </div>
        
    </div>
        <soundTable v-else :tableSelected="tableSelected" @back="tableSelected = ''"></soundTable>        
</template>

<script lang="ts">
import { ref } from 'vue';
import { useStore } from 'vuex'

import soundTable from './soundTable.vue';
import { ipcRenderer } from 'electron';
import { tableActions } from '../store/enums/tableEnum';

export default {
    components: {
        soundTable,
    },

    setup() {        
        const store = useStore();
        const mainFolder = ref(`${__dirname.substring(0, __dirname.indexOf('resources') + 10).replaceAll(/\\/g, "/")}`);

        const tableSelected = ref('');

        const tables = ref<Array<any>>([]);

        const getTables = () => {
            store.dispatch(tableActions.GET_TABLES).then(res => {
                tables.value = res;
            })
        }

        getTables();

        const returnTableClass = () => {
            return `table0${Math.round(Math.random()*2)}`;
        }

        return {
            tables,
            tableSelected,

            returnTableClass,
        }
    }
}
</script>