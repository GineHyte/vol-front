<script lang="ts">
	import { run } from 'svelte/legacy';

	import { DataTable, DataTableSkeleton, Modal } from 'carbon-components-svelte';
	import { createEventDispatcher } from 'svelte';
	import { Pagination, PaginationProps } from '$lib/scripts/pagination';
	import { t } from '$lib/utils/utils';

	interface Props {
		open?: boolean;
		title?: string;
		excludeHeaders?: string[];
		getFunc: (pprop: PaginationProps) => Promise<Pagination<any>>;
		alreadySelectedIds?: number[];
		modalUnderSelect?: import('svelte').Snippet;
		batch?: boolean;
	}

	let {
		open = $bindable(false),
		title = '',
		excludeHeaders = [],
		getFunc,
		alreadySelectedIds = [],
		modalUnderSelect,
		batch = false,
	}: Props = $props();

	let dispatch = createEventDispatcher();
	let localSelectedRow: { [key: string]: any } = $state({});
	let localSelectedRows: Array<{ [key: string]: any }> = $state([]);
	let localSelectedRowIds: Array<any> = $state([]);
	let rows: Array<any> = $state([]);

	run(() => {
		if (!open) {
			dispatch('close');
			if (batch) {
				localSelectedRows = [];
			} else {
				localSelectedRow = {};
			}
		}
	});

	function saveRows(pRows: any) {
		rows = pRows;
		return pRows;
	}

	function submit() {
		if (batch) {
			localSelectedRows = rows.filter((el) => localSelectedRowIds.includes(el.id));
			dispatch('submit', localSelectedRows);
		} else {
			dispatch('submit', localSelectedRow);
		}
	}
</script>

<Modal
	size={'lg'}
	bind:open
	primaryButtonText={t('common.done')}
	modalHeading={title}
	primaryButtonDisabled={batch
		? localSelectedRowIds.length === 0
		: localSelectedRow.id === undefined}
	on:submit={submit}
>
	{#await getFunc(new PaginationProps(1, 100))}
		<DataTableSkeleton />
	{:then model}
		<DataTable
			batchSelection={batch}
			radio={!batch}
			nonSelectableRowIds={alreadySelectedIds}
			headers={model.getHeaders(excludeHeaders)}
			bind:selectedRowIds={localSelectedRowIds}
			rows={saveRows(model.getRows())}
			on:click:row--select={(e) => {
				if (!batch) {
					localSelectedRow = e.detail.row;
				}
			}}
		/>
	{/await}
</Modal>

{@render modalUnderSelect?.()}
