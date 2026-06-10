<script lang="ts">
	import { Button } from 'carbon-components-svelte';
	import { Subtech } from '$lib/scripts/models';
	import { editSubtech, getSubtech, getTechs } from '$lib/scripts/endpoints';
	import ModalCreateRelation from '$lib/ui/ModalCreateRelation.svelte';
	import ModalEdit from '@/render/lib/ui/ModalEdit.svelte';
	import ModalSkeleton from '@/render/lib/ui/ModalSkeleton.svelte';
	import { pushNotification, t } from '$lib/utils/utils';

	interface Props {
		editSubtechId?: number | undefined;
		editOpen?: boolean;
		updateTable: () => void;
	}

	let { editSubtechId, editOpen = $bindable(false), updateTable }: Props = $props();

	let subtech = $state(new Subtech());
	let selectedTech: { [key: string]: any } | undefined = $state(undefined);
	let selectTechOpen = $state(false);

	async function pullSubtech() {
		if (editSubtechId) {
			subtech = await getSubtech(editSubtechId);
			selectedTech = subtech.tech;
		}
	}

	async function editSubtechRenderer() {
		if (selectedTech) {
			subtech.tech = selectedTech.id;
		}
		let status = await editSubtech(subtech);
		if (status.status === 'success') {
			pushNotification('editSubtechSuccess');
		} else {
			pushNotification('editSubtechError');
		}
		editOpen = false;
		updateTable();
	}
</script>

{#if editOpen}
	{#await pullSubtech()}
		<ModalSkeleton model={subtech} title={t('titles.subtech')} exclude={['id', 'tech']} />
	{:then _}
		<ModalEdit
			title={t('titles.subtech')}
			bind:model={subtech}
			onSubmit={editSubtechRenderer}
			bind:open={editOpen}
			requiredFields={['name']}
			exclude={['id', 'tech']}
		>
			{#snippet createRelationField()}
				<Button
					class="mt-4"
					on:click={() => {
						selectTechOpen = true;
					}}
				>
					{t('buttons.selectTech')}: {selectedTech?.name ?? ''}
				</Button>
			{/snippet}
			{#snippet modalCreateRelation()}
				<ModalCreateRelation
					title={t('titles.tech')}
					getFunc={getTechs}
					bind:open={selectTechOpen}
					on:submit={(e) => {
						selectedTech = e.detail;
						selectTechOpen = false;
					}}
					excludeHeaders={['id']}
				/>
			{/snippet}
		</ModalEdit>
	{/await}
{/if}
