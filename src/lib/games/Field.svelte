<script>
	import {
		Column,
		Grid,
		Row,
		ExpandableTile,
		SkeletonPlaceholder,
	} from 'carbon-components-svelte';
	import Player from './Player.svelte';
	import Zone from './Zone.svelte';
	import { Game } from '$lib/scripts/games';
	import { Team } from '$lib/scripts/teams';

	export let game = new Game();

	let isZoneEnabled = false;
	let isPlayersEnabled = true;
	let selectedPlayer = '';

	let teamA = new Team();
	let teamB = new Team();

	async function getGame(id) {
		game.parseData(await game.get());
		if (game.teamA) {
			teamA.id = game.teamA;
			teamA.parseData(await teamA.get());
		}
		if (game.teamB) {
			teamB.id = game.teamB;
			teamB.parseData(await teamB.get());
		}
	}
</script>

{#if game.id != null}
	{#await getGame(game.id)}
		<SkeletonPlaceholder class="w-[36rem] h-[18rem]" />
	{:then}
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
						<!-- <Player top="50" left="160" player={teamA.players[0]} /> -->
						<!-- <Player top="170" left="90" player={teamA.players[1]} /> -->
					</div>
					<div class="h-full w-[1px] bg-black" />
					<div class="relative w-full">
						<!-- <Player top="170" left="90" player={teamB.players[0]} /> -->
						<!-- <Player top="50" left="160" player={teamA.players[1]} /> -->
					</div>
				{/if}
			</div>
			<ExpandableTile>
				<div slot="above"><h1 class="text-lg font-bold">Field Legend:</h1></div>
				<div slot="below">
					<ul>
						<li>A - Atacker</li>
						<li>D - Defender</li>
					</ul>
				</div>
			</ExpandableTile>
		</div>
	{/await}
{/if}
