<script lang="ts">
	import { pushNotification } from '$lib/utils/utils';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let target: readonly (HTMLElement | null)[] | null = null;

	import { createPlayer, getPlayer, deletePlayer } from '$lib/scripts/endpoints';

	import {
		ContextMenu,
		ContextMenuDivider,
		ContextMenuGroup,
		ContextMenuOption,
	} from 'carbon-components-svelte';

	let currentId: number | null = null;

	async function duplicate() {
		if (currentId) {
			let status = await createPlayer(await getPlayer(currentId));
			console.log(status);
			if (status.status.originalType.value === 'success') {
				pushNotification({
					title: 'Успіх!',
					message: 'Гравець дубльований.',
					kind: 'success',
				});
				dispatch('update');
			} else {
				pushNotification({
					title: 'Помилка!',
					message: 'Гравець не може бути дубльований.',
					kind: 'error',
				});
			}
		}
	}

	async function remove() {
		if (currentId) {
			let status = await deletePlayer(currentId);
			if (status.status.originalType.value === 'success') {
				pushNotification({
					title: 'Успіх!',
					message: 'Гравець видалений.',
					kind: 'success',
				});
				dispatch('update');
			} else {
				pushNotification({
					title: 'Помилка!',
					message: 'Гравець не може бути видалений.',
					kind: 'error',
				});
			}
		}
	}
</script>

{#if target !== null}
	<ContextMenu {target} on:open={(e) => (currentId = Number(e.detail.id))}>
		<ContextMenuOption indented kind="danger" labelText="Видалити" on:click={remove} />
		<ContextMenuOption indented labelText="Дублювати" on:click={duplicate} />
	</ContextMenu>
{/if}
