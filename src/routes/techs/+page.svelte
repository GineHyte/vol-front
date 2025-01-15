<script lang="ts">
	import SideList from '$lib/ui/SideList.svelte';
	import {
		Toolbar,
		ToolbarContent,
		Content,
		Grid,
		Row,
		Column,
		DataTable,
		DataTableSkeleton,
		Pagination,
		SkeletonText,
		Tile,
		Button,
	} from 'carbon-components-svelte';
	import {
		getTech,
		getTechs,
		createTech,
		deleteTech,
		createSubtech,
		deleteSubtech,
		getSubtechs,
		getSubtech,
	} from '$lib/scripts/endpoints';
	import { Tech, Subtech } from '$lib/scripts/models';
	import ModalCreate from '$lib/ui/ModalCreate.svelte';
	import { pushNotification } from '$lib/utils/utils';
	import { PaginationProps } from '$lib/scripts/pagination';
	import ContextMenuSideList from '$lib/ui/ContextMenuSideList.svelte';

	let techId: number | undefined = undefined;
	let createOpen = false;
	let createSubtechOpen = false;
	let subtechPage = 1;
	let subtechPageSize = 5;
	let targetForSubtechs: any;
	let subtechTableUpdate = false;

	function selectTech(id: number) {
		techId = id;
	}

	async function duplicateTech(currentId: number) {
		if (currentId) {
			let tech = await getTech(currentId);
			console.log(tech);
			let status = await createTech(tech);
			if (status.status.originalType.value === 'success') {
				pushNotification({
					title: 'Успіх!',
					message: 'Техніка дубльована.',
					kind: 'success',
				});
			} else {
				pushNotification({
					title: 'Помилка!',
					message: 'Техніка не може бути дубльована.',
					kind: 'error',
				});
			}
		}
	}

	async function duplicateSubtech(currentId: number) {
		if (currentId) {
			let subtech = await getSubtech(currentId);
			console.log(subtech);
			let status = await createSubtech(subtech);
			if (status.status.originalType.value === 'success') {
				pushNotification({
					title: 'Успіх!',
					message: 'Підтехніка дубльована.',
					kind: 'success',
				});
			} else {
				pushNotification({
					title: 'Помилка!',
					message: 'Підтехніка не може бути дубльована.',
					kind: 'error',
				});
			}
		}
	}

	async function removeTech(currentId: number) {
		if (currentId) {
			let status = await deleteTech(currentId);
			if (status.status.originalType.value === 'success') {
				pushNotification({
					title: 'Успіх!',
					message: 'Техніка видалена.',
					kind: 'success',
				});
			} else {
				pushNotification({
					title: 'Помилка!',
					message: 'Техніка не може бути видалена.',
					kind: 'error',
				});
			}
		}
	}

	async function removeSubtech(currentId: number) {
		if (currentId) {
			let status = await deleteSubtech(currentId);
			if (status.status.originalType.value === 'success') {
				pushNotification({
					title: 'Успіх!',
					message: 'Підтехніка видалена.',
					kind: 'success',
				});
			} else {
				pushNotification({
					title: 'Помилка!',
					message: 'Підтехніка не може бути видалена.',
					kind: 'error',
				});
			}
		}
	}

	async function createTechRenderer(inputData: any) {
		let tech = new Tech();
		tech.deserialize(inputData);
		let status = await createTech(tech);
		if (status.status.originalType.value === 'success') {
			pushNotification({
				title: 'Успіх!',
				message: 'Ви створили нову техніку.',
				kind: 'success',
			});
		} else {
			pushNotification({
				title: 'Помилка!',
				message: 'Техніка не може бути створена.',
				kind: 'error',
			});
		}
		createOpen = false;
	}

	async function createSubtechRenderer(inputData: any) {
		let subtech = new Subtech();
		subtech.techId.originalType.value = techId;
		subtech.deserialize(inputData);
		let status = await createSubtech(subtech);
		if (status.status.originalType.value === 'success') {
			pushNotification({
				title: 'Успіх!',
				message: 'Ви створили нову підтехніку.',
				kind: 'success',
			});
		} else {
			pushNotification({
				title: 'Помилка!',
				message: 'Підтехніка не може бути створена.',
				kind: 'error',
			});
		}
		createSubtechOpen = false;
	}
</script>

{#if techId}
	<Content>
		<Grid>
			{#await getTech(techId)}
				<Row class="min-h-96 m-4">
					<Column>
						<SkeletonText paragraph lines={8} />
					</Column>
				</Row>
			{:then tech}
				<Row>
					<Column>
						<p>Назва: {tech.name.originalType.value}</p>
					</Column>
					<div class="h-[12rem]" />
					<div class="w-full h-full mt-8" bind:this={targetForSubtechs}>
						{#key [subtechTableUpdate, createSubtechOpen]}
							{#await getSubtechs(techId, new PaginationProps(subtechPage, subtechPageSize))}
								<DataTableSkeleton />
							{:then subtechs}
								<DataTable
									sortable
									headers={subtechs.getHeaders()}
									rows={subtechs.getRows()}
								>
									<svelte:fragment slot="cell" let:cell let:row>
										<div class="w-full h-full" id={row.id}>
											{cell.value}
										</div>
									</svelte:fragment>
									<Toolbar>
										<ToolbarContent class="w-full">
											<Button
												on:click={() => (createSubtechOpen = true)}
												class="w-full"
											>
												+ Підтехніка
											</Button>
										</ToolbarContent>
									</Toolbar>
								</DataTable>
								<Pagination
									pageSizes={[5, 10, 20, 50]}
									bind:pageSize={subtechPageSize}
									bind:page={subtechPage}
									totalItems={subtechs.total}
								/>
							{/await}
						{/key}
					</div>
					<ContextMenuSideList
						target={targetForSubtechs}
						deleteFunc={removeSubtech}
						duplicateFunc={duplicateSubtech}
						on:update={() => (subtechTableUpdate = !subtechTableUpdate)}
					/>
				</Row>
			{/await}
		</Grid>
	</Content>
{/if}

<ModalCreate
	label="tech"
	title="Техніка"
	model={new Tech()}
	handleSubmit={createTechRenderer}
	bind:open={createOpen}
	requiredFields={['name', 'description']}
/>

<ModalCreate
	label="subtech"
	title="Підтехніка"
	model={new Subtech()}
	handleSubmit={createSubtechRenderer}
	bind:open={createSubtechOpen}
	requiredFields={['name', 'description']}
	excludeFields={['techId']}
/>

{#key createOpen}
	<SideList
		bind:currentId={techId}
		title="Техніка"
		deleteFunc={removeTech}
		duplicateFunc={duplicateTech}
		newFunc={() => {
			createOpen = true;
		}}
		getFunc={getTechs}
		selectFunc={selectTech}
		headers={[{ key: 'name', value: 'Назва' }]}
	/>
{/key}
