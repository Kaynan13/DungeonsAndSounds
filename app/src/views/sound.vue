<template>
    <div class="manage-sound-table">
        <div class="mesa-select" v-if="!tableSelected">
            <el-select v-model="tableSelected" size="large" style="width: 400px" filterable allow-create
                default-first-option :reserve-keyword="false" placeholder="Selecione ou Crie uma Mesa"
                @change="selectTable">
                <el-option v-for="item in tables" :key="item.fileName" :label="item.name" :value="item.fileName" />
            </el-select>
            <span>ou</span>
            <el-upload style="width: 400px" class="upload-demo" drag :on-change="changeUpload" accept="application/JSON"
                :auto-upload="false" :show-file-list="false">
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">
                    Arraste o arquivo aqui ou <em>clique para importar</em>
                </div>
            </el-upload>
        </div>

        <div class="header-manage-table" v-if="tableSelected">
            <div class="primary-header">
                <el-input v-model="search" placeholder="Buscar" style="width: 300px" @input="filterSounds" />
                <el-select v-model="tableSelected" style="width: 250px" filterable allow-create default-first-option
                    :reserve-keyword="false" placeholder="Selecione ou Crie uma Mesa" @change="selectTable">
                    <el-option v-for="item in tables" :key="item.fileName" :label="item.name" :value="item.fileName" />
                </el-select>
            </div>

            <div class="secundary-header">
                <div class="left-content">

                    <el-button @click="exportTable">
                        <el-icon>
                            <Download />
                        </el-icon> &nbsp; Exportar Mesa
                    </el-button>

                    <el-button style="margin-right: 10px;" type="danger" plain @click="excludeTable">
                        <el-icon>
                            <DeleteFilled />
                        </el-icon> &nbsp; Excluir Mesa
                    </el-button>

                </div>

                <el-button @click="modalToggle = true">
                    <el-icon>
                        <Plus />
                    </el-icon>
                    &nbsp; Adicionar Som
                </el-button>
            </div>
        </div>

        <div class="sound-list-scroll" v-if="tableSelected">
            <div class="sound-list-container">
                <h3 style="width: 100%; text-align:center; margin-top: 200px; color: #555" v-if="soundList.length == 0">
                    Ainda não foram carregados sons para esta mesa</h3>
                <div v-for="(sound, index) in soundList" :key="index" class="sound">
                    <img width="100" height="100" :src="sound.imageUrl">
                    <div class="sound-name">
                        <div class="sound-group">
                            {{ sound.group }}
                        </div>
                        {{ sound.name }}
                    </div>

                    <a :href="sound.soundUrl" target="_blank">
                        <el-icon>
                            <Link />
                        </el-icon>
                        YOUTUBE LINK
                    </a>

                    <el-button type="primary" circle @click="editSound(sound)">
                        <el-icon>
                            <Edit />
                        </el-icon>
                    </el-button>

                    <el-button type="danger" circle @click="deleteSound(sound)">
                        <el-icon>
                            <Delete />
                        </el-icon>
                    </el-button>
                </div>
            </div>
        </div>

        <!-- FORMULARIO DE CRIAR SONS -->
        <el-dialog v-model="modalToggle" title="Adicionar Som">

            <el-form label-width="100px" style="max-width: 460px" ref="ruleFormRef" :model="modelSound" :rules="rules">
                <el-form-item label="Grupo" prop="group">
                    <el-select v-model="modelSound.group" filterable allow-create default-first-option
                        :reserve-keyword="false" placeholder="Grupo">
                        <el-option v-for="item in selectedTableGroups" :key="item" :label="item" :value="item" />
                    </el-select>
                </el-form-item>

                <el-form-item label="Url Youtube" prop="soundUrl">
                    <el-input v-model="modelSound.soundUrl" @input="getVideoInfos" />
                </el-form-item>

                <el-form-item label="Nome" prop="name">
                    <el-input v-model="modelSound.name" />
                </el-form-item>

                <el-form-item label="Url Imagem" prop="imageUrl">
                    <el-input v-model="modelSound.imageUrl" />
                </el-form-item>
            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="closeModal(ruleFormRef)">Cancelar</el-button>
                    <el-button type="primary" @click="addingSoundToTable(ruleFormRef)">
                        Salvar
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { ref, computed } from 'vue'
import { ElLoading, ElMessage, ElMessageBox, FormInstance } from 'element-plus'

