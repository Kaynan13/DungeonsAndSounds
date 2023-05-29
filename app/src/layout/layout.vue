<template>
        <titleBar></titleBar>
        <asideMenu></asideMenu>
        <main>            
            <router-view></router-view>
        </main>
</template>

<script lang="ts">
import asideMenu from "./asideMenu.vue"
import titleBar from "./titleBar.vue"

export default{
    components: {
        asideMenu,
        titleBar
    }

}
</script>

<style>
@import url(../assets/style/layout.css);
</style>