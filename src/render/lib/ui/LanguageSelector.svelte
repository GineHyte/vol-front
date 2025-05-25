<script lang="ts">
	import { Dropdown } from 'carbon-components-svelte';
	import { languages, changeLanguage, currentLanguage } from '$lib/i18n/utils';
	import { Language } from 'carbon-icons-svelte';

	let selectedLanguage = $state('uk');

	// Subscribe to current language changes
	currentLanguage.subscribe((value: string) => {
		selectedLanguage = value;
	});

	function handleLanguageChange(event: any) {
		const newLanguage = event.detail.selectedId;
		changeLanguage(newLanguage);
	}
</script>

<Dropdown
	class="mt-2"
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
