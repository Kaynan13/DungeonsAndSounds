<template>
  <!-- FORMULARIO DE CRIAR SONS -->
  <el-dialog v-model="modal" title="Adicionar Som">
    <el-form ref="ruleFormRef" :model="model" :rules="rules">
      <div style="display: flex; flex-wrap: nowrap">
        <el-form-item prop="group">
          <el-select
            v-model="model.group"
            filterable
            allow-create
            default-first-option
            @change="changeGroup"
            :reserve-keyword="false"
            placeholder="Grupo"
          >
            <el-option
              v-for="item in groupList"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>

        <div style="margin-left: 15px">
          <el-form-item prop="groupColor">
            <el-color-picker
              :disabled="disableGroupColor"
              v-model="groupColor"
              placeholder="Cor do Grupo"
            />
          </el-form-item>
        </div>
      </div>

      <el-form-item prop="soundUrl">
        <el-input
          v-model="model.soundUrl"
          @input="getVideoInfos"
          placeholder="Url do Youtube"
        />
      </el-form-item>

      <el-form-item prop="name">
        <el-input placeholder="Nome do Som" v-model="model.name" maxlength="25" />
      </el-form-item>

      <el-form-item prop="imageUrl">
        <el-input placeholder="Url Imagem" v-model="model.imageUrl" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeModal(ruleFormRef)">Cancelar</el-button>
        <el-button type="primary" @click="saveSound(ruleFormRef)"> Salvar </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { ref } from 'vue'
import Sound from '../../store/entity/sound'

import { useStore } from 'vuex'
import { ElLoading, ElMessageBox, FormInstance } from 'element-plus'

import { tableActions } from '../../store/enums/tableEnum'
import { postGroup, postSound, putGroup } from '../../store/interface/tableInterface'

export default {

    props: {
        groupList: {
            type: Array<any>,
            default: () => {
                return []
            }
        },

        tableSelected: {
            type: String,
            default: () => {
                return ''
            }
        },
    },

    emit: ['created'],

    setup(props, { emit }) {
        const store = useStore()

        const modal = ref(false)

        const groupListCombo = ref<Array<any>>(props.groupList)

        const model = ref<Sound>(new Sound())

        const groupColor = ref<string>('')

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

        const openModal = () => {
            modal.value = true
            groupColor.value = `#${(Math.random() * 0xfffff * 1000000).toString(16).slice(0, 6)}`
        }

        const closeModal = (formEl: FormInstance) => {
            if (!formEl) return

            modal.value = false;
            setTimeout(() => {
                formEl.resetFields();
                model.value = new Sound();
            }, 100)
        }

        const getVideoInfos = async () => {
            if(model.value.soundUrl.includes('?v=')){
                let indexStart = model.value.soundUrl.indexOf('?v=') + 3
                model.value._videoId = model.value.soundUrl.substring(indexStart, model.value.soundUrl.length).split('&')[0]
            }

            if(model.value.soundUrl.includes('youtu.be'))
                model.value._videoId = model.value.soundUrl.split('.be/')[1]

            if (model.value._videoId) {                
                const loading = ElLoading.service({
                    lock: true,
                    background: 'rgba(0, 0, 0, 0.7)',
                });

                store.dispatch(tableActions.GET_VIDEO_INFOS, model.value._videoId).then(res => {
                    model.value.imageUrl = res.image
                    model.value.name = res.name

                    setTimeout(() => {
                        loading.close()
                    }, 500)
                })
            }
        }

        const saveSound = async (formEl: FormInstance) => {
            if (!formEl) return

            await formEl.validate(valid => {
                if (valid) {
                    debugger
                    // Groups Save and Edit
                    let selectedGroup = props.groupList.find(item => item.name == model.value.group)
                    if(selectedGroup && selectedGroup.color !== groupColor.value)
                        store.dispatch(tableActions.PUT_GROUP, {table: props.tableSelected, group: {name: selectedGroup.name, color: groupColor.value}} as putGroup)
                    else if(!selectedGroup)
                        store.dispatch(tableActions.POST_GROUP, {table: props.tableSelected, group: {name: model.value.group, color: groupColor.value}} as postGroup)

                    if (model.value.id) {
                        let data: postSound = {
                            table: props.tableSelected,
                            sound: model.value
                        }

                        store.dispatch(tableActions.PUT_SOUND, data).then(res => {
                            emit('created')
                        })
                    } else {
                        let data: postSound = {
                            table: props.tableSelected,
                            sound: model.value
                        }

                        store.dispatch(tableActions.POST_SOUND, data).then(res => {
                            emit('created')
                        })
                    }

                    closeModal(formEl)

                }
            })

        }

        const disableGroupColor = ref<boolean>(false);
        const changeGroup = (group: any) => {
            let selectedGroup: any = props.groupList.find((item: any) => item.name == group)

            if(selectedGroup)
                groupColor.value = selectedGroup.color
        }

        const editSound = (sound: Sound) => {
            model.value = sound
            changeGroup(model.value.group)
            modal.value = true
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
                let model = {
                    table: props.tableSelected,
                    soundId: sound.id!
                } 
                
                store.dispatch(tableActions.DELETE_SOUND, model).then(res => {                    
                })
            })
        }

        return {
            // data
            modal,
            groupListCombo,
            model,
            groupColor,
            ruleFormRef,
            rules,
            disableGroupColor,

            // methods
            openModal,
            closeModal,
            getVideoInfos,
            saveSound,
            changeGroup,
            editSound,
            deleteSound
        }
    }
}
</script>
