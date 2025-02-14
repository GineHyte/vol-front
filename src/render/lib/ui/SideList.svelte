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

	interface Props {
		title?: string;
		getFunc: (props: PaginationProps) => Promise<Pagination<Model>>;
		selectFunc: (id: number) => void;
		newFunc: () => void;
		headers: { key: string; value: string }[];
		deleteFunc: (currentId: number) => Promise<void>;
		duplicateFunc: (currentId: number) => Promise<void>;
		editFunc: (currentId: number) => Promise<void>;
		currentId?: number | null;
	}

	let {
		title = '',
		getFunc,
		selectFunc,
		newFunc,
		headers,
		deleteFunc,
		duplicateFunc,
		editFunc,
		currentId = null
	}: Props = $props();

	let pageSize = 4;
	let page = $state(1);
	let target: any = $state();
	let tableUpdate = $state(false);
</script>

<div class="absolute right-0 top-24 w-44" bind:this={target}>
	{#key [page, tableUpdate]}
		{#await getFunc(new PaginationProps(page, pageSize))}
			<DataTableSkeleton columns={1} />
		{:then model}
			<DataTable size="compact" {headers} rows={model.getRows()}>
				{#snippet cell({ cell, row })}
							
						<ClickableTile
							id={row.id}
							disabled={row.id === currentId}
							on:click={() => selectFunc(row.id)}
						>
							{cell.value}
						</ClickableTile>
					
							{/snippet}
				<Toolbar>
					{#if newFunc}
						<ToolbarContent>
							<Button on:click={newFunc} class="w-full">+ {title}</Button>
						</ToolbarContent>
					{/if}
				</Toolbar>
			</DataTable>
			{#if model.total === 0}
				<ClickableTile disabled>Немає даних</ClickableTile>
			{/if}
			<CompactPagination bind:page total={model.pages} />
			<ContextMenuSideList
				{target}
				{deleteFunc}
				{duplicateFunc}
				{editFunc}
				updateFunc={() => (tableUpdate = !tableUpdate)}
			/>
		{/await}
	{/key}
</div>
