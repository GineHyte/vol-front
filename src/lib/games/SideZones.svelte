<script lang="ts">
	import { Column, Grid, Row } from 'carbon-components-svelte';
	import { Side } from '$lib/utils/utils';
	import { createEventDispatcher } from 'svelte';

	export let currentSide: Side;
	export let side: Side;

	const dispatch = createEventDispatcher();

	let disabled: boolean = true;

	$: disabled = currentSide !== side;
</script>

<div class="w-full h-full flex flex-col">
	<div class="w-full h-full flex items-center justify-center font-bold">
		<button
			class="w-full h-full border-2 border-white flex items-center justify-center cursor-pointer {disabled
				? 'bg-gray-500 cursor-not-allowed'
				: 'hover:bg-red-500 cursor-pointer'}"
			on:click={() => dispatch('selectZone', { zone: 1, side })}
		>
			1
		</button>
		<button
			class="w-full h-full border-2 border-white flex items-center justify-center cursor-pointer {disabled
				? 'bg-gray-500 cursor-not-allowed'
				: 'hover:bg-red-500 cursor-pointer'}"
			on:click={() => dispatch('selectZone', { zone: 1, side })}
		>
			2
		</button>
	</div>
	<div class="w-full h-full flex items-center justify-center font-bold">
		<button
			class="w-full h-full border-2 border-white flex items-center justify-center cursor-pointer {disabled
				? 'bg-gray-500 cursor-not-allowed'
				: 'hover:bg-red-500 cursor-pointer'}"
			on:click={() => dispatch('selectZone', { zone: 1, side })}
		>
			3
		</button>
		<button
			class="w-full h-full border-2 border-white flex items-center justify-center cursor-pointer {disabled
				? 'bg-gray-500 cursor-not-allowed'
				: 'hover:bg-red-500 cursor-pointer'}"
		>
			4
		</button>
	</div>
	<div class="w-full h-full flex items-center justify-center font-bold">
		<button
			class="w-full h-full border-2 border-white flex items-center justify-center cursor-pointer {disabled
				? 'bg-gray-500 cursor-not-allowed'
				: 'hover:bg-red-500 cursor-pointer'}"
			on:click={() => dispatch('selectZone', { zone: 1, side })}
		>
			5
		</button>
		<button
			class="w-full h-full border-2 border-white flex items-center justify-center cursor-pointer {disabled
				? 'bg-gray-500 cursor-not-allowed'
				: 'hover:bg-red-500 cursor-pointer'}"
		>
			6
		</button>
	</div>
</div>
