<template>
    <div>

        <div class="sound-table-header">
            <el-button @click="backToTableList" circle>
                <el-icon>
                    <Back />
                </el-icon>
            </el-button>

            <!-- <el-radio-group v-model="groupSelected" @change="selectGroup" small>
                <el-radio-button :label="null">Todos</el-radio-button>
                <el-radio-button v-for="group in soundsGroups" :label="group.groupName" />
            </el-radio-group> -->

            <el-select v-model="groupSelected" @change="selectGroup" collapse-tags placeholder="Grupo" style="width: 240px">                
                <el-option label="Todos" :value="null" />
                <el-option v-for="group in soundsGroups" :label="group.groupName" :value="group.groupName" />
            </el-select>
        </div>

    </div>
</template>

<script lang="ts">
import { ref } from 'vue'
export default {
    props: {
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

        return {
            // data
            groupSelected,

            // methods
            backToTableList,
            selectGroup,
        }
    }
}
</script>