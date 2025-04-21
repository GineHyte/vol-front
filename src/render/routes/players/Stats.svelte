<script lang="ts">
	import '@carbon/charts-svelte/styles.css';
	import { PieChart } from '@carbon/charts-svelte';
	import { Modal } from 'carbon-components-svelte';
	import { getPlayerStats, getTechStats } from '@/render/lib/scripts/endpoints';
	import type { TechSum } from '@/render/lib/scripts/models';
	import type { Impact } from '@/render/lib/utils/utils';

	interface Props {
		open: boolean;
		playerId: number;
	}

	let { open = $bindable(), playerId }: Props = $props();
	let diagramDepth = 0;

	let techId: number | undefined;
	let subtechId: number | undefined;
	let impact: typeof Impact | undefined;

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
		} else if (diagramDepth === 1) {
			let data = await getTechStats(playerId);
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
				height: '400px',
			}}
		/>
	{:then data}
		<PieChart
			{data}
			options={{
				theme: 'g90',
				title: 'Статистика по гравцю',
				resizable: true,
				legend: {
					alignment: 'center',
				},
				pie: {
					alignment: 'center',
				},
				height: '400px',
			}}
		/>
	{/await}
</Modal>
