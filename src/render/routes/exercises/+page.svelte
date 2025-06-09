<script lang="ts">
	import {
		Content,
		Pagination,
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
	} from '$lib/scripts/endpoints';
	import { pushNotification } from '$lib/utils/utils';
	import ContextMenu from '@/render/lib/ui/ContextMenu.svelte';
	import { PaginationProps } from '@/render/lib/scripts/pagination';
	import CreateExercise from './CreateExercise.svelte';
	import EditExercise from './EditExercise.svelte';
	import { t } from '$lib/utils/utils';

	let createOpen = $state(false);
	let editOpen = $state(false);
	let editExerciseId: number | undefined = $state(undefined);
	let selectedTech = $state(undefined);
	let selectedSubtech = $state(undefined);

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

	async function editExercise(currentId: number) {
		if (currentId) {
			console.log('editExercise', currentId);
			editExerciseId = currentId;
			editOpen = true;
		}
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
								sortable
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
									<span id={row.id}>{cell.value}</span>
								{/snippet}
								<Toolbar>
									<ToolbarContent>
										<Button
											on:click={() => {
												createOpen = true;
											}}
											class="w-full"
										>
											+ {t('titles.exercise')}
										</Button>
									</ToolbarContent>
								</Toolbar>
							</DataTable>
							<Pagination
								pageSizes={[10, 50, 100, 1000]}
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
					editFunc={editExercise}
				/>
			</Column>
		</Row>
	</Grid>
</Content>

{#if createOpen}
	<CreateExercise bind:createOpen {updateTable} />
{/if}
{#if editOpen}
	<EditExercise bind:editOpen {editExerciseId} {selectedTech} {selectedSubtech} />
{/if}
