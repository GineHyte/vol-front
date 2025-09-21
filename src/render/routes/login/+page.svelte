<script lang="ts">
	import loginBackground from '$lib/videos/login-back.mp4';
	import loginBackgroundFinal from '$lib/videos/login-back-final.mp4';
	import { settingsRenderer } from '@/render/lib/utils/store';
	import { languages } from '$lib/utils/utils';
	import LoginForm from './LoginForm.svelte';
	import RegisterForm from './RegisterForm.svelte';
	import { CloseLarge } from 'carbon-icons-svelte';
	import { onMount } from 'svelte';

	let videoElementRef = $state<HTMLVideoElement>();
	let doLoginAnimation = $state(false);
	let settings: SettingsType = $state({});
	let localeCounter = $state(0);
	let registerPage = $state(false);

	settingsRenderer.subscribe((v: any) => {
		settings = v;
		localeCounter = languages.findIndex((l) => l.code === v.locale);
	});

	function handleLocaleChange() {
		if (localeCounter >= Object.keys(languages).length - 1) {
			localeCounter = 0;
		} else {
			localeCounter += 1;
		}
		const newLocale = languages.map((l) => l.code)[localeCounter];
		settingsRenderer.set({ ...settings, locale: newLocale });
	}

	function setWindowState(data: any) {
		window.electron.setWindowState(data);
	}

	onMount(() => {
		if (videoElementRef) {
			videoElementRef.height = window.innerHeight;
			if (window.innerWidth === 1000) {
				videoElementRef.style.left = '-30rem';
			} else if (window.innerWidth < 1200) {
				videoElementRef.style.left = '-20rem';
			} else if (window.innerWidth < 1400) {
				videoElementRef.style.left = '-10rem';
			}
		}
	});
</script>

{#key doLoginAnimation}
	<video
		bind:this={videoElementRef}
		src={doLoginAnimation ? loginBackgroundFinal : loginBackground}
		autoplay
		loop={!doLoginAnimation}
		muted
		width="auto"
		playsinline
		class="block fixed z-0 overflow-hidden"
	></video>
{/key}

<div class="flex fixed top-0 right-0 mt-4 mr-4 z-20 gap-4">
	<button class="w-10 h-10 bg-gray-200 hover:bg-gray-300" onclick={handleLocaleChange}>
		{settings.locale?.toUpperCase()}
	</button>
	<button
		class="w-10 h-10 bg-red-500 hover:bg-gray-300"
		onclick={() => {
			setWindowState({ close: true });
		}}
	>
		<CloseLarge class="m-auto" />
	</button>
</div>

{#if registerPage}
	<RegisterForm bind:registerPage bind:doLoginAnimation />
{:else}
	<LoginForm bind:registerPage bind:doLoginAnimation />
{/if}
