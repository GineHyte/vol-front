<script lang="ts">
	import { DataTable, DataTableSkeleton, Modal } from 'carbon-components-svelte';
	import { createEventDispatcher } from 'svelte';
	import { Pagination } from '$lib/scripts/pagination';

	export let open: boolean = false;
	export let title: string = '';
	export let excludeHeaders: string[] = [];
	export let getFunc: () => Promise<Pagination<any>>;
	export let alreadySelectedIds: number[] = [];

	let dispatch = createEventDispatcher();
	let localSelectedRow: { [key: string]: any } = {};

	$: if (!open) {
		dispatch('close');
		localSelectedRow = {};
	}
</script>

<Modal
	size={'lg'}
	bind:open
	primaryButtonText="Готово"
	modalHeading={title}
	primaryButtonDisabled={localSelectedRow.id === undefined}
	on:submit={() => {
		dispatch('submit', localSelectedRow);
	}}
>
	{#await getFunc()}
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

<slot name="modalUnderSelect" />
