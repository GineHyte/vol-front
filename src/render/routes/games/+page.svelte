<script lang="ts">
	import { run } from 'svelte/legacy';

	import SideList from '$lib/ui/SideList.svelte';
	import {
		SkeletonPlaceholder,
		Content,
		Grid,
		Row,
		Column,
		DataTable,
		DataTableSkeleton,
		Pagination,
		Button,
		Tile,
	} from 'carbon-components-svelte';
	import {
		getGames,
		getGame,
		createGame,
		deleteGame,
		getActions,
		getAction,
		getSubtechs,
		getTeams,
		getTechs,
		createAction,
		deleteAction,
	} from '$lib/scripts/endpoints';
	import { Game, Action } from '$lib/scripts/models';
	import { PaginationProps } from '$lib/scripts/pagination';
	import ModalCreate from '$lib/ui/ModalCreate.svelte';
	import { pushNotification } from '$lib/utils/utils';
	import Field from '@/render/routes/games/Field.svelte';
	import ContextMenuSideList from '$lib/ui/ContextMenuSideList.svelte';
	import { Impact, Side } from '$lib/utils/utils';
	import ModalCreateRelation from '$lib/ui/ModalCreateRelation.svelte';
	import CreateGame from '@/render/routes/games/CreateGame.svelte';
	import SideListGame from '@/render/routes/games/SideListGame.svelte';

	let selectedGameId: number | undefined = $state(undefined);
	let createOpen = $state(false);
	let selectedTech: number = $state(-1);
	let selectedSubtech: number = $state(-1);
	let selectedImpact: string = $state('');
	let selectedZones: number[] = $state([]);
	let selectedSide: Side = $state(Side.NOTSET);
	let selectedPlayer: number = $state(-1);
	let zoneEnabled: number = $state(0);
	let actionTableUpdate = $state(false);
	let actionsPage = $state(1);
	let actionsPageSize = $state(10);
	let targetForActions: any = $state();
	let actionOrder = $state(0);
	let teamA = $state(0);
	let teamB = $state(0);
	let selectTeamAOpen = false;
	let editOpen = false;
	let editGame: number | undefined = undefined;
	let selectTeamBOpen = false;

	let localGame: Game | undefined = undefined;

	async function getGameLocal(gameIdLocal: number) {
		localGame = await getGame(gameIdLocal);
		return localGame;
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
								{#await getTechs()}
									<DataTableSkeleton />
								{:then techs}
									<DataTable
										useStaticWidth
										headers={[{ key: 'name', value: 'Технічна навичка' }]}
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
								{#await getSubtechs(selectedTech)}
									<DataTableSkeleton />
								{:then subtechs}
									<DataTable
										useStaticWidth
										headers={[{ key: 'name', value: 'Під-техніка' }]}
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
									headers={[{ key: 'impact', value: 'Якісний показник гри' }]}
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
							<span>Опис: {game.description}</span>
						{/if}
						{#if actionOrder > 0}
							<Button class="absolute bottom-4 left-4" on:click={goBack}>
								Назад
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
									sortable
									headers={actions.getHeaders(['id'])}
									rows={actions.getRows()}
								>
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
					<ContextMenuSideList
						target={targetForActions}
						deleteFunc={removeAction}
						duplicateFunc={duplicateAction}
						on:update={() => (actionTableUpdate = !actionTableUpdate)}
					/>
				</Row>
			{/await}
		</Grid>
	</Content>
{/if}

<SideListGame {selectedGameId} {createOpen} {selectGame} {editOpen} {editGame} />
