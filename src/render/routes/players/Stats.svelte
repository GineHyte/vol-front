<script lang="ts">
	import '@carbon/charts-svelte/styles.css';
	import { PieChart } from '@carbon/charts-svelte';
	import { Modal } from 'carbon-components-svelte';
	import {
		getPlayerStats,
		getTechStats,
		getImpactStats,
		getSubtechStats,
	} from '@/render/lib/scripts/endpoints';
	import type { TechSum, SubtechSum, ImpactSum, ZoneSum } from '@/render/lib/scripts/models';
	import { Impact } from '@/render/lib/utils/utils';
	import { t } from '$lib/utils/utils';

	interface Props {
		open: boolean;
		playerId: number;
	}

	let { open = $bindable(), playerId }: Props = $props();
	let diagramDepth = $state(0);

	let techId: number | undefined;
	let techIds: { [key: string]: number } = {};
	let subtechId: number | undefined;
	let subtechIds: { [key: string]: number } = {};
	let impact: string | undefined;
	let impacts: { [key: string]: string } = {};
	let title: string = $state(t('titles.playerStats'));

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
				techIds[el.nameWithId.name] = el.nameWithId.id;
				return record;
			});
		} else if (diagramDepth === 1 && techId !== undefined) {
			let data = await getTechStats(playerId, techId);
			title = `${title} / ${Object.keys(techIds).find((name) => techIds[name] === techId)}`;
			chartData = data.subtechTop.map((el: SubtechSum) => {
				let record = {
					group: el.nameWithId.name,
					value: el.sumActions,
				};
				subtechIds[el.nameWithId.name] = el.nameWithId.id;
				return record;
			});
		} else if (diagramDepth == 2 && techId !== undefined && subtechId !== undefined) {
			let data = await getSubtechStats(playerId, techId, subtechId);
			title = `${title} / ${Object.keys(subtechIds).find((name) => subtechIds[name] === subtechId)}`;
			chartData = data.impactTop.map((el: ImpactSum) => {
				let record = {
					group: Impact[el.impact],
					value: el.sumActions,
				};
				impacts[Impact[el.impact]] = el.impact;
				return record;
			});
		} else if (
			diagramDepth == 3 &&
			techId !== undefined &&
			subtechId !== undefined &&
			impact !== undefined
		) {
			let data = await getImpactStats(playerId, techId, subtechId, impact);
			title = `${title} / ${Object.keys(impacts).find((name) => impacts[name] === impact)}`;
			chartData = data.zoneTop.map((el: ZoneSum) => {
				let record = {
					group: el.zone,
					value: el.sumActions,
				};
				return record;
			});
		}
		return chartData;
	}

	function handleChartLoad() {
		if (chartComponent && chartComponent.services && chartComponent.services.events) {
			chartComponent.services.events.addEventListener('pie-slice-click', handleSliceClick);
		}
	}

	function handleSliceClick(event: CustomEvent) {
		if (diagramDepth <= 2) {
			let group = event.detail.datum.data.group;
			switch (diagramDepth) {
				case 0:
					techId = techIds[group];
				case 1:
					subtechId = subtechIds[group];
				case 2:
					impact = impacts[group];
			}
			diagramDepth += 1;
		}
	}

	function goBack() {
		title = t('titles.playerStats');
		diagramDepth -= 1;
		if (diagramDepth === 0) {
			title = t('titles.playerStats');
		} else {
			title = title.split(' / ').slice(0, diagramDepth).join(' / ');
		}
	}
</script>

{#key diagramDepth}
	<Modal
		bind:open
		hasScrollingContent
		primaryButtonText={t('common.back')}
		passiveModal={diagramDepth == 0}
		on:click:button--primary={goBack}
	>
		{#await getPlayerChartData()}
			<PieChart
				data={[]}
				options={{
					theme: 'g90',
					title: title,
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
				{data}
				bind:chart={chartComponent}
				on:update={() => {
					if (chartComponent) {
						handleChartLoad();
					}
				}}
				options={{
					theme: 'g90',
					title: title,
					resizable: true,
					legend: {
						alignment: 'center',
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
{/key}
