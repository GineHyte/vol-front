<script lang="ts">
	import { Button, Tile } from 'carbon-components-svelte';
	import { Game } from '$lib/scripts/models';
	import { createGame, getTeams } from '$lib/scripts/endpoints';
	import ModalCreate from '$lib/ui/ModalCreate.svelte';
	import ModalCreateRelation from '$lib/ui/ModalCreateRelation.svelte';
	import { pushNotification } from '$lib/utils/utils';

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
		selectTeamBOpen = $bindable(false),
	}: Props = $props();

	async function createGameRenderer(inputData: any) {
		let game = new Game();
		Object.keys(inputData).forEach((key) => {
			// @ts-ignore
			game[key as keyof Game] = inputData[key];
		});
		game.teamA = teamA.id;
		game.teamB = teamB.id;
		let status = await createGame(game);
		if (status.status === 'success') {
			pushNotification('createGameSuccess');
		} else {
			pushNotification('createGameError');
		}
		createOpen = false;
	}
</script>

<ModalCreate
	title="Гра"
	model={new Game()}
	handleSubmit={createGameRenderer}
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
</ModalCreate>
