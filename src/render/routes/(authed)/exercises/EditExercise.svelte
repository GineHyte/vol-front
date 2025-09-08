<script lang="ts">
	import { Button, Tile } from 'carbon-components-svelte';
	import { Exercise, ExerciseSubtech } from '$lib/scripts/models';
	import { editExercise, getExercise, getTechs, getSubtechs } from '$lib/scripts/endpoints';
	import ModalCreateRelation from '$lib/ui/ModalCreateRelation.svelte';
	import ModalEdit from '@/render/lib/ui/ModalEdit.svelte';
	import { pushNotification } from '$lib/utils/utils';
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
	import { t } from '$lib/utils/utils';
	import { PaginationProps } from '$lib/scripts/pagination';
	import ModalSkeleton from '@/render/lib/ui/ModalSkeleton.svelte';

	interface Props {
		editExerciseId?: number | undefined;
		editOpen?: boolean;
		updateTable: () => void;
	}

	let { editExerciseId, editOpen = $bindable(false), updateTable }: Props = $props();

	let exercise = $state(new Exercise());
	let selectedTech: { [key: string]: any } | undefined = $state(undefined);
	let selectedSubtechs: Array<{ [key: string]: any }> = $state([]);
	let selectionTechOpen: boolean = $state(false);
	let selectionSubtechOpen: boolean = $state(false);

	async function pullExercise() {
		if (editExerciseId) {
			exercise = await getExercise(editExerciseId);
			selectedSubtechs = exercise.subtechs.map((el: ExerciseSubtech) => el.subtech);
		}
	}

	async function editExerciseRenderer() {
		if (exercise.subtechs) {
			exercise.subtechs = exercise.subtechs.map((el: any) => {
				let res = new ExerciseSubtech();
				res.subtech = el.subtech.id;
				return res;
			});
			let selectedRowIds = selectedSubtechs.map((el) => el.id);
			exercise.subtechs = exercise.subtechs.filter((el: any) => {
				selectedRowIds.includes(el.id);
			});
		}
		selectedSubtechs.forEach((selectedSubtech) => {
			let exerciseSubtech = new ExerciseSubtech();
			exerciseSubtech.subtech = selectedSubtech.id;
			exercise.subtechs = [...(exercise.subtechs || []), exerciseSubtech];
		});
		let status = await editExercise(exercise);
		if (status.status === 'success') {
			pushNotification('editExerciseSuccess');
		} else {
			pushNotification('editExerciseError');
		}
		editOpen = false;
		updateTable();
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
		</ModalEdit>
	{/await}
{/if}
