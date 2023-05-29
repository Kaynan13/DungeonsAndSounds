<template>
    <div class="timeline">
        <div v-for="item in timelineContent" class="layer" :style="{
                width: `${item.width - item.startPercent}%`,
                marginLeft: `${item.startPercent}%`
            }">
            {{ item.audio.rawContent.name }}
        </div>

        <div class="seconds-marks">
            <div v-for="sec in arraySeconds">            
                <div v-if="timelineMinutes == 1 || (Number(sec) == 0 || sec.toString().split('')[sec.toString().split('').length -1 ] == '0')">
                    {{ sec }}
                </div>
                <span>'</span>
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

        const timelineContent = computed(() => {
            timelineMinutes.value = Math.ceil(props.scene.time / 60) == 0 ? 1 : Math.ceil(props.scene.time / 60);
            return props.scene.data.map((item: any) => {
                let finish = item.finishAt ? item.finishAt : props.scene.time;
                item.width = (100 * finish) / (60 * timelineMinutes.value);
                item.startPercent = (100 * item.startAt) / (60 * timelineMinutes.value)
                return item
            })
        })

        const arraySeconds = computed(() => {
            let values = [];

            for (let index = 0; index <= (60 * timelineMinutes.value); index++) {
                let time: string = new Date(index * 1000).toISOString().split('T')[1].split('.')[0];

                if(timelineMinutes.value == 1)
                    values.push(`${index}s`)
                else{

                    if(index == 0 || index.toString().split('')[index.toString().split('').length -1 ] == '0')
                        values.push(`${time.split(':')[1]}:${time.split(':')[2]}`);
                    else
                        values.push('');                

                }
            }

            return values
        })

        return {
            timelineMinutes,
            timelineContent,
            arraySeconds
        }
    }
}
</script>