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
	} from 'carbon-components-svelte';
	import {
		getPlayers,
		getPlayer,
		createPlayer,
		deletePlayer,
		getGames,
	} from '$lib/scripts/endpoints';
	import { PaginationProps } from '$lib/scripts/pagination';
	import { Player } from '$lib/scripts/models';
	import ModalCreate from '$lib/ui/ModalCreate.svelte';
	import { pushNotification } from '$lib/utils/utils';

	let playerId: number | undefined = undefined;
	let createOpen = false;
	let sideListUpdater: boolean = false;

	function selectPlayer(id: number) {
		playerId = id;
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
		playerId = undefined;
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

{#if playerId}
	<Content>
		<Grid>
			<Row class="min-h-96 m-4">
				{#await getPlayer(playerId)}
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
				{/await}
			</Row>
			<Row>
				<Column>
					{#await getGames(new PaginationProps(), undefined, playerId)}
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
	>
		<svelte:fragment slot="createRelationField" />
		<svelte:fragment slot="modalCreateRelation" />
	</ModalCreate>
{/if}
{#key sideListUpdater}
	<SideList
		bind:currentId={playerId}
		title="Гравець"
		deleteFunc={removePlayer}
		duplicateFunc={duplicatePlayer}
		newFunc={() => {
			createOpen = true;
		}}
		getFunc={getPlayers}
		selectFunc={selectPlayer}
		headers={[{ key: 'firstName', value: "Ім'я" }]}
	/>
{/key}
