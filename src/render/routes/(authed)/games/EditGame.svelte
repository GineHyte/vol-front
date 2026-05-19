<script lang="ts">
	import { Button, TextInput, Tile } from 'carbon-components-svelte';
	import { Game, GamePlayerUpdate, NameWithId, Player, PlayerTeam, Team } from '$lib/scripts/models';
	import { editGame, getGame, getPlayers, getTeam, getTeams } from '$lib/scripts/endpoints';
	import ModalCreateRelation from '$lib/ui/ModalCreateRelation.svelte';
	import ModalEdit from '@/render/lib/ui/ModalEdit.svelte';
	import { pushNotification } from '$lib/utils/utils';
	import { t } from '$lib/utils/utils';
	import { Pagination, PaginationProps } from '$lib/scripts/pagination';
	import ModalSkeleton from '@/render/lib/ui/ModalSkeleton.svelte';
	import { TrashCan } from 'carbon-icons-svelte';

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
	let newPlayerUpdate = $state(new GamePlayerUpdate());
	let playerBeforeTeam: Team | undefined = $state(undefined);
	let playerUpdates: GamePlayerUpdate[] = $state([]);
	let playerBeforeOpen: boolean = $state(false);
	let playerBeforeTeamOpen: boolean = $state(false);
	let playerAfterOpen: boolean = $state(false);

	async function pullGame() {
		if (!editGameId) return;
		game = await getGame(editGameId);
		teamA = await getTeam(game.teamA);
		teamB = await getTeam(game.teamB);
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

	function playersTeam2NameWithId(playersTeam: PlayerTeam[]): NameWithId[] {
		return playersTeam.map((playerTeam) => {
			let player = new NameWithId();
			player.id = playerTeam.player.id;
			player.name = playerTeam.player.name;
			return player;
		})
	}

	async function getPlayersBeforeRenderer(pprop: PaginationProps): Promise<Pagination<NameWithId>> {
		if (!playerBeforeTeam) return new Pagination<NameWithId>({ items: [] }, NameWithId);
		let team = await getTeam(playerBeforeTeam.id);
		let players = new Pagination<NameWithId>({ items: playersTeam2NameWithId(team.players) }, NameWithId);
		return players;
	}

	async function getPlayersAfterRenderer(pprop: PaginationProps): Promise<Pagination<NameWithId>> {
		console.log(teamA)
		console.log(teamA.players)
		return new Pagination<NameWithId>(
			{ items: playersTeam2NameWithId([...teamA.players, ...teamB.players]) },
			NameWithId,
		);;
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
				<Button
					class="mt-4"
					on:click={() => {
						selectTeamAOpen = true;
					}}
				>
					{t('buttons.selectTeamA')}: {teamA.name}
				</Button>
				<Button
					class="mt-4"
					on:click={() => {
						selectTeamBOpen = true;
					}}
					disabled={!teamA}
				>
					{t('buttons.selectTeamB')}: {teamB.name}
				</Button>
				<div class="mt-10"></div>
				{#each playerUpdates as playerUpdate}
					<div class="flex">
						<Tile>{playerUpdate.playerBefore.name} -> {playerUpdate.playerAfter.name}</Tile>
						<Button
							kind="danger-tertiary"
							iconDescription="Delete"
							icon={TrashCan}
							on:click={(e) => {
								playerUpdates = playerUpdates.filter(
									(el) => el.playerBefore.id !== playerUpdate.playerBefore.id && el.playerAfter.id !== playerUpdate.playerAfter.id,
								);
							}}
						/>
					</div>
				{/each}
				<div class="mt-2"></div>
				{#key [playerBeforeOpen, playerAfterOpen]}
					<Button on:click={() => (playerBeforeTeamOpen = true)} disabled={!teamA}>
						{t('buttons.selectPlayerBefore')}: {newPlayerUpdate.playerBefore?.name ?? ""}
					</Button>
					<Button
						on:click={() => (playerAfterOpen = true)}
						disabled={!teamB || !teamA || !newPlayerUpdate.playerBefore}
					>
						{t('buttons.selectPlayerAfter')}: {newPlayerUpdate.playerAfter?.name ?? ""}
					</Button>
				{/key}
			{/snippet}
			{#snippet modalCreateRelation()}
				{#key [teamA, teamB]}
					<ModalCreateRelation
						title={t('buttons.selectTeamA')}
						getFunc={getTeamsRenderer}
						alreadySelectedIds={[teamA.id, teamB.id]}
						bind:open={selectTeamAOpen}
						on:submit={(e) => {
							teamA = e.detail;
							selectTeamAOpen = false;
						}}
						excludeHeaders={['id']}
					/>
					<ModalCreateRelation
						title={t('buttons.selectTeamB')}
						getFunc={getTeamsRenderer}
						alreadySelectedIds={[teamA.id, teamB.id]}
						bind:open={selectTeamBOpen}
						on:submit={(e) => {
							teamB = e.detail;
							selectTeamBOpen = false;
						}}
						excludeHeaders={['id']}
					/>
				{/key}
				<ModalCreateRelation
					title={t('buttons.selectPlayerBefore')}
					getFunc={getTeamsRenderer}
					bind:open={playerBeforeTeamOpen}
					on:submit={(e) => {
						playerBeforeTeam = e.detail;
						playerBeforeTeamOpen = false;
						playerBeforeOpen = true;
					}}
					excludeHeaders={['id']}
				/>
				{#if playerBeforeOpen}
					<ModalCreateRelation
						title={t('buttons.selectPlayerBefore') + ": " + playerBeforeTeam.name}
						getFunc={getPlayersBeforeRenderer}
						bind:open={playerBeforeOpen}
						on:submit={(e) => {
							newPlayerUpdate.playerBefore = e.detail;
							playerBeforeOpen = false;
						}}
						excludeHeaders={['id', 'lastName', 'age', 'weight', 'height', 'imageFile', 'teams']}
					/>
				{/if}
				<ModalCreateRelation
					title={t('buttons.selectPlayerAfter')}
					getFunc={getPlayersAfterRenderer}
					bind:open={playerAfterOpen}
					on:submit={(e) => {
						newPlayerUpdate.playerAfter = e.detail;
						playerUpdates.push(newPlayerUpdate);
						newPlayerUpdate = new GamePlayerUpdate();
						playerAfterOpen = false;
					}}
					excludeHeaders={['id', 'lastName', 'age', 'weight', 'height', 'imageFile', 'teams']}
				/>
			{/snippet}
		</ModalEdit>
	{/await}
{/if}
