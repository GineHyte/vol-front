<script lang="ts">
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
	import { Pagination, PaginationProps } from '$lib/scripts/pagination';
	import Model from '$lib/scripts/model';

	export let getFunc: (props: PaginationProps) => Promise<Pagination<Model>>;
	export let selectFunc;

	let pageSize = 4;
	let page: number;
</script>

<div class="absolute right-0 top-24 w-44">
	{#key page}
		{#await getFunc(new PaginationProps(page, pageSize))}
			<DataTableSkeleton />
		{:then model}
			<DataTable headers={model.getHeaders()} rows={model.getRows()}>
				<svelte:fragment slot="cell" let:cell let:row>
					<ClickableTile on:click={() => selectFunc(row.id)}>{cell.value}</ClickableTile>
				</svelte:fragment>
				<Toolbar>
					<ToolbarContent>
						<Button class="w-full">+ Add</Button>
					</ToolbarContent>
				</Toolbar>
			</DataTable>
			{#if model.total === 0}
				<ClickableTile disabled>No Data</ClickableTile>
			{/if}
			<CompactPagination bind:page total={model.pages} />
		{/await}
	{/key}
</div>
