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
	} from 'carbon-components-svelte';
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
	import { pushNotification } from '$lib/utils/utils';
	import Stats from './Stats.svelte';
	import Plan from './Plan.svelte';

	let selectedPlayerId: number | undefined = $state(undefined);
	let createOpen = $state(false);
	let sideListUpdater: boolean = $state(false);
	let showStatistics = $state(false);
	let showPlan = $state(false);

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
</script>

{#if selectedPlayerId}
	<Content>
		<Grid>
			<Row class="min-h-96 m-4">
				{#await getPlayer(selectedPlayerId)}
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
						<p>Ім'я: {player.firstName}</p>
						<p>Прізвище: {player.lastName}</p>
						<p>Вік: {player.age}</p>
						<p>Зріст: {player.height ? player.height : ''}</p>
						<p>Вага: {player.weight ? player.weight : ''}</p>
					</Column>
					<Column>
						<Button
							on:click={() => {
								showStatistics = !showStatistics;
							}}
						>
							Статистика
						</Button>
						<Button
							on:click={async () => {
								if (selectedPlayerId) {
									calculatePlayerStats(selectedPlayerId);
								}
							}}
						>
							Розрахувати статистику
						</Button>
					</Column>
					<Column>
						<Button
							on:click={() => {
								showPlan = !showPlan;
							}}
						>
							План тренувань
						</Button>
						<Button
							on:click={async () => {
								if (selectedPlayerId) {
									generatePlan(selectedPlayerId);
								}
							}}
						>
							Розрахувати План тренувань
						</Button>
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
		title="Гравець"
		model={new Player()}
		handleSubmit={createPlayerRenderer}
		bind:open={createOpen}
		requiredFields={['age', 'firstName', 'lastName']}
		exclude={['teams', 'imageFile']}
	></ModalCreate>
{/if}
{#key sideListUpdater}
	<SideList
		bind:selectedId={selectedPlayerId}
		title="Гравець"
		deleteFunc={removePlayer}
		duplicateFunc={duplicatePlayer}
		newFunc={() => {
			createOpen = true;
		}}
		getFunc={getPlayers}
		editFunc={(currentId: number) => {
			selectedPlayerId = currentId;
		}}
		headers={[{ key: 'firstName', value: "Ім'я" }]}
	/>
{/key}
{#if showStatistics && selectedPlayerId}
	<Stats bind:open={showStatistics} playerId={selectedPlayerId} />
{/if}
{#if showPlan && selectedPlayerId}
	<Plan bind:open={showPlan} playerId={selectedPlayerId} />
{/if}
