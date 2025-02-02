<script>
	import { ToastNotification } from 'carbon-components-svelte';
	import { notifications } from '@/render/lib/utils/store';

	const DEFAULT_TIMEOUT = 3_000;

	$: $notifications,
		() => {
			setTimeout(() => {
				notifications.set($notifications.slice(1, -1));
			}, 3100);
		};
</script>

<div class="absolute right-0 bottom-0">
	{#each $notifications as not}
		<ToastNotification
			timeout={not.timeout ? not.timeout : DEFAULT_TIMEOUT}
			kind={not.kind}
			title={not.title}
			subtitle={not.message}
		/>
		<!-- caption={not.caption ? not.caption : new Date().toLocaleString()} -->
	{/each}
</div>
