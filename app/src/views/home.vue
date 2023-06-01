<template>
    <!-- Home and tables manager -->
    <tableList ref="tableListRef" v-if="tableSelected == ''" @create="opentableCreate" @select="selectTable" />
    <tableCreate ref="tableCreateRef" v-if="tableSelected == ''" @created="updateList" />

    <!-- Sounds and scenes manager -->
    <soundTable v-if="tableSelected !== ''" :tableSelected="tableSelected" @back="tableSelected = ''" />
</template>

<script lang="ts">
import { ref } from 'vue'
import { useStore } from 'vuex'

import soundTable from './soundTable.vue'
import tableCreate from '../components/tableCreate.vue'
import tableList from '../components/tableList.vue'

export default {
    components: {
        soundTable,
        tableCreate,
        tableList
    },

    setup() {
        const store = useStore()

        const tableSelected = ref('')

        const selectTable = (table: string) => {
            console.log(table)
            tableSelected.value = table
        }

        // const getTables = () => {
        //     store.dispatch(tableActions.GET_TABLES).then(res => {
        //         tables.value = res;
        //     })
        // }

        const tableListRef = ref()

        const updateList = (table: string) => {
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

            selectTable,
            updateList,
            opentableCreate,
        }
    }
}
</script>