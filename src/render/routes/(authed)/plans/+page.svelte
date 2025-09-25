<script lang="ts">
	import { Pagination } from '$lib/scripts/pagination';
	import '@carbon/charts-svelte/styles.css';
	import { getPlanWeek } from '@/render/lib/scripts/endpoints';
	import { Modal, DataTableSkeleton, DataTable, Dropdown } from 'carbon-components-svelte';
	import type { DataTableRow } from 'carbon-components-svelte/types/DataTable/DataTable.svelte';
	import { Exercise, NameWithId, type PlanWeek } from '@/render/lib/scripts/models';
	import { t } from '$lib/utils/utils';
	import { currentPlanPlayer } from '@/render/lib/utils/store';
	import { MeterChart, type ChartTabularData } from '@carbon/charts-svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let weekNumber: number = $state(1);
	let totalChart = $state(0);

	const tableHeaders = [
		{ key: 'name', value: t('common.name') },
		{ key: 'subtechs', value: t('titles.subtech') },
		{ key: 'timePerExercise', value: t('fields.timePerExercise') },
		{ key: 'fromZone', value: t('fields.fromZone') },
		{ key: 'toZone', value: t('fields.toZone') },
	];

	const chartOptions = $derived({
		title: t('titles.planDistribution'),
		height: '230px',
		meter: {
			proportional: {
				total: totalChart,
				unit: ' вправ',
			},
		},
		color: {
			pairing: {
				option: 2,
			},
		},
		theme: document.documentElement.getAttribute('theme')?.toString(),
	});

	let chartData = $state<ChartTabularData>([]);
	let chartComponent = $state<MeterChart>();
	let tableData: DataTableRow[] = [];
	let filteredTableData = $state<DataTableRow[]>([]);
	let currentSubtech = $state('');

	async function calculateData(planWeek: Promise<PlanWeek>): Promise<PlanWeek> {
		let newChartData: ChartTabularData = [];
		let subtechDict: Record<string, number> = {};
		let localTotal = 0;
		const res = await planWeek;

		res.exercises.forEach((ex: Exercise, i: number) => {
			ex.subtechs.forEach((sub: any) => {
				if (subtechDict[sub.subtech.name] !== undefined) {
					subtechDict[sub.subtech.name] += 1;
				} else {
					subtechDict[sub.subtech.name] = 1;
				}
				localTotal += 1;
			});
		});

		for (const [key, value] of Object.entries(subtechDict)) {
			newChartData.push({
				group: key,
				value: value,
				valueLabel: localTotal > 0 ? ((value / localTotal) * 100).toFixed(2) + '%' : '0%',
			});
		}

		let newTableData: DataTableRow[] = [];
		res.exercises.forEach((ex: Exercise, i: number) => {
			let tableRow: DataTableRow = { id: ex.id.toString() + '-' + i.toString() };
			tableRow.name = ex.name;
			tableRow.subtechs = ex.subtechs.map((x: any) => x.subtech.name).join(', ');
			tableRow.timePerExercise = ex.timePerExercise + ' ' + t('timeUnit');
			tableRow.fromZone = ex.fromZone;
			tableRow.toZone = ex.toZone;
			newTableData.push(tableRow);
		});

		tableData = newTableData;
		filteredTableData = tableData;
		chartData = newChartData;
		totalChart = localTotal;
		return res;
	}

	function filterTableData() {
		if (currentSubtech !== '') {
			filteredTableData = tableData.filter((row: DataTableRow) =>
				row.subtechs.includes(currentSubtech),
			);
		} else {
			filteredTableData = tableData;
		}
	}

	function handleChartLoad() {
		if (chartComponent && chartComponent.services && chartComponent.services.events) {
			chartComponent.services.events.addEventListener('meter-click', handleChartClick);
		}
	}

	function handleChartClick(event: CustomEvent) {
		console.log(event);
		currentSubtech = event.detail.datum.group;
		filterTableData();
	}

	onMount(() => {
		if ($currentPlanPlayer === -1) {
			goto('/players');
		}
	});
</script>

{#await calculateData(getPlanWeek($currentPlanPlayer, weekNumber))}
	<DataTableSkeleton />
{:then planWeek}
	<Dropdown
		bind:selectedId={weekNumber}
		items={[...Array(12)].map((_, i) => ({ id: i + 1, text: `${t('weeks')} ${i + 1}` }))}
		label={t('weeks')}
		class="mb-4"
	/>
	<div class="text-white mb-4">
		<MeterChart
			bind:chart={chartComponent}
			data={chartData}
			options={chartOptions}
			on:load={handleChartLoad}
		/>
	</div>
	<DataTable sortable headers={tableHeaders} rows={filteredTableData}></DataTable>
{/await}
