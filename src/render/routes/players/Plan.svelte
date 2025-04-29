<script lang="ts">
	import '@carbon/charts-svelte/styles.css';
	import { getPlanWeek } from '@/render/lib/scripts/endpoints';
	import { Modal, DataTableSkeleton, DataTable } from 'carbon-components-svelte';
	import type { DataTableRow } from 'carbon-components-svelte/types/DataTable/DataTable.svelte';
	import type { Exercise, PlanWeek } from '@/render/lib/scripts/models';

	interface Props {
		open: boolean;
		playerId: number;
		playerName: string;
	}

	let { open = $bindable(), playerId, playerName }: Props = $props();
	let weekNumber: number = 1;
	const tableHeaders = [
		{ key: 'name', value: 'Назва' },
		// { key: 'description', value: 'Опис' },
		{ key: 'tech', value: 'Техніка' },
		{ key: 'subtech', value: 'Підтехніка' },
		{ key: 'timePerExercise', value: 'Час на виконання' },
	];

	function formatPlanWeek(planWeek: PlanWeek): DataTableRow[] {
		let tableData: DataTableRow[] = [];
		planWeek.exercises.forEach((ex: Exercise) => {
			let tableRow: DataTableRow = { id: ex.id };
			tableRow.name = ex.name;
			// tableRow.description = ex.description;
			tableRow.tech = ex.tech.name;
			tableRow.subtech = ex.subtech.name;
			tableRow.timePerExercise = ex.timePerExercise + ' хв';
			tableData.push(tableRow);
		});
		console.log(tableData);
		return tableData;
	}
</script>

<Modal bind:open hasScrollingContent>
	{#await getPlanWeek(playerId, weekNumber)}
		<DataTableSkeleton />
	{:then planWeek}
		<DataTable
			sortable
			title={playerName}
			headers={tableHeaders}
			rows={formatPlanWeek(planWeek)}
		></DataTable>
	{/await}
</Modal>
