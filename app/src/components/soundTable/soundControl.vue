<template>
    <div class="sound-control-panel" v-show="audios && audios.length != 0">        

        <div class="control-audio-content" v-for="audio in audios">

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
                        <el-button type="danger" circle @click="stopAudio(audio)">
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
</template>

<script lang="ts">
import { ref } from 'vue';

import AudioType from '../../store/entity/audio'
import status from '../../store/enums/statusEnum';

export default {
    emit: ['change'],

    setup(props, { emit }) {
        const audios = ref<Array<AudioType>>([]);


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
                if (configs.groupName)
                    audio._sceneName = configs.groupName;

                audios.value.push(audio)

                let currentAudio = audios.value.find(item => item.id == audio.id) as AudioType;

                await currentAudio.audio!.play()
                currentAudio.audio!.volume = audio.volume / 100

                if (configs.loop) {
                    currentAudio.audio!.loop = true
                    currentAudio.progress = 100

                } else
                    finishAudio(audio.id)

                currentAudio.status = status.playing

                currentAudio.audio!.addEventListener('timeupdate', function () {
                    if (configs.loop) {
                        var buffer = .44
                        if (this.currentTime > this.duration - buffer) {
                            this.currentTime = 0
                            this.play()
                        }
                    }
                });

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

        const stopAudio = (audio: AudioType) => {            
            let currentAudio = audio;
            if (currentAudio && !currentAudio.audio!.paused && currentAudio.status == status.playing) {
                currentAudio.audio!.pause()
                currentAudio.audio!.currentTime! = 0
                currentAudio.status = status.notStarted


                let defaultIndex = audios.value.findIndex(item => item.id == audio.id)
                audios.value.splice(defaultIndex, 1)

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

        const clearAudios = () => {                                
            while (audios.value.length > 0) {                
                stopAudio(audios.value[0])   
            }
        }

        return {
            audios,

            changeVolume,
            stopAudio,
            restartAudio,
            playAudio,
            loopAudio,
            clearAudios
        }
    }
}
</script>