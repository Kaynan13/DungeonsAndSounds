<template>
    <el-dialog v-model="modal" title="Criar Mesa">
        <h5 style="margin-top: 0;">Crie uma nova mesa ou importe uma Existente</h5>
        <el-form ref="ruleFormRef" :model="modelCreateTable" :rules="rules">
            <el-form-item prop="fileName">
                <el-input v-model="modelCreateTable.fileName" placeholder="Nome da Mesa" />
            </el-form-item>
        </el-form>

        <div style="display: flex; flex-wrap: nowrap; align-items: center; margin-bottom: 20px; opacity: 0.5;">
            <hr width="100%" />
            <div style="margin: 0 10px; line-height: 1;">ou</div>
            <hr width="100%" />
        </div>

        <el-upload class="upload-demo" drag :on-change="changeUpload" accept="application/JSON" :auto-upload="false"
            :show-file-list="false">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
                Arraste o arquivo aqui ou <em>clique para importar</em>
            </div>
        </el-upload>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="closeModal(ruleFormRef)">Cancelar</el-button>
                <el-button type="primary" @click="submit(ruleFormRef)">
                    Salvar
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { ElMessage, FormInstance } from 'element-plus'
import { ref } from 'vue'
import { useStore } from 'vuex'

import fs from 'fs'
import { ipcRenderer } from 'electron'

import { tableActions } from '../store/enums/tableEnum'
import type { createTable } from "../store/interface/tableInterface";

export default {

    emit: ['created'],

    setup(props, { emit }) {
        const store = useStore()

        const modal = ref(false)

        const openTableCreate = () => {
            modal.value = true
        }

        const ruleFormRef = ref<FormInstance | any>()
        const rules = ref({
            fileName: [{
                required: true,
                message: 'Dê um nome para sua mesa.',
                trigger: 'change'
            }]
        })

        const modelCreateTable = ref({
            fileName: ''
        });

        const closeModal = (formEl: FormInstance) => {
            if (!formEl) return

            formEl.resetFields();
            modal.value = false;
            modelCreateTable.value = { fileName: '' };
        }

        const submit = (formEl: FormInstance) => {
            if (!formEl) return

            formEl.validate(valid => {
                if (valid) {
                    createTableFile(modelCreateTable.value!.fileName).then(res => {
                        if(res){
                            debugger;
                            emit('created', modelCreateTable.value!.fileName)
                            formEl.resetFields();
                            modal.value = false;
                            modelCreateTable.value = { fileName: '' };
                        }

                    })                    
                }
            })
        }

        const createTableFile = (fileName: string, data: any = null) => {
            return new Promise(resolve => {
                let model: createTable = {
                    fileName: fileName,
                    data: data
                }

                store.dispatch(tableActions.CREATE_TABLE, model).then(res => {
                    ElMessage({
                        type: 'success',
                        message: `Mesa ${fileName} criada com sucesso.`,
                    })                    

                    resolve(true)
                }).catch((err) => {
                    console.error(err)
                    ElMessage({
                        type: 'error',
                        message: `Não foi possivel criar a mesa ${fileName}.`,
                    })

                    resolve(false)
                })
            })
        }



        const changeUpload = (file: any) => {
            if (file.raw.type == 'application/json') {
                let path = file.raw.path;

                fs.readFile(path, 'utf8', (err, data) => {
                    if (err) console.error(`Unable to scan file: ${err}`)

                    if (!data || data.length <= 0)
                        ElMessage.error('O arquivo selecionado está vazio.')
                    else {
                        createTableFile
                        createTableFile(file.name.split('.')[0], data).then(res => {
                            modal.value = false;
                            modelCreateTable.value = { fileName: '' };
                            emit('created', file.name.split('.')[0])
                        })
                    }
                })
            } else {
                ElMessage.error('Selecione um arquivo no formato correto.')
            }
        }

        return {
            // data
            modal,
            ruleFormRef,
            rules,
            modelCreateTable,

            // methods
            openTableCreate,
            closeModal,
            submit,
            createTableFile,
            changeUpload,
        }
    }
}

</script>