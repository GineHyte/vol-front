<script lang="ts">
	import {
		DataTable,
		DataTableSkeleton,
		Modal,
		TileGroup,
		RadioTile,
	} from 'carbon-components-svelte';
	import { createEventDispatcher } from 'svelte';

	import { getPlayers, getTeams, getGames, getTechs } from '$lib/scripts/endpoints';
	import { Pagination } from '$lib/scripts/pagination';
	import { PaginationProps } from '$lib/scripts/pagination';
	import { Relation } from '$lib/scripts/relation';
	import { Amplua } from '$lib/utils/utils';

	export let relation: Relation;
	export let selectedRelation: number[] = [];
	export let open: boolean = false;

	let dispatch = createEventDispatcher();
	let getFunc: (paginationProps: PaginationProps) => Promise<Pagination<any>>;
	let playersAmplua: string[] = [Amplua.Defender];
	let playersAmpluaOpen: boolean = false;

	if (relation.jsRelation === 'players') {
		getFunc = getPlayers;
	} else if (relation.jsRelation === 'teams') {
		getFunc = getTeams;
	} else if (relation.jsRelation === 'games') {
		getFunc = getGames;
	} else if (relation.jsRelation === 'subtechs') {
		getFunc = getTechs;
	}

	$: if (!open) {
		dispatch('close');
		selectedRelation = [];
	}

	console.log('modal create relation open: ', open);
</script>

<Modal
	size={'lg'}
	bind:open
	primaryButtonText="Готово"
	modalHeading={relation.relationTitle}
	primaryButtonDisabled={selectedRelation.length === 0}
	on:submit={() => {
		open = false;
		if (selectedRelation.length === 0) return;
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
			open = false;
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
			{#each Object.entries(Amplua) as amplua}
				<RadioTile value={amplua[0]}>{amplua[1]}</RadioTile>
			{/each}
		</TileGroup>
	</Modal>
{/if}
