<script lang="ts">
	import { pushNotification } from '$lib/utils/utils';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let target: readonly (HTMLElement | null)[] | null = null;
	export let deleteFunc: (dispatch: (event: string) => void, currentId: number) => void;
	export let duplicateFunc: (dispatch: (event: string) => void, currentId: number) => void;

	import { createPlayer, getPlayer, deletePlayer } from '$lib/scripts/endpoints';

	import {
		ContextMenu,
		ContextMenuDivider,
		ContextMenuGroup,
		ContextMenuOption,
	} from 'carbon-components-svelte';

	let currentId: number | null = null;
</script>

{#if target !== null}
	<ContextMenu {target} on:open={(e) => (currentId = Number(e.detail.id))}>
		<ContextMenuOption
			indented
			kind="danger"
			labelText="Видалити"
			on:click={() => {
				if (currentId) deleteFunc(dispatch, currentId);
			}}
		/>
		<ContextMenuOption
			indented
			labelText="Дублювати"
			on:click={() => {
				if (currentId) duplicateFunc(dispatch, currentId);
			}}
		/>
	</ContextMenu>
{/if}
