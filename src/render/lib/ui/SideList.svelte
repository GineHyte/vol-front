<script lang="ts">
	import {
		DataTable,
		ClickableTile,
		DataTableSkeleton,
		Toolbar,
		ToolbarContent,
		Button,
	} from 'carbon-components-svelte';

	import CompactPagination from '$lib/ui/CompactPagination.svelte';
	import { Pagination, PaginationProps } from '$lib/scripts/pagination';
	import Model from '$lib/scripts/model';
	import ContextMenu from '@/render/lib/ui/ContextMenu.svelte';
	import { trunicate } from '../utils/utils';
	import { t } from '$lib/i18n/utils';

	interface Props {
		title?: string;
		headers: { key: string; value: string }[];
		selectedId?: number | null;
		getFunc: (props: PaginationProps) => Promise<Pagination<Model>>;
		newFunc: () => void;
		editFunc: (currentId: number) => void;
		deleteFunc: (currentId: number) => Promise<void>;
		duplicateFunc: (currentId: number) => Promise<void>;
	}

	let {
		title = '',
		headers,
		selectedId = $bindable(undefined),
		getFunc,
		newFunc,
		editFunc,
		deleteFunc,
		duplicateFunc,
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
						disabled={row.id === selectedId}
						on:click={() => (selectedId = row.id)}
					>
						{trunicate(cell.value, 10)}
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
				<ClickableTile disabled>{$t('common.noData')}</ClickableTile>
			{/if}
			<CompactPagination bind:page total={model.pages} />
			<ContextMenu
				{target}
				{deleteFunc}
				{duplicateFunc}
				{editFunc}
				updateFunc={() => (tableUpdate = !tableUpdate)}
			/>
		{/await}
	{/key}
</div>
