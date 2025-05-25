<script lang="ts">
	import { Button, Tile } from 'carbon-components-svelte';
	import { Exercise } from '$lib/scripts/models';
	import { createExercise, getTechs, getSubtechs } from '$lib/scripts/endpoints';
	import ModalCreate from '$lib/ui/ModalCreate.svelte';
	import ModalCreateRelation from '$lib/ui/ModalCreateRelation.svelte';
	import { pushNotification } from '$lib/utils/utils';
	import { PaginationProps } from '@/render/lib/scripts/pagination';
	import { t } from '$lib/i18n/utils';

	type Props = {
		createOpen?: boolean;
		updateTable: () => void;
	};

	let { createOpen = $bindable(false), updateTable }: Props = $props();

	let selectedTech: { [key: string]: any } | undefined = $state(undefined);
	let selectedSubtech: { [key: string]: any } | undefined = $state(undefined);
	let selectionTechOpen: boolean = $state(false);
	let selectionSubtechOpen: boolean = $state(false);

	async function createExerciseRenderer(inputData: any) {
		let exercise = new Exercise();
		Object.keys(inputData).forEach((key) => {
			// @ts-ignore
			exercise[key as keyof Exercise] = inputData[key];
		});
		exercise.tech = selectedTech?.id;
		exercise.subtech = selectedSubtech?.id;
		let status = await createExercise(exercise);
		if (status.status === 'success') {
			pushNotification('createExerciseSuccess');
		} else {
			pushNotification('createExerciseError');
		}
		createOpen = false;
		updateTable();
	}
</script>

<ModalCreate
	title={$t('titles.exercise')}
	model={new Exercise()}
	handleSubmit={createExerciseRenderer}
	bind:open={createOpen}
	requiredFields={['name', 'description', 'difficulty', 'timePerExercise']}
	exclude={['imageUrl', 'videoUrl']}
>
	{#snippet createRelationField()}
		{#if selectedTech}
			<Tile>{$t('titles.tech')}: {selectedTech.name}</Tile>
		{/if}
		{#if selectedSubtech}
			<Tile>{$t('titles.subtech')}: {selectedSubtech.name}</Tile>
		{/if}
		<Button
			class="mt-4"
			on:click={() => {
				selectionTechOpen = true;
			}}
		>
			{$t('buttons.selectTech')}
		</Button>
		<Button
			class="mt-4"
			on:click={() => {
				selectionSubtechOpen = true;
			}}
			disabled={!selectedTech}
		>
			{$t('buttons.selectSubtech')}
		</Button>
	{/snippet}
	{#snippet modalCreateRelation()}
		<ModalCreateRelation
			title={$t('titles.tech')}
			getFunc={getTechs}
			bind:open={selectionTechOpen}
			on:submit={(e) => {
				selectedTech = e.detail;
				selectionTechOpen = false;
				selectionSubtechOpen = true;
			}}
			excludeHeaders={['id']}
		/>
		{#if selectedTech}
			<ModalCreateRelation
				title={$t('titles.subtech')}
				getFunc={async () => {
					return await getSubtechs(selectedTech?.id, new PaginationProps(1, 100));
				}}
				bind:open={selectionSubtechOpen}
				on:submit={(e) => {
					selectedSubtech = e.detail;
					selectionSubtechOpen = false;
				}}
				excludeHeaders={['id']}
			/>
		{/if}
	{/snippet}
</ModalCreate>
