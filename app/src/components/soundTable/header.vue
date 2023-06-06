<template>
    <div>

        <div class="sound-table-header">
            <el-button @click="backToTableList" circle>
                <el-icon>
                    <Back />
                </el-icon>
            </el-button>

            <div class="sound-list-title">Mesa:<div class="table-name"> {{ table }}</div></div>

            <el-select v-model="groupSelected" @change="selectGroup" collapse-tags placeholder="Grupo" style="width: 240px">                
                <el-option label="Todos" :value="null" />
                <el-option v-for="group in soundsGroups" :label="group.name" :value="group.name" />
            </el-select>
        </div>

    </div>
</template>

<script lang="ts">
import { ref, computed } from 'vue'
export default {
    props: {
        tableSelected: {
            type: String,
            default: () => {
                return ''
            }
        },
        soundsGroups: {
            type: Array<any>,
            default: () => {
                return []
            }
        }
    },

    emit: ['back', 'selectedGroup'],

    setup(props, { emit }) {

        const backToTableList = () => {
            emit('back')
        }

        const groupSelected = ref();

        const selectGroup = () => {            
            emit('selectedGroup', groupSelected.value)
        }

        const table = computed(() => {
            return props.tableSelected.includes('.') ? props.tableSelected.split('.')[0] : props.tableSelected
        })

        return {
            // data
            groupSelected,
            table,

            // methods
            backToTableList,
            selectGroup,
        }
    }
}
</script>