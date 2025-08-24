<script lang="ts">
	import SideList from '$lib/ui/SideList.svelte';
	import {
		SkeletonPlaceholder,
		ImageLoader,
		Content,
		Grid,
		Row,
		Column,
		SkeletonText,
		DataTable,
		DataTableSkeleton,
		Button,
		Loading,
	} from 'carbon-components-svelte';
	import { ChartStacked, MachineLearningModel } from 'carbon-icons-svelte';
	import {
		getPlayers,
		getPlayer,
		createPlayer,
		deletePlayer,
		getGames,
		calculatePlayerStats,
		generatePlan,
	} from '$lib/scripts/endpoints';
	import { PaginationProps } from '$lib/scripts/pagination';
	import { Player } from '$lib/scripts/models';
	import ModalCreate from '$lib/ui/ModalCreate.svelte';
	import ModalEdit from '$lib/ui/ModalEdit.svelte';
	import { pushNotification } from '$lib/utils/utils';
	import Stats from './Stats.svelte';
	import Plan from './Plan.svelte';
	import { t } from '$lib/utils/utils';

	let selectedPlayerId: number | undefined = $state(undefined);
	let createOpen = $state(false);
	let editOpen = $state(false);
	let sideListUpdater: boolean = $state(false);
	let showStatistics = $state(false);
	let showPlan = $state(false);
	let playerName = $state('');
	let generatePlanLoading = $state(false);
	let calculatePlayerStatsLoading = $state(false);
	let selectionPlayerOpen = $state(false);
	let selectedPlayer: Player | undefined = $state(undefined);

	async function onGeneratePlan() {
		if (!selectedPlayerId) {
			return; // Exit early if no player selected
		}

		generatePlanLoading = true;

		try {
			const status = await generatePlan(selectedPlayerId);

			if (!status) {
				pushNotification('generatePlanError');
				return;
			}

			if (status.status === 'success') {
				pushNotification('generatePlanSuccess');
			} else {
				pushNotification('generatePlanError');
			}
		} catch (error) {
			pushNotification('generatePlanError');
		} finally {
			// This ensures generatePlanLoading is always set to false
			// regardless of success, errors, or early returns
			generatePlanLoading = false;
		}
	}

	async function onCalculatePlayerStats() {
		if (selectedPlayerId) {
			calculatePlayerStatsLoading = true;
			let status = await calculatePlayerStats(selectedPlayerId);
			if (status.status === 'success') {
				pushNotification('calculatePlayerStatsSuccess');
			} else {
				if (status.detail === 'No actions found for player') {
					pushNotification('calculatePlayerStatsNoActionError');
				} else {
					pushNotification('calculatePlayerStatsNoPlayerError');
				}
			}
			calculatePlayerStatsLoading = false;
		}
	}

	function updateSideList() {
		sideListUpdater = !sideListUpdater;
	}

	async function duplicatePlayer(currentId: number) {
		if (currentId) {
			let status = await createPlayer(await getPlayer(currentId));
			if (status.status === 'success') {
				pushNotification('duplicatePlayerSuccess');
			} else {
				pushNotification('duplicatePlayerError');
			}
		}
		updateSideList();
	}

	async function removePlayer(currentId: number) {
		if (currentId) {
			let status = await deletePlayer(currentId);
			if (status.status === 'success') {
				pushNotification('removePlayerSuccess');
			} else {
				pushNotification('removePlayerError');
			}
		}
		updateSideList();
		selectedPlayerId = undefined;
	}

	async function createPlayerRenderer(inputData: any) {
		let player = new Player();
		Object.keys(inputData).forEach((key) => {
			// @ts-ignore
			player[key as keyof Player] = inputData[key];
		});
		let status = await createPlayer(player);
		if (status.status === 'success') {
			pushNotification('createPlayerSuccess');
		} else {
			pushNotification('createPlayerError');
		}
		createOpen = false;
		updateSideList();
	}

	async function updatePlayerRenderer(inputData: any) {
		let player = new Player();
		Object.keys(inputData).forEach((key) => {
			// @ts-ignore
			player[key as keyof Player] = inputData[key];
		});
		let status = await createPlayer(player);
		if (status.status === 'success') {
			pushNotification('updatePlayerSuccess');
		} else {
			pushNotification('updatePlayerError');
		}
		editOpen = false;
		updateSideList();
	}

	async function getPlayerAndSaveName(playerId: number) {
		let player = await getPlayer(playerId);
		playerName = `${player.firstName} ${player.lastName}`;
		return player;
	}
</script>

{#if selectedPlayerId}
	<Content>
		<Grid>
			<Row class="min-h-96 m-4">
				{#await getPlayerAndSaveName(selectedPlayerId)}
					<Column>
						<SkeletonPlaceholder class="size-96" />
					</Column>
					<Column>
						<SkeletonText paragraph lines={8} />
					</Column>
				{:then player}
					<Column>
						<ImageLoader class="size-96" ratio="4x3" fadeIn alt="Player`s photo" />
					</Column>
					<Column>
						<p>{t('fields.firstName')}: {player.firstName}</p>
						<p>{t('fields.lastName')}: {player.lastName}</p>
						<p>{t('fields.age')}: {player.age}</p>
						<p>{t('fields.height')}: {player.height ? player.height : ''}</p>
						<p>{t('fields.weight')}: {player.weight ? player.weight : ''}</p>
					</Column>
					<Column>
						<div>
							<Button
								on:click={() => {
									showStatistics = !showStatistics;
								}}
							>
								{t('buttons.statistics')}
							</Button>
							{#if calculatePlayerStatsLoading}
								<Button kind="ghost" iconDescription={t('common.loading')}>
									{#snippet icon()}
										<Loading
											class="text-transparent"
											small
											withOverlay={false}
											description={t('common.loading')}
										/>
									{/snippet}
								</Button>
							{:else}
								<Button
									kind="ghost"
									iconDescription={t('buttons.calculateStats')}
									icon={ChartStacked}
									on:click={onCalculatePlayerStats}
								></Button>
							{/if}
						</div>
						<div>
							<Button
								on:click={() => {
									showPlan = !showPlan;
								}}
							>
								{t('buttons.plan')}
							</Button>
							{#if generatePlanLoading}
								<Button kind="ghost" iconDescription={t('common.loading')}>
									{#snippet icon()}
										<Loading
											class="text-transparent"
											small
											withOverlay={false}
											description={t('common.loading')}
										/>
									{/snippet}
								</Button>
							{:else}
								<Button
									kind="ghost"
									iconDescription={t('buttons.trainingPlan')}
									icon={MachineLearningModel}
									on:click={onGeneratePlan}
								></Button>
							{/if}
						</div>
					</Column>
				{/await}
			</Row>
			<Row>
				<Column>
					{#await getGames(new PaginationProps(), undefined, selectedPlayerId)}
						<DataTableSkeleton />
					{:then games}
						<DataTable headers={games.getHeaders()} rows={games.getRows()} />
					{/await}
				</Column>
			</Row>
		</Grid>
	</Content>
{/if}

{#if createOpen}
	<ModalCreate
		title={t('navigation.players')}
		model={new Player()}
		handleSubmit={createPlayerRenderer}
		bind:open={createOpen}
		requiredFields={['age', 'firstName', 'lastName']}
		exclude={['teams', 'imageFile']}
	></ModalCreate>
{/if}
{#if editOpen && selectedPlayer}
	<ModalEdit
		title={t('navigation.players')}
		model={selectedPlayer}
		handleSubmit={updatePlayerRenderer}
		bind:open={editOpen}
	></ModalEdit>
{/if}
{#key sideListUpdater}
	<SideList
		bind:selectedId={selectedPlayerId}
		title={t('navigation.players')}
		deleteFunc={removePlayer}
		duplicateFunc={duplicatePlayer}
		newFunc={() => {
			createOpen = true;
		}}
		getFunc={getPlayers}
		editFunc={(currentId: number) => {
			selectedPlayerId = currentId;
		}}
		headers={[{ key: 'firstName', value: t('fields.firstName') }]}
	/>
{/key}
{#if showStatistics && selectedPlayerId}
	<Stats bind:open={showStatistics} playerId={selectedPlayerId} />
{/if}
{#if showPlan && selectedPlayerId}
	<Plan bind:open={showPlan} playerId={selectedPlayerId} {playerName} />
{/if}
