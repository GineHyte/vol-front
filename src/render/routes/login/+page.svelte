<script lang="ts">
	import { login } from '$lib/scripts/endpoints';
	import { FluidForm, TextInput, PasswordInput, Button } from 'carbon-components-svelte';
	import { loginData } from '$lib/utils/store';
	import { get } from 'svelte/store';
	import { pushNotification } from '@/render/lib/utils/utils';
	import loginBackground from '$lib/videos/login-back.mp4';
	import loginBackgroundFinal from '$lib/videos/login-back-final.mp4';

	let videoElementRef: HTMLVideoElement;
	let doLoginAnimation = $state(false);
	let password = $state('');
	let username = $state('');
	let passwordInvalid = $state(false);
	let errorUsernameInvalid = $state(false);
	let errorText = $state('');

	function plausibilityCheck(username: string, password: string): boolean {
		const passCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)[a-zA-Zd]{6,}$/.test(password);
		const userCheck = /^[a-zA-Z0-9_]{3,}$/.test(username);
		if (!passCheck) {
			passwordInvalid = true;
			pushNotification('errorPasswordPlausibility');
		}
		if (!userCheck) {
			errorUsernameInvalid = true;
			pushNotification('errorUsernamePlausibility');
		}
		return passCheck && userCheck;
	}

	function handleSubmit(event: Event) {
		if (plausibilityCheck(username, password)) {
			login(username, password)
				.then((resp) => {
					if (resp.accessToken) {
						doLoginAnimation = true;
						loginData.set({
							accessToken: resp.accessToken,
							refreshToken: resp.refreshToken,
							username: username,
						});
						pushNotification('successLoginData');
						setTimeout(() => {
							window.location.href = '/';
						}, 1000);
					} else {
						pushNotification('errorLoginFailed');
					}
				})
				.catch((err) => {
					console.error(err);
					pushNotification('errorLoginFailed');
				});
		} else {
			doLoginAnimation = false;
			passwordInvalid = true;
			setTimeout(() => {
				passwordInvalid = false;
			}, 2000);
		}
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
	/>
{/key}

<div class="pt-[20%] pr-24 z-1 fixed right-0 w-[45rem] h-[100vh]">
	<span class="text-3xl">Log in</span>
	<FluidForm class="mt-10" on:submit={handleSubmit}>
		<TextInput labelText="Username" placeholder="Enter username..." required />
		<PasswordInput
			invalid={passwordInvalid}
			required
			type="password"
			labelText="Password"
			placeholder="Enter password..."
		/>
	</FluidForm>
	{#if errorText !== ''}
		<p class="text-red-500 mt-2">{errorText}</p>
	{/if}
	<Button class="absolute mt-10 w-60 h-16 text-xl" on:click={handleSubmit}>Submit</Button>
</div>
