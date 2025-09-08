<script lang="ts">
	import { Button, Tile } from 'carbon-components-svelte';
	import { Exercise, ExerciseSubtech } from '$lib/scripts/models';
	import { createExercise, getTechs, getSubtechs } from '$lib/scripts/endpoints';
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
	import ModalCreate from '$lib/ui/ModalCreate.svelte';
	import ModalCreateRelation from '$lib/ui/ModalCreateRelation.svelte';
	import { pushNotification } from '$lib/utils/utils';
	import { PaginationProps } from '@/render/lib/scripts/pagination';
	import { t } from '$lib/utils/utils';

	type Props = {
		createOpen?: boolean;
		updateTable: () => void;
	};

	let { createOpen = $bindable(false), updateTable }: Props = $props();

	let selectedTech: { [key: string]: any } | undefined = $state(undefined);
	let selectedSubtechs: Array<{ [key: string]: any }> = $state([]);
	let selectionTechOpen: boolean = $state(false);
	let selectionSubtechOpen: boolean = $state(false);

	async function createExerciseRenderer(inputData: any) {
		let exercise = new Exercise();
		Object.keys(inputData).forEach((key) => {
			// @ts-ignore
			exercise[key as keyof Exercise] = inputData[key];
		});
		selectedSubtechs.forEach((selectedSubtech) => {
			let exerciseSubtech = new ExerciseSubtech();
			exerciseSubtech.subtech = selectedSubtech.id;
			exercise.subtechs = [...(exercise.subtechs || []), exerciseSubtech];
		});
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
	title={t('titles.exercise')}
	model={new Exercise()}
	handleSubmit={createExerciseRenderer}
	bind:open={createOpen}
	requiredFields={['name', 'description', 'difficulty', 'timePerExercise']}
	exclude={['imageUrl', 'videoUrl']}
>
	{#snippet createRelationField()}
		{#if selectedSubtechs}
			{#each selectedSubtechs as selectedSubtech}
				<Tile class="flex align-center gap-4">
					<span class="mt-4">{t('titles.subtech')}: {selectedSubtech.name}</span>
					<Button
						kind="danger-tertiary"
						iconDescription="Delete"
						icon={TrashCan}
						on:click={(e) => {
							selectedSubtechs = selectedSubtechs.filter(
								(el) => el.id !== selectedSubtech.id,
							);
						}}
					/>
				</Tile>
			{/each}
		{/if}
		<Button
			class="mt-4"
			on:click={() => {
				selectionTechOpen = true;
			}}
		>
			{t('buttons.selectTech')}
		</Button>
		<Button
			class="mt-4"
			on:click={() => {
				selectionSubtechOpen = true;
			}}
		>
			{t('buttons.selectSubtech')}
		</Button>
	{/snippet}
	{#snippet modalCreateRelation()}
		<ModalCreateRelation
			title={t('titles.tech')}
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
				batch
				title={t('titles.subtech')}
				getFunc={async () => {
					return await getSubtechs(selectedTech?.id, new PaginationProps(1, 100));
				}}
				bind:open={selectionSubtechOpen}
				on:submit={(e) => {
					if (selectedSubtechs) {
						selectedSubtechs = [...selectedSubtechs, ...e.detail];
						selectionSubtechOpen = false;
					}
				}}
				alreadySelectedIds={selectedSubtechs.map((el) => el.id)}
				excludeHeaders={['id']}
			/>
		{/if}
	{/snippet}
</ModalCreate>
