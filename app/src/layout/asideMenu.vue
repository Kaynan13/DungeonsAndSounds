<template>
    <div class="aside-menu-icons">
        <img src="../assets/images/DS-Logo.png">
        <!-- <ul>
            <el-tooltip class="box-item" effect="light" content="Jogar" placement="right">
                <router-link to="home">
                    <li :class="[activeMenu == 'home' ? 'active' : '']" @click="activeMenu = 'home'">
                        <el-icon>
                            <VideoPlay />
                        </el-icon>
                    </li>
                </router-link>
            </el-tooltip>

            <el-tooltip class="box-item" effect="light" content="Configurações" placement="right">
                <router-link to="settings">
                    <li :class="[activeMenu == 'settings' ? 'active' : '']" @click="activeMenu = 'settings'">
                        <el-icon>
                            <Setting />
                        </el-icon>
                    </li>
                </router-link>
            </el-tooltip>
        </ul> -->
    </div>
</template>

<script lang="ts">
import { ref } from 'vue'

export default {
    setup() {
        const activeMenu = ref('home');

        return {
            activeMenu
        }
    }
}
</script>