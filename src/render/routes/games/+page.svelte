<script lang="ts">
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
	} from 'carbon-components-svelte';
	import {
		getGames,
		getGame,
		createGame,
		deleteGame,
		getActions,
		getAction,
		getSubtechs,
		getTechs,
		createAction,
		deleteAction,
	} from '$lib/scripts/endpoints';
	import { Game, Action } from '$lib/scripts/models';
	import { PaginationProps } from '$lib/scripts/pagination';
	import ModalCreate from '$lib/ui/ModalCreate.svelte';
	import { pushNotification } from '$lib/utils/utils';
	import Field from '$lib/games/Field.svelte';
	import ContextMenuSideList from '$lib/ui/ContextMenuSideList.svelte';
	import { Impact, Side } from '$lib/utils/utils';

	let gameId: number | undefined = undefined;
	let createOpen = false;
	let selectedTech: number = -1;
	let selectedSubtech: number = -1;
	let selectedImpact: string = '';
	let selectedZones: number[] = [];
	let selectedSide: Side = Side.NOTSET;
	let selectedPlayer: number = -1;
	let zoneEnabled: number = 0;
	let actionTableUpdate = false;
	let actionsPage = 1;
	let actionsPageSize = 10;
	let targetForActions: any;
	let actionOrder = 0;

	let localGame: Game | undefined = undefined;

	async function getGameLocal(gameIdLocal: number) {
		localGame = await getGame(gameIdLocal);
		return localGame;
	}

	function selectGame(id: number) {
		gameId = id;
	}

	async function duplicateGame(currentId: number) {
		if (currentId) {
			let game = await getGame(currentId);
			let status = await createGame(game);
			if (status.status.originalType.value === 'success') {
				pushNotification({
					title: 'Успіх!',
					message: 'Гра дубльована.',
					kind: 'success',
				});
			} else {
				pushNotification({
					title: 'Помилка!',
					message: 'Гра не може бути дубльована.',
					kind: 'error',
				});
			}
		}
	}

	async function removeGame(currentId: number) {
		if (currentId) {
			let status = await deleteGame(currentId);
			if (status.status.originalType.value === 'success') {
				pushNotification({
					title: 'Успіх!',
					message: 'Гра видалена.',
					kind: 'success',
				});
			} else {
				pushNotification({
					title: 'Помилка!',
					message: 'Гра не може бути видалена.',
					kind: 'error',
				});
			}
		}
	}

	async function createGameRenderer(inputData: any) {
		let game = new Game();
		Object.keys(inputData).forEach((key) => {
			// @ts-ignore
			game[key as keyof Game].originalType.value = inputData[key];
		});
		let status = await createGame(game);
		if (status.status.originalType.value === 'success') {
			pushNotification({
				title: 'Успіх!',
				message: 'Ви створили нову гру.',
				kind: 'success',
			});
		} else {
			pushNotification({
				title: 'Помилка!',
				message: 'Гра не може бути створена.',
				kind: 'error',
			});
		}
		createOpen = false;
	}

	async function submitAction() {
		let action = new Action();
		action.game.originalType.value = gameId;
		action.team.originalType.value =
			selectedSide === Side.LEFT
				? localGame?.teamA.originalType.value
				: localGame?.teamB.originalType.value;
		action.player.originalType.value = selectedPlayer;
		action.subtech.originalType.value = selectedSubtech;
		action.from_zone.originalType.value = selectedZones[0];
		action.to_zone.originalType.value = selectedZones[1];
		action.impact.originalType.value = selectedImpact;

		let status = await createAction(action);
		if (status.status.originalType.value === 'success') {
			pushNotification({
				title: 'Успіх!',
				message: 'Дія створена.',
				kind: 'success',
			});
		} else {
			pushNotification({
				title: 'Помилка!',
				message: 'Дія не може бути створена.',
				kind: 'error',
			});
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
			if (status.status.originalType.value === 'success') {
				pushNotification({
					title: 'Успіх!',
					message: 'Дія дубльована.',
					kind: 'success',
				});
			} else {
				pushNotification({
					title: 'Помилка!',
					message: 'Дія не може бути дубльована.',
					kind: 'error',
				});
			}
		}
	}

	async function removeAction(currentId: number) {
		if (currentId) {
			let status = await deleteAction(currentId);
			if (status.status.originalType.value === 'success') {
				pushNotification({
					title: 'Успіх!',
					message: 'Дія видалена.',
					kind: 'success',
				});
			} else {
				pushNotification({
					title: 'Помилка!',
					message: 'Гра не може бути видалена.',
					kind: 'error',
				});
			}
		}
	}

	async function goBack() {
		actionOrder -= 1;
	}

	$: if (selectedImpact !== '') {
		zoneEnabled = selectedSide;
	}
</script>

{#if gameId}
	<Content>
		<Grid>
			{#await getGameLocal(gameId)}
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
										<svelte:fragment slot="cell" let:cell let:row>
											<button
												on:click={() => {
													actionOrder = 2;
													selectedTech = row.id;
												}}
											>
												{cell.value}
											</button>
										</svelte:fragment>
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
										<svelte:fragment slot="cell" let:cell let:row>
											<button
												on:click={() => {
													actionOrder = 3;
													selectedSubtech = row.id;
												}}
											>
												{cell.value}
											</button>
										</svelte:fragment>
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
									<svelte:fragment slot="cell" let:cell let:row>
										<button
											on:click={() => {
												actionOrder = 4;
												selectedImpact = row.id;
											}}
										>
											{cell.value}
										</button>
									</svelte:fragment>
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
						{#if game.description.originalType.value}
							<span>Опис: {game.description.originalType.value}</span>
						{/if}
						<Button class="absolute bottom-4 left-4" on:click={goBack}>Назад</Button>
					</Column>
				</Row>
				<Row>
					<div class="w-full h-full mt-8" bind:this={targetForActions}>
						{#key actionTableUpdate}
							{#await getActions(gameId, new PaginationProps(actionsPage, actionsPageSize))}
								<DataTableSkeleton />
							{:then actions}
								<DataTable
									sortable
									headers={actions.getHeaders()}
									rows={actions.getRows()}
								>
									<svelte:fragment slot="cell" let:cell let:row>
										<div class="w-full h-full" id={row.id}>
											{cell.value}
										</div>
									</svelte:fragment>
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

<ModalCreate
	label="game"
	title="Гра"
	model={new Game()}
	handleSubmit={createGameRenderer}
	bind:open={createOpen}
	requiredFields={['name', 'teamA', 'teamB']}
/>

{#key createOpen}
	<SideList
		bind:currentId={gameId}
		title="Гра"
		deleteFunc={removeGame}
		duplicateFunc={duplicateGame}
		newFunc={() => {
			createOpen = true;
		}}
		getFunc={getGames}
		selectFunc={selectGame}
		headers={[{ key: 'name', value: 'Назва' }]}
	/>
{/key}
