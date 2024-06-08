<template>
    <div class="sound-list-page">
        <soundHeader :soundsGroups="groupList" :tableSelected="tableSelected" @selectedGroup="filterGroup"
            @back="backToTableList" />

        <Transition name="slide-fade">
            <div class="context-menu" v-show="contextToggle" ref="contextMenuRef"
                :style="{ top: `${mousePosition.y}px`, left: `${mousePosition.x}px` }"
                @mouseleave="closeContextMenu">
                <div class="context-title">
                    {{ soundContextSelected ? soundContextSelected.name : 'Ações Rápidas' }}
                </div>

                <ul class="context-list">
                    <li @click="playWithLoop">
                        <el-icon><RefreshRight /></el-icon>
                        Iniciar em Loop
                    </li>
                    <li @click="playMuted">                        
                        <el-icon><Mute /></el-icon>
                        Iniciar mudo
                    </li>
                    <li @click="editSound(soundContextSelected, $event)">
                        <el-icon><Edit /></el-icon>
                        Editar Som
                    </li>
                    <li @click="deleteSound(soundContextSelected, $event)">
                        <el-icon><Delete /></el-icon>
                        Excliur Som
                    </li>
                </ul>
            </div>
        </Transition>

        <div class="sound-list-container">
            <div class="sound-list">

                <div class="add-sound-button" @click="openFormModal">
                    <el-icon>
                        <Plus />
                    </el-icon>
                    Novo Som
                </div>

                <div :class="['sound-button', sound.config ? 'config' : '', sound.loaded ? '' : 'inative']"
                    v-for="(sound, index) in soundList" @mouseleave="triggerConfigModeLeave(sound)"
                    @click="playAudio(sound)" @contextmenu.prevent="openContextMenu($event, sound)">

                    <div class="sound-image" :style="{ 'background-image': `url(${sound.imageUrl})` }"></div>

                    <div class="sound-content">

                        <div class="sound-group"
                            :style="{ backgroundColor: getGroupColor(sound.group), color: checkLuma(getGroupColor(sound.group)) }">
                            {{ sound.group }}
                        </div>

                        <div class="sound-infos-content">

                            <div class="sound-infos">

                                <div class="sound-name">
                                    {{ sound.name }}
                                </div>

                                <div class="options-button" @click="openSoundOptions(sound, $event)">
                                    <el-icon>
                                        <ArrowUpBold />
                                    </el-icon>
                                </div>

                                <div class="sound-options">

                                    <el-button type="primary" plain circle @click="editSound(sound, $event)">
                                        <el-icon>
                                            <Edit />
                                        </el-icon>
                                    </el-button>

                                    <el-button type="danger" plain circle @click="deleteSound(sound, $event)">
                                        <el-icon>
                                            <Delete />
                                        </el-icon>
                                    </el-button>

                                </div>

                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>

        <soundCreate ref="soundCreateRef" :tableSelected="tableSelected" :groupList="groupList"
            @created="getSoundsFromTable" />

        <soundControl ref="soundControlRef" />
    </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useStore } from 'vuex'
import { ElMessageBox } from 'element-plus'

import { tableActions } from '../../store/enums/tableEnum'
import Sound from '../../store/entity/sound'
import AudioType from '../../store/entity/audio'
import { postGroupRange } from '../../store/interface/tableInterface'

import soundCreate from './soundCreate.vue'
import soundControl from './soundControl.vue'
import soundHeader from './header.vue'

