<template>
    <div class="timeline-container">
        <div class="timeline">
            <div class="seconds-marks">
                <div v-for="sec in arraySeconds">
                    <div
                        v-if="timelineMinutes == 1 || (Number(sec) == 0 || sec.toString().split('')[sec.toString().split('').length - 1] == '0')">
                        {{ sec }}
                    </div>
                    <span>'</span>
                </div>
            </div>

            <div class="timeline-content" :style="{ width: `${arraySeconds.length * 30}px` }" ref="timelineRef">

                <div class="layer-container">
                    <div class="layer" style="width: 200px">

                        <div class="layer-left-side" @mousedown="grabLeft($event)"
                        @mouseup="releaseLeft($event)" @mouseleave="releaseLeft($event)"
                        @mousemove="moveLeft($event)"></div>

                        <div class="layer-content" @mousedown="grabSound($event)"
                        @mouseup="releaseSound($event)" @mouseleave="releaseSound($event)"
                        @mousemove="moveSound($event)"></div>

                        <div class="layer-right-side"></div>
                    </div>
                </div>

                <!-- <div v-for="item in timelineContent" class="layer" :style="{
                width: `${item.width - item.startPercent}%`,
                marginLeft: `${item.startPercent}%`
            }">
                {{ item.audio.rawContent.name }}
            </div> -->
            </div>

            <div class="add-layer" v-if="timelineContent.length <= 0">
                <el-icon>
                    <Plus />
                </el-icon>&nbsp;

                Adicionar Faixa
            </div>

        </div>
    </div>
</template>

<script lang="ts">
import { ref, computed } from 'vue'

export default {
    name: 'timelineEditor',

    props: {
        scene: {
            type: Object,
            default: () => {
                return ''
            }
        }
    },

    setup(props) {
        const timelineMinutes = ref(1);

        const timelineContent = ref([])

        const timelineRef = ref()

        // const timelineContent = computed(() => {
        //     timelineMinutes.value = Math.ceil(props.scene.time / 60) == 0 ? 1 : Math.ceil(props.scene.time / 60);
        //     return props.scene.data.map((item: any) => {
        //         let finish = item.finishAt ? item.finishAt : props.scene.time;
        //         item.width = (100 * finish) / (60 * timelineMinutes.value);
        //         item.startPercent = (100 * item.startAt) / (60 * timelineMinutes.value)
        //         return item
        //     })
        // })

        const arraySeconds = computed(() => {
            let values = [];

            for (let index = 0; index <= (60 * timelineMinutes.value); index++) {
                let time: string = new Date(index * 1000).toISOString().split('T')[1].split('.')[0];

                if (timelineMinutes.value == 1)
                    values.push(`${index}s`)
                else {

                    if (index == 0 || index.toString().split('')[index.toString().split('').length - 1] == '0')
                        values.push(`${time.split(':')[1]}:${time.split(':')[2]}`);
                    else
                        values.push('');

                }
            }

            return values
        })

        const isDragging = ref(false)
        const currentPositionDragg = ref<number>(0)
        const grabSound = (event: any) => {
            isDragging.value = true;
            currentPositionDragg.value = event.clientX - event.target.parentNode.getBoundingClientRect().left
        }

        const releaseSound = (event: any) => {
            isDragging.value = false
            currentPositionDragg.value = 0
        }

        const moveSound = (event: any) => {
            let timelineScrollPosition = (timelineRef.value.getBoundingClientRect().left * -1)
            let leftSize = event.target.parentNode.clientWidth + ((event.clientX + timelineScrollPosition) - currentPositionDragg.value) + 30
            if (isDragging.value && ((event.clientX + timelineScrollPosition) - currentPositionDragg.value) > 0 && leftSize < timelineRef.value.clientWidth) {
                event.target.parentNode.style.left = `${(event.clientX + timelineScrollPosition) - currentPositionDragg.value}px`
            }
        }

        const isDraggingLeft = ref(false)   
        const currentLeft = ref(0)     
        const grabLeft = (event: any) => {
            isDraggingLeft.value = true;
            currentPositionDragg.value = event.clientX - (event.target.parentNode.getBoundingClientRect().left + event.target.parentNode.clientWidth)
            currentLeft.value = event.target.parentNode.getBoundingClientRect().left
        }

        const releaseLeft = (event: any) => {
            isDraggingLeft.value = false
            currentPositionDragg.value = 0
        }

        const moveLeft = (event: any) => {
            let timelineScrollPosition = (timelineRef.value.getBoundingClientRect().left * -1)
            if (isDraggingLeft.value) {
                console.log('move')
                let changeValue = (currentPositionDragg.value - (event.clientX + timelineScrollPosition))
                event.target.parentNode.style.width = `${event.target.parentNode.clientWidth - (changeValue)}px`
                event.target.parentNode.style.left = `${currentLeft.value + (changeValue*-1)}px`
            }
        }

        return {
            // Data
            timelineRef,
            timelineMinutes,
            timelineContent,
            arraySeconds,

            // Methods
            grabSound,
            releaseSound,
            moveSound,
            grabLeft,
            releaseLeft,
            moveLeft,
        }
    }
}
</script>

<style>
@import url(../../assets/style/scene/index.css);
</style>