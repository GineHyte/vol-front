<script lang="ts">
	import { DataTable, DataTableSkeleton, Modal } from 'carbon-components-svelte';
	import { createEventDispatcher } from 'svelte';

	import { Pagination } from '$lib/scripts/pagination';

	export let open: boolean = false;
	export let title: string = '';
	export let getFunc: () => Promise<Pagination<any>>;

	let dispatch = createEventDispatcher();
	let selectedRelation: number[] = [];

	$: if (!open) {
		dispatch('close');
		selectedRelation = [];
	}
</script>

<Modal
	size={'lg'}
	bind:open
	primaryButtonText="Готово"
	modalHeading={title}
	primaryButtonDisabled={selectedRelation.length === 0}
	on:submit={() => {
		dispatch('submit', selectedRelation);
	}}
>
	{#await getFunc()}
		<DataTableSkeleton />
	{:then data}
		<DataTable
			bind:selectedRowIds={selectedRelation}
			headers={data.getHeaders()}
			rows={data.getRows()}
			on:click:row={(e) => {
				selectedRelation = [e.detail.id];
			}}
		/>
	{/await}
</Modal>
