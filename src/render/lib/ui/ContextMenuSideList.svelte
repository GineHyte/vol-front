<script lang="ts">
	import { ContextMenu, ContextMenuOption } from 'carbon-components-svelte';
	import { createEventDispatcher } from 'svelte';

	export let target: readonly (HTMLElement | null)[] | null = null;
	export let deleteFunc: (currentId: number) => Promise<void>;
	export let duplicateFunc: (currentId: number) => Promise<void>;

	let currentId: number | null = null;
	let dispatch = createEventDispatcher();
</script>

{#if target !== null}
	<ContextMenu
		{target}
		on:open={(e) => {
			if (e.detail.id) {
				currentId = Number(e.detail.id);
			}
		}}
	>
		<ContextMenuOption
			indented
			kind="danger"
			labelText="Видалити"
			on:click={async () => {
				if (currentId) await deleteFunc(currentId);
				dispatch('update');
			}}
		/>
		<ContextMenuOption
			indented
			labelText="Дублювати"
			on:click={async () => {
				if (currentId) await duplicateFunc(currentId);
				dispatch('update');
			}}
		/>
	</ContextMenu>
{/if}
