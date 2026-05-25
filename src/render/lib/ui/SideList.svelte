<script lang="ts">
	import {
		DataTable,
		ClickableTile,
		DataTableSkeleton,
		Toolbar,
		ToolbarContent,
		Button,
		ComposedModal,
		ModalHeader,
		ModalBody,
	} from 'carbon-components-svelte';
	import { List } from 'carbon-icons-svelte';

	import CompactPagination from '$lib/ui/CompactPagination.svelte';
	import { Pagination, PaginationProps } from '$lib/scripts/pagination';
	import Model from '$lib/scripts/model';
	import ContextMenu from '@/render/lib/ui/ContextMenu.svelte';
	import { t } from '$lib/utils/utils';

	interface Props {
		title?: string;
		headers: { key: string; value: string }[];
		selectedId?: number | null;
		getFunc: (props: PaginationProps) => Promise<Pagination<Model>>;
		newFunc: () => void;
		editFunc?: (currentId: number) => Promise<void>;
		deleteFunc?: (currentId: number) => Promise<void>;
		duplicateFunc?: (currentId: number) => Promise<void>;
		deepDuplicateFunc?: (currentId: number) => Promise<void>;
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
		deepDuplicateFunc,
	}: Props = $props();

	let open = $state(false);
	let pageSize = 10;
	let page = $state(1);
	let target: HTMLElement | undefined = $state();
	let tableUpdate = $state(false);

	function closeList() {
		open = false;
	}

	function selectRow(id: number) {
		selectedId = id;
		closeList();
	}

	const compactTileClass = 'block w-full h-auto !min-h-0 !py-1 !px-2 text-sm leading-7';
</script>

<div class="absolute right-0 top-24 z-10 px-2">
	<Button icon={List} on:click={() => (open = true)} class="w-44">
		{title}
	</Button>
</div>

{#if open}
	<ComposedModal size={'lg'} bind:open on:close={closeList}>
		<ModalHeader {title} />
		<ModalBody>
			<div bind:this={target}>
				{#key [page, tableUpdate]}
					{#await getFunc(new PaginationProps(page, pageSize))}
						<DataTableSkeleton columns={headers.length} />
					{:then model}
						<DataTable size="compact" {headers} rows={model.getRows()}>
							{#snippet cell({ cell, row })}
								<div class="h-full w-full" id={row.id}>
									<ClickableTile
										class={compactTileClass}
										disabled={row.id === selectedId}
										on:click={() => selectRow(row.id)}
									>
										{cell.value}
									</ClickableTile>
								</div>
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
							<ClickableTile class={compactTileClass} disabled>{t('common.noData')}</ClickableTile>
						{/if}
						<CompactPagination bind:page total={model.pages} />
					{/await}
				{/key}
			</div>
		</ModalBody>
	</ComposedModal>
	{#if target}
		<ContextMenu
			{target}
			{deleteFunc}
			{duplicateFunc}
			{editFunc}
			{deepDuplicateFunc}
			updateFunc={() => (tableUpdate = !tableUpdate)}
		/>
	{/if}
{/if}
