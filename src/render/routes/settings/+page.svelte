<script lang="ts">
	import { Button, TextInput } from 'carbon-components-svelte';
	import { pushNotification } from '$lib/utils/utils';
	import { settingsRenderer } from '$lib/utils/store';
	import { ProgressBar } from 'carbon-components-svelte';
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
			loaded: true,
		});

		settingsRenderer.set({ ...settings, apiUrl: apiUrl, apiVersion: apiVersion });
	}

	function checkUpdate() {
		window.electron.checkUpdate();
	}

	function downloadUpdate() {
		window.electron.downloadUpdate();
	}
</script>

<TextInput
	labelText="IP адрес сервера"
	bind:value={apiUrl}
	placeholder={settings.apiUrl}
	class="mb-4"
/>
<TextInput
	labelText="Версія API"
	bind:value={apiVersion}
	placeholder={settings.apiVersion}
	class="mb-4"
/>
<Button class="mb-4" on:click={checkUpdate}>Перевірити оновлення</Button>

<Button class="absolute bottom-4 left-4" on:click={saveSettings}>Зберегти</Button>
