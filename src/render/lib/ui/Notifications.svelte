<script>
	import { ToastNotification } from 'carbon-components-svelte';
	import { notifications } from '$lib/utils/store';
	import { onMount } from 'svelte';

	const DEFAULT_TIMEOUT = 3_000;
	let notificationsLocal = $state([]);

	onMount(() => {
		notifications.subscribe((value) => {
			if (value.length === 0) return;
			notificationsLocal = value;
			setTimeout(
				() => {
					notifications.set([]);
				},
				notificationsLocal[notificationsLocal.length - 1].timeout > 0
					? notificationsLocal[notificationsLocal.length - 1].timeout
					: DEFAULT_TIMEOUT,
			);
		});
	});
</script>

<div class="absolute right-0 bottom-0 z-50">
	{#key notificationsLocal}
		{#each notificationsLocal as not}
			<ToastNotification
				on:close={() => {
					notifications.set([]);
				}}
				timeout={not.timeout > 0 ? not.timeout : DEFAULT_TIMEOUT}
				kind={not.kind}
				title={not.title}
				subtitle={not.message}
			/>
			<!-- caption={not.caption ? not.caption : new Date().toLocaleString()} -->
		{/each}
	{/key}
</div>
