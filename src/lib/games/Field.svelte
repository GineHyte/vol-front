<script>
	import {
		Column,
		Grid,
		Row,
		ExpandableTile,
		SkeletonPlaceholder,
	} from 'carbon-components-svelte';
	import { Game, Player, Team } from '$lib/scripts/models';
	import { getGame, getTeam, getPlayers } from '$lib/scripts/endpoints';
	import Zone from './Zone.svelte';
	import PlayerElement from './Player.svelte';

	export let game = new Game();

	let isZoneEnabled = false;
	let isPlayersEnabled = true;
	let selectedPlayer = '';

	$: if (selectedPlayer) {
		console.log(selectedPlayer);
		isPlayersEnabled = false;
		isZoneEnabled = true;
	}
</script>

{#if game}
	<div>
		<div class="flex w-[36rem] h-[18rem] bg-amber-600 relative">
			{#if isZoneEnabled}
				<Grid>
					<Row>
						<Column><Zone number={1} /></Column>
						<Column><Zone number={2} /></Column>
					</Row>
					<Row>
						<Column><Zone number={3} /></Column>
						<Column><Zone number={4} /></Column>
					</Row>
					<Row>
						<Column><Zone number={5} /></Column>
						<Column><Zone number={6} /></Column>
					</Row>
				</Grid>
				<div class="h-full w-[1px] bg-black" />
				<Grid>
					<Row>
						<Column><Zone number={1} /></Column>
						<Column><Zone number={2} /></Column>
					</Row>
					<Row>
						<Column><Zone number={3} /></Column>
						<Column><Zone number={5} /></Column>
						<Column><Zone number={6} /></Column>
					</Row>
				</Grid>
			{/if}
			{#if isPlayersEnabled}
				<div class="relative w-full">
					{#if game.teamA}
						{#await getTeam(game.teamA.originalType.value)}
							teamA
						{:then team}
							{console.log(team)}
							{#if team.players.originalType.value[0]}
								<PlayerElement
									top="50"
									left="160"
									title={team.players.originalType.value[0].amplua}
									on:select={() =>
										(selectedPlayer =
											team.players.originalType.value[0].playerId)}
								/>
							{/if}
							{#if team.players.originalType.value[1]}
								<PlayerElement
									top="170"
									left="90"
									title={team.players.originalType.value[1].amplua}
									on:select={() =>
										(selectedPlayer =
											team.players.originalType.value[1].playerId)}
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
									on:select={() =>
										(selectedPlayer =
											team.players.originalType.value[0].playerId)}
								/>
							{/if}
							{#if team.players.originalType.value[1]}
								<PlayerElement
									top="50"
									left="160"
									title={team.players.originalType.value[1].amplua}
									on:select={() =>
										(selectedPlayer =
											team.players.originalType.value[1].playerId)}
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
