<template>
	<router-view></router-view>
</template>

<script lang="ts">

import { ipcRenderer } from 'electron'

import { useStore } from 'vuex'

import { tableActions } from './store/enums/tableEnum'

export default {
	setup() {
		const store = useStore()


		ipcRenderer.on('update-avaliable', () => {            
            store.dispatch(tableActions.SET_UPDATE_ACTION, true)
        })
	}
}
</script>