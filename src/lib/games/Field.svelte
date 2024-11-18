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

	export let game = new Game();

	let isZoneEnabled = false;
	let isPlayersEnabled = true;
	let selectedPlayer = '';

	let teamA = [];
	let teamB = [];
</script>

{#if game.id != null}
	{#await game.get()}
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
						<Player top="50" left="160" />
						<Player top="170" left="90" />
					</div>
					<div class="h-full w-[1px] bg-black" />
					<div class="relative w-full">
						<Player top="170" left="90" />
						<Player top="50" left="160" />
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
	{:then}
		<SkeletonPlaceholder />
	{/await}
{/if}
