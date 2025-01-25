<script lang="ts">
	import {
		SkeletonPlaceholder,
		ImageLoader,
		Content,
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
	} from '$lib/scripts/endpoints';
	import { Exercise } from '$lib/scripts/models';
	import ModalCreate from '$lib/ui/ModalCreate.svelte';
	import { pushNotification } from '$lib/utils/utils';

	let exerciseId: number | undefined = undefined;
	let createOpen = false;

	function selectExercise(id: number) {
		exerciseId = id;
	}

	async function duplicateExercise(currentId: number) {
		if (currentId) {
			let status = await createExercise((await getExercise(currentId)) as Exercise);
			if (status.status.originalType.value === 'success') {
				pushNotification({
					title: 'Успіх!',
					message: 'Вправа дубльована.',
					kind: 'success',
				});
			} else {
				pushNotification({
					title: 'Помилка!',
					message: 'Вправа не може бути дубльована.',
					kind: 'error',
				});
			}
		}
	}

	async function removeExercise(currentId: number) {
		if (currentId) {
			let status = await deleteExercise(currentId);
			if (status.status.originalType.value === 'success') {
				pushNotification({
					title: 'Успіх!',
					message: 'Вправа видалена.',
					kind: 'success',
				});
			} else {
				pushNotification({
					title: 'Помилка!',
					message: 'Вправа не може бути видалена.',
					kind: 'error',
				});
			}
		}
	}

	async function createExerciseRenderer(inputData: any) {
		let exercise = new Exercise();
		Object.keys(inputData).forEach((key) => {
			// @ts-ignore
			exercise[key as keyof Exercise].originalType.value = inputData[key];
		});
		let status = await createExercise(exercise);
		if (status.status.originalType.value === 'success') {
			pushNotification({
				title: 'Успіх!',
				message: 'Ви створили нову вправу.',
				kind: 'success',
			});
		} else {
			pushNotification({
				title: 'Помилка!',
				message: 'Вправа не може бути створена.',
				kind: 'error',
			});
		}
		createOpen = false;
	}
</script>

<Content>
	<Grid>
		<Row>
			<Column>
				{#await getExercises()}
					<DataTableSkeleton />
				{:then exercises}
					<DataTable
						headers={exercises.getHeaders(['imageUrl', 'videoUrl'])}
						rows={exercises.getRows()}
					>
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
		requiredFields={['name', 'description', 'difficulty', 'subtechId', 'timePerExercise']}
		excludeFields={['imageUrl', 'videoUrl']}
	/>
{/if}
