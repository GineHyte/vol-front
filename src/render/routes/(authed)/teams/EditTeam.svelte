<script lang="ts">
	import { Button, Tile } from 'carbon-components-svelte';
	import { Team } from '$lib/scripts/models';
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
	import ModalCreateRelation from '$lib/ui/ModalCreateRelation.svelte';
	import ModalEdit from '@/render/lib/ui/ModalEdit.svelte';
	import { getAmplua, pushNotification } from '$lib/utils/utils';
	import { t } from '$lib/utils/utils';
	import ModalSkeleton from '@/render/lib/ui/ModalSkeleton.svelte';
	import { editTeam, getPlayer, getPlayers, getTeam } from '@/render/lib/scripts/endpoints';
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
			selectedPlayers = await Promise.all(
				team.players.map(async (playerToTeam: any) => {
					const playerObj = await getPlayer(playerToTeam.player.id);
					const amplua = playerObj.teams.find(
						(playerToTeam: any) => playerToTeam.team.id === team.id,
					).amplua;
					return { ...playerObj.__tableData, amplua };
				}),
			);
		}
	}

	async function editTeamRenderer() {
		team.players = team.players.map((playerToTeam: any) => {
			const selectedPlayer = selectedPlayers.find(
				(selectedPlayer) => selectedPlayer.id === playerToTeam.player.id,
			);
			if (selectedPlayer) {
				playerToTeam.amplua = selectedPlayer.amplua;
			} else {
				return null;
			}
			return playerToTeam;
		});
		team.players = team.players.filter((playerToTeam: any) => playerToTeam !== null);
		const status = await editTeam(team);
		if (status.status === 'success') {
			pushNotification('editTeamSuccess');
			editOpen = false;
		} else {
			pushNotification('editTeamError');
		}
	}

	function teardownVariables() {
		selectPlayerOpen = false;
		selectPlayerAmpluaOpen = false;
		selectedPlayers = [];
		selectionPlayerObject = {};
	}
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
			onClose={teardownVariables}
		>
			{#snippet createRelationField()}
				{#key selectedPlayers}
					{#each selectedPlayers as selectedPlayer}
						<Tile class="flex align-center gap-4">
							<span class="mt-4">
								{selectedPlayer.firstName}
								{selectedPlayer.lastName} - {getAmplua()[selectedPlayer.amplua]}
							</span>
							<Button
								kind="danger-tertiary"
								iconDescription="Delete"
								icon={TrashCan}
								on:click={(e) => {
									selectedPlayers = selectedPlayers.filter(
										(el) => el.id !== selectedPlayer.id,
									);
								}}
							/>
						</Tile>
					{/each}
				{/key}
				<Button
					disabled={selectedPlayers.length >= 2}
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
