<script>
	import Field from '$lib/games/Field.svelte';
	import SideList from '$lib/ui/SideList.svelte';
	import { Game, Games } from '$lib/scripts/games';
	import { Column, DataTable, Grid, Row } from 'carbon-components-svelte';

	let game;

	function selectGame(id) {
		game.id = id;
	}

	let teamsHeaders = [
		{
			key: '',
		},
	];
</script>

<Grid>
	<Row>
		<Column />
		<Column>
			<Field bind:game />
		</Column>
		<Column />
	</Row>
	<Row>
		<DataTable />
	</Row>
</Grid>

<SideList model={new Games()} headers={[{ key: 'name', value: 'Games' }]} selectFunc={selectGame} />
