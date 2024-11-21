<script>
	import {
		DataTable,
		ClickableTile,
		DataTableSkeleton,
		Toolbar,
		ToolbarContent,
		Button,
		PaginationNav,
	} from 'carbon-components-svelte';

	import CompactPagination from '$lib/ui/CompactPagination.svelte';

	export let headers;
	export let model;

	export let selectFunc;

	let pageSize = 4;
	let page;
</script>

<div class="absolute right-0 top-24 w-44">
	{#key page}
		{#await model.get(pageSize, page)}
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
			<CompactPagination bind:page bind:total={model.totalPages} />
		{/await}
	{/key}
</div>
