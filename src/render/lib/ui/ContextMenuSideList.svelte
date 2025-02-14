<script lang="ts">
	import { ContextMenu, ContextMenuOption } from 'carbon-components-svelte';
	interface Props {
		[key: string]: any
	}

	let { ...props }: Props = $props();

	let { target, deleteFunc, duplicateFunc, editFunc, update: updateFunc } = props;

	let currentId: number | null = $state(null);
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
				updateFunc();
			}}
		/>
		<ContextMenuOption
			indented
			labelText="Дублювати"
			on:click={async () => {
				if (currentId) await duplicateFunc(currentId);
				updateFunc();
			}}
		/>
		<ContextMenuOption
			indented
			labelText="Редагувати"
			on:click={async () => {
				if (currentId) await editFunc(currentId);
				updateFunc();
			}}
		/>
	</ContextMenu>
{/if}