export default {
    props: {
        tableSelected: {
            type: String,
            default: () => {
                return ''
            }
        }
    },

    emit: ['back'],

    components: {
        soundCreate,
        soundHeader,
        soundControl,
    },

    setup(props, { emit }) {
        const store = useStore()
        const rawTable = ref<any>()
        const soundList = ref<Array<Sound>>([])
        const audioList = ref<Array<AudioType>>([])
        const groupList = ref<Array<any>>([])

        const getSoundsFromTable = () => {
            store.dispatch(tableActions.GET_SOUNDS, props.tableSelected).then(res => {
                rawTable.value = res

                soundList.value = res.sounds

                soundList.value.sort((a: any, b: any) => {
                    if (a.group > b.group)
                        return 1

                    if (a.group < b.group)
                        return -1

                    return 0
                })

                groupList.value = res.groups ? res.groups : []

                groupList.value.sort((a: any, b: any) => {
                    if(a.name < b.name)
                        return -1

                    if(a.name > b.name)
                        return 1

                    return 0
                })

                let hasGroups = false
                if (groupList.value.length > 0)
                    hasGroups = true

                soundList.value.filter((sound: Sound) => {
                    let indexStart = sound.soundUrl.indexOf('?v=') + 3
                    sound._videoId = sound.soundUrl.substring(indexStart, sound.soundUrl.length).split('&')[0]
                    sound.configMode = false
                    sound.loaded = false

                    let audioElement = new Audio(`http://localhost:9000/getAudio?id=${sound._videoId}`)
                    audioList.value.push(new AudioType(sound._videoId, audioElement, 50, sound))

                    if (!hasGroups) {
                        if (!groupList.value.some(item => item.name == sound.group))
                            groupList.value.push({ name: sound.group, color: `#${(Math.random() * 0xfffff * 1000000).toString(16).slice(0, 6)}` })
                    }

                    audioElement.addEventListener('loadeddata', () => {
                        soundList.value.filter(item => {
                            if (item._videoId == sound._videoId)
                                item.loaded = true;
                        })
                    })

                    audioElement.addEventListener('error', () => {
                        soundList.value.filter(item => {
                            if (item._videoId == sound._videoId)
                                item.loadError = true;
                        })
                    })
                })

                if (!hasGroups) {
                    let model: postGroupRange = {
                        table: props.tableSelected,
                        groups: groupList.value
                    }
                    store.dispatch(tableActions.POST_GROUP_RANGE, model)
                }
            })
        }
        getSoundsFromTable();

        const getGroupColor = (group: string) => {
            let currentGroup = groupList.value.find((item: any) => item.name == group)
            if (currentGroup)
                return groupList.value.find((item: any) => item.name == group).color
            else
                return '#cdcdcd'
        }

        const openSoundOptions = (sound: Sound, event: any) => {
            event.stopPropagation();
            sound.config = !sound.config
        }

        const triggerConfigModeLeave = (sound: Sound) => {
            sound.configTimer = setTimeout(() => {
                sound.config = false
            }, 500)
        }

        const checkLuma = (color: string) => {
            var c = color.substring(1);

            if (c.length == 3) {
                let each = c.split('');
                c = `${each[0]}${each[0]}${each[1]}${each[1]}${each[2]}${each[2]}`;
            }

            var rgb = parseInt(c, 16);   // convert rrggbb to decimal
            var r = (rgb >> 16) & 0xff;  // extract red
            var g = (rgb >> 8) & 0xff;  // extract green
            var b = (rgb >> 0) & 0xff;  // extract blue

            var luma = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);

            if (luma >= (255 / 2))
                return '#000'
            else
                return '#fff'
        }

        const soundCreateRef = ref()

        const openFormModal = () => {
            soundCreateRef.value.openModal();
        }

        const editSound = (sound: Sound, evt: any) => {
            evt.stopPropagation()

            soundCreateRef.value.editSound(sound);
        }

        const deleteSound = (sound: Sound, evt: any) => {
            evt.stopPropagation()

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

                store.dispatch(tableActions.DELETE_SOUND, model).then(() => getSoundsFromTable())
            })

        }

        const backToTableList = () => {
            soundControlRef.value.clearAudios()
            emit('back')
        }

        const filterGroup = (group: string) => {
            soundList.value = rawTable.value.sounds.filter((item: Sound) => item.group == group || group == null)
        }

        const soundControlRef = ref()

        const playAudio = (sound: Sound) => {
            if (sound.loaded && !sound.config) {
                let currentSound = audioList.value.find(item => item.id == sound._videoId)

                soundControlRef.value.playAudio(currentSound)
            }
        }

        const contextMenuRef = ref()
        const contextToggle = ref<boolean>(false)
        const mousePosition = ref({ x: 0, y: 0 })
        const soundContextSelected = ref<Sound>(new Sound())

        const openContextMenu = (event: any, sound: Sound) => {
            if (sound.loaded) {
                let [X, Y] = [event.clientX, event.clientY]

                mousePosition.value.x = X + 200 > window.innerWidth ? (X - 190) : (X - 10)
                mousePosition.value.y = Y + 150 > window.innerHeight ? (Y - (150 - 10)) : (Y - 10)

                soundContextSelected.value = sound

                contextToggle.value = true;
            }
        }

        const closeContextMenu = () => {
            soundContextSelected.value = new Sound();
            contextToggle.value = false;
        }

        const playWithLoop = () => {
            let currentSound = audioList.value.find(item => item.id == soundContextSelected.value!._videoId)

            soundControlRef.value.playAudio(currentSound, { loop: true })
        }

        const playMuted = () => {
            let currentSound = audioList.value.find(item => item.id == soundContextSelected.value!._videoId)
            
            currentSound!.volume = 0

            soundControlRef.value.playAudio(currentSound)
        }


        return {
            // data
            soundList,
            groupList,
            soundCreateRef,
            soundControlRef,
            contextMenuRef,
            mousePosition,
            contextToggle,
            soundContextSelected,

            // methods
            openSoundOptions,
            triggerConfigModeLeave,
            getSoundsFromTable,
            getGroupColor,
            checkLuma,
            openFormModal,
            editSound,
            deleteSound,
            backToTableList,
            filterGroup,
            playAudio,
            openContextMenu,
            closeContextMenu,
            playWithLoop,
            playMuted,
        }
    }
}
</script>

<style>
@import url(../../assets/style/soundList/index.css);
</style>