<template>
	<router-view></router-view>
</template>

<script lang="ts">
import { ipcRenderer } from 'electron'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
	setup() {

		ipcRenderer.on('maximizou', () => {
			console.log('testeeee');
		})

		ipcRenderer.on('update-avaliable', () => {
			ElMessageBox.confirm(
				`Yeees, saiu uma nova atualização! Quer atualizar agora?`,
				'Success',
				{
					confirmButtonText: 'Atualizar',
					cancelButtonText: 'Deixa pra depois',
					type: 'success',
				}
			).then(() => {
				ipcRenderer.send('start-update');

				ipcRenderer.on('update-finished', () => {
					ElMessage({
						type: 'success',
						message: `Dungeons and Sounds atualizado com sucesso!`,
					})
				})
			});
		})

		ipcRenderer.on('update-error', (err: any) => {
			ElMessage({
						type: 'error',
						message: err,
					})
		})
	}
}
</script>