<script lang="ts">
	import loginBackground from '$lib/videos/login-back.mp4';
	import loginBackgroundFinal from '$lib/videos/login-back-final.mp4';
	import { settingsRenderer } from '@/render/lib/utils/store';
	import { languages } from '$lib/utils/utils';
	import LoginForm from './LoginForm.svelte';
	import RegisterForm from './RegisterForm.svelte';

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
</script>

{#key doLoginAnimation}
	<video
		bind:this={videoElementRef}
		src={doLoginAnimation ? loginBackgroundFinal : loginBackground}
		autoplay
		loop={!doLoginAnimation}
		muted
		playsinline
		class="block h-100vh fixed z-0"
	></video>
{/key}

<button
	class="fixed top-0 right-0 z-20 w-10 h-10 mt-4 mr-4 bg-gray-200 hover:bg-gray-300"
	onclick={handleLocaleChange}
>
	{settings.locale?.toUpperCase()}
</button>

{#if registerPage}
	<RegisterForm bind:registerPage bind:doLoginAnimation />
{:else}
	<LoginForm bind:registerPage bind:doLoginAnimation />
{/if}
