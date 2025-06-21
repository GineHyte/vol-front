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
	import loginBackground from '$lib/videos/login-back.webm';
</script>

<video src={loginBackground} autoplay loop muted playsinline class="block h-100vh fixed z-0" />

<Tile class="z-1 fixed right-[6%] top-[30%] w-[40rem] h-[22rem]">
	<span class="text-3xl">Log in</span>
	<FluidForm class="mt-10">
		<TextInput labelText="User name" placeholder="Enter user name..." required />
		<PasswordInput
			required
			type="password"
			labelText="Password"
			placeholder="Enter password..."
		/>
	</FluidForm>
	<Button class="absolute right-0 bottom-0 w-60 h-16 text-xl">Submit</Button>
</Tile>
