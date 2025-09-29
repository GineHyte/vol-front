<script lang="ts">
	import { Button, Tile } from 'carbon-components-svelte';
	import { Team } from '$lib/scripts/models';
	import ModalCreateRelation from '$lib/ui/ModalCreateRelation.svelte';
	import ModalEdit from '@/render/lib/ui/ModalEdit.svelte';
	import { getAmplua, pushNotification } from '$lib/utils/utils';
	import { t } from '$lib/utils/utils';
	import { Pagination, PaginationProps } from '$lib/scripts/pagination';
	import ModalSkeleton from '@/render/lib/ui/ModalSkeleton.svelte';
	import { getPlayers, getTeam } from '@/render/lib/scripts/endpoints';
	import ModalUnderSelect from '@/render/lib/ui/ModalUnderSelect.svelte';

	interface Props {
		editTeamId?: number | undefined;
		editOpen?: boolean;
	}

	let { editTeamId, editOpen = $bindable(false) }: Props = $props();

	let team = $state(new Team());
	let selectPlayerOpen = $state(false);
	let selectPlayerAmpluaOpen = $state(false);
	let selectedPlayers: { [key: string]: any }[] = $state([]);
	let selectionPlayerObject: { [key: string]: any } = $state({});

	async function pullTeam() {
		if (editTeamId) {
			team = await getTeam(editTeamId);
		}
	}

	async function editTeamRenderer() {}
</script>

{#if editOpen}
	{#await pullTeam()}
		<ModalSkeleton model={team} title={t('titles.team')} />
	{:then _}
		<ModalEdit
			title={t('titles.team')}
			bind:model={team}
			onSubmit={editTeamRenderer}
			bind:open={editOpen}
			requiredFields={['name']}
		>
			{#snippet createRelationField()}
				{#key selectedPlayers}
					{#each selectedPlayers as selectedPlayer}
						<Tile>
							{selectedPlayer.firstName}
							{selectedPlayer.lastName} - {getAmplua()[selectedPlayer.amplua]}
						</Tile>
					{/each}
				{/key}
				<Button
					class="mt-4"
					on:click={() => {
						selectPlayerOpen = true;
					}}
				>
					{t('buttons.addPlayer')}
				</Button>
			{/snippet}
			{#snippet modalCreateRelation()}
				<ModalCreateRelation
					title={t('titles.player')}
					getFunc={getPlayers}
					bind:open={selectPlayerOpen}
					on:submit={(e) => {
						selectionPlayerObject = e.detail;
						selectPlayerOpen = false;
						selectPlayerAmpluaOpen = true;
					}}
					alreadySelectedIds={selectedPlayers.map((selectedPlayer) => selectedPlayer.id)}
					excludeHeaders={['teams', 'imageFile', 'id']}
				>
					{#snippet modalUnderSelect()}
						<ModalUnderSelect
							title={t('titles.amplua')}
							options={Object.keys(getAmplua()).map((key) => {
								return { key: key, value: getAmplua()[key] };
							})}
							bind:open={selectPlayerAmpluaOpen}
							on:submit={(e) => {
								selectionPlayerObject.amplua = e.detail;
								selectedPlayers = [...selectedPlayers, selectionPlayerObject];
								selectPlayerAmpluaOpen = false;
							}}
						/>
					{/snippet}
				</ModalCreateRelation>
			{/snippet}
		</ModalEdit>
	{/await}
{/if}
