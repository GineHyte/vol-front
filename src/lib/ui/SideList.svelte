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
	export let selectFunc: (id: number) => void;
	export let newFunc: () => void | undefined;
	export let headers: { key: string; value: string }[];

	let pageSize = 4;
	let page: number;
</script>

<div class="absolute right-0 top-24 w-44">
	<!-- {#key page} -->
	{#await getFunc(new PaginationProps(page, pageSize))}
		<DataTableSkeleton />
	{:then model}
		<DataTable {headers} rows={model.getRows()}>
			<svelte:fragment slot="cell" let:cell let:row>
				<ClickableTile on:click={() => selectFunc(row.id)}>{cell.value}</ClickableTile>
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
	{/await}
	<!-- {/key} -->
</div>
