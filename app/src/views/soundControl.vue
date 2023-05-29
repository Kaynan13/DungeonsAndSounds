<template>
    <div class="sound-control-panel" v-show="audios && audios.length != 0">

        <div class="control-audio-content" v-for="audio in soloAudios">

            <div class="audio-infos" :style="{ backgroundImage: `url(${audio.rawContent.imageUrl})` }">
                <!-- <div class="signs">
                </div> -->
                <el-progress type="circle" :percentage="audio.progress" :status="audio.audio!.loop ? '' : 'exception'"
                    :show-text="false" />
                <span>
                    {{ audio.rawContent.name }}
                </span>
            </div>
            <div class="control-audio">
                <el-slider @input="changeVolume(audio.id)" v-model="audio.volume" vertical height="200px"
                    :show-tooltip="false" />
                <div class="control-buttons">

                    <el-tooltip class="box-item" effect="light" content="Parar" placement="right">
                        <el-button type="danger" circle @click="stopAudio(audio.id)">
                            <el-icon>
                                <CloseBold />
                            </el-icon>
                        </el-button>
                    </el-tooltip>

                    <el-tooltip class="box-item" effect="light" content="Recomeçar" placement="right">
                        <el-button type="success" circle @click="restartAudio(audio.id)">
                            <el-icon>
                                <RefreshRight />
                            </el-icon>
                        </el-button>
                    </el-tooltip>

                    <el-tooltip class="box-item" effect="light" content="Loop" placement="right">
                        <el-button :type="audio.audio!.loop ? 'primary' : 'info'" :plain="!audio.audio!.loop" circle
                            @click="loopAudio(audio.id)">
                            <el-icon>
                                <Refresh />
                            </el-icon>
                        </el-button>
                    </el-tooltip>

                </div>
            </div>
        </div>

        <!-- scenes -->
        <div class="scene-audios-container" v-for="scene in scenes">
            <span class="scene-name">
                {{ scene.name }}
            </span> 
            <div class="control-audio-content" v-for="audio in scene.audios">

                <div class="audio-infos" :style="{ backgroundImage: `url(${audio.rawContent.imageUrl})` }">
                    <el-progress type="circle" :percentage="audio.progress" :status="audio.audio!.loop ? '' : 'exception'"
                        :show-text="false" />
                    <span>
                        {{ audio.rawContent.name }}
                    </span>
                </div>
                <div class="control-audio">
                    <el-slider @input="changeVolume(audio.id)" v-model="audio.volume" vertical height="200px"
                        :show-tooltip="false" />
                    <div class="control-buttons">

                        <el-tooltip class="box-item" effect="light" content="Parar" placement="right">
                            <el-button type="danger" circle @click="stopAudio(audio.id)">
                                <el-icon>
                                    <CloseBold />
                                </el-icon>
                            </el-button>
                        </el-tooltip>

                        <el-tooltip class="box-item" effect="light" content="Recomeçar" placement="right">
                            <el-button type="success" circle @click="restartAudio(audio.id)">
                                <el-icon>
                                    <RefreshRight />
                                </el-icon>
                            </el-button>
                        </el-tooltip>

                        <el-tooltip class="box-item" effect="light" content="Loop" placement="right">
                            <el-button :type="audio.audio!.loop ? 'primary' : 'info'" :plain="!audio.audio!.loop" circle
                                @click="loopAudio(audio.id)">
                                <el-icon>
                                    <Refresh />
                                </el-icon>
                            </el-button>
                        </el-tooltip>

                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
import { ref } from 'vue';

import AudioType from '../store/entity/audio'
import status from '../store/enums/statusEnum';

export default {
    props: {},

    emit: ['change'],

    setup(props, { emit }) {
        const audios = ref<Array<AudioType>>([]);

        class sceneClass {
            public name: string;
            public audios: Array<AudioType>;

            constructor(_name: string = '', _audios: Array<AudioType> = []) {
                this.name = _name;
                this.audios = _audios;
            }
        }

        const soloAudios = ref<Array<AudioType>>([]);
        const scenes = ref<Array<sceneClass>>([]);

        class playConfigs {
            public loop: boolean;
            public groupName: string | null;

            constructor() {
                this.loop = false;
                this.groupName = null;
            }
        }

        const playAudio = async (audio: AudioType, configs: playConfigs = new playConfigs()) => {
            if (audios.value.some(item => item.id == audio.id)) {
                restartAudio(audio.id)
            } else {
                if(configs.groupName)
                    audio._sceneName = configs.groupName;

                audios.value.push(audio)
                
                if (!audio.fromScene)
                    soloAudios.value.push(audio)


                if (configs.groupName && !scenes.value.some(item => item.name == configs.groupName))
                    scenes.value.push(new sceneClass(configs.groupName, [audio]))
                else if (configs.groupName && scenes.value.some(item => item.name == configs.groupName))
                    scenes.value.find(item => item.name == configs.groupName)?.audios.push(audio)

                let currentAudio = audios.value.find(item => item.id == audio.id) as AudioType;

                await currentAudio.audio!.play()
                currentAudio.audio!.volume = audio.volume / 100

                if (configs.loop) {
                    currentAudio.audio!.loop = true
                    currentAudio.progress = 100
                } else
                    finishAudio(audio.id)

                currentAudio.status = status.playing

                emit('change', {
                    change: 'play',
                    audioList: audios.value,
                    currentAudio: currentAudio
                })
            }
        }

        const finishAudio = (audioId: string) => {
            let currentAudio: AudioType = audios.value.find(item => item.id == audioId)!;

            if (currentAudio.interval) clearInterval(currentAudio.interval)

            currentAudio.interval = setInterval(() => {

                currentAudio.progress = Number(((currentAudio.audio!.currentTime * 100) / currentAudio.audio!.duration).toFixed(0))

                if (Math.round(currentAudio.audio?.currentTime!) == Math.round(currentAudio.audio?.duration!)) {
                    currentAudio.audio?.load()
                    currentAudio.status = status.notStarted
                    currentAudio.progress = 0;

                    let defaultIndex = audios.value.findIndex(item => item.id == audioId)
                    audios.value.splice(defaultIndex, 1)

                    if (currentAudio.fromScene) {
                        let index = scenes.value.find((item: any) => item.name == currentAudio._sceneName)!.audios.findIndex(item => item.id == audioId)
                        scenes.value.find((item: any) => item.name == currentAudio._sceneName)!.audios.splice(index, 1)
                    } else {
                        let index = soloAudios.value.findIndex(item => item.id == audioId)
                        soloAudios.value.splice(index, 1)
                    }

                    emit('change', {
                        change: 'stop',
                        audioList: audios.value,
                        currentAudio: currentAudio
                    })
                }
            }, 100)
        }

        const changeVolume = (audioId: string) => {
            let currentAudio = audios.value.find(item => item.id == audioId)!;
            currentAudio.audio!.volume = currentAudio.volume / 100

            emit('change', {
                change: 'volume',
                audioList: audios.value,
                currentAudio: currentAudio
            })
        }

        const stopAudio = (audioId: string) => {
            let currentAudio = audios.value.find(item => item.id == audioId)!;            
            if (currentAudio && !currentAudio.audio!.paused && currentAudio.status == status.playing) {
                currentAudio.audio!.pause()
                currentAudio.audio!.currentTime! = 0
                currentAudio.status = status.notStarted


                let defaultIndex = audios.value.findIndex(item => item.id == audioId)
                audios.value.splice(defaultIndex, 1)

                if (currentAudio.fromScene) {    
                    let scene = scenes.value.find((item: any) => item.name == currentAudio._sceneName)!;
                    let index = scene.audios.findIndex(item => item.id == audioId)
                    scene.audios.splice(index, 1)

                    if(scene.audios.length == 0){
                        let sceneIndex = scenes.value.findIndex(item => item.name == scene.name);
                        scenes.value.splice(sceneIndex, 1);
                    }
                } else {
                    let index = soloAudios.value.findIndex(item => item.id == audioId)
                    soloAudios.value.splice(index, 1)
                }

                if (currentAudio.interval) clearInterval(currentAudio.interval)

                emit('change', {
                    change: 'stop',
                    audioList: audios.value,
                    currentAudio: currentAudio
                })
            }
        }

        const restartAudio = async (audioId: string) => {
            let currentAudio = audios.value.find(item => item.id == audioId)!;

            if (!currentAudio.audio!.paused && currentAudio.status == status.playing) {
                currentAudio.audio!.pause()
                currentAudio.audio!.currentTime = 0
                await currentAudio.audio!.play()
                finishAudio(audioId)

                emit('change', {
                    change: 'restart',
                    audioList: audios.value,
                    currentAudio: currentAudio
                })
            }
        }

        const loopAudio = (audioId: string) => {
            let currentAudio = audios.value.find(item => item.id == audioId)!;

            console.log(currentAudio.audio!.loop)

            currentAudio.audio!.loop = !currentAudio.audio?.loop;

            if (currentAudio.audio!.loop) {
                if (currentAudio.interval) clearInterval(currentAudio.interval)

                currentAudio.progress = 100
            }
            else
                finishAudio(audioId)

            emit('change', {
                change: 'loopToggle',
                audioList: audios.value,
                currentAudio: currentAudio
            })
        }

        return {
            audios,
            soloAudios,
            scenes,

            changeVolume,
            stopAudio,
            restartAudio,
            playAudio,
            loopAudio
        }
    }
}
</script>