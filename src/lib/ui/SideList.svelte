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

	export let selectFunc;
</script>

<div class="absolute right-0 top-24 w-40">
	{#await model.get()}
		<DataTableSkeleton {headers} />
	{:then}
		<DataTable {headers} rows={model.rawData}>
			<svelte:fragment slot="cell" let:cell let:row>
				<ClickableTile on:click={() => selectFunc(row.id)}>{cell.value}</ClickableTile>
			</svelte:fragment>
			<Toolbar>
				<ToolbarContent>
					<Button class="w-full">+ Add</Button>
				</ToolbarContent>
			</Toolbar>
		</DataTable>
		{#if model.rawData.length === 0}
			<ClickableTile disabled>No Data</ClickableTile>
		{/if}
	{/await}
</div>
