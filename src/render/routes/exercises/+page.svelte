<script lang="ts">
	import {
		SkeletonPlaceholder,
		ImageLoader,
		Content,
		Tile,
		Grid,
		DataTable,
		DataTableSkeleton,
		Row,
		Column,
		Toolbar,
		ToolbarContent,
		Button,
		SkeletonText,
	} from 'carbon-components-svelte';
	import {
		getExercises,
		getExercise,
		createExercise,
		deleteExercise,
		getTechs,
		getSubtechs,
	} from '$lib/scripts/endpoints';
	import { Exercise } from '$lib/scripts/models';
	import ModalCreate from '$lib/ui/ModalCreate.svelte';
	import { pushNotification } from '$lib/utils/utils';
	import ModalCreateRelation from '$lib/ui/ModalCreateRelation.svelte';
	import ContextMenuSideList from '$lib/ui/ContextMenuSideList.svelte';

	let exerciseId: number | undefined = undefined;
	let createOpen = false;
	let selectedTech: { [key: string]: any } | undefined = undefined;
	let selectedSubtech: { [key: string]: any } | undefined = undefined;
	let selectionTechOpen: boolean = false;
	let selectionSubtechOpen: boolean = false;
	let tableUpdater: boolean = false;
	let targetForExercises: any;

	function selectExercise(id: number) {
		exerciseId = id;
	}

	function updateTable() {
		tableUpdater = !tableUpdater;
	}

	async function duplicateExercise(currentId: number) {
		if (currentId) {
			let exercise = await getExercise(currentId);
			exercise.tech = exercise.tech.id;
			exercise.subtech = exercise.subtech.id;
			let status = await createExercise(exercise);
			if (status.status === 'success') {
				pushNotification('duplicateExerciseSuccess');
			} else {
				pushNotification('duplicateExerciseError');
			}
		}
	}

	async function removeExercise(currentId: number) {
		let status = await deleteExercise(currentId);
		if (currentId) {
			console.log(currentId);
			if (status.status === 'success') {
				pushNotification('deleteExerciseSuccess');
			} else {
				pushNotification('deleteExerciseError');
			}
		}
	}

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

<Content>
	<Grid>
		<Row>
			<Column>
				<div bind:this={targetForExercises}>
					{#key tableUpdater}
						{#await getExercises()}
							<DataTableSkeleton />
						{:then exercises}
							<DataTable
								headers={exercises.getHeaders(['imageUrl', 'videoUrl'])}
								rows={exercises.getRows()}
							>
								<svelte:fragment slot="cell" let:cell let:row>
									<div class="w-full h-full" id={row.id}>
										{cell.value}
									</div>
								</svelte:fragment>
								<Toolbar>
									<ToolbarContent>
										<Button
											on:click={() => {
												createOpen = true;
											}}
											class="w-full"
										>
											+ Вправа
										</Button>
									</ToolbarContent>
								</Toolbar>
							</DataTable>
						{/await}
					{/key}
				</div>
				<ContextMenuSideList
					target={targetForExercises}
					deleteFunc={removeExercise}
					duplicateFunc={duplicateExercise}
					on:update={updateTable}
				/>
			</Column>
		</Row>
	</Grid>
</Content>

{#if createOpen}
	<ModalCreate
		title="Вправа"
		model={new Exercise()}
		handleSubmit={createExerciseRenderer}
		bind:open={createOpen}
		requiredFields={['name', 'description', 'difficulty', 'timePerExercise']}
		exclude={['imageUrl', 'videoUrl']}
	>
		<svelte:fragment slot="createRelationField">
			{#if selectedTech}
				<Tile>Техніка: {selectedTech.name}</Tile>
			{/if}
			{#if selectedSubtech}
				<Tile>Підтехніка: {selectedSubtech.name}</Tile>
			{/if}
			<Button
				class="mt-4"
				on:click={() => {
					selectionTechOpen = true;
				}}
			>
				Вибрати техніку
			</Button>
			<Button
				class="mt-4"
				on:click={() => {
					selectionSubtechOpen = true;
				}}
				disabled={!selectedTech}
			>
				Вибрати підтехніку
			</Button>
		</svelte:fragment>
		<svelte:fragment slot="modalCreateRelation">
			<ModalCreateRelation
				title="Техніка"
				getFunc={getTechs}
				bind:open={selectionTechOpen}
				on:submit={(e) => {
					selectedTech = e.detail;
					console.log(selectedTech);
					selectionTechOpen = false;
					selectionSubtechOpen = true;
				}}
				excludeHeaders={['id']}
			/>
			{#if selectedTech}
				<ModalCreateRelation
					title="Підехніка"
					getFunc={async () => {
						return await getSubtechs(selectedTech?.id);
					}}
					bind:open={selectionSubtechOpen}
					on:submit={(e) => {
						selectedSubtech = e.detail;
						selectionSubtechOpen = false;
					}}
					excludeHeaders={['id']}
				/>
			{/if}
		</svelte:fragment>
	</ModalCreate>
{/if}
