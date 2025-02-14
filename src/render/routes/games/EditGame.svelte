<script lang="ts">
	import { Button, Tile } from 'carbon-components-svelte';
	import { Game } from '$lib/scripts/models';
	import { createGame, getTeams } from '$lib/scripts/endpoints';
	import { createEventDispatcher } from 'svelte';
	import ModalCreateRelation from '$lib/ui/ModalCreateRelation.svelte';
	import ModalEdit from '@/render/lib/ui/ModalEdit.svelte';

	interface Props {
		createOpen?: boolean;
		teamA?: any;
		teamB?: any;
		selectTeamAOpen?: boolean;
		selectTeamBOpen?: boolean;
	}

	let {
		createOpen = $bindable(false),
		teamA = $bindable(undefined),
		teamB = $bindable(undefined),
		selectTeamAOpen = $bindable(false),
		selectTeamBOpen = $bindable(false)
	}: Props = $props();

	const dispatch = createEventDispatcher();
</script>

<ModalEdit
	title="Гра"
	model={new Game()}
	handleSubmit={async (e) => {
		dispatch('submit', e);
	}}
	bind:open={createOpen}
	requiredFields={['name']}
>
	{#snippet createRelationField()}
	
			{#if teamA}
				<Tile>
					Команда А: {teamA.name}
				</Tile>
			{/if}
			{#if teamB}
				<Tile>
					Команда Б: {teamB.name}
				</Tile>
			{/if}
			<Button
				class="mt-4"
				on:click={() => {
					selectTeamAOpen = true;
				}}
			>
				Вибрати команду А
			</Button>
			<Button
				class="mt-4"
				on:click={() => {
					selectTeamBOpen = true;
				}}
			>
				Вибрати команду Б
			</Button>
		
	{/snippet}
	{#snippet modalCreateRelation()}
	
			<ModalCreateRelation
				title="КомандаА"
				getFunc={getTeams}
				bind:open={selectTeamAOpen}
				on:submit={(e) => {
					teamA = e.detail;
					selectTeamAOpen = false;
				}}
				alreadySelectedIds={[teamA.id, teamB.id]}
				excludeHeaders={['players', 'id']}
			/>
			<ModalCreateRelation
				title="Гравець"
				getFunc={getTeams}
				bind:open={selectTeamBOpen}
				on:submit={(e) => {
					teamB = e.detail;
					selectTeamBOpen = false;
				}}
				alreadySelectedIds={[teamA.id, teamB.id]}
				excludeHeaders={['players', 'id']}
			/>
		
	{/snippet}
</ModalEdit>
