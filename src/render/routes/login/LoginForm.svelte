<script lang="ts">
	import { login } from '$lib/scripts/endpoints';
	import { FluidForm, TextInput, PasswordInput, Button } from 'carbon-components-svelte';
	import { loginData } from '$lib/utils/store';
	import { pushNotification } from '@/render/lib/utils/utils';
	import { t } from '$lib/utils/utils';
	import { settingsRenderer } from '@/render/lib/utils/store';

	let password = $state('');
	let username = $state('');
	let passwordInvalid = $state(false);
	let usernameInvalid = $state(false);
	let errorText = $state('');
	let settings: SettingsType = $state({});
	let server: string = $state('');

	interface Props {
		registerPage?: boolean;
		doLoginAnimation?: boolean;
	}

	let { registerPage = $bindable(false), doLoginAnimation = $bindable(false) }: Props = $props();

	settingsRenderer.subscribe((v: any) => {
		settings = v;
		server = v.apiUrl || '';
	});
	function plausibilityCheck(username: string, password: string): boolean {
		passwordInvalid = false; ///^(?=.*[a-z])(?=.*[A-Z])(?=.*d)[a-zA-Zd]{8,}$/.test(password);
		usernameInvalid = false; ///^[a-zA-Z0-9_]{3,}$/.test(username);
		if (passwordInvalid) {
			errorText = t('notifications.plausibilityPassword');
			pushNotification('errorPasswordPlausibility');
		}
		if (usernameInvalid) {
			errorText = t('notifications.plausibilityUsername');
			pushNotification('errorUsernamePlausibility');
		}
		return !passwordInvalid && !usernameInvalid;
	}
	function handleSubmit(event: Event) {
		// Reset error states
		passwordInvalid = false;
		usernameInvalid = false;
		errorText = '';

		settings.apiUrl = server;
		settingsRenderer.set(settings);

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
						pushNotification('successLogin');
						setTimeout(() => {
							window.location.href = '/';
							settingsRenderer.set(settings);
						}, 1000);
					} else {
						pushNotification('errorInvalidCredentials');
						errorText = t('notifications.invalidCredentials');
					}
				})
				.catch((err) => {
					pushNotification('errorInvalidCredentials');
					errorText = t('notifications.invalidCredentials');
				});
		} else {
			doLoginAnimation = false;
			passwordInvalid = true;
			setTimeout(() => {
				passwordInvalid = false;
				usernameInvalid = false;
				errorText = '';
			}, 2000);
		}
	}
</script>

<div class="pt-[20%] pr-24 z-10 fixed right-0 w-[44rem] h-[100vh]">
	<div class="bg-loginBg p-2">
		<p class="text-3xl">{t('login.title')}</p>
		<p class="text-sm text-gray-500">
			{t('login.registerText')}
			<a class="text-blue-500 underline cursor-pointer" onclick={() => (registerPage = true)}>
				{t('login.registerLink')}
			</a>
		</p>
	</div>
	<FluidForm class="mt-6" on:submit={handleSubmit}>
		<TextInput
			bind:value={username}
			invalid={usernameInvalid}
			labelText={t('login.username')}
			placeholder={t('login.usernamePlaceholder')}
			invalidText={errorText}
			required
		/>
		<PasswordInput
			bind:value={password}
			invalid={passwordInvalid}
			required
			type="password"
			labelText={t('login.password')}
			invalidText={errorText}
			placeholder={t('login.passwordPlaceholder')}
		/>
		<TextInput
			bind:value={server}
			labelText={t('login.server')}
			placeholder={t('login.serverPlaceholder')}
			invalidText={errorText}
			required
		/>
	</FluidForm>
	{#if errorText !== ''}
		<p class="text-red-500 mt-2">{errorText}</p>
	{/if}
	<Button class="absolute mt-10 w-60 h-16 text-lg" on:click={handleSubmit}>
		{t('login.submit')}
	</Button>
</div>
