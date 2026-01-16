<script lang="ts">
	import { Button, Checkbox, TextInput, Dropdown } from 'carbon-components-svelte';
	import { pushNotification, languages } from '$lib/utils/utils';
	import { settingsRenderer, versionRenderer, loginData } from '@/render/lib/utils/store';
	import { t } from '$lib/utils/utils';
	import { Theme } from 'carbon-components-svelte';
	import type { SelectProps } from 'carbon-components-svelte/types/Select/Select.svelte';

	let settings: SettingsType = $state({});

	settingsRenderer.subscribe((v: any) => {
		settings = v;
	});

	type CarbonTheme = 'white' | 'g10' | 'g80' | 'g90' | 'g100';

	let themeSelectorOptions: SelectProps & {
		themes?: CarbonTheme[];
	} = {
		labelText: t('buttons.theme'),
		themes: ['white', 'g10', 'g80', 'g90', 'g100'],
	};

	function saveSettings(e: Event) {
		pushNotification('settingsSaveSuccess');
		const settingsToSave: SettingsType = {
			apiUrl: settings.apiUrl,
			trunicate: settings.trunicate,
			locale: settings.locale,
			theme: settings.theme,
			loaded: true,
		};

		settingsRenderer.set(settingsToSave);
	}

	function logout() {
		pushNotification('successLogout');
		loginData.set({
			accessToken: '',
			refreshToken: '',
			username: '',
		});
		window.location.href = '/login';
	}

	function checkUpdate() {
		window.electron.checkUpdate();
	}
</script>

<TextInput
	labelText={t('settings.serverIP')}
	bind:value={settings.apiUrl}
	placeholder={settings.apiUrl}
	class="mb-4"
	on:focus={(e) => {
		const target = e.target as HTMLInputElement;
		if (target) {
			target.value = target.placeholder;
		}
	}}
/>
<Checkbox labelText={t('settings.truncateNames')} bind:checked={settings.trunicate} class="mb-4" />

<Dropdown
	class="mt-2 mb-2"
	titleText={t('settings.version')}
	size="sm"
	items={languages.map((lang: { code: string; name: string }) => ({
		id: lang.code,
		text: lang.name,
	}))}
	bind:selectedId={settings.locale}
	style="min-width: 120px;"
/>
<Button class="my-4" on:click={logout}>
	{t('buttons.logout')}
</Button>

<!-- <TextInput
	labelText="Версія API"
	bind:value={apiVersion}
	placeholder={settings.apiVersion}
	class="mb-4"
/> -->
<Button class="mt-4" on:click={checkUpdate}>{t('buttons.checkUpdate')}</Button>
<Theme
	on:update={(e) => {
		settings.theme = e.detail.theme as CarbonTheme;
	}}
	render="select"
	theme={settings.theme}
	select={themeSelectorOptions}
/>
<p>{t('settings.version')}: {$versionRenderer}</p>

<Button class="absolute bottom-4 left-4" on:click={saveSettings}>{t('common.save')}</Button>
