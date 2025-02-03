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
	let selectedPlayers: number[] = [];

	function selectTeam(id: number) {
		teamId = id;
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
	}

	async function createTeamRenderer(inputData: any) {
		let team = new Team();
		Object.keys(inputData).forEach((key) => {
			if (key === 'players') {
				let players: PlayerTeam[] = [];
				for (const player of inputData[key]) {
					let playerTeam = new PlayerTeam();
					playerTeam.player = player[0];
					playerTeam.team = team.id;
					playerTeam.amplua = player[1];
					players.push(playerTeam);
				}
				team.players = players;
			} else {
				// @ts-ignore
				team[key as keyof Team] = inputData[key];
			}
		});
		let status = await createTeam(team);
		if (status.status === 'success') {
			pushNotification('createTeamSuccess');
		} else {
			pushNotification('createTeamError');
		}
		createOpen = false;
	}

	async function getTeamPlayers(team: Team) {
		let players: Pagination<Player>;
		let playersData: any[] = [];
		if (team.players) {
			for (const player of team.players) {
				let playerData = await getPlayer(player.player_id);
				playersData.push(playerData);
			}
		}
		players = new Pagination(
			{ page: 1, size: 10, pages: 1, total: playersData.length, items: playersData },
			Player,
		);
		return players;
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
				{#await getTeamPlayers(team)}
					<p>Loading...</p>
				{:then players}
					<DataTable
						headers={players.getHeaders(['teams', 'imageFileId'])}
						rows={players.getRows()}
					/>
				{/await}
			{/await}
		</Grid>
	</Content>
{/if}

<ModalCreate
	title="Команда"
	model={new Team()}
	handleSubmit={createTeamRenderer}
	bind:open={createOpen}
	requiredFields={['name', 'players']}
>
	<svelte:fragment slot="createRelationField">
		{#each selectedPlayers as selectedPlayer}
			<Tile>{selectedPlayer.firstName}</Tile>
		{/each}
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
				selectedPlayers = [...selectedPlayers, e.detail];
				selectPlayerOpen = false;
			}}
			alreadySelectedIds={selectedPlayers.map((player) => player.id)}
			excludeHeaders={['teams', 'imageFile', 'id']}
			backPropagateFields={['id', 'firstName', 'lastName']}
		>
			<svelte:fragment slot="modalUnderSelect">
				<ModalUnderSelect
					title="Амплуа"
					options={[]}
					bind:open={selectPlayerOpen}
					on:submit={(e) => {
						selectedPlayers = [...selectedPlayers, e.detail];
						selectPlayerOpen = false;
					}}
				/>
			</svelte:fragment>
		</ModalCreateRelation>
	</svelte:fragment>
</ModalCreate>

{#key createOpen}
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
