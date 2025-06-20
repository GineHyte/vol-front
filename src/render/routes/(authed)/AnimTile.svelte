<script lang="ts">
	import { ClickableTile } from 'carbon-components-svelte';
	import { fade, fly } from 'svelte/transition';

	interface Props {
		href: string;
		title: string;
		text: string;
		pentogram: any;
	}

	let { href, title, text, pentogram }: Props = $props();
	let onMouseOver = $state(false);
</script>

<ClickableTile
	{href}
	class="h-36"
	on:mouseover={() => (onMouseOver = true)}
	on:mouseleave={() => (onMouseOver = false)}
>
	<h3 class="text-xl font-bold mb-2">{title}</h3>
	<div class="relative">
		{#if onMouseOver}
			<p
				class="absolute top-0 left-0"
				in:fly={{ y: 20, duration: 300 }}
				out:fade={{ duration: 200 }}
			>
				{text}
			</p>
		{:else}
			<div
				class="absolute top-0 left-0"
				in:fly={{ y: 20, duration: 300 }}
				out:fade={{ duration: 200 }}
			>
				{@render pentogram()}
			</div>
		{/if}
	</div>
</ClickableTile>
