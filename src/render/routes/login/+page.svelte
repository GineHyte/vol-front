<script lang="ts">
	import { login, token } from '$lib/scripts/endpoints';
	import {
		Form,
		FormGroup,
		FluidForm,
		TextInput,
		PasswordInput,
		Checkbox,
		RadioButtonGroup,
		RadioButton,
		Select,
		SelectItem,
		Tile,
		Button,
	} from 'carbon-components-svelte';
	import { loginData } from '$lib/utils/store';
	import { get } from 'svelte/store';
	import { pushNotification } from '@/render/lib/utils/utils';
	import loginBackground from '$lib/videos/login-back.mp4';

	let videoElementRef: HTMLVideoElement;
	let videoCurrentTime = $state(0);
	let doLoginAnimation = $state(false);

	function handleSubmit(event: Event) {
		videoElementRef.playbackRate = 4.0;
		doLoginAnimation = true;
	}
</script>

{#key doLoginAnimation}
	<video
		bind:currentTime={videoCurrentTime}
		bind:this={videoElementRef}
		src={videoCurrentTime === 0 && doLoginAnimation ? '' : loginBackground}
		autoplay
		loop
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
			required
			type="password"
			labelText="Password"
			placeholder="Enter password..."
		/>
	</FluidForm>
	<Button class="absolute mt-10 w-60 h-16 text-xl" on:click={handleSubmit}>Submit</Button>
</div>
