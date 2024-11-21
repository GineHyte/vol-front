<script>
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
	import Notifications from '$lib/ui/Notifications.svelte';

	let isSideNavOpen = false;

	let ready = false;
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
	<HeaderNav style="display:block">
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

<Notifications />
