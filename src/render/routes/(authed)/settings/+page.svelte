<script lang="ts">
	import { Button, Checkbox, TextInput, Dropdown } from 'carbon-components-svelte';
	import { pushNotification, languages } from '$lib/utils/utils';
	import { settingsRenderer, versionRenderer } from '@/render/lib/utils/store';

	let settings: SettingsType = $state({});

	settingsRenderer.subscribe((v: any) => {
		settings = v;
	});

	function saveSettings(e: Event) {
		pushNotification('settingsSaveSuccess');
		const settingsToSave: SettingsType = {
			apiUrl: settings.apiUrl,
			trunicate: settings.trunicate,
			locale: settings.locale,
			loaded: true,
		};

		settingsRenderer.set(settingsToSave);
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
	bind:selectedId={settings.locale}
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
