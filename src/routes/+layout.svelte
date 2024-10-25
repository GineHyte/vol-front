<script lang="ts">
	import { onMount } from 'svelte';
	import 'carbon-components-svelte/css/all.css';
	import '$lib/_global.css';

	import {
		Header,
		HeaderNav,
		HeaderNavItem,
		HeaderNavMenu,
		SideNav,
		SideNavItems,
		SideNavMenu,
		SideNavMenuItem,
		SideNavLink,
		SideNavDivider,
		SkipToContent,
		Content,
	} from 'carbon-components-svelte';

	let isSideNavOpen = false;

	let ready: boolean = false;
	onMount(() => (ready = true));
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
		<HeaderNavItem href="/" text="Link 1" />
		<HeaderNavItem href="/" text="Link 2" />
		<HeaderNavItem href="/" text="Link 3" />
		<HeaderNavMenu text="Menu">
			<HeaderNavItem href="/" text="Link 1" />
			<HeaderNavItem href="/" text="Link 2" />
			<HeaderNavItem href="/" text="Link 3" />
		</HeaderNavMenu>
		<HeaderNavItem href="/" text="Link 4" />
	</HeaderNav>
</Header>

<SideNav bind:isOpen={isSideNavOpen}>
	<SideNavItems>
		<SideNavLink text="Link 1" />
		<SideNavLink text="Link 2" />
		<SideNavLink text="Link 3" />
		<SideNavMenu text="Menu">
			<SideNavMenuItem href="/" text="Link 1" />
			<SideNavMenuItem href="/" text="Link 2" />
			<SideNavMenuItem href="/" text="Link 3" />
		</SideNavMenu>
		<SideNavDivider />
		<SideNavLink text="Link 4" />
	</SideNavItems>
</SideNav>

<Content>
	{#if ready}
		<slot />
	{/if}
</Content>
