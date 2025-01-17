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
	import ModalCreate from '$lib/ui/ModalCreate.svelte';

	let isSideNavOpen = false;

	let ready = false;
	onMount(() => (ready = true));

	let routes = [
		{
			title: 'Головна',
			path: '/',
		},
		{
			title: 'Ігри',
			path: '/games',
		},
		{
			title: 'Гравці',
			path: '/players',
		},
		{
			title: 'Команди',
			path: '/teams',
		},
		{
			title: 'Технічні навички',
			path: '/techs',
		},
		{
			title: 'Вправи',
			path: '/exercises',
		},
	];
</script>

<Header
	platformName="Технічні навички в пляжному волейболі"
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
