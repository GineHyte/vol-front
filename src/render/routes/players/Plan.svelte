<script lang="ts">
	import '@carbon/charts-svelte/styles.css';
	import { getPlanWeek } from '@/render/lib/scripts/endpoints';
	import { Modal, DataTableSkeleton, DataTable } from 'carbon-components-svelte';

	interface Props {
		open: boolean;
		playerId: number;
	}

	let { open = $bindable(), playerId }: Props = $props();
	let weekNumber: number = 1;
</script>

<Modal bind:open hasScrollingContent>
	{#await getPlanWeek(playerId, weekNumber)}
		<DataTableSkeleton />
	{:then planWeek}
		{console.log(planWeek)}
		<!-- <DataTable
			useStaticWidth
			headers={[{ key: 'name', value: 'Під-техніка' }]}
			rows={planWeek.__tableData}
		></DataTable> -->
	{/await}
</Modal>
