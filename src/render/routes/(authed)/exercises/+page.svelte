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
		Select,
		SelectItem,
		ToolbarSearch,
		Button,
	} from 'carbon-components-svelte';
	import type { Pagination as PaginationType } from '@/render/lib/scripts/pagination';
	import {
		getExercises,
		getExercise,
		createExercise,
		deleteExercise,
	} from '$lib/scripts/endpoints';
	import { pushNotification, trunicate } from '$lib/utils/utils';
	import ContextMenu from '@/render/lib/ui/ContextMenu.svelte';
	import { PaginationProps } from '@/render/lib/scripts/pagination';
	import CreateExercise from './CreateExercise.svelte';
	import EditExercise from './EditExercise.svelte';
	import { t } from '$lib/utils/utils';
	import { ExerciseSubtech } from '@/render/lib/scripts/models';
	import type { Exercise, NameWithId } from '@/render/lib/scripts/models';
	import ModalText from '@/render/lib/ui/ModalText.svelte';
	import type {
		DataTableRowId,
		DataTableRow,
	} from 'carbon-components-svelte/types/DataTable/DataTable.svelte';
	import { SmallComponentsMakingALargerWhole } from 'carbon-pictograms-svelte';

	let createOpen = $state(false);
	let editOpen = $state(false);
	let editExerciseId: number | undefined = $state(undefined);
	let exerciseTextOpen = $state(false);
	let modalTextTitle = $state('');
	let modalTextText = $state('');

	let tableUpdater: boolean = $state(false);
	let targetForExercises: any = $state();
	let page = $state(1);
	let pageSize = $state(10);
	let selectedFilter = $state('');
	let filterInput = $state('');
	let backupRows: DataTableRow[] = $state([]);

	function updateTable() {
		tableUpdater = !tableUpdater;
	}

	async function duplicateExercise(currentId: number) {
		if (currentId) {
			let exercise = await getExercise(currentId);
			exercise.subtechs = exercise.subtechs.map((sub: ExerciseSubtech) => {
				let relation = new ExerciseSubtech();
				relation.subtech = sub.subtech.id;
				return relation;
			});
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

	async function formatRows(object: PaginationType<Exercise>): Promise<PaginationType<Exercise>> {
		object.items.map((el: Exercise) => {
			el.subtechs = el.subtechs
				.map((sub: ExerciseSubtech) => {
					return sub.subtech.name;
				})
				.join(', ');
		});

		return object;
	}

	async function filterFows(object: PaginationType<Exercise>): Promise<PaginationType<Exercise>> {
		object.items = object.items.filter((row: any) => {
			if (selectedFilter === '') return true;
			const rowValue = row[selectedFilter];
			if (typeof rowValue === 'string') {
				console.log(
					rowValue.toLowerCase(),
					rowValue.toLowerCase().includes(filterInput.toLowerCase()),
				);
				return rowValue.toLowerCase().includes(filterInput.toLowerCase());
			}
		});

		return object;
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
						{:then rawExercises}
							{#await formatRows(rawExercises) then formatedExercises}
								{#key filterInput}
									{JSON.stringify(formatedExercises)}
									{#await filterFows(formatedExercises) then exercises}
										<div class="mb-4">
											<Select
												labelText="Фільтрувати за"
												bind:selected={selectedFilter}
											>
												{#each formatedExercises
													.getHeaders()
													?.filter((ex) => ex.key !== 'id') as exercise}
													<SelectItem
														text={exercise.value}
														value={exercise.key}
													/>
												{/each}
											</Select>
										</div>
										<DataTable
											sortable
											headers={formatedExercises.getHeaders([
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
												<button
													onclick={() => {
														exerciseTextOpen = true;
														modalTextText = cell.value;
														modalTextTitle = cell.header;
													}}
													class="text-left"
													id={row.id}
												>
													{trunicate(cell.value)}
												</button>
											{/snippet}

											<Toolbar>
												<ToolbarContent>
													<ToolbarSearch
														persistent
														value={filterInput}
														on:keydown={(e) => {
															if (e.key === 'Enter')
																filterInput = (
																	e.target as HTMLInputElement
																).value;
														}}
														on:clear={() => {
															filterInput = '';
														}}
													/>
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
							{/await}
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
	<EditExercise bind:editOpen {editExerciseId} {updateTable} />
{/if}
{#if exerciseTextOpen}
	<ModalText bind:open={exerciseTextOpen} title={modalTextTitle} text={modalTextText} />
{/if}
