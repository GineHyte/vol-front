<script lang="ts">
	import '@carbon/charts-svelte/styles.css';
	import { PieChart } from '@carbon/charts-svelte';
	import { Modal } from 'carbon-components-svelte';
	import { getPlayerStats } from '@/render/lib/scripts/endpoints';
	import type { TechSum } from '@/render/lib/scripts/models';

	interface Props {
		open: boolean;
		playerId: number;
	}

	let { open = $bindable(), playerId }: Props = $props();

	// **
	// This Method can be moved to modal.ts file
	// 1 HTTP request to get player stats !!!
	// **
	async function getPlayerChartData(playerId: number): Promise<{ [index: string]: any }[]> {
		let data = await getPlayerStats(playerId);
		let chartData: { [index: string]: any }[] = [];
		if (data.techTop.length > 0) {
			data.techTop.forEach((el: TechSum) => {
				let record = {
					group: el.nameWithId.name,
					value: el.sumActions,
				};
				chartData.push(record);
			});
		}
		return chartData;
	}
</script>

<Modal bind:open passiveModal hasScrollingContent>
	{#await getPlayerChartData(playerId)}
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
		{console.log(data)}
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
