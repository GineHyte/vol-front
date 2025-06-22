<script lang="ts">
	import 'carbon-components-svelte/css/all.css';
	import '$lib/_global.css';
	import { Content } from 'carbon-components-svelte';
	import { onMount } from 'svelte';
	import Notifications from '$lib/ui/Notifications.svelte';
	import { initI18n } from '@/render/lib/i18n';
	import { settingsRenderer } from '@/render/lib/utils/store';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
	let ready = $state(false);

	onMount(() => {
		ready = true;
		window.electron.getSettings().then((settings: any) => {
			if (settings) {
				settings.loaded = true;
				settingsRenderer.set(settings);
				initI18n();
			}
		});
	});
</script>

<Content class="p-0 h-100vh w-100vw bg-loginBg ">
	{#if ready}
		{@render children?.()}
	{/if}
</Content>

<Notifications />
