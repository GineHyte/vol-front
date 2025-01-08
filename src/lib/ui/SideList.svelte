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
	import ContextMenuSideList from '$lib/ui/ContextMenuSideList.svelte';

	export let getFunc: (props: PaginationProps) => Promise<Pagination<Model>>;
	export let selectFunc: (id: number) => void;
	export let newFunc: () => void | undefined;
	export let headers: { key: string; value: string }[];

	let pageSize = 4;
	let page = 1;
	let target: any;
	let tableUpdate = false;
</script>

<div class="absolute right-0 top-24 w-44" bind:this={target}>
	{#key [page, tableUpdate]}
		{#await getFunc(new PaginationProps(page, pageSize))}
			<DataTableSkeleton />
		{:then model}
			<DataTable {headers} rows={model.getRows()}>
				<svelte:fragment slot="cell" let:cell let:row>
					<ClickableTile id={row.id} on:click={() => selectFunc(row.id)}>
						{cell.value}
					</ClickableTile>
				</svelte:fragment>
				<Toolbar>
					{#if newFunc}
						<ToolbarContent>
							<Button on:click={newFunc} class="w-full">+ Новий</Button>
						</ToolbarContent>
					{/if}
				</Toolbar>
			</DataTable>
			{#if model.total === 0}
				<ClickableTile disabled>Немає даних</ClickableTile>
			{/if}
			<CompactPagination bind:page total={model.pages} />
			<ContextMenuSideList {target} on:update={() => (tableUpdate = !tableUpdate)} />
		{/await}
	{/key}
</div>
