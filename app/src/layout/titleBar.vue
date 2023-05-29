<template>
    <div class="title-bar">

        <div class="left-content">
            <!-- <img src="" alt=""> -->
            Dungeons and Sounds
        </div>

        <div class="right-content">
            <button @click="winMinimize">
                <el-icon>
                    <Minus />
                </el-icon>
            </button>
            <button @click="winMaximize">
                <el-icon>
                    <CopyDocument />
                </el-icon>
            </button>
            <button @click="winClose">
                <el-icon>
                    <CloseBold />
                </el-icon>
            </button>
        </div>

    </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'

import { ipcRenderer } from 'electron';

export default {
    setup() {      

        const winMinimize = () => {
            ipcRenderer.send('minimize')
        }

        const winMaximize = () => {
            ipcRenderer.send('maximize')
        }

        const winMove = () => {
            ipcRenderer.send('close')
        }

        const winClose = () => {
            ipcRenderer.send('close')
        }

        return {
            winMinimize,
            winMaximize,
            winMove,
            winClose,
        }
    }
}
</script>