<script lang="ts">
	import '@carbon/charts-svelte/styles.css';
	import { getPlanWeek } from '@/render/lib/scripts/endpoints';
	import { Modal, DataTableSkeleton, DataTable, Dropdown } from 'carbon-components-svelte';
	import type { DataTableRow } from 'carbon-components-svelte/types/DataTable/DataTable.svelte';
	import type { Exercise, PlanWeek } from '@/render/lib/scripts/models';
	import { t } from '$lib/utils/utils';

	interface Props {
		open: boolean;
		playerId: number;
		playerName: string;
	}

	let { open = $bindable(), playerId, playerName }: Props = $props();
	let weekNumber: number = $state(1);
	const tableHeaders = [
		{ key: 'name', value: t('common.name') },
		{ key: 'tech', value: t('titles.tech') },
		{ key: 'subtech', value: t('titles.subtech') },
		{ key: 'timePerExercise', value: t('fields.timePerExercise') },
		{ key: 'fromZone', value: t('fields.fromZone') },
		{ key: 'toZone', value: t('fields.toZone') },
	];

	function formatPlanWeek(planWeek: PlanWeek): DataTableRow[] {
		let tableData: DataTableRow[] = [];
		planWeek.exercises.forEach((ex: Exercise) => {
			let tableRow: DataTableRow = { id: ex.id };
			tableRow.name = ex.name;
			tableRow.tech = ex.tech.name;
			tableRow.subtech = ex.subtech.name;
			tableRow.timePerExercise = ex.timePerExercise + ' ' + t('timeUnit');
			tableRow.fromZone = ex.fromZone;
			tableRow.toZone = ex.toZone;
			tableData.push(tableRow);
		});
		return tableData;
	}
</script>

<Modal
	modalHeading={playerName}
	class="pt-10"
	bind:open
	hasScrollingContent
	primaryButtonDisabled
	size="lg"
>
	{#await getPlanWeek(playerId, weekNumber)}
		<DataTableSkeleton />
	{:then planWeek}
		<Dropdown
			bind:selectedId={weekNumber}
			items={[...Array(12)].map((_, i) => ({ id: i + 1, text: `${t('weeks')} ${i + 1}` }))}
			label={t('weeks')}
			class="mb-4"
		/>
		<DataTable sortable headers={tableHeaders} rows={formatPlanWeek(planWeek)}></DataTable>
	{/await}
</Modal>
