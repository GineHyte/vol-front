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

	function selectPlayer(id: number) {
		playerId = id;
	}

	async function createPlayerRenderer() {
		let player = new Player();
		let status = await createPlayer(player);
		if (status.status.value === 'success') {
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
						<p>First Name: {player.firstName}</p>
						<p>Last Name: {player.lastName}</p>
						<p>Age: {player.age}</p>
						<p>Height: {player.height}</p>
						<p>Weight: {player.weight}</p>
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

<SideList
	newFunc={() => {
		createOpen = true;
	}}
	getFunc={getPlayers}
	selectFunc={selectPlayer}
/>

{#if createOpen}
	<ModalCreate title="+ Гравець" model={new Player()} handleSubmit={createPlayerRenderer} />
{/if}
