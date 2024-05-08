<template>
        <titleBar></titleBar>        
        <main>            
            <router-view></router-view>
        </main>
</template>

<script lang="ts">
import titleBar from "./titleBar.vue"

export default{
    components: {        
        titleBar
    }

}
</script>

<style>
@import url(../assets/style/layout.css);
</style>