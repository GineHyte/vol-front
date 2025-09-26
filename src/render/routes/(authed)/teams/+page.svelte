<script lang="ts">
	import SideList from '$lib/ui/SideList.svelte';
	import {
		SkeletonPlaceholder,
		ImageLoader,
		Content,
		Grid,
		Row,
		Column,
		DataTable,
		Tile,
		Button,
		SkeletonText,
	} from 'carbon-components-svelte';
	import {
		getTeams,
		getTeam,
		getPlayer,
		createTeam,
		deleteTeam,
		getPlayers,
	} from '$lib/scripts/endpoints';
	import { Team, PlayerTeam, Player } from '$lib/scripts/models';
	import ModalCreate from '$lib/ui/ModalCreate.svelte';
	import { pushNotification, t, getAmplua } from '$lib/utils/utils';
	import { Pagination } from '$lib/scripts/pagination';
	import ModalCreateRelation from '$lib/ui/ModalCreateRelation.svelte';
	import ModalUnderSelect from '$lib/ui/ModalUnderSelect.svelte';

	let teamId: number | undefined = $state(undefined);
	let createOpen = $state(false);
	let selectPlayerOpen = $state(false);
	let selectPlayerAmpluaOpen = $state(false);
	let selectedPlayers: { [key: string]: any }[] = $state([]);
	let selectionPlayerObject: { [key: string]: any } = $state({});
	let sideListUpdater: boolean = $state(false);

	function updateSideList() {
		sideListUpdater = !sideListUpdater;
	}

	async function duplicateTeam(currentId: number) {
		if (currentId) {
			let team = (await getTeam(currentId)) as Team;
			let status = await createTeam(team);
			if (status.status === 'success') {
				pushNotification('duplicateTeamSuccess');
			} else {
				pushNotification('duplicateTeamError');
			}
		}
		updateSideList();
	}

	async function removeTeam(currentId: number) {
		if (currentId) {
			let status = await deleteTeam(currentId);
			if (status.status === 'success') {
				pushNotification('removeTeamSuccess');
			} else {
				pushNotification('removeTeamError');
			}
		}
		teamId = undefined;
		updateSideList();
	}

	async function createTeamRenderer(inputData: any) {
		let team = new Team();
		Object.keys(inputData).forEach((key) => {
			team[key as keyof Team] = inputData[key];
		});
		selectedPlayers.forEach((selectedPlayer) => {
			let playerTeam = new PlayerTeam();
			playerTeam.player = selectedPlayer.id;
			playerTeam.amplua = selectedPlayer.amplua;
			team.players = [...(team.players || []), playerTeam];
		});
		let status = await createTeam(team);
		if (status.status === 'success') {
			pushNotification('createTeamSuccess');
		} else {
			pushNotification('createTeamError');
		}
		createOpen = false;
		selectedPlayers = [];
		updateSideList();
	}
</script>

{#if teamId}
	<Content>
		<Grid>
			{#await getTeam(teamId)}
				<Row class="min-h-96 m-4">
					<Column>
						<SkeletonPlaceholder class="size-96" />
					</Column>
					<Column>
						<SkeletonText paragraph lines={8} />
					</Column>
				</Row>
			{:then team}
				<Row>
					<Column>
						<ImageLoader class="size-96" ratio="4x3" fadeIn alt="Team`s photo" />
					</Column>
					<Column>
						<p>{t('common.name')}: {team.name}</p>
					</Column>
				</Row>
				<DataTable
					headers={(team.players[0] || new PlayerTeam()).getHeaders(['team'])}
					rows={team.players.map((playerTeam, i) => {
						let tableData = playerTeam.__tableData;
						tableData.id = i;
						return tableData;
					})}
				/>
			{/await}
		</Grid>
	</Content>
{/if}

<ModalCreate
	title={t('titles.team')}
	model={new Team()}
	handleSubmit={createTeamRenderer}
	bind:open={createOpen}
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
</ModalCreate>

{#key sideListUpdater}
	<SideList
		editFunc={() => {}}
		bind:selectedId={teamId}
		title={t('titles.team')}
		deleteFunc={removeTeam}
		duplicateFunc={duplicateTeam}
		newFunc={() => {
			createOpen = true;
		}}
		getFunc={getTeams}
		headers={[{ key: 'name', value: t('common.name') }]}
	/>
{/key}
