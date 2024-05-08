<template>
    <div class="title-bar">

        <div class="left-content">
            <!-- <img src="" alt=""> -->
            <img src="../assets/images/DS-Logo.png">
            <span class="version">v{{ appVersion }}</span>            
        </div>

        <div class="right-content">
            <el-tooltip content="Nova versão disponivel" v-if="hasUpdate">
                <button class="update-button" @click="downloadUpdate">
                    <el-icon>
                        <Download />
                    </el-icon>
                </button>
            </el-tooltip>

            <button class="system-button" @click="winMinimize">
                <el-icon>
                    <Minus />
                </el-icon>
            </button>
            <button class="system-button" @click="winMaximize">
                <el-icon>
                    <CopyDocument />
                </el-icon>
            </button>
            <button class="system-button" @click="winClose">
                <el-icon>
                    <CloseBold />
                </el-icon>
            </button>            
        </div>        

    </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'

import { ipcRenderer } from 'electron'

import { ElMessage, ElMessageBox } from 'element-plus'

import { version } from '../../package.json'

export default {
    setup() {
        const appVersion = ref(version);

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

        const hasUpdate = ref<boolean>(false);

        ipcRenderer.on('update-avaliable', () => {
            hasUpdate.value = true;            
        })

        const downloadUpdate = () => {
            ElMessageBox.confirm(
                `Bora instalar a nova versão do Dungeons and Sounds?`,
                'Success',
                {
                    confirmButtonText: 'Atualizar',
                    cancelButtonText: 'Deixa pra depois',
                    type: 'success',
                    title: 'Yeeeees!',
                    icon: 'Download'
                }
            ).then(() => {
                ipcRenderer.send('start-update');
            });
        }

        ipcRenderer.on('update-error', (err: any) => {
            ElMessage({
                type: 'error',
                message: err,
            })
        })

        return {
            // data
            appVersion,
            hasUpdate,

            // methods        
            winMinimize,
            winMaximize,
            winMove,
            winClose,
            downloadUpdate,
        }
    }
}
</script>