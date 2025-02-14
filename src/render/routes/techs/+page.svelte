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
	import { error } from '@sveltejs/kit';

	let techId: number | undefined = $state(undefined);
	let createOpen = $state(false);
	let createSubtechOpen = $state(false);
	let subtechPage = $state(1);
	let subtechPageSize = $state(5);
	let targetForSubtechs: any = $state();
	let subtechTableUpdate = $state(false);

	function selectTech(id: number) {
		techId = id;
	}

	async function duplicateTech(currentId: number) {
		if (currentId) {
			let tech = await getTech(currentId);
			let status = await createTech(tech);
			if (status.status === 'success') {
				pushNotification('duplicateTechSuccess');
			} else {
				pushNotification('duplicateTechError');
			}
		}
	}

	async function duplicateSubtech(currentId: number) {
		if (currentId) {
			let subtech = await getSubtech(currentId);
			subtech.tech = subtech.tech.id;
			let status = await createSubtech(subtech);
			if (status.status === 'success') {
				pushNotification('duplicateSubtechSuccess');
			} else {
				pushNotification('duplicateSubtechError');
			}
		}
	}

	async function removeTech(currentId: number) {
		if (currentId) {
			let status = await deleteTech(currentId);
			if (status.status === 'success') {
				pushNotification('removeTechSuccess');
			} else {
				pushNotification('removeTechError');
			}
		}
		techId = undefined;
	}

	async function removeSubtech(currentId: number) {
		let a = 1000 / 0;
		if (currentId) {
			let status = await deleteSubtech(currentId);
			if (status.status === 'success') {
				pushNotification('removeSubtechSuccess');
			} else {
				pushNotification('removeSubtechError');
			}
		}
	}

	async function createTechRenderer(inputData: any) {
		let tech = new Tech();
		tech.deserialize(inputData);
		let status = await createTech(tech);
		if (status.status === 'success') {
			pushNotification('createTechSuccess');
		} else {
			pushNotification('createTechError');
		}
		createOpen = false;
	}

	async function createSubtechRenderer(inputData: any) {
		let subtech = new Subtech();
		subtech.tech = techId;
		subtech.deserialize(inputData);
		let status = await createSubtech(subtech);
		if (status.status === 'success') {
			pushNotification('createSubtechSuccess');
		} else {
			pushNotification('createSubtechError', { errorDetail: JSON.stringify(status.detail) });
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
						<p>Назва: {tech.name}</p>
					</Column>
					<div class="h-[12rem]"></div>
					<div class="w-full h-full mt-8" bind:this={targetForSubtechs}>
						{#key [subtechTableUpdate, createSubtechOpen]}
							{#await getSubtechs(techId, new PaginationProps(subtechPage, subtechPageSize))}
								<DataTableSkeleton />
							{:then subtechs}
								<DataTable
									sortable
									headers={subtechs.getHeaders(['id'])}
									rows={subtechs.getRows()}
								>
									{#snippet cell({ cell, row })}
																	
											<div class="w-full h-full" id={row.id}>
												{cell.value}
											</div>
										
																	{/snippet}
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
	title="Техніка"
	model={new Tech()}
	handleSubmit={createTechRenderer}
	bind:open={createOpen}
	requiredFields={['name']}
/>

<ModalCreate
	title="Підтехніка"
	model={new Subtech()}
	handleSubmit={createSubtechRenderer}
	bind:open={createSubtechOpen}
	requiredFields={['name']}
	exclude={['tech']}
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
