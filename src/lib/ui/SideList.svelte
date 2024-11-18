<script>
	import {
		DataTable,
		ClickableTile,
		DataTableSkeleton,
		Toolbar,
		ToolbarContent,
		Button,
	} from 'carbon-components-svelte';

	export let headers;
	export let model;
</script>

<div class="absolute right-0 top-24 w-30">
	{#await model.get()}
		<DataTableSkeleton {headers} />
	{:then}
		<DataTable {headers} rows={model.rawData}>
			<svelte:fragment slot="cell" let:cell>
				<ClickableTile>{cell.value}</ClickableTile>
			</svelte:fragment>
			<Toolbar>
				<ToolbarContent>
					<Button>+ Add</Button>
				</ToolbarContent>
			</Toolbar>
		</DataTable>
	{/await}
</div>
