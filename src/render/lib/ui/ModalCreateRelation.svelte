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
	}

	let {
		open = $bindable(false),
		title = '',
		excludeHeaders = [],
		getFunc,
		alreadySelectedIds = [],
		modalUnderSelect,
	}: Props = $props();

	let dispatch = createEventDispatcher();
	let localSelectedRow: { [key: string]: any } = $state({});

	run(() => {
		if (!open) {
			dispatch('close');
			localSelectedRow = {};
		}
	});
</script>

<Modal
	size={'lg'}
	bind:open
	primaryButtonText={t('common.done')}
	modalHeading={title}
	primaryButtonDisabled={localSelectedRow.id === undefined}
	on:submit={() => {
		dispatch('submit', localSelectedRow);
	}}
>
	{#await getFunc(new PaginationProps(1, 100))}
		<DataTableSkeleton />
	{:then model}
		<DataTable
			radio={true}
			nonSelectableRowIds={alreadySelectedIds}
			headers={model.getHeaders(excludeHeaders)}
			rows={model.getRows()}
			on:click:row--select={(e) => {
				localSelectedRow = e.detail.row;
			}}
		/>
	{/await}
</Modal>

{@render modalUnderSelect?.()}
