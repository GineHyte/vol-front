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
	} from 'carbon-components-svelte';
	import { getPlayers, getPlayer, createPlayer, deletePlayer } from '$lib/scripts/endpoints';
	import { Player } from '$lib/scripts/models';
	import ModalCreate from '$lib/ui/ModalCreate.svelte';
	import { pushNotification } from '$lib/utils/utils';

	let playerId: number | undefined = undefined;
	let createOpen = false;

	function selectPlayer(id: number) {
		playerId = id;
	}

	async function duplicatePlayer(currentId: number) {
		if (currentId) {
			let status = await createPlayer(await getPlayer(currentId));
			if (status.status.originalType.value === 'success') {
				pushNotification({
					title: 'Успіх!',
					message: 'Гравець дубльований.',
					kind: 'success',
				});
			} else {
				pushNotification({
					title: 'Помилка!',
					message: 'Гравець не може бути дубльований.',
					kind: 'error',
				});
			}
		}
	}

	async function removePlayer(currentId: number) {
		if (currentId) {
			let status = await deletePlayer(currentId);
			if (status.status.originalType.value === 'success') {
				pushNotification({
					title: 'Успіх!',
					message: 'Гравець видалений.',
					kind: 'success',
				});
			} else {
				pushNotification({
					title: 'Помилка!',
					message: 'Гравець не може бути видалений.',
					kind: 'error',
				});
			}
		}
	}

	async function createPlayerRenderer(inputData: any) {
		let player = new Player();
		Object.keys(inputData).forEach((key) => {
			// @ts-ignore
			player[key as keyof Player].originalType.value = inputData[key];
		});
		let status = await createPlayer(player);
		if (status.status.originalType.value === 'success') {
			pushNotification({
				title: 'Успіх!',
				message: 'Ви створили нового гравця.',
				kind: 'success',
			});
		} else {
			pushNotification({
				title: 'Помилка!',
				message: 'Гравець не може бути створений.',
				kind: 'error',
			});
		}
		createOpen = false;
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
						<p>Ім'я: {player.firstName.originalType.value}</p>
						<p>Прізвище: {player.lastName.originalType.value}</p>
						<p>Вік: {player.age.originalType.value}</p>
						<p>
							Зріст: {player.height.originalType.value
								? player.height.originalType.value
								: ''}
						</p>
						<p>
							Вага: {player.weight.originalType.value
								? player.weight.originalType.value
								: ''}
						</p>
					</Column>
				{/await}
			</Row>
			<Row>
				<!-- <Column>
					{#await games.get()}
						<DataTableSkeleton {headers} />
					{:then}
						<DataTable {headers} rows={games.rawData} />
					{/await}
				</Column> -->
			</Row>
		</Grid>
	</Content>
{/if}

{#if createOpen}
	<ModalCreate
		title="+ Гравець"
		model={new Player()}
		handleSubmit={createPlayerRenderer}
		bind:open={createOpen}
		requiredFields={['age', 'firstName', 'lastName']}
		excludeFields={['teams', 'imageFileId']}
	/>
{/if}
{#key createOpen}
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
