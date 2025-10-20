<script lang="ts">
	import { Button, Tile } from 'carbon-components-svelte';
	import { Game } from '$lib/scripts/models';
	import { editGame, getGame, getTeams } from '$lib/scripts/endpoints';
	import ModalCreateRelation from '$lib/ui/ModalCreateRelation.svelte';
	import ModalEdit from '@/render/lib/ui/ModalEdit.svelte';
	import { pushNotification } from '$lib/utils/utils';
	import { t } from '$lib/utils/utils';
	import { Pagination, PaginationProps } from '$lib/scripts/pagination';
	import ModalSkeleton from '@/render/lib/ui/ModalSkeleton.svelte';

	interface Props {
		editGameId?: number | undefined;
		editOpen?: boolean;
		teamA?: any;
		teamB?: any;
		selectTeamAOpen?: boolean;
		selectTeamBOpen?: boolean;
	}

	let {
		editGameId,
		editOpen = $bindable(false),
		teamA = $bindable(undefined),
		teamB = $bindable(undefined),
		selectTeamAOpen = $bindable(false),
		selectTeamBOpen = $bindable(false),
	}: Props = $props();

	let game = $state(new Game());

	async function pullGame() {
		if (editGameId) {
			game = await getGame(editGameId);
		}
	}

	async function editGameRenderer() {
		game.teamA = teamA.id;
		game.teamB = teamB.id;
		let status = await editGame(game);
		if (status.status === 'success') {
			pushNotification('editGameSuccess');
		} else {
			pushNotification('editGameError');
		}
		editOpen = false;
	}

	async function getTeamsRenderer(pprop: PaginationProps): Promise<Pagination<any>> {
		let teams = await getTeams(pprop);
		teams.items = teams.items.map((team: any) => {
			team.players = team.players.map((player: any) => player.player.name);
			return team;
		});
		return teams;
	}
</script>

{#if editOpen}
	{#await pullGame()}
		<ModalSkeleton
			model={game}
			title={t('titles.game')}
			exclude={['teamA', 'teamB', 'finished', 'stats']}
		/>
	{:then _}
		<ModalEdit
			title={t('titles.game')}
			bind:model={game}
			onSubmit={editGameRenderer}
			bind:open={editOpen}
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
					getFunc={getTeamsRenderer}
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
		</ModalEdit>
	{/await}
{/if}
