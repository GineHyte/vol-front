<!-- @migration-task Error while migrating Svelte code: Can only bind to state or props
https://svelte.dev/e/bind_invalid_value -->
<script lang="ts">
	import { getGame, createGame, deleteGame } from '$lib/scripts/endpoints';
	import { pushNotification } from '$lib/utils/utils';

	async function duplicateGameRenderer(currentId: number) {
		if (currentId) {
			let game = await getGame(currentId);
			let status = await createGame(game);
			if (status.status === 'success') {
				pushNotification('duplicateGameSuccess');
			} else {
				pushNotification('duplicateGameError');
			}
		}
	}

	async function deleteGameRenderer(currentId: number) {
		if (currentId) {
			let status = await deleteGame(currentId);
			if (status.status === 'success') {
				pushNotification('removeGameSuccess');
			} else {
				pushNotification('removeGameError');
			}
		}
	}
</script>

{#key createOpen}
	<SideList
		bind:currentId={gameId}
		title="Гра"
		deleteFunc={deleteGameRenderer}
		duplicateFunc={duplicateGameRenderer}
		newFunc={() => {
			createOpen = true;
		}}
		getFunc={getGames}
		selectFunc={selectGame}
		headers={[{ key: 'name', value: 'Назва' }]}
	/>
{/key}
