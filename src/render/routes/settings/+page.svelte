<script lang="ts">
	import { Button, TextInput } from 'carbon-components-svelte';
	import { pushNotification } from '$lib/utils/utils';
	import { settingsRenderer } from '$lib/utils/store';

	let settings: any = {};
	settingsRenderer.subscribe((v: any) => {
		settings = v;
	});

	let apiUrl = '';
	let apiVersion = '';

	function saveSettings(e: Event) {
		pushNotification({
			title: 'Успіх!',
			message: 'Налаштування збережено.',
			kind: 'success',
		});

		window.electron.setSettings({
			apiUrl: apiUrl,
			apiVersion: apiVersion,
		});

		settingsRenderer.set({ ...settings, apiUrl: apiUrl, apiVersion: apiVersion });
	}
</script>

<TextInput labelText="IP адрес сервера" bind:value={apiUrl} placeholder={settings.apiUrl} />
<TextInput labelText="Версія API" bind:value={apiVersion} placeholder={settings.apiVersion} />

<Button class="absolute bottom-4" on:click={saveSettings}>Зберегти</Button>
