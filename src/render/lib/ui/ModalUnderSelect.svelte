<script lang="ts">
	import { Modal, TileGroup, RadioTile } from 'carbon-components-svelte';
	import { createEventDispatcher } from 'svelte';
	import { t } from '$lib/i18n/utils';

	interface Props {
		open?: boolean;
		title?: string;
		options?: { [key: string]: any }[];
	}

	let { open = $bindable(false), title = '', options = [] }: Props = $props();

	let dispatch = createEventDispatcher();
	let selectedOption: string = $state('');
</script>

<Modal
	size={'lg'}
	bind:open
	primaryButtonText={$t('common.done')}
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
