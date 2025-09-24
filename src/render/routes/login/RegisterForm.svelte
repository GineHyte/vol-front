<script lang="ts">
	import { register } from '$lib/scripts/endpoints';
	import { FluidForm, TextInput, PasswordInput, Button } from 'carbon-components-svelte';
	import { loginData } from '$lib/utils/store';
	import { pushNotification } from '$lib/utils/utils';
	import { t } from '$lib/utils/utils';
	import { settingsRenderer } from '$lib/utils/store';
	import { ChevronRight } from 'carbon-icons-svelte';
	import { Register } from '$lib/scripts/models';

	let password = $state('');
	let username = $state('');
	let passwordCheck = $state('');
	let firstName = $state('');
	let lastName = $state('');
	let passwordInvalid = $state(false);
	let passwordCheckInvalid = $state(false);
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
	function plausibilityCheck(username: string, password: string, passwordCheck: string): boolean {
		passwordInvalid = false; ///^(?=.*[a-z])(?=.*[A-Z])(?=.*d)[a-zA-Zd]{8,}$/.test(password);
		usernameInvalid = false; ///^[a-zA-Z0-9_]{3,}$/.test(username);
		passwordCheckInvalid = password !== passwordCheck;
		if (passwordCheckInvalid) {
			passwordCheckInvalid = true;
			errorText = t('notifications.passwordMismatch');
			pushNotification('errorPasswordMismatch');
		}
		if (passwordInvalid) {
			passwordInvalid = true;
			errorText = t('notifications.plausibilityPassword');
			pushNotification('errorPasswordPlausibility');
		}
		if (usernameInvalid) {
			usernameInvalid = true;
			errorText = t('notifications.plausibilityUsername');
			pushNotification('errorUsernamePlausibility');
		}
		return !passwordInvalid && !usernameInvalid && !passwordCheckInvalid;
	}
	function handleSubmit(event: Event) {
		// Reset error states
		passwordInvalid = false;
		usernameInvalid = false;
		errorText = '';

		settingsRenderer.set({ ...settings, apiUrl: server });

		if (plausibilityCheck(username, password, passwordCheck)) {
			const registerData = new Register();
			registerData.username = username;
			registerData.password = password;
			registerData.firstName = firstName;
			registerData.lastName = lastName;
			register(registerData)
				.then((resp) => {
					if (resp.status === 'success') {
						doLoginAnimation = true;
						pushNotification('successRegister');
						setTimeout(() => {
							window.location.href = '/login';
						}, 1000);
					} else {
						pushNotification('errorRegister');
						errorText = t('notifications.registerError');
					}
				})
				.catch((err) => {
					pushNotification('errorRegister');
					errorText = t('notifications.registerError');
				});
		} else {
			setTimeout(() => {
				passwordInvalid = false;
				usernameInvalid = false;
				passwordCheckInvalid = false;
				errorText = '';
			}, 2000);
		}
	}
</script>

<div class="pt-[17%] pr-24 z-10 fixed right-0 w-[44rem] h-[100vh]">
	<div class="bg-loginBg p-2">
		<p class="text-3xl">{t('login.registerTitle')}</p>
		<p class="text-sm text-gray-500">
			{t('login.loginText')}
			<a
				class="text-blue-500 underline cursor-pointer"
				onclick={() => (registerPage = false)}
			>
				{t('login.loginLink')}
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
		<PasswordInput
			bind:value={passwordCheck}
			invalid={passwordCheckInvalid}
			required
			type="password"
			invalidText={errorText}
			labelText={t('login.password')}
			placeholder={t('login.passwordPlaceholder')}
		/>
		<TextInput
			bind:value={firstName}
			labelText={t('login.firstName')}
			placeholder={t('login.firstNamePlaceholder')}
			invalidText={errorText}
			required
		/>
		<TextInput
			bind:value={lastName}
			labelText={t('login.lastName')}
			placeholder={t('login.lastNamePlaceholder')}
			invalidText={errorText}
			required
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
