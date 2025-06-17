<script lang="ts">
	import { run } from 'svelte/legacy';
	import { onMount } from 'svelte';
	import 'carbon-components-svelte/css/all.css';
	import '$lib/_global.css';
	import { initI18n } from '$lib/i18n';
	import { locale } from 'svelte-i18n';
	import { t } from '$lib/utils/utils';
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
	import { Close, Minimize, Maximize, Subtract, LightFilled, Light } from 'carbon-icons-svelte';
	import { settingsRenderer, versionRenderer } from '@/render/lib/utils/store';
	import Notifications from '$lib/ui/Notifications.svelte';
	import { pushNotification } from '../lib/utils/utils';
	import { isLoading } from 'svelte-i18n';
	import { loginData } from '$lib/utils/store';
	import { token } from '$lib/scripts/endpoints';
	import { get } from 'svelte/store';
	import { page } from '$app/stores'; // Импорт текущего маршрута

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
	let isSideNavOpen = $state(false);
	let currentWindowState = $state({
		isMaximized: false,
		isFullScreen: false,
	});
	let theme = $state('g100'); // "white" | "g10" | "g80" | "g90" | "g100"
	let ready = $state(false);
	let currentRoute = $page.route.id || '/'; // Default route

	async function checkAccessToken() {
		const { refreshToken, username } = get(loginData) || {};
		if (!refreshToken || !username) {
			pushNotification('errorLoginData');
			window.location.href = '/login';
			return;
		} else {
			const resp = await token(refreshToken, username);
			if (!resp.accessToken) {
				pushNotification('errorLoginData');
				window.location.href = '/login';
				return;
			} else {
				loginData.set({
					accessToken: resp.accessToken,
					refreshToken: resp.refreshToken,
					username: username,
				});
				pushNotification('successLoginData');
			}
		}
	}

	onMount(() => {
		ready = true;
		checkAccessToken();
		window.electron.getSettings().then((settings: any) => {
			if (settings) {
				settings.loaded = true;
				settingsRenderer.set(settings);
				initI18n();
			}
		});
		window.electron.getVersion().then((version: any) => {
			versionRenderer.set(version);
		});
		window.onerror = (message, source, lineno, colno, error) => {
			pushNotification('error', {
				message: message.toString(),
				source: source || '',
				lineno: lineno?.toString() || '',
				colno: colno?.toString() || '',
				error: error?.toString() || '',
			});
		};
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

	function getRoutes() {
		return [
			{
				title: t('navigation.home'),
				path: '/',
			},
			{
				title: t('navigation.games'),
				path: '/games',
			},
			{
				title: t('navigation.players'),
				path: '/players',
			},
			{
				title: t('navigation.teams'),
				path: '/teams',
			},
			{
				title: t('navigation.techs'),
				path: '/techs',
			},
			{
				title: t('navigation.exercises'),
				path: '/exercises',
			},
			{
				title: t('navigation.settings'),
				path: '/settings',
			},
		];
	}

	run(() => {
		document.documentElement.setAttribute('theme', theme);
	});
</script>

{#key $locale}
	<Header
		platformName={t('titles.appTitle')}
		bind:isSideNavOpen
		class="w-full"
		style="-webkit-app-region: drag;"
		persistentHamburgerMenu={true}
	>
		<!-- @migration-task: migrate this slot by hand, `skip-to-content` is an invalid identifier -->
		<svelte:fragment slot="skip-to-content">
			<SkipToContent />
		</svelte:fragment>
		<HeaderNav style="display:block">
			<Button
				kind={theme === 'g100' ? 'ghost' : 'secondary'}
				on:click={() => {
					theme = theme === 'g100' ? 'white' : 'g100';
				}}
				iconDescription={t('buttons.theme')}
				icon={theme === 'g100' ? LightFilled : Light}
			/>
			{#key currentWindowState}
				<Button
					icon={Subtract}
					kind="secondary"
					size="small"
					iconDescription={t('buttons.minimize')}
					on:click={() => setWindowState({ minimize: true })}
				/>
				<Button
					icon={currentWindowState.isMaximized || currentWindowState.isFullScreen
						? Minimize
						: Maximize}
					kind="secondary"
					size="small"
					iconDescription={t('buttons.maximize')}
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
					iconDescription={t('common.close')}
					on:click={() => setWindowState({ close: true })}
				/>
			{/key}
		</HeaderNav>
		<SideNav bind:isOpen={isSideNavOpen}>
			<SideNavItems>
				{#each getRoutes() as route}
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
		{#if ready && currentRoute !== '/login'}
			{@render children?.()}
		{/if}
	</Content>

	<Notifications />
{/key}
