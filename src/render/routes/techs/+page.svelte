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
	import ContextMenu from '$lib/ui/ContextMenu.svelte';
	import { error } from '@sveltejs/kit';
	import { t } from '$lib/i18n/utils';

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

<Content>
	<Grid fullWidth>
		<Row>
			<Column>
				<div bind:this={targetForTechs}>
					{#key techTableUpdater}
						{#await getTechs(new PaginationProps(techPage, techPageSize))}
							<DataTableSkeleton />
						{:then techs}
							<DataTable
								sortable
								headers={techs.getHeaders(['id'])}
								rows={techs.getRows()}
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
												createTechOpen = true;
											}}
											class="w-full"
										>
											+ {$t('titles.tech')}
										</Button>
									</ToolbarContent>
								</Toolbar>
							</DataTable>
							<Pagination
								pageSizes={[5, 10, 20, 50]}
								bind:pageSize={techPageSize}
								bind:page={techPage}
								totalItems={techs.total}
							/>
						{/await}
					{/key}
				</div>
				<ContextMenu
					target={targetForTechs}
					deleteFunc={removeTech}
					duplicateFunc={duplicateTech}
					updateFunc={() => (techTableUpdater = !techTableUpdater)}
				/>
			</Column>
			<Column>
				{#if selectedTech}
					<Tile>
						<p>{$t('common.name')}: {selectedTech.name}</p>
					</Tile>
					<div bind:this={targetForSubtechs}>
						{#key subtechTableUpdater}
							{#await getSubtechs(selectedTech.id, new PaginationProps(subtechPage, subtechPageSize))}
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
										<ToolbarContent>
											<Button
												on:click={() => {
													createSubtechOpen = true;
												}}
												class="w-full"
											>
												+ {$t('titles.subtech')}
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
					<ContextMenu
						target={targetForSubtechs}
						deleteFunc={removeSubtech}
						duplicateFunc={duplicateSubtech}
						updateFunc={() => (subtechTableUpdate = !subtechTableUpdate)}
					/>
				{/if}
			</Column>
		</Row>
	</Grid>
</Content>

<ModalCreate
	title={$t('titles.tech')}
	model={new Tech()}
	handleSubmit={createTechRenderer}
	bind:open={createTechOpen}
/>

<ModalCreate
	title={$t('titles.subtech')}
	model={new Subtech()}
	handleSubmit={createSubtechRenderer}
	bind:open={createSubtechOpen}
/>

<ModalCreateRelation
	title={$t('titles.tech')}
	getFunc={getTechs}
	bind:open={selectionTechOpen}
	on:submit={(e) => {
		selectedTech = e.detail;
		selectionTechOpen = false;
	}}
	headers={[{ key: 'name', value: $t('common.name') }]}
	excludeHeaders={['id']}
/>

{#key createOpen}
	<SideList
		bind:selectedId={techId}
		title={$t('titles.tech')}
		deleteFunc={removeTech}
		duplicateFunc={duplicateTech}
		editFunc={() => {}}
		newFunc={() => {
			createOpen = true;
		}}
		getFunc={getTechs}
		headers={[{ key: 'name', value: $t('common.name') }]}
	/>
{/key}
