<script lang="ts">
	import 'carbon-components-svelte/css/all.css';
	import '$lib/_global.css';
	import {
		Header,
		HeaderNav,
		Content,
		Button,
		SideNav,
		SideNavItems,
		SideNavLink,
		SkipToContent,
	} from 'carbon-components-svelte';
	import { onMount } from 'svelte';
	import { read } from '$app/server';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
	let ready = $state(false);

	onMount(() => {
		ready = true;
	});
</script>

<Content class="p-0 h-100vh w-100vw bg-loginBg ">
	{#if ready}
		{@render children?.()}
	{/if}
</Content>
