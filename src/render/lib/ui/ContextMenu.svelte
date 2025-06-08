<script lang="ts">
	import { ContextMenu, ContextMenuOption } from 'carbon-components-svelte';
	import { t } from '$lib/utils/utils';

	interface Props {
		target: any;
		deleteFunc?: (currentId: number) => Promise<void>;
		duplicateFunc?: (currentId: number) => Promise<void>;
		editFunc?: (currentId: number) => Promise<void>;
		updateFunc: () => void;
	}

	let { ...props }: Props = $props();

	let { target, deleteFunc, duplicateFunc, editFunc, updateFunc } = props;

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
		{#if deleteFunc}
			<ContextMenuOption
				indented
				kind="danger"
				labelText={t('common.delete')}
				on:click={async () => {
					if (currentId) await deleteFunc(currentId);
					updateFunc();
				}}
			/>
		{/if}
		{#if duplicateFunc}
			<ContextMenuOption
				indented
				labelText={t('common.duplicate')}
				on:click={async () => {
					if (currentId) await duplicateFunc(currentId);
					updateFunc();
				}}
			/>
		{/if}
		{#if editFunc}
			<ContextMenuOption
				indented
				labelText={t('common.edit')}
				on:click={async () => {
					if (currentId) await editFunc(currentId);
					updateFunc();
				}}
			/>
		{/if}
		<ContextMenuOption indented labelText={t('common.update')} on:click={updateFunc} />
	</ContextMenu>
{/if}
