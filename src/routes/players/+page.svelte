<script>
	import { Player, Players } from '$lib/scripts/players';
	import { Games } from '$lib/scripts/games';
	import SideList from '$lib/ui/SideList.svelte';
	import {
		SkeletonPlaceholder,
		ImageLoader,
		Content,
		Grid,
		Row,
		Column,
		DataTable,
		DataTableSkeleton,
		ClickableTile,
		SkeletonText,
	} from 'carbon-components-svelte';
	import { getPlayers } from '$lib/scripts/endpoints';

	let games = new Games();
	let player = new Player();

	let headers = [
		{ key: 'name', value: 'Name' },
		{ key: 'team_a_score', value: 'Team A' },
		{ key: 'team_b_score', value: 'Team B' },
		{ key: 'to_datetime', value: 'Datetime' },
	];

	function selectPlayer(id) {
		player.id = id;
	}

	async function getPlayer(id) {
		player.parseData(await player.get());
	}
</script>

{#if player.id}
	<Content>
		<Grid>
			<Row class="min-h-96 m-4">
				{#await getPlayer(player.id)}
					<Column>
						<SkeletonPlaceholder class="size-96" />
					</Column>
					<Column>
						<SkeletonText paragraph lines={8} />
					</Column>
				{:then}
					<Column>
						<ImageLoader
							class="size-96"
							ratio="4x3"
							fadeIn
							src={player.imageURL}
							alt="Player`s photo"
						/>
					</Column>
					<Column>
						<p>First Name: {player.firstName}</p>
						<p>Last Name: {player.lastName}</p>
						<p>Age: {player.age}</p>
						<p>Height: {player.height}</p>
						<p>Weight: {player.weight}</p>
					</Column>
				{/await}
			</Row>
			<Row>
				<Column>
					{#await games.get()}
						<DataTableSkeleton {headers} />
					{:then}
						<DataTable {headers} rows={games.rawData} />
					{/await}
				</Column>
			</Row>
		</Grid>
	</Content>
{/if}

<SideList
	getFunc={getPlayers}
	headers={[{ key: 'first_name', value: 'Player' }]}
	selectFunc={selectPlayer}
/>
