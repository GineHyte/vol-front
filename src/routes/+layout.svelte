<script lang="ts">
	import { onMount } from 'svelte';
	import 'carbon-components-svelte/css/all.css';
	import '$lib/_global.css';

	import {
		Header,
		HeaderNav,
		HeaderNavItem,
		SkipToContent,
		Content,
	} from 'carbon-components-svelte';

	let isSideNavOpen = false;

	let ready: boolean = false;
	onMount(() => (ready = true));

	let routes = [
		{
			title: 'Home',
			path: '/',
		},
		{
			title: 'Games',
			path: '/games',
		},
		{
			title: 'Players',
			path: '/players',
		},
		{
			title: 'Teams',
			path: '/teams',
		},
	];
</script>

<Header
	platformName="Technical Skills in Beach Volleyball"
	bind:isSideNavOpen
	class="w-full"
	style="-webkit-app-region: drag;"
>
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
	<HeaderNav style="-webkit-app-region: drag;">
		{#each routes as route}
			<HeaderNavItem href={route.path} text={route.title} />
		{/each}
	</HeaderNav>
</Header>

<Content>
	{#if ready}
		<slot />
	{/if}
</Content>
