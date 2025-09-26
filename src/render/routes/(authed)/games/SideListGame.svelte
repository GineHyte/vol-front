<!-- Here are all SideList shit and also modals for Editing and Creating Models-->
<script lang="ts">
	import { getGame, createGame, deleteGame, getGames } from '$lib/scripts/endpoints';
	import { pushNotification, t } from '$lib/utils/utils';
	import SideList from '$lib/ui/SideList.svelte';
	import CreateGame from './CreateGame.svelte';
	import EditGame from './EditGame.svelte';

	let editOpen = $state(false);
	let editGame: number | undefined = $state(undefined);
	let createOpen = $state(false);

	interface Props {
		selectedGameId?: number | undefined;
		teamA?: any;
		teamB?: any;
	}

	let {
		selectedGameId = $bindable(),
		teamA = $bindable(),
		teamB = $bindable(),
	}: Props = $props();

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

	async function editGameRenderer(currentId: number) {
		if (currentId) {
			editOpen = true;
			editGame = currentId;
			selectedGameId = undefined;
		}
	}
</script>

{#key [createOpen, editOpen]}
	<SideList
		bind:selectedId={selectedGameId}
		title="Гра"
		deleteFunc={deleteGameRenderer}
		duplicateFunc={duplicateGameRenderer}
		editFunc={editGameRenderer}
		newFunc={() => {
			createOpen = true;
		}}
		getFunc={getGames}
		headers={[{ key: 'name', value: t('common.name') }]}
	/>
{/key}
<CreateGame bind:createOpen bind:teamA bind:teamB />
<EditGame editGameId={editGame} bind:editOpen bind:teamA bind:teamB />
