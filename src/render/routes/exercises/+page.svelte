<script lang="ts">
	import {
		Content,
		Pagination,
		Tile,
		Grid,
		DataTable,
		DataTableSkeleton,
		Row,
		Column,
		Toolbar,
		ToolbarContent,
		Button,
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
	import ContextMenu from '@/render/lib/ui/ContextMenu.svelte';
	import { PaginationProps } from '@/render/lib/scripts/pagination';
	import { Rewind_10 } from 'carbon-icons-svelte';

	let createOpen = $state(false);
	let selectedTech: { [key: string]: any } | undefined = $state(undefined);
	let selectedSubtech: { [key: string]: any } | undefined = $state(undefined);
	let selectionTechOpen: boolean = $state(false);
	let selectionSubtechOpen: boolean = $state(false);
	let tableUpdater: boolean = $state(false);
	let targetForExercises: any = $state();
	let page = $state(1);
	let pageSize = $state(10);

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
			if (status.status === 'success') {
				pushNotification('removeExerciseSuccess');
			} else {
				pushNotification('removeExerciseError');
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
	<Grid fullWidth>
		<Row>
			<Column>
				<div bind:this={targetForExercises}>
					{#key tableUpdater}
						{#await getExercises(new PaginationProps(page, pageSize))}
							<DataTableSkeleton />
						{:then exercises}
							<DataTable
								headers={exercises.getHeaders([
									'imageUrl',
									'videoUrl',
									'id',
									'description',
									'fromZone',
									'toZone',
								])}
								rows={exercises.getRows()}
							>
								{#snippet cell({ cell, row })}
									<div class="w-full h-full" id={row.id}>
										{cell.value}
									</div>
								{/snippet}
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
							<Pagination
								pageSizes={[10, 50, 100]}
								bind:pageSize
								bind:page
								totalItems={exercises.total}
							/>
						{/await}
					{/key}
				</div>
				<ContextMenu
					target={targetForExercises}
					deleteFunc={removeExercise}
					duplicateFunc={duplicateExercise}
					updateFunc={updateTable}
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
		{#snippet createRelationField()}
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
		{/snippet}
		{#snippet modalCreateRelation()}
			<ModalCreateRelation
				title="Техніка"
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
		{/snippet}
	</ModalCreate>
{/if}
