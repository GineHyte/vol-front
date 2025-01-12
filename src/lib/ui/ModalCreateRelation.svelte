<script lang="ts">
	import { onMount } from 'svelte';
	import {
		DataTable,
		DataTableSkeleton,
		Modal,
		TileGroup,
		RadioTile,
	} from 'carbon-components-svelte';
	import { getPlayers, getTeams, getGames } from '$lib/scripts/endpoints';
	import { Pagination } from '$lib/scripts/pagination';
	import Model from '$lib/scripts/model';
	import { PaginationProps } from '$lib/scripts/pagination';
	import { createEventDispatcher } from 'svelte';
	import { Relation } from '$lib/scripts/relation';
	import { AMPLUA } from '$lib/utils/utils';

	export let relation: Relation;
	export let selectedRelation: number[] = [];
	export let open: boolean = false;
	export let parentOpen: boolean = false; // workaround for Carbon, because it doesn't support nested modals

	let dispatch = createEventDispatcher();
	let getFunc: (paginationProps: PaginationProps) => Promise<Pagination<any>>;
	let playersAmplua: string[] = [AMPLUA.Defender];
	let playersAmpluaOpen: boolean = false;

	if (relation.jsRelation === 'players') {
		getFunc = getPlayers;
	} else if (relation.jsRelation === 'teams') {
		getFunc = getTeams;
	} else if (relation.jsRelation === 'games') {
		getFunc = getGames;
	}

	$: parentOpen = !open;
	$: if (!open) dispatch('close');
	$: playersAmpluaOpen = !open && selectedRelation.length !== 0;
</script>

<Modal
	size={'lg'}
	bind:open
	primaryButtonText="Готово"
	modalHeading={relation.relationTitle}
	primaryButtonDisabled={selectedRelation.length === 0}
	on:submit={() => {
		open = false;
		if (relation.jsRelation === 'players') return;
		dispatch('submit', selectedRelation);
	}}
>
	{#if getFunc}
		{#await getFunc(new PaginationProps())}
			<DataTableSkeleton />
		{:then data}
			<DataTable
				bind:selectedRowIds={selectedRelation}
				headers={data.getHeaders(['teams', 'players', 'imageFileId'])}
				rows={data.getRows()}
				on:click:row={(e) => {
					selectedRelation = [e.detail.id];
					if (relation.jsRelation === 'players') {
						playersAmpluaOpen = true;
					}
				}}
			/>
		{/await}
	{/if}
</Modal>

{#if relation.jsRelation === 'players'}
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
			{#each Object.entries(AMPLUA) as amplua}
				<RadioTile value={amplua[0]}>{amplua[1]}</RadioTile>
			{/each}
		</TileGroup>
	</Modal>
{/if}
