<script lang="ts">
	import { Button, TextInput } from 'carbon-components-svelte';
	import { pushNotification } from '$lib/utils/utils';
	import { settingsRenderer, versionRenderer } from '@/render/lib/utils/store';
	import { ProgressBar } from 'carbon-components-svelte';

	let settings: any = $state({});
	settingsRenderer.subscribe((v: any) => {
		settings = v;
	});

	let apiUrl = $state('');
	let apiVersion = '';

	function saveSettings(e: Event) {
		pushNotification('settingsSaveSuccess');

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
	on:focus={(e) => (e.target.value = e.target.placeholder)}
/>
<!-- <TextInput
	labelText="Версія API"
	bind:value={apiVersion}
	placeholder={settings.apiVersion}
	class="mb-4"
/> -->
<!-- <Button class="mb-4" on:click={checkUpdate}>Перевірити оновлення</Button> -->
<p>Версія: {$versionRenderer}</p>

<Button class="absolute bottom-4 left-4" on:click={saveSettings}>Зберегти</Button>
