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
	import Zone from './SideZones.svelte';
	import PlayerElement from './Player.svelte';
	import { IbmZEnvironmentsDevSecOps, RightPanelClose, RowExpand } from 'carbon-icons-svelte';
	import { Side } from '$lib/utils/utils';
	import SideZones from './SideZones.svelte';
	import { current_component } from 'svelte/internal';

	export let game = new Game();

	let zoneEnabled: number = 0; // 0 - false, 1 - left, 2 - right
	let isPlayersEnabled = true;
	let selectedPlayer: { playerId: number; side: Side } = { playerId: -1, side: Side.NOTSET }; // playerId, side
	let selectedZone: { zone: number; side: Side } = { zone: -1, side: Side.NOTSET }; // zone, side

	$: {
		isPlayersEnabled = selectedPlayer.playerId < 0;
		zoneEnabled = selectedPlayer.side;
		console.log('isPlayersEnabled', isPlayersEnabled);
	}
</script>

{#if game}
	<div>
		<div class="flex w-[36rem] h-[18rem] bg-amber-600 relative">
			{#if zoneEnabled}
				<SideZones
					currentSide={zoneEnabled}
					side={Side.LEFT}
					on:selectZone={(e) => {
						selectedZone = e.detail;
						zoneEnabled = Side.RIGHT;
					}}
				/>
				<div class="h-full w-[1px] bg-black" />
				<SideZones
					currentSide={zoneEnabled}
					side={Side.RIGHT}
					on:selectZone={(e) => {
						selectedZone = e.detail;
						zoneEnabled = Side.LEFT;
					}}
				/>
			{/if}
			{#if isPlayersEnabled}
				<div class="relative w-full">
					{#if game.teamA}
						{#await getTeam(game.teamA.originalType.value)}
							teamA
						{:then team}
							{#if team.players.originalType.value[0]}
								<PlayerElement
									top="50"
									left="160"
									title={team.players.originalType.value[0].amplua}
									on:select={() => {
										selectedPlayer.side = Side.LEFT;
										selectedPlayer.playerId =
											team.players.originalType.value[0].player_id;
									}}
								/>
							{/if}
							{#if team.players.originalType.value[1]}
								<PlayerElement
									top="170"
									left="90"
									title={team.players.originalType.value[1].amplua}
									on:select={() => {
										selectedPlayer.side = Side.LEFT;
										selectedPlayer.playerId =
											team.players.originalType.value[1].player_id;
									}}
								/>
							{/if}
						{/await}
					{/if}
				</div>
				<div class="h-full w-[1px] bg-black" />
				<div class="relative w-full">
					{#if game.teamB}
						{#await getTeam(game.teamB.originalType.value)}
							teamB
						{:then team}
							{#if team.players.originalType.value[0]}
								<PlayerElement
									top="170"
									left="90"
									title={team.players.originalType.value[0].amplua}
									on:select={() => {
										selectedPlayer.side = Side.RIGHT;
										selectedPlayer.playerId =
											team.players.originalType.value[0].player_id;
									}}
								/>
							{/if}
							{#if team.players.originalType.value[1]}
								<PlayerElement
									top="50"
									left="160"
									title={team.players.originalType.value[1].amplua}
									on:select={() => {
										selectedPlayer.side = Side.RIGHT;
										selectedPlayer.playerId =
											team.players.originalType.value[1].player_id;
									}}
								/>
							{/if}
						{/await}
					{/if}
				</div>
			{/if}
		</div>
		<ExpandableTile>
			<div slot="above"><h1 class="text-lg font-bold">Field Legend:</h1></div>
			<div slot="below">
				<ul>
					<li>A - Attacker</li>
					<li>D - Defender</li>
				</ul>
			</div>
		</ExpandableTile>
	</div>
{/if}
