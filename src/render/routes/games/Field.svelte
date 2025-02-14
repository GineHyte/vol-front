<script lang="ts">
	import { run } from 'svelte/legacy';

	import { ExpandableTile } from 'carbon-components-svelte';
	import { Game, Team } from '$lib/scripts/models';
	import { getTeam } from '$lib/scripts/endpoints';
	import PlayerElement from './Player.svelte';
	import SideZones from './SideZones.svelte';
	import { Side, Amplua } from '$lib/utils/utils';

	interface Props {
		game?: any;
		selectedZones?: number[]; // zone
		selectedSide?: Side;
		selectedPlayer?: number;
		zoneEnabled?: Side; // 0 - false, 1 - left, 2 - right
		submitFunc: () => Promise<void>;
		actionOrder?: number;
	}

	let {
		game = new Game(),
		selectedZones = $bindable([]),
		selectedSide = $bindable(Side.NOTSET),
		selectedPlayer = $bindable(-1),
		zoneEnabled = $bindable(0),
		submitFunc,
		actionOrder = $bindable(0)
	}: Props = $props();

	let teamALocal: Team | undefined = $state(undefined);
	let teamBLocal: Team | undefined = $state(undefined);

	async function getTeamLocal(teamId: number) {
		let team = await getTeam(teamId);
		if (game.teamA === team.id) {
			teamALocal = team;
		} else {
			teamBLocal = team;
		}
		return team;
	}

	let isPlayersEnabled = $state(true);

	run(() => {
		isPlayersEnabled = actionOrder === 0;
	});
</script>

{#if game}
	<div>
		<div class="w-full flex justify-around">
			<span>{teamALocal?.name}</span>
			<span>{teamBLocal?.name}</span>
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
							actionOrder = 5;
							await submitFunc();
						}
					}}
				/>
				<div class="h-full w-[1px] bg-black"></div>
				<SideZones
					currentSide={zoneEnabled}
					side={Side.RIGHT}
					on:selectZone={async (e) => {
						selectedZones = [...selectedZones, e.detail];
						zoneEnabled = Side.LEFT;
						if (selectedZones.length === 2) {
							zoneEnabled = 0;
							actionOrder = 5;
							await submitFunc();
						}
					}}
				/>
			{/if}
			{#if isPlayersEnabled}
				<div class="relative w-full">
					{#if game.teamA}
						{#await getTeamLocal(game.teamA)}
							teamA
						{:then team}
							{#if team.players[0]}
								<PlayerElement
									top="50"
									left="160"
									title={Amplua[team.players[0].amplua][0]}
									on:select={() => {
										selectedPlayer = team.players[0].player.id;
										selectedSide = Side.LEFT;
										actionOrder = 1;
									}}
								/>
							{/if}
							{#if team.players[1]}
								<PlayerElement
									top="170"
									left="90"
									title={Amplua[team.players[1].amplua][0]}
									on:select={() => {
										selectedPlayer = team.players[1].player.id;
										selectedSide = Side.LEFT;
										actionOrder = 1;
									}}
								/>
							{/if}
						{/await}
					{/if}
				</div>
				<div class="h-full w-[1px] bg-black"></div>
				<div class="relative w-full">
					{#if game.teamB}
						{#await getTeamLocal(game.teamB)}
							teamB
						{:then team}
							{#if team.players[0]}
								<PlayerElement
									top="170"
									left="90"
									title={Amplua[team.players[0].amplua][0]}
									on:select={() => {
										selectedPlayer = team.players[0].player.id;
										selectedSide = Side.RIGHT;
										actionOrder = 1;
									}}
								/>
							{/if}
							{#if team.players[1]}
								<PlayerElement
									top="50"
									left="160"
									title={Amplua[team.players[1].amplua][0]}
									on:select={() => {
										selectedPlayer = team.players[1].player.id;
										selectedSide = Side.RIGHT;
										actionOrder = 1;
									}}
								/>
							{/if}
						{/await}
					{/if}
				</div>
			{/if}
		</div>
		<ExpandableTile>
			{#snippet above()}
						<div ><h1 class="text-lg font-bold">Легенда поля:</h1></div>
					{/snippet}
			{#snippet below()}
						<div >
					<ul>
						<li>Н - Нападник</li>
						<li>З - Захисник</li>
						<li>У - Універсальний</li>
					</ul>
				</div>
					{/snippet}
		</ExpandableTile>
	</div>
{/if}
