<script lang="ts">
	import { onMount } from 'svelte';
	import 'carbon-components-svelte/css/all.css';
	import '$lib/_global.css';

	import {
		Header,
		HeaderNav,
		HeaderNavItem,
		Content,
		Button,
		SideNav,
		SideNavItems,
		SideNavLink,
		SideNavMenu,
		SkipToContent,
		SideNavMenuItem,
	} from 'carbon-components-svelte';
	import { Close, Minimize, Maximize, Subtract, WintryMix } from 'carbon-icons-svelte';
	import { settingsRenderer, versionRenderer } from '$lib/utils/store';
	import Notifications from '$lib/ui/Notifications.svelte';
	import ModalCreate from '$lib/ui/ModalCreate.svelte';

	let isSideNavOpen = false;
	let currentWindowState = {
		isMaximized: false,
		isFullScreen: false,
	};

	let ready = false;
	onMount(() => {
		ready = true;
		window.electron.getSettings().then((settings: any) => {
			if (settings) {
				settings.loaded = true;
				settingsRenderer.set(settings);
			}
		});
		window.electron.getVersion().then((version: any) => {
			versionRenderer.set(version);
		});
	});

	window.electron.getWindowState().then((windowState: any) => {
		currentWindowState = windowState;
	});

	function setWindowState(data: any) {
		window.electron.setWindowState(data);
		window.electron.getWindowState().then((windowState: any) => {
			currentWindowState = windowState;
		});
	}

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
		{
			title: 'Налаштування',
			path: '/settings',
		},
	];
</script>

<Header
	platformName="Технічні навички в пляжному волейболі"
	bind:isSideNavOpen
	class="w-full"
	style="-webkit-app-region: drag;"
	persistentHamburgerMenu={true}
>
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
	<HeaderNav style="display:block">
		{#key currentWindowState}
			<Button
				icon={Subtract}
				kind="secondary"
				size="small"
				iconDescription="Мінімізувати"
				on:click={() => setWindowState({ minimize: true })}
			/>
			<Button
				icon={currentWindowState.isMaximized || currentWindowState.isFullScreen
					? Minimize
					: Maximize}
				kind="secondary"
				size="small"
				iconDescription="Свернути"
				on:click={() =>
					setWindowState({
						maximize: !(
							currentWindowState.isMaximized || currentWindowState.isFullScreen
						),
					})}
			/>
			<Button
				icon={Close}
				kind="danger"
				size="small"
				iconDescription="Закрити"
				on:click={() => setWindowState({ close: true })}
			/>
		{/key}
	</HeaderNav>
	<SideNav bind:isOpen={isSideNavOpen}>
		<SideNavItems>
			{#each routes as route}
				<SideNavLink
					href={route.path}
					text={route.title}
					on:click={() => (isSideNavOpen = false)}
				/>
			{/each}
		</SideNavItems>
	</SideNav>
</Header>

<Content>
	{#if ready}
		<slot />
	{/if}
</Content>

<Notifications />
