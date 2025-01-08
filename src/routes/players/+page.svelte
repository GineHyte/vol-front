<script lang="ts">
	import SideList from '$lib/ui/SideList.svelte';
	import {
		SkeletonPlaceholder,
		ImageLoader,
		Content,
		Grid,
		Row,
		Column,
		DataTable,
		DataTableSkeleton,
		ClickableTile,
		SkeletonText,
	} from 'carbon-components-svelte';
	import { getPlayers, getPlayer, createPlayer } from '$lib/scripts/endpoints';
	import { Player } from '$lib/scripts/models';
	import ModalCreate from '$lib/ui/ModalCreate.svelte';
	import { pushNotification } from '$lib/utils/utils';

	let playerId: number | undefined = undefined;
	let createOpen = false;
	let tableUpdate = false;

	function selectPlayer(id: number) {
		playerId = id;
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
	/>
{/if}

<SideList
	newFunc={() => {
		createOpen = true;
	}}
	getFunc={getPlayers}
	selectFunc={selectPlayer}
	headers={[{ key: 'firstName', value: "Ім'я" }]}
/>