import axios from 'axios'

import { useStore } from 'vuex'

import Sound from '../store/entity/sound'
import Table from "../store/entity/table";

import type { createTable, postSound, putSound, deleteSound } from "../store/interface/tableInterface";

import fs from 'fs'
import { ipcRenderer } from 'electron'
import { tableActions } from '../store/enums/tableEnum'

export default {
    setup() {
        const store = useStore();

        const modalToggle = ref(false)

        const search = ref('')

        const modelSound = ref(new Sound())

        const ruleFormRef = ref<FormInstance | any>()
        const rules = ref({
            name: [{
                required: true,
                message: 'Preencha o campo nome.',
                trigger: 'change',
            }],
            soundUrl: [{
                required: true,
                message: 'Preencha o campo Url Youtube.',
                trigger: 'change',
            }],
            imageUrl: [{
                required: true,
                message: 'Preencha o campo Url Imagem.',
                trigger: 'change',
            }],
            group: [{
                required: true,
                message: 'Crie ou selecione um grupo.',
                trigger: 'change',
            }],
        })

        const mainFolder = ref(`${__dirname.substring(0, __dirname.indexOf('resources') + 10).replaceAll(/\\/g, "/")}`);

        const tablePath = computed(() => {
            return `${mainFolder.value}${tableSelected.value.includes('.json') ? tableSelected.value : tableSelected.value + '.json'}`;
        })

        const createNewConfig = (fileName: string, value: string | null = null) => {
            return new Promise(resolve => {
                try {
                    let model: createTable = {
                        fileName: fileName,
                        data: value
                    }

                    store.dispatch(tableActions.CREATE_TABLE, model).then(res => {
                        resolve(res);                        
                    })
                } catch (err) {
                    console.error(err)
                    resolve(false)
                }
            })
        }

        const tables = ref<Array<any>>([])
        const getTables = () => {
            return new Promise(resolve => {
                store.dispatch(tableActions.GET_TABLES).then(res => {
                    tables.value = res;
                    resolve(true)
                })
            })
        }
        getTables();

        const tableSelected = ref('')
        const selectTable = (evt: any) => {
            if (!evt.includes('.json') && !tables.value.some(item => item.name == evt)) {
                ElMessageBox.confirm(
                    `Você está prestes a criar a mesa ${evt}!`,
                    'Warning',
                    {
                        confirmButtonText: 'Criar',
                        cancelButtonText: 'Cancelar',
                        type: 'warning',
                    }
                ).then(() => {
                    let tableName = evt.replaceAll(' ', '-');
                    debugger;
                    createNewConfig(tableName).then(res => {
                        if (res) {
                            ElMessage({
                                type: 'success',
                                message: `Mesa ${evt} criada com sucesso`,
                            })

                            tables.value = []
                            getTables().then(res => {
                                getSoundsFromTable()
                                tableSelected.value = tables.value.find(item => item.name == evt).name;
                            })
                        } else {
                            ElMessage({
                                type: 'error',
                                message: `Erro ao criar mesa ${evt}`,
                            })
                        }
                    })
                }).catch(() => {
                    tableSelected.value = '';
                })
            } else {
                getSoundsFromTable()
            }
        }

        const rawTable = ref<any>();
        const allSounds = ref<Array<Sound>>([])
        const soundList = ref<Array<Sound>>([])
        const selectedTableGroups = ref<Array<string>>([])

        const getSoundsFromTable = () => {
            store.dispatch(tableActions.GET_SOUNDS, tableSelected.value).then(res => {
                rawTable.value = res;
                allSounds.value = rawTable.value.sounds
                soundList.value = rawTable.value.sounds

                selectedTableGroups.value = soundList.value.filter((x, i) => soundList.value.findIndex(y => y.group == x.group) === i).map((item: any) => {
                    return item.group
                })

                filterSounds(search.value)
            })
        }

        const filterSounds = (search: string) => {
            soundList.value = allSounds.value.filter(item => item.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) || item.group.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
        }

        const addingSoundToTable = async (formEl: FormInstance) => {
            if (!formEl) return

            debugger;
            await formEl.validate(valid => {
                if (valid) {       
                    if (modelSound.value.id) {
                        let model: postSound = {
                            table: tableSelected.value,
                            sound: modelSound.value
                        }

                        store.dispatch(tableActions.PUT_SOUND, model).then(res => {                            
                            getSoundsFromTable();
                        })
                    } else {
                        let model: postSound = {
                            table: tableSelected.value,
                            sound: modelSound.value
                        }

                        store.dispatch(tableActions.POST_SOUND, model).then(res => {
                            getSoundsFromTable();
                        })
                    }

                    modalToggle.value = false;
                    modelSound.value = new Sound();

                }
            })

        }

        const editSound = (sound: Sound) => {
            modelSound.value = sound;
            modalToggle.value = true;
        }

        const deleteSound = (sound: Sound) => {
            ElMessageBox.confirm(
                `Você está prestes a deletar o som: ${sound.name}`,
                'Warning',
                {
                    confirmButtonText: 'Deletar',
                    cancelButtonText: 'Cancelar',
                    type: 'warning',
                }
            ).then(() => {
                let model: deleteSound = {
                    table: tableSelected.value,
                    soundId: sound.id!
                } 
                
                store.dispatch(tableActions.DELETE_SOUND, model).then(res => {
                    getSoundsFromTable()
                })
            })
        }

        const closeModal = (formEl: FormInstance) => {
            if (!formEl) return

            formEl.resetFields();
            modalToggle.value = false;
            modelSound.value = new Sound();
        }

        const changeUpload = (file: any) => {
            if (file.raw.type == 'application/json') {
                let path = file.raw.path;

                fs.readFile(path, 'utf8', (err, data) => {
                    if (err) console.error(`Unable to scan file: ${err}`)

                    if (!data || data.length <= 0)
                        ElMessage.error('O arquivo selecionado está vazio.')
                    else {
                        createNewConfig(file.name.split('.')[0], data)
                        getTables()
                        tableSelected.value = file.name
                        selectTable(file.name)
                    }
                })
            } else {
                ElMessage.error('Selecione um arquivo no formato correto.')
            }
        }

        const exportTable = () => {
            ipcRenderer.send("download", {
                payload: {
                    fileUrl: tablePath.value
                }
            })
        }

        const excludeTable = () => {
            let fileName = tableSelected.value.includes('.json') ? tableSelected.value.split('.')[0] : tableSelected.value;
            ElMessageBox.confirm(
                `Você está prestes a deletar a mesa ${fileName}!`,
                'Warning',
                {
                    confirmButtonText: 'Deletar',
                    cancelButtonText: 'Cancelar',
                    type: 'warning',
                }
            ).then(() => {
                store.dispatch(tableActions.DELETE_TABLE, tableSelected.value).then(res => {
                    tableSelected.value = ''
                    getTables()
                    ElMessage.success(`Mesa ${fileName} deletada com sucesso.`)
                });
            }).catch(() => {
                ElMessage.error(`Erro ao deletar mesa ${fileName}.`)
            })
        }

        const getVideoInfos = async () => {
            if (modelSound.value.soundUrl.includes('?v=')) {
                let indexStart = modelSound.value.soundUrl.indexOf('?v=') + 3
                let videoId = modelSound.value.soundUrl.substring(indexStart, modelSound.value.soundUrl.length).split('&')[0]

                const loading = ElLoading.service({
                    lock: true,
                    background: 'rgba(0, 0, 0, 0.7)',
                });

                axios.get('http://localhost:9000/getInfos', {
                    params: {
                        id: videoId
                    }
                }).then(res => {
                    modelSound.value.imageUrl = res.data.thumbnails[1].url
                    modelSound.value.name = res.data.title

                    setTimeout(() => {
                        loading.close()
                    }, 500)
                })
            }
        }

        return {
            // data
            mainFolder,
            modalToggle,
            search,
            modelSound,
            rules,
            ruleFormRef,
            tables,
            tableSelected,
            soundList,
            selectedTableGroups,
            tablePath,

            // methods
            createNewConfig,
            selectTable,
            addingSoundToTable,
            editSound,
            deleteSound,
            closeModal,
            filterSounds,
            changeUpload,
            exportTable,
            excludeTable,
            getVideoInfos,
        }
    }
}

</script>