<script lang="ts">
	import { Button, Checkbox, TextInput, Dropdown } from 'carbon-components-svelte';
	import { pushNotification } from '$lib/utils/utils';
	import { settingsRenderer, versionRenderer } from '@/render/lib/utils/store';
	import { languages, changeLanguage, currentLanguage } from '$lib/i18n/utils';

	let selectedLanguage = $state('uk');

	// Subscribe to current language changes
	currentLanguage.subscribe((value: string) => {
		selectedLanguage = value;
	});

	function handleLanguageChange(event: any) {
		const newLanguage = event.detail.selectedId;
		changeLanguage(newLanguage);
	}

	let settings: any = $state({});
	settingsRenderer.subscribe((v: any) => {
		settings = v;
	});

	function saveSettings(e: Event) {
		pushNotification('settingsSaveSuccess');

		window.electron.setSettings({
			apiUrl: settings.apiUrl,
			apiVersion: settings.apiVersion,
			trunicate: settings.trunicate,
			loaded: true,
		});

		settingsRenderer.set({
			...settings,
			apiUrl: settings.apiUrl,
			apiVersion: settings.apiVersion,
			trunicate: settings.trunicate,
		});
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
	bind:value={settings.apiUrl}
	placeholder={settings.apiUrl}
	class="mb-4"
	on:focus={(e) => (e.target.value = e.target.placeholder)}
/>
<Checkbox labelText="Урізання назв" bind:checked={settings.trunicate} class="mb-4" />

<Dropdown
	class="mt-2 mb-2"
	titleText=""
	size="sm"
	items={languages.map((lang: { code: string; name: string }) => ({
		id: lang.code,
		text: lang.name,
	}))}
	selectedId={selectedLanguage}
	on:select={handleLanguageChange}
	style="min-width: 120px;"
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
