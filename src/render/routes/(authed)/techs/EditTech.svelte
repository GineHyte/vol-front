<script lang="ts">
	import { Tech } from '$lib/scripts/models';
	import { editTech, getTech } from '$lib/scripts/endpoints';
	import ModalEdit from '@/render/lib/ui/ModalEdit.svelte';
	import ModalSkeleton from '@/render/lib/ui/ModalSkeleton.svelte';
	import { pushNotification, t } from '$lib/utils/utils';

	interface Props {
		editTechId?: number | undefined;
		editOpen?: boolean;
		updateTable: () => void;
	}

	let { editTechId, editOpen = $bindable(false), updateTable }: Props = $props();

	let tech = $state(new Tech());

	async function pullTech() {
		if (editTechId) {
			tech = await getTech(editTechId);
		}
	}

	async function editTechRenderer() {
		let status = await editTech(tech);
		if (status.status === 'success') {
			pushNotification('editTechSuccess');
		} else {
			pushNotification('editTechError');
		}
		editOpen = false;
		updateTable();
	}
</script>

{#if editOpen}
	{#await pullTech()}
		<ModalSkeleton model={tech} title={t('titles.tech')} exclude={['id']} />
	{:then _}
		<ModalEdit
			title={t('titles.tech')}
			bind:model={tech}
			onSubmit={editTechRenderer}
			bind:open={editOpen}
			requiredFields={['name']}
			exclude={['id']}
		/>
	{/await}
{/if}
