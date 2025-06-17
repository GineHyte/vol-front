<script lang="ts">
	import { run } from 'svelte/legacy';

	import { Column, Grid, Row } from 'carbon-components-svelte';
	import { Side } from '$lib/utils/utils';
	import { createEventDispatcher } from 'svelte';

	interface Props {
		currentSide: Side;
		side: Side;
	}

	let { currentSide, side }: Props = $props();

	let zones: number[][] = $state();

	if (side === Side.LEFT) {
		zones = [
			[5, 4],
			[6, 3],
			[1, 2],
		];
	} else {
		zones = [
			[2, 1],
			[3, 6],
			[4, 5],
		];
	}

	const dispatch = createEventDispatcher();

	let disabled: boolean = $state(true);

	run(() => {
		disabled = currentSide !== side;
	});
</script>

<div class="w-full h-full flex flex-col">
	{#each zones as row}
		<div class="w-full h-full flex items-center justify-center font-bold">
			{#each row as zone}
				<button
					class="w-full h-full border-2 border-white flex items-center justify-center cursor-pointer {disabled
						? 'bg-gray-500 cursor-not-allowed'
						: 'hover:bg-red-500 cursor-pointer'}"
					onclick={() => dispatch('selectZone', zone)}
				>
					{zone}
				</button>
			{/each}
		</div>
	{/each}
</div>
