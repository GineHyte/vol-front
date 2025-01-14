<script lang="ts">
	import {
		Column,
		Grid,
		Row,
		ExpandableTile,
		SkeletonPlaceholder,
	} from 'carbon-components-svelte';
	import { Game, Player, Team } from '$lib/scripts/models';
	import { getGame, getTeam, getPlayers } from '$lib/scripts/endpoints';
	import PlayerElement from './Player.svelte';
	import SideZones from './SideZones.svelte';
	import { Side, Amplua } from '$lib/utils/utils';

	export let game = new Game();
	export let selectedZones: number[] = []; // zone
	export let selectedSide: Side = Side.NOTSET;
	export let selectedPlayer: number = -1;
	export let zoneEnabled: number = 0; // 0 - false, 1 - left, 2 - right
	export let submitFunc: () => Promise<void>;

	let teamALocal: Team | undefined = undefined;
	let teamBLocal: Team | undefined = undefined;

	async function getTeamLocal(teamId: number) {
		let team = await getTeam(teamId);
		if (game.teamA.originalType.value === team.id.originalType.value) {
			teamALocal = team;
		} else {
			teamBLocal = team;
		}
		return team;
	}

	let isPlayersEnabled = true;

	$: {
		isPlayersEnabled = selectedPlayer < 0;
	}
</script>

{#if game}
	<div>
		<div class="w-full flex justify-around">
			<span>{teamALocal?.name.originalType.value}</span>
			<span>{teamBLocal?.name.originalType.value}</span>
		</div>
		<div class="flex w-[36rem] h-[18rem] bg-amber-600 relative">
			{#if zoneEnabled}
				<SideZones
					currentSide={zoneEnabled}
					side={Side.LEFT}
					on:selectZone={async (e) => {
						selectedZones = [...selectedZones, e.detail];
						zoneEnabled = Side.RIGHT;
						if (selectedZones.length === 2) {
							zoneEnabled = 0;
							await submitFunc();
						}
					}}
				/>
				<div class="h-full w-[1px] bg-black" />
				<SideZones
					currentSide={zoneEnabled}
					side={Side.RIGHT}
					on:selectZone={async (e) => {
						selectedZones = [...selectedZones, e.detail];
						zoneEnabled = Side.LEFT;
						if (selectedZones.length === 2) {
							zoneEnabled = 0;
							await submitFunc();
						}
					}}
				/>
			{/if}
			{#if isPlayersEnabled}
				<div class="relative w-full">
					{#if game.teamA}
						{#await getTeamLocal(game.teamA.originalType.value)}
							teamA
						{:then team}
							{#if team.players.originalType.value[0]}
								<PlayerElement
									top="50"
									left="160"
									title={Amplua[team.players.originalType.value[0].amplua][0]}
									on:select={() => {
										selectedPlayer =
											team.players.originalType.value[0].player_id;
										selectedSide = Side.LEFT;
									}}
								/>
							{/if}
							{#if team.players.originalType.value[1]}
								<PlayerElement
									top="170"
									left="90"
									title={Amplua[team.players.originalType.value[1].amplua][0]}
									on:select={() => {
										selectedPlayer =
											team.players.originalType.value[1].player_id;
										selectedSide = Side.LEFT;
									}}
								/>
							{/if}
						{/await}
					{/if}
				</div>
				<div class="h-full w-[1px] bg-black" />
				<div class="relative w-full">
					{#if game.teamB}
						{#await getTeamLocal(game.teamB.originalType.value)}
							teamB
						{:then team}
							{#if team.players.originalType.value[0]}
								<PlayerElement
									top="170"
									left="90"
									title={Amplua[team.players.originalType.value[0].amplua][0]}
									on:select={() => {
										selectedPlayer =
											team.players.originalType.value[0].player_id;
										selectedSide = Side.RIGHT;
									}}
								/>
							{/if}
							{#if team.players.originalType.value[1]}
								<PlayerElement
									top="50"
									left="160"
									title={Amplua[team.players.originalType.value[1].amplua][0]}
									on:select={() => {
										selectedPlayer =
											team.players.originalType.value[1].player_id;
										selectedSide = Side.RIGHT;
									}}
								/>
							{/if}
						{/await}
					{/if}
				</div>
			{/if}
		</div>
		<ExpandableTile>
			<div slot="above"><h1 class="text-lg font-bold">Легенда поля:</h1></div>
			<div slot="below">
				<ul>
					<li>Н - Нападник</li>
					<li>З - Захисник</li>
					<li>У - Універсальний</li>
				</ul>
			</div>
		</ExpandableTile>
	</div>
{/if}
