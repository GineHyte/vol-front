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
	import { pushNotification } from '$lib/utils/utils';
	import { Pagination } from '$lib/scripts/pagination';
	import ModalCreateRelation from '$lib/ui/ModalCreateRelation.svelte';
	import ModalUnderSelect from '$lib/ui/ModalUnderSelect.svelte';
	import { Amplua } from '$lib/utils/utils';

	let teamId: number | undefined = undefined;
	let createOpen = false;
	let selectPlayerOpen = false;
	let selectPlayerAmpluaOpen = false;
	let selectedPlayers: { [key: string]: any }[] = [];
	let selectionPlayerObject: { [key: string]: any } = {};
	let sideListUpdater: boolean = false;

	function selectTeam(id: number) {
		teamId = id;
	}

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
						<p>Назва: {team.name}</p>
					</Column>
				</Row>
				<DataTable
					headers={(team.players[0] || new PlayerTeam()).getHeaders()}
					rows={team.players.map((playerTeam) => playerTeam.__tableData)}
				/>
			{/await}
		</Grid>
	</Content>
{/if}

<ModalCreate
	title="Команда"
	model={new Team()}
	handleSubmit={createTeamRenderer}
	bind:open={createOpen}
	requiredFields={['name']}
>
	<svelte:fragment slot="createRelationField">
		{#key selectedPlayers}
			{#each selectedPlayers as selectedPlayer}
				<Tile>
					{selectedPlayer.firstName}
					{selectedPlayer.lastName} - {Amplua[selectedPlayer.amplua]}
				</Tile>
			{/each}
		{/key}
		<Button
			class="mt-4"
			on:click={() => {
				selectPlayerOpen = true;
			}}
		>
			Додати гравця
		</Button>
	</svelte:fragment>
	<svelte:fragment slot="modalCreateRelation">
		<ModalCreateRelation
			title="Гравець"
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
			<svelte:fragment slot="modalUnderSelect">
				<ModalUnderSelect
					title="Амплуа"
					options={Object.keys(Amplua).map((key) => {
						return { key: key, value: Amplua[key] };
					})}
					bind:open={selectPlayerAmpluaOpen}
					on:submit={(e) => {
						selectionPlayerObject.amplua = e.detail;
						selectedPlayers = [...selectedPlayers, selectionPlayerObject];
						selectPlayerAmpluaOpen = false;
						console.log(selectedPlayers);
					}}
				/>
			</svelte:fragment>
		</ModalCreateRelation>
	</svelte:fragment>
</ModalCreate>

{#key sideListUpdater}
	<SideList
		bind:currentId={teamId}
		title="Команда"
		deleteFunc={removeTeam}
		duplicateFunc={duplicateTeam}
		newFunc={() => {
			createOpen = true;
		}}
		getFunc={getTeams}
		selectFunc={selectTeam}
		headers={[{ key: 'name', value: 'Назва' }]}
	/>
{/key}
