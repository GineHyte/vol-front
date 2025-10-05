<script lang="ts">
	import { run } from 'svelte/legacy';

	import {
		SkeletonPlaceholder,
		Content,
		Grid,
		Row,
		Column,
		DataTable,
		DataTableSkeleton,
		Pagination,
		Toolbar,
		Button,
	} from 'carbon-components-svelte';
	import {
		getGame,
		getActions,
		getAction,
		getSubtechs,
		getTechs,
		createAction,
		deleteAction,
	} from '$lib/scripts/endpoints';
	import type { Pagination as PaginationType } from '$lib/scripts/pagination';
	import { Game, Action } from '$lib/scripts/models';
	import { PaginationProps } from '$lib/scripts/pagination';
	import { pushNotification } from '$lib/utils/utils';
	import Field from '@/render/routes/(authed)/games/Field.svelte';
	import ContextMenu from '@/render/lib/ui/ContextMenu.svelte';
	import { Impact, Side } from '$lib/utils/utils';
	import SideListGame from '@/render/routes/(authed)/games/SideListGame.svelte';
	import { t } from '$lib/utils/utils';
	import EditActions from './EditActions.svelte';
	import type { DataTableRow } from 'carbon-components-svelte/types/DataTable/DataTable.svelte';

	let batchSelectedActions = $state([]);
	let batchUpdateActive = $state(false);
	let actionTableUpdate = $state(false);
	let actionsRowsBuffer: DataTableRow[] = $state([]);
	let targetForActions: any = $state();
	let selectedSubtech: number = $state(-1);
	let actionsPageSize = $state(10);
	let selectedGameId: number | undefined = $state(undefined);
	let selectedImpact: string = $state('');
	let selectedPlayer: number = $state(-1);
	let selectedZones: number[] = $state([]);
	let batchEditOpen = $state(false);
	let selectedTech: number = $state(-1);
	let selectedSide: Side = $state(Side.NOTSET);
	let zoneEnabled: number = $state(0);
	let actionsPage = $state(1);
	let actionOrder = $state(0);
	let teamA = $state(0);
	let teamB = $state(0);

	let localGame: Game | undefined = undefined;

	async function getGameLocal(gameIdLocal: number) {
		localGame = await getGame(gameIdLocal);
		return localGame;
	}

	function getActionRows(actions: PaginationType<Action>): DataTableRow[] {
		actionsRowsBuffer = actions.getRows();
		return actionsRowsBuffer;
	}

	async function submitAction() {
		let action = new Action();
		action.game = selectedGameId;
		action.team = selectedSide === Side.LEFT ? localGame?.teamA : localGame?.teamB;
		action.player = selectedPlayer;
		action.subtech = selectedSubtech;
		action.from_zone = selectedZones[0];
		action.to_zone = selectedZones[1];
		action.impact = selectedImpact;

		let status = await createAction(action);
		if (status.status === 'success') {
			pushNotification('createActionSuccess');
		} else {
			pushNotification('createActionError');
		}

		selectedTech = -1;
		selectedSubtech = -1;
		selectedImpact = '';
		selectedZones = [];
		selectedSide = Side.NOTSET;
		selectedPlayer = -1;
		zoneEnabled = 0;
		actionOrder = 0;
		actionTableUpdate = !actionTableUpdate;
	}

	async function duplicateAction(currentId: number) {
		if (currentId) {
			let action = await getAction(currentId);
			let status = await createAction(action);
			if (status.status === 'success') {
				pushNotification('duplicateActionSuccess');
			} else {
				pushNotification('duplicateActionError');
			}
		}
	}

	async function removeAction(currentId: number) {
		if (currentId) {
			let status = await deleteAction(currentId);
			if (status.status === 'success') {
				pushNotification('removeActionSuccess');
			} else {
				pushNotification('removeActionError');
			}
		}
	}

	async function goBack() {
		actionOrder -= 1;
	}

	run(() => {
		if (selectedImpact !== '') {
			zoneEnabled = selectedSide;
		}
	});
</script>

{#if selectedGameId}
	<Content>
		<Grid>
			{#await getGameLocal(selectedGameId)}
				<Row class="min-h-96 m-4">
					<SkeletonPlaceholder class="size-96" />
				</Row>
			{:then game}
				<Row>
					<Column>
						{#key actionOrder}
							{#if actionOrder === 1}
								{#await getTechs(new PaginationProps(1, 100))}
									<DataTableSkeleton />
								{:then techs}
									<DataTable
										useStaticWidth
										headers={[{ key: 'name', value: t('navigation.techs') }]}
										rows={techs.getRows()}
									>
										{#snippet cell({ cell, row })}
											<button
												onclick={() => {
													actionOrder = 2;
													selectedTech = row.id;
												}}
											>
												{cell.value}
											</button>
										{/snippet}
									</DataTable>
								{/await}
							{:else if actionOrder === 2}
								{#await getSubtechs(selectedTech, new PaginationProps(1, 100))}
									<DataTableSkeleton />
								{:then subtechs}
									<DataTable
										useStaticWidth
										headers={[{ key: 'name', value: t('titles.subtech') }]}
										rows={subtechs.getRows()}
									>
										{#snippet cell({ cell, row })}
											<button
												onclick={() => {
													actionOrder = 3;
													selectedSubtech = row.id;
												}}
											>
												{cell.value}
											</button>
										{/snippet}
									</DataTable>
								{/await}
							{:else if actionOrder === 3}
								<DataTable
									headers={[
										{ key: 'impact', value: t('fields.qualityIndicator') },
									]}
									rows={Object.entries(Impact).map(([key, value]) => ({
										id: key,
										impact: value,
									}))}
								>
									{#snippet cell({ cell, row })}
										<button
											onclick={() => {
												actionOrder = 4;
												selectedImpact = row.id;
											}}
										>
											{cell.value}
										</button>
									{/snippet}
								</DataTable>
							{/if}
						{/key}
					</Column>
					<Column>
						<Field
							{game}
							bind:actionOrder
							bind:selectedZones
							bind:selectedSide
							bind:selectedPlayer
							bind:zoneEnabled
							submitFunc={submitAction}
						/>
					</Column>
					<Column class="relative">
						{#if game.description}
							<span>{t('common.description')}: {game.description}</span>
						{/if}
						{#if actionOrder > 0}
							<Button class="absolute bottom-4 left-4" on:click={goBack}>
								{t('common.back')}
							</Button>
						{/if}
					</Column>
				</Row>
				<Row>
					<div class="w-full h-full mt-8" bind:this={targetForActions}>
						{#key actionTableUpdate}
							{#await getActions(selectedGameId, new PaginationProps(actionsPage, actionsPageSize))}
								<DataTableSkeleton />
							{:then actions}
								<DataTable
									selectable={batchUpdateActive}
									bind:selectedRowIds={batchSelectedActions}
									sortable
									headers={actions.getHeaders(['id'])}
									rows={getActionRows(actions)}
								>
									<Toolbar>
										<Button
											kind={batchUpdateActive ? 'primary' : 'secondary'}
											on:click={() => {
												batchUpdateActive = !batchUpdateActive;
											}}
										>
											Toggle bactch update
										</Button>
										{#if batchUpdateActive}
											<Button
												disabled={batchSelectedActions.length == 0}
												on:click={() => {
													batchEditOpen = true;
												}}
											>
												Edit selected actions
											</Button>
										{/if}
									</Toolbar>
									{#snippet cell({ cell, row })}
										<div class="w-full h-full" id={row.id}>
											{cell.value}
										</div>
									{/snippet}
								</DataTable>
								<Pagination
									pageSizes={[5, 10, 20, 50]}
									bind:pageSize={actionsPageSize}
									bind:page={actionsPage}
									totalItems={actions.total}
								/>
							{/await}
						{/key}
					</div>
					<ContextMenu
						target={targetForActions}
						deleteFunc={removeAction}
						duplicateFunc={duplicateAction}
						updateFunc={() => (actionTableUpdate = !actionTableUpdate)}
					/>
				</Row>
			{/await}
		</Grid>
	</Content>
{/if}

<SideListGame bind:selectedGameId bind:teamA bind:teamB />

<EditActions
	editActions={batchSelectedActions
		.map((id) => actionsRowsBuffer.find((action) => action.id === id))
		.filter((actionExists) => !!actionExists)}
	bind:editOpen={batchEditOpen}
	{teamA}
	{teamB}
/>
