<script lang="ts">
	import '@carbon/charts-svelte/styles.css';
	import { PieChart } from '@carbon/charts-svelte';
	import { Modal } from 'carbon-components-svelte';
	import { getPlayerStats, getTechStats } from '@/render/lib/scripts/endpoints';
	import type { TechSum } from '@/render/lib/scripts/models';
	import type { ToolbarControlTypes } from '@carbon/charts';
	import { Impact } from '@/render/lib/utils/utils';
	import { onMount } from 'svelte';

	interface Props {
		open: boolean;
		playerId: number;
	}

	let { open = $bindable(), playerId }: Props = $props();
	let diagramDepth = 0;

	let techId: number | undefined;
	let techIds: number[] = [];
	let subtechId: number | undefined;
	let subtechIds: number[] = [];
	let impact: keyof typeof Impact | undefined;
	let impacts: (keyof typeof Impact)[];

	let loaded: boolean = $state(false);
	let chartComponent: PieChart | undefined = $state();

	// **
	// This Method can be moved to modal.ts file
	// 1 HTTP request to get player stats !!!
	// **
	async function getPlayerChartData(): Promise<{ [index: string]: any }[]> {
		let chartData: { [index: string]: any }[] = [];
		if (diagramDepth === 0) {
			let data = await getPlayerStats(playerId);
			chartData = data.techTop.map((el: TechSum) => {
				let record = {
					group: el.nameWithId.name,
					value: el.sumActions,
				};
				return record;
			});
		} else if (diagramDepth === 1 && techId) {
			let data = await getTechStats(playerId, techId);
			chartData = data.subtechTop.map((el: TechSum) => {
				let record = {
					group: el.nameWithId.name,
					value: el.sumActions,
				};
				return record;
			});
		}
		return chartData;
	}

	function handleChartLoad() {
		console.log(chartComponent);
		console.log(chartComponent.services);
		if (chartComponent && chartComponent.services && chartComponent.services.events) {
			chartComponent.services.events.addEventListener('pie-slice-click', handleSliceClick);
		}
	}

	function handleSliceClick(event: CustomEvent) {
		const clickedSliceData = event.detail;
		alert(`Clicked on ${clickedSliceData.label} with value ${clickedSliceData.value}`);
		console.log('Clicked slice data:', clickedSliceData);
		// You can now use this data to perform other actions,
		// such as updating a state variable or navigating to another page.
	}
</script>

<Modal bind:open passiveModal hasScrollingContent>
	{#await getPlayerChartData()}
		<PieChart
			data={[]}
			options={{
				theme: 'g90',
				title: 'Статистика по гравцю',
				resizable: true,
				data: {
					loading: true,
				},
				legend: {
					alignment: 'center',
				},
				pie: {
					alignment: 'center',
				},
				height: '600px',
			}}
		/>
	{:then data}
		<PieChart
			on:pie-slice-click={() => {
				console.log('TEST');
			}}
			{data}
			bind:chart={chartComponent}
			on:update={() => {
				if (chartComponent) {
					handleChartLoad();
				}
			}}
			options={{
				theme: 'g90',
				title: 'Статистика по гравцю',
				resizable: true,
				legend: {
					alignment: 'center',
				},
				tooltip: {
					enabled: false,
				},
				toolbar: {
					enabled: false,
				},
				pie: {
					alignment: 'center',
				},
				height: '600px',
			}}
		/>
	{/await}
</Modal>
