<template>
    <div class="book-page" v-for="item in pageData">
        <div class="page-item" v-if="item.title != 'index' && item.title != 'url'">
            <div :class="[children ? 'page-subtitle' : 'page-title']">{{ item.title }}</div>
            <div class="page-info" v-if="!item.subItem">{{ item.content }}</div>
        </div>

        <bookPage :pageData="item.content" :children="true" v-if="item.subItem" />
    </div>   
</template>

<script lang="ts">

export default {
    name: 'bookPage',

    props: {
        pageData: {
            type: Object,
            default: () => {
                return null
            }
        },
        children: {
            type: Boolean,
            default: () => {
                return false
            }
        }
    }
}

</script>