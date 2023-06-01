<template>
    <div class="play-page">
        <div class="table-list-container">
            <div class="table-box add-table" @click="openTableCreate">
                <div class="table-name">
                    <el-icon>
                        <Plus />
                    </el-icon>
                    <br />
                    Nova Mesa
                </div>
            </div>

            <div :class="['table-box', returnTableClass()]" v-for="item in tables" @click="selectedTable(item.fileName)">

                <div class="table-options">
                    <el-button circle type="info" plain @click="exportTable(item.fileName, $event)">

                        <el-icon>
                            <Download />
                        </el-icon>

                    </el-button>

                    <el-button circle type="danger" plain @click="excludeTable(item.fileName, $event)">

                        <el-icon>
                            <DeleteFilled />
                        </el-icon>

                    </el-button>
                </div>

                <div class="table-name">
                    {{ item.name }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useStore } from 'vuex'

import { tableActions } from '../store/enums/tableEnum'
import { ipcRenderer } from 'electron'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
    emit: ['select', 'create'],

    setup(props, { emit }) {
        console.log('table list')
        const store = useStore()

        const tables = ref<Array<any>>([])

        const getTables = () => {
            return new Promise(resolve => {
                store.dispatch(tableActions.GET_TABLES).then(res => {
                    tables.value = res;
                    resolve(true);
                }).catch(() => {
                    resolve(false)
                })
            })
        }
        getTables()

        const returnTableClass = () => {
            return `table0${Math.round(Math.random() * 2)}`;
        }

        const openTableCreate = () => {
            emit('create');
        }

        const selectedTable = (table: string) => {
            emit('select', table)
        }


        const exportTable = (table: string, evt: any) => {
            evt.stopPropagation()

            let mainFolder = `${__dirname.substring(0, __dirname.indexOf('resources') + 10).replaceAll(/\\/g, "/")}`;
            ipcRenderer.send("download", {
                payload: {
                    fileUrl: `${mainFolder}${table}`
                }
            })
        }

        const excludeTable = (table: string, evt: any) => {
            evt.stopPropagation()

            ElMessageBox.confirm(
                `Você está prestes a deletar a mesa ${table}!`,
                'Warning',
                {
                    confirmButtonText: 'Deletar',
                    cancelButtonText: 'Cancelar',
                    type: 'warning',
                }
            ).then(() => {
                store.dispatch(tableActions.DELETE_TABLE, table).then(res => {
                    ElMessage.success(`Mesa ${table} deletada com sucesso.`)
                    getTables()
                });
            }).catch(() => {
                ElMessage.error(`Erro ao deletar mesa ${table}.`)
            })
        }

        return {
            // data
            tables,

            // methods
            getTables,
            returnTableClass,
            selectedTable,
            openTableCreate,
            exportTable,
            excludeTable,
        }
    }
}
</script>