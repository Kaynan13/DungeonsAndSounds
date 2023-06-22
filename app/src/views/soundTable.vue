<template>
    <!-- <div class="sound-table-main"> -->
        <!-- <div class="sound-table-header">
            <el-button @click="backToTableList">
                <el-icon>
                    <Back />
                </el-icon>
                &nbsp;
                Voltar as Mesas
            </el-button>

            <el-radio-group v-model="groupSelected" @change="selectGroup" small>
                <el-radio-button :label="null">Todos</el-radio-button>
                <el-radio-button v-for="group in soundsGroups" :label="group.groupName" />
            </el-radio-group>
        </div> -->

        <!-- <soundTableHeader :soundsGroups="groupList" @back="backToTableList" @selectedGroup="selectGroup" /> -->

        <!-- scene recording component -->
        <!-- <div :class="['sound-table-scene', recording != 0 ? 'recording' : '']">
            <div class="record-signal" v-if="recording != 0"></div>
            <span v-if="recording != 0" class="time-display">{{ formatRecordTime(recordObject.time) }}</span>
            <div class="record-button-content" v-if="recording != 0">
                <el-button-group>
                    <el-button type="default" plain v-if="recording == 2">
                        <fas icon="fa-solid fa-play"></fas>
                    </el-button> -->

                    <!-- <el-button type="default" plain v-if="recording == 1">
                        <fas icon="fa-solid fa-pause"></fas>
                    </el-button> -->

                    <!-- <el-button type="danger" plain @click="stopRecording">
                        <fas icon="fa-solid fa-stop"></fas>
                    </el-button>

                    <el-button type="danger" plain @click="deleteRecord">
                        <fas icon="fa-solid fa-trash"></fas>
                    </el-button>

                </el-button-group>
            </div>

            <el-button v-if="recording == 0" @click="startRecordMode">
                <el-icon>
                    <Film />
                </el-icon>
                &nbsp;
                Gravar uma Cena
            </el-button>
        </div>
 -->
        <!-- <timelineEditor v-if="recording != 0" :scene="recordObject"></timelineEditor> -->

        <!-- <div class="scenes-list" v-if="scenesList.length != 0">
            <div class="scene-content" v-for="scene in scenesList" @mouseover="sceneMouseOverHandle(scene)"
                @mouseleave="sceneMouseLeaveHandle(scene)">
                <div class="scene-object" @click="playRecorded(scene)">
                    <fas icon="fa-solid fa-play"></fas>

                    <span class="scene-name">
                        {{ scene.name }}
                    </span>
                </div>

                <Transition name="slide-fade">
                    <div class="optins-content" v-if="scene._showOptions"> -->
                        <!-- <el-button type="primary" circle @click="editScene(scene)">
                            <el-icon>
                                <Edit />
                            </el-icon>
                        </el-button> -->

                        <!-- <el-button type="danger" circle @click="deleteScene(scene)" style="margin-left: 5px">
                            <el-icon>
                                <Delete />
                            </el-icon>
                        </el-button>
                    </div>
                </Transition>

            </div>
        </div>

        <div :class="['sound-table-sound-list-content',
            recording != 0 ? 'recording' : '',]">
 -->
            <!-- <div class="sound-list-container" v-if="groupSelected">
                <div :class="['sound-button', sound.loaded ? '' : 'disabled']" v-for="(sound, index) in soundList"
                    :key="index" @click="playAudio(sound._videoId, sound.loaded)">
                    <div class="blackbox-options" v-if="sound.configMode" @mouseup="sound.configMode = false">
                    </div>
                    <div class="sound-button-content">                        
                        <div class="sound-image" :style="{ 'background-image': `url(${sound.imageUrl})` }"></div>
                        <div class="sound-name">{{ sound.name }}</div>
                    </div>
                </div>
            </div> -->

            <!-- <div class="all-sound-list-container" v-if="!groupSelected">
                <div class="group-container" v-for="group in soundsGroups">

                    <div class="group-name">
                        {{ group.groupName }}
                        <hr />
                    </div>

                    <div :class="['sound-button', sound.loaded ? '' : 'disabled']" v-for="(sound, index) in group.soundList"
                        :key="index" @click="playAudio(sound._videoId, sound.loaded)" @mouseover="triggerHoldEvent(sound)"
                        @mouseleave="triggerLeaveEvent(sound)">
                        <div class="sound-button-content">

                            <Transition name="grow-fade">
                                <div class="option-buttons" v-show="sound.configMode">

                                    <el-button type="primary" plain circle class="option-btn"
                                        @mouseup="triggerUpEvent(sound)">
                                        <el-icon>
                                            <Edit />
                                        </el-icon>
                                    </el-button>
                                    <el-button type="danger" plain circle class="option-btn"
                                        @mouseup="triggerUpEvent(sound)">
                                        <el-icon>
                                            <Delete />
                                        </el-icon>
                                    </el-button>

                                </div>
                            </Transition>
                            <div class="sound-image" :style="{ 'background-image': `url(${sound.imageUrl})` }"></div>
                            <div class="sound-name">{{ sound.name }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <soundControl @change="changeControl" ref="soundControlRef">
        </soundControl>
    </div> -->
</template>


<script lang="ts">
// import { ref } from 'vue';

// import AudioType from '../store/entity/audio'
// import status from '../store/enums/statusEnum'
// import fs from 'fs'

// import soundControl from './soundControl.vue'
// import timelineEditor from '../components/sceneTimeline.vue'
// import { ElMessageBox, ElMessage } from 'element-plus'

// import { useStore } from 'vuex'

// import { tableActions } from '../store/enums/tableEnum'

// import soundTableHeader from '../components/soundTable/header.vue'
// import Sound from '../store/entity/sound';

// export default {
//     components: {
//         soundTableHeader,
//         soundControl,
//         timelineEditor
//     },

//     props: {
//         tableSelected: {
//             type: String,
//             default: () => {
//                 return ''
//             }
//         }
//     },

//     emit: ['back'],

//     setup(props, { emit }) {
//         const store = useStore();
//         // const loading = ElLoading.service({
//         //     lock: true,
//         //     background: 'rgba(0, 0, 0, 0.7)',
//         //     text: 'Carregando Sons'
//         // });


//         // 0 - not started
//         // 1 - recording
//         // 2 - paused
//         const recording = ref(0);

//         const mainFolder = ref(`${__dirname.substring(0, __dirname.indexOf('resources') + 10).replaceAll(/\\/g, "/")}`);
//         const soundControlRef = ref();
//         const soundLoadingCount = ref([]);

//         const audioList = ref<Array<any>>([]);

//         const rawTable = ref();
//         const scenesList = ref<Array<any>>([]);
//         const soundList = ref<Array<any>>([]);
//         const allSoundsGroups = ref<Array<any>>([]);
//         const soundsGroups = ref<Array<any>>([]);
//         const groupList = ref<Array<string>>([])

//         const getSoundsFromTable = () => {
//             if (props.tableSelected !== '') {
//                 store.dispatch(tableActions.GET_SOUNDS, props.tableSelected).then(res => {
//                     if (!res || res.length <= 0) {
//                         soundList.value = []
//                     } else {
//                         rawTable.value = res;
//                         scenesList.value = [...rawTable.value.scenes];
//                         let allSounds = rawTable.value.sounds;

//                         allSounds.filter(async (item: any) => {
//                             let indexStart = item.soundUrl.indexOf('?v=') + 3
//                             item._videoId = item.soundUrl.substring(indexStart, item.soundUrl.length).split('&')[0]
//                             item.configMode = false

//                             let audioElement = new Audio(`http://localhost:9000/getAudio?id=${item._videoId}`)
//                             audioList.value.push(new AudioType(item._videoId, audioElement, 50, item, status.notStarted))

//                             audioElement.addEventListener("loadeddata", () => {
//                                 console.log(soundList.value);
//                                 soundList.value.filter(lbda => {
//                                     if (lbda._videoId == item._videoId) {
//                                         lbda.loaded = true;
//                                     }
//                                 });

//                                 allSoundsGroups.value.filter((group: any) => {
//                                     group.soundList.filter((sound: any) => {
//                                         if (sound._videoId == item._videoId) {
//                                             sound.loaded = true;
//                                         }
//                                     })
//                                 })
//                             });
//                         })

//                         allSoundsGroups.value = allSounds.filter((x, i) => allSounds.findIndex(y => y.group == x.group) === i).map((item) => {
//                             return { groupName: item.group, soundList: allSounds.filter(sound => item.group == sound.group) }
//                         })

//                         groupList.value = allSoundsGroups.value.filter((item: any) => {
//                             return item.groupName;
//                         })

//                         soundsGroups.value = allSoundsGroups.value

//                         selectGroup(null);

//                     }
//                 })
//             }
//         }
//         getSoundsFromTable();

//         const backToTableList = () => {
//             emit('back')
//         }

//         const playAudio = (id, loaded) => {
//             if (loaded) {
//                 let currentSound = audioList.value.find(item => item.id == id);
//                 if (currentSound.rawContent.configModeTimeOut) clearTimeout(currentSound.rawContent.configModeTimeOut)
//                 currentSound.rawContent.configMode = false
//                 currentSound.fromScene = false;

//                 soundControlRef.value.playAudio(currentSound)

//                 if (recording.value == 1)
//                     recordData(audioList.value.find(item => item.id == id))
//             }
//         }

//         const groupSelected = ref(null);
//         const selectGroup = (group: string | null) => {
//             // if (group)
//             //     soundList.value = soundsGroups.value.find((item) => item.groupName == group).soundList

//             soundsGroups.value = allSoundsGroups.value.filter((item: any) => !group || item.groupName == group)
//         }

//         const controlVisible = ref(false)
//         const changeControl = (evt) => {
//             if (evt.audioList.length > 0)
//                 controlVisible.value = true
//             else
//                 controlVisible.value = false

//             if (recording.value == 1)
//                 recordData(evt.currentAudio, evt.change)
//         }

//         const triggerHoldEvent = (sound: any) => {
//             if (sound.loaded) {
//                 if (!sound.configMode){
//                     sound.configModeTimeOut = setTimeout(() => {
//                         sound.configMode = true
//                     }, 300)
//                 }else{
//                     clearTimeout(sound.configModeTimeOut)
//                 }
//             }
//         }

//         const triggerLeaveEvent = (sound: any) => {
//             if (sound.loaded) {                
//                     sound.configModeTimeOut = setTimeout(() => {
//                         sound.configMode = false
//                     }, 300)
//             }
//         }

//         const triggerUpEvent = (sound) => {
//             if (sound.loaded) {
//                 clearTimeout(sound.configModeTimeOut)
//                 sound.configMode = false

//                 soundControlRef.value.playAudio(audioList.value.find(item => item.id == sound._videoId), { loop: true })
//             }
//         }

//         // scene record functions

//         const startRecordMode = () => {
//             ElMessageBox.confirm(
//                 `A gravação de cena será iniciada assim que o primeiro som começar.`,
//                 'Warning',
//                 {
//                     confirmButtonText: 'Ok',
//                     cancelButtonText: 'Cancelar',
//                     type: 'warning',
//                 }
//             ).then(() => {
//                 recording.value = 1
//             })
//         }

//         const recordObject = ref({
//             interval: null,
//             time: 0,
//             data: [],
//         })

//         const recordData = (audio, action = 'play') => {
//             if (!recordObject.value.interval) {
//                 recordObject.value.interval = setInterval(() => {
//                     recordObject.value.time += 0.1
//                 }, 100)
//             }

//             let audioFromData = recordObject.value.data.find(item => item.audio.id == audio.id) ?? null;
//             if (!audioFromData) {
//                 recordObject.value.data.push({
//                     startAt: recordObject.value.time,
//                     audio: audio
//                 })
//             } else {
//                 if (action == 'stop')
//                     audioFromData.finishAt = recordObject.value.time

//                 audioFromData.audio = audio
//             }
//         }

//         const stopRecording = () => {
//             recording.value = 0;
//             clearInterval(recordObject.value.interval)

//             ElMessageBox.prompt('Crie um nome para a cena gravada.', 'Cena', {
//                 confirmButtonText: 'OK',
//                 cancelButtonText: 'Cancel',
//             }).then(({ value }) => {
//                 delete recordObject.value.interval
//                 recordObject.value.name = value
//                 recordObject.value.id = rawTable.value.scenes.length + 1 ?? 1;

//                 scenesList.value.push(recordObject.value)
//                 rawTable.value.scenes = scenesList.value

//                 rawTable.value.scenes.filter(item => {
//                     delete item._showOptions;
//                     delete item.optionsTimeOut;
//                     delete item.interval;
//                 })

//                 let tableName = props.tableSelected.includes('.json') ? props.tableSelected : `${props.tableSelected}.json`
//                 fs.writeFile(`${mainFolder.value}/${tableName}`, JSON.stringify(rawTable.value), err => {
//                     if (err) console.error(`Unable to save data: ${err}`)

//                     ElMessage({
//                         type: 'success',
//                         message: `Cena ${value} criada com sucesso.`,
//                     })
//                     getSoundsFromTable()
//                 })
//             }).catch(() => {
//                 ElMessage({
//                     type: 'info',
//                     message: 'Cena excluida',
//                 })

//                 deleteRecord();
//             })
//         }

//         const deleteRecord = () => {
//             ElMessageBox.confirm(
//                 `Tem certeza que deseja deletar a gravação?`,
//                 'Warning',
//                 {
//                     confirmButtonText: 'Deletar',
//                     cancelButtonText: 'Cancelar',
//                     type: 'warning',
//                 }
//             ).then(() => {
//                 recordObject.value = {
//                     interval: null,
//                     time: 0,
//                     data: [],
//                 }
//                 recording.value = 0
//             })
//         }

//         const scenesPlaying = ref([]);
//         const playRecorded = (scene) => {
//             scenesPlaying.value.push(scene);
//             let seconds = 0;
//             let interval = setInterval(() => {

//                 let startItem = scenesPlaying.value.find(item => item.id == scene.id).data.find(item => item.startAt == seconds);
//                 let finishItem = scenesPlaying.value.find(item => item.id == scene.id).data.find(item => item.finishAt == seconds);

//                 if (startItem) {
//                     let audioToSend = audioList.value.find(item => item.id == startItem.audio.id)
//                     audioToSend.volume = startItem.audio.volume;
//                     audioToSend.fromScene = true;
//                     soundControlRef.value.playAudio(audioToSend, { groupName: scene.name })
//                 }

//                 if (finishItem && finishItem.audio)
//                     soundControlRef.value.stopAudio(finishItem.audio.id)

//                 seconds += 0.1
//             }, 100)

//             setTimeout(() => {
//                 clearInterval(interval)
//                 scenesPlaying.value.splice(scenesPlaying.value.findIndex(item => item.id == scene.id), 1);
//             }, scene.time * 1000)
//         }

//         const deleteScene = (scene) => {
//             ElMessageBox.confirm(`Deseja excluir a cena "${scene.name}."`,
//                 'Warning',
//                 {
//                     confirmButtonText: 'Deletar',
//                     cancelButtonText: 'Cancelar',
//                     type: 'warning',
//                 }
//             ).then(() => {
//                 let index = rawTable.value.scenes.findIndex(item => item.id = scene.id);

//                 rawTable.value.scenes.splice(index, 1);

//                 rawTable.value.scenes.filter(item => {
//                     delete item._showOptions;
//                     delete item.optionsTimeOut;
//                 })

//                 let tableName = props.tableSelected.includes('.json') ? props.tableSelected : `${props.tableSelected}.json`;

//                 fs.writeFile(`${mainFolder.value}/${tableName}`, JSON.stringify(rawTable.value), err => {
//                     if (err) console.error(`Unable to delete data: ${err}`)

//                     getSoundsFromTable()
//                 })
//                 ElMessage({
//                     type: 'success',
//                     message: `Cena ${scene.name} deletada com sucesso.`,
//                 })
//             }).catch(() => {
//                 ElMessage({
//                     type: 'info',
//                     message: 'Deleção cancelada.',
//                 })
//             })
//         }

//         const sceneMouseOverHandle = (scene) => {
//             if (!scene._showOptions)
//                 scene.optionsTimeOut = setTimeout(() => {
//                     scenesList.value.filter(item => {
//                         item._showOptions = false;
//                     })
//                     scene._showOptions = true;
//                 }, 300)
//         }

//         const sceneMouseLeaveHandle = (scene) => {
//             clearTimeout(scene.optionsTimeOut)
//             scene._showOptions = false;
//         }

//         const formatRecordTime = (time) => {
//             let data = new Date(time * 1000).toISOString();
//             return data.split('T')[1].split('.')[0]
//         }

//         return {
//             recording,
//             soundList,
//             scenesList,
//             soundsGroups,
//             groupList,
//             groupSelected,
//             soundControlRef,
//             controlVisible,
//             recordObject,

//             getSoundsFromTable,
//             selectGroup,
//             backToTableList,
//             playAudio,
//             changeControl,
//             triggerHoldEvent,
//             triggerLeaveEvent,
//             triggerUpEvent,

//             // scene record functions
//             startRecordMode,
//             recordData,
//             stopRecording,
//             deleteRecord,
//             playRecorded,
//             deleteScene,
//             sceneMouseOverHandle,
//             sceneMouseLeaveHandle,
//             formatRecordTime,
//         }
//     }
// }
</script>