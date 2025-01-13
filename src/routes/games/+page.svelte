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
	import {
		getGames,
		getGame,
		createGame,
		deleteGame,
		getActions,
		getSubtechs,
		getTechs,
	} from '$lib/scripts/endpoints';
	import { Game } from '$lib/scripts/models';
	import ModalCreate from '$lib/ui/ModalCreate.svelte';
	import { pushNotification } from '$lib/utils/utils';
	import { Pagination } from '$lib/scripts/pagination';
	import Datatype from '$lib/scripts/datatype';
	import Field from '$lib/games/Field.svelte';

	let gameId: number | undefined = undefined;
	let createOpen = false;
	let tableUpdate = false;

	function selectGame(id: number) {
		gameId = id;
	}

	async function duplicateGame(dispatch: (event: string) => void, currentId: number) {
		if (currentId) {
			let game = await getGame(currentId);
			console.log(game);
			let status = await createGame(game);
			if (status.status.originalType.value === 'success') {
				pushNotification({
					title: 'Успіх!',
					message: 'Гра дубльована.',
					kind: 'success',
				});
				dispatch('update');
			} else {
				pushNotification({
					title: 'Помилка!',
					message: 'Гра не може бути дубльована.',
					kind: 'error',
				});
			}
		}
	}

	async function removeGame(dispatch: (event: string) => void, currentId: number) {
		if (currentId) {
			let status = await deleteGame(currentId);
			if (status.status.originalType.value === 'success') {
				pushNotification({
					title: 'Успіх!',
					message: 'Гра видалена.',
					kind: 'success',
				});
				dispatch('update');
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
</script>

{#if gameId}
	<Content>
		<Grid>
			{#await getGame(gameId)}
				<Row class="min-h-96 m-4">
					<SkeletonPlaceholder class="size-96" />
				</Row>
			{:then game}
				<Row>
					<Column>
						{#await getTechs()}
							<DataTableSkeleton />
						{:then techs}
							<DataTable
								useStaticWidth
								headers={[{ key: 'name', value: 'Технічна навичка' }]}
								rows={techs.getRows()}
							/>
						{/await}
					</Column>
					<Column>
						<Field {game} />
					</Column>
					<Column />
				</Row>
				<Row>
					{#await getActions(gameId)}
						<DataTableSkeleton />
					{:then actions}
						<DataTable headers={actions.getHeaders()} rows={actions.getRows()} />
					{/await}
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
