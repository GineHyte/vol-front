<script lang="ts">
	import { Button, Tile } from 'carbon-components-svelte';
	import { Game } from '$lib/scripts/models';
	import { createGame, getTeams } from '$lib/scripts/endpoints';
	import ModalCreate from '$lib/ui/ModalCreate.svelte';
	import ModalCreateRelation from '$lib/ui/ModalCreateRelation.svelte';
	import { pushNotification } from '$lib/utils/utils';
	import { t } from '$lib/utils/utils';
	import { PaginationProps } from '$lib/scripts/pagination';

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
	title={t('titles.game')}
	model={new Game()}
	handleSubmit={createGameRenderer}
	bind:open={createOpen}
	requiredFields={['name', 'description']}
	exclude={['teamA', 'teamB', 'finished', 'stats']}
>
	{#snippet createRelationField()}
		{#if teamA}
			<Tile>{t('buttons.selectTeamA')}: {teamA.name}</Tile>
		{/if}
		{#if teamB}
			<Tile>{t('buttons.selectTeamB')}: {teamB.name}</Tile>
		{/if}
		<Button
			class="mt-4"
			on:click={() => {
				selectTeamAOpen = true;
			}}
		>
			{t('buttons.selectTeamA')}
		</Button>
		<Button
			class="mt-4"
			on:click={() => {
				selectTeamBOpen = true;
			}}
			disabled={!teamA}
		>
			{t('buttons.selectTeamB')}
		</Button>
	{/snippet}
	{#snippet modalCreateRelation()}
		<ModalCreateRelation
			title={t('buttons.selectTeamA')}
			getFunc={getTeams}
			bind:open={selectTeamAOpen}
			on:submit={(e) => {
				teamA = e.detail;
				selectTeamAOpen = false;
				selectTeamBOpen = true;
			}}
			excludeHeaders={['id']}
		/>
		{#if teamA}
			<ModalCreateRelation
				title={t('buttons.selectTeamB')}
				getFunc={async () => {
					return await getTeams(new PaginationProps(1, 100));
				}}
				bind:open={selectTeamBOpen}
				on:submit={(e) => {
					teamB = e.detail;
					selectTeamBOpen = false;
				}}
				excludeHeaders={['id']}
			/>
		{/if}
	{/snippet}
</ModalCreate>
