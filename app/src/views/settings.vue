<template>
    <div>
        <!-- <el-radio-group v-model="settingsPage" style="margin-bottom: 30px">
            <el-radio-button label="top">top</el-radio-button>
            <el-radio-button label="right">right</el-radio-button>
            <el-radio-button label="bottom">bottom</el-radio-button>
            <el-radio-button label="left">left</el-radio-button>
        </el-radio-group> -->

        <!-- <ul v-infinite-scroll="load" class="infinite-list" style="overflow: auto">
            <li v-for="i in count" :key="i" class="infinite-list-item">{{ i }}</li>
        </ul> -->
        <sound></sound>
    </div>
</template>

<script>
    import {ref} from 'vue'

    import sound from './sound.vue'

    export default{
        components:{
            sound
        },
        setup(){
            const settingsPage = ref();

            return {
                settingsPage
            }
        }
    }

</script>