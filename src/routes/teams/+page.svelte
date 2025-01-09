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
		DataTableSkeleton,
		ClickableTile,
		SkeletonText,
	} from 'carbon-components-svelte';
	import { getTeams, getTeam, getPlayer, createTeam, deleteTeam } from '$lib/scripts/endpoints';
	import { Team, PlayerTeam, Player } from '$lib/scripts/models';
	import ModalCreate from '$lib/ui/ModalCreate.svelte';
	import { pushNotification } from '$lib/utils/utils';
	import { Pagination } from '$lib/scripts/pagination';

	let teamId: number | undefined = undefined;
	let createOpen = false;
	let tableUpdate = false;

	function selectTeam(id: number) {
		teamId = id;
	}

	async function duplicateTeam(dispatch: (event: string) => void, currentId: number) {
		if (currentId) {
			let team = await getTeam(currentId);
			let players: PlayerTeam[] = [];
			for (const player of team.players.originalType.value) {
				let playerTeam = new PlayerTeam();
				console.log(player);
				playerTeam.playerId.originalType.value = player;
				playerTeam.teamId.originalType.value = team.id.originalType.value;
				playerTeam.amplua.originalType.value = player.amplua.originalType.value;
				players.push(playerTeam);
			}
			team.players.originalType.value = players;
			let status = await createTeam(team);
			if (status.status.originalType.value === 'success') {
				pushNotification({
					title: 'Успіх!',
					message: 'Команда дубльована.',
					kind: 'success',
				});
				dispatch('update');
			} else {
				pushNotification({
					title: 'Помилка!',
					message: 'Команда не може бути дубльована.',
					kind: 'error',
				});
			}
		}
	}

	async function removeTeam(dispatch: (event: string) => void, currentId: number) {
		if (currentId) {
			let status = await deleteTeam(currentId);
			if (status.status.originalType.value === 'success') {
				pushNotification({
					title: 'Успіх!',
					message: 'Команда видалена.',
					kind: 'success',
				});
				dispatch('update');
			} else {
				pushNotification({
					title: 'Помилка!',
					message: 'Команда не може бути видалена.',
					kind: 'error',
				});
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
					playerTeam.playerId.originalType.value = player[0];
					playerTeam.teamId.originalType.value = team.id.originalType.value;
					playerTeam.amplua.originalType.value = player[1];
					players.push(playerTeam);
				}
				team.players.originalType.value = players;
			} else {
				// @ts-ignore
				team[key as keyof Team].originalType.value = inputData[key];
			}
		});
		let status = await createTeam(team);
		if (status.status.originalType.value === 'success') {
			pushNotification({
				title: 'Успіх!',
				message: 'Ви створили нову команду.',
				kind: 'success',
			});
		} else {
			pushNotification({
				title: 'Помилка!',
				message: 'Команда не може бути створена.',
				kind: 'error',
			});
		}
		createOpen = false;
	}

	async function getTeamPlayers(team: Team) {
		let players: Pagination<Player>;
		let playersData: any[] = [];
		if (team.players.originalType.value) {
			for (const player of team.players.originalType.value) {
				let playerData = await getPlayer(player);
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
						<p>Назва: {team.name.originalType.value}</p>
					</Column>
				</Row>
				{#await getTeamPlayers(team)}
					<p>Loading...</p>
				{:then players}
					<DataTable headers={players.getHeaders()} rows={players.getRows()} />
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
/>

{#key createOpen}
	<SideList
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
