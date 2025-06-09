<script lang="ts">
	import { Button, Tile } from 'carbon-components-svelte';
	import { Exercise } from '$lib/scripts/models';
	import { editExercise, getExercise, getTechs, getSubtechs } from '$lib/scripts/endpoints';
	import ModalCreateRelation from '$lib/ui/ModalCreateRelation.svelte';
	import ModalEdit from '@/render/lib/ui/ModalEdit.svelte';
	import { pushNotification } from '$lib/utils/utils';
	import { t } from '$lib/utils/utils';
	import { PaginationProps } from '$lib/scripts/pagination';
	import ModalSkeleton from '@/render/lib/ui/ModalSkeleton.svelte';

	interface Props {
		editExerciseId?: number | undefined;
		editOpen?: boolean;
		selectedTech?: any;
		selectedSubtech?: any;
		selectionTechOpen?: boolean;
		selectionSubtechOpen?: boolean;
	}

	let {
		editExerciseId,
		editOpen = $bindable(false),
		selectedTech = $bindable(undefined),
		selectedSubtech = $bindable(undefined),
		selectionTechOpen = $bindable(false),
		selectionSubtechOpen = $bindable(false),
	}: Props = $props();

	let exercise = $state(new Exercise());

	async function pullExercise() {
		if (editExerciseId) {
			exercise = await getExercise(editExerciseId);
		}
	}

	async function editExerciseRenderer() {
		if (selectedTech) exercise.tech = selectedTech.id;
		if (selectedSubtech) exercise.subtech = selectedSubtech.id;

		let status = await editExercise(exercise);
		if (status.status === 'success') {
			pushNotification('editExerciseSuccess');
		} else {
			pushNotification('editExerciseError');
		}
		editOpen = false;
	}
</script>

{#if editOpen}
	{#await pullExercise()}
		<ModalSkeleton
			model={exercise}
			title={t('titles.exercise')}
			exclude={['imageUrl', 'videoUrl']}
		/>
	{:then _}
		<ModalEdit
			title={t('titles.exercise')}
			bind:model={exercise}
			onSubmit={editExerciseRenderer}
			bind:open={editOpen}
			requiredFields={['name', 'description', 'difficulty', 'timePerExercise']}
			exclude={['imageUrl', 'videoUrl']}
		>
			{#snippet createRelationField()}
				{#if selectedTech}
					<Tile>{t('titles.tech')}: {selectedTech.name}</Tile>
				{/if}
				{#if selectedSubtech}
					<Tile>{t('titles.subtech')}: {selectedSubtech.name}</Tile>
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
					disabled={!selectedTech}
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
						title={t('titles.subtech')}
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
		</ModalEdit>
	{/await}
{/if}
