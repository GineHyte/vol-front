<script lang="ts">
	import { Modal, TileGroup, RadioTile } from 'carbon-components-svelte';
	import { createEventDispatcher } from 'svelte';

	export let open: boolean = false;
	export let title: string = '';
	export let options: { [key: string]: any }[] = [];

	let dispatch = createEventDispatcher();
	let selectedOption: string = '';
</script>

<Modal
	size={'lg'}
	bind:open
	primaryButtonText="Готово"
	modalHeading={title}
	on:submit={() => {
		open = false;
		dispatch('submit', selectedOption);
	}}
>
	<TileGroup
		legend={title}
		selected={selectedOption}
		on:select={(e) => {
			selectedOption = e.detail;
		}}
	>
		{#each options as option}
			<RadioTile value={option.key}>{option.value}</RadioTile>
		{/each}
	</TileGroup>
</Modal>
