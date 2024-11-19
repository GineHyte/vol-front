<script>
	import { Games } from '$lib/scripts/games';
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
	} from 'carbon-components-svelte';

	let games = new Games();
</script>

<!-- <SkeletonPlaceholder style="height: 12rem; width: 12rem;" /> -->

<Content>
	<Grid>
		<Row>
			<Column>
				<ImageLoader
					ratio="4x3"
					fadeIn
					src="https://upload.wikimedia.org/wikipedia/commons/1/1b/Svelte_Logo.svg"
					alt="Player`s photo"
				/>
			</Column>
			<Column>
				<span>some info to Player</span>
			</Column>
		</Row>
	</Grid>
	{#await games.get()}
		<DataTableSkeleton
			headers={[
				{ key: 'name', value: 'Name' },
				{ key: 'description', value: 'Description' },
				{ key: '', value: 'Last Name' },
			]}
		/>
	{:then}
		<DataTable {headers} rows={model.rawData}>
			<svelte:fragment slot="cell" let:cell let:row>
				<ClickableTile on:click={() => selectFunc(row.id)}>{cell.value}</ClickableTile>
			</svelte:fragment>
		</DataTable>
	{/await}
</Content>
