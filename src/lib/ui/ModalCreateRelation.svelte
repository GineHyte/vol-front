<script lang="ts">
	import { onMount } from 'svelte';
	import {
		ClickableTile,
		DataTable,
		DataTableSkeleton,
		Modal,
		TileGroup,
		RadioTile,
	} from 'carbon-components-svelte';
	import { getPlayers, getTeams } from '$lib/scripts/endpoints';
	import { Pagination } from '$lib/scripts/pagination';
	import Model from '$lib/scripts/model';
	import { PaginationProps } from '$lib/scripts/pagination';
	import { createEventDispatcher } from 'svelte';
	import { PlayersAmplua } from '$lib/scripts/enums';

	export let relation: string;
	export let selectedRelation: number[] = [];
	export let open: boolean = false;
	export let parentOpen: boolean = false; // workaround for Carbon, because it doesn't support nested modals

	let dispatch = createEventDispatcher();
	let getFunc: (paginationProps: PaginationProps) => Promise<Pagination<any>>;
	let playersAmplua: string[] = [PlayersAmplua.DEFENDER];
	let playersAmpluaOpen: boolean = false;

	if (relation === 'player') {
		getFunc = getPlayers;
	} else if (relation === 'team') {
		getFunc = getTeams;
	}

	$: parentOpen = !open;
	$: playersAmpluaOpen = !open && selectedRelation.length !== 0;
</script>

<Modal
	size={'lg'}
	bind:open
	primaryButtonText="Готово"
	modalHeading={relation}
	primaryButtonDisabled={selectedRelation.length === 0}
	on:submit={() => {
		open = false;
		if (relation === 'player') return;
		dispatch('submit', selectedRelation);
	}}
>
	{#await getFunc(new PaginationProps())}
		<DataTableSkeleton />
	{:then data}
		<DataTable
			bind:selectedRowIds={selectedRelation}
			headers={data.getHeaders()}
			rows={data.getRows()}
			on:click:row={(e) => {
				selectedRelation = [e.detail.id];
				playersAmpluaOpen = true;
			}}
		/>
	{/await}
</Modal>

{#if relation === 'player'}
	<Modal
		size={'lg'}
		bind:open={playersAmpluaOpen}
		primaryButtonText="Готово"
		modalHeading={'Амплуа'}
		on:submit={() => {
			playersAmpluaOpen = false;
			dispatch('submit', [...selectedRelation, ...playersAmplua]);
		}}
	>
		<TileGroup
			legend="Амплуа"
			selected={playersAmplua[0]}
			on:select={(e) => {
				playersAmplua = [e.detail];
			}}
		>
			<RadioTile value={PlayersAmplua.DEFENDER}>Захисник</RadioTile>
			<RadioTile value={PlayersAmplua.ATTACKER}>Нападник</RadioTile>
			<RadioTile value={PlayersAmplua.UNIVERSAL}>Все</RadioTile>
		</TileGroup>
	</Modal>
{/if}
