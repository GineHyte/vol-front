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
	import { getTeams, getTeam, createTeam } from '$lib/scripts/endpoints';
	import { Team, PlayerTeam } from '$lib/scripts/models';
	import ModalCreate from '$lib/ui/ModalCreate.svelte';
	import { pushNotification } from '$lib/utils/utils';

	let teamId: number | undefined = undefined;
	let createOpen = false;
	let tableUpdate = false;

	function selectTeam(id: number) {
		teamId = id;
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
</script>

{#if teamId}
	<Content>
		<Grid>
			<Row class="min-h-96 m-4">
				{#await getTeam(teamId)}
					<Column>
						<SkeletonPlaceholder class="size-96" />
					</Column>
					<Column>
						<SkeletonText paragraph lines={8} />
					</Column>
				{:then team}
					<Column>
						<ImageLoader class="size-96" ratio="4x3" fadeIn alt="Team`s photo" />
					</Column>
					<Column>
						<p>Назва: {team.name.originalType.value}</p>
					</Column>
				{/await}
			</Row>
			<Row>
				<!-- <Column>
					{#await games.get()}
						<DataTableSkeleton {headers} />
					{:then}
						<DataTable {headers} rows={games.rawData} />
					{/await}
				</Column> -->
			</Row>
		</Grid>
	</Content>
{/if}

<ModalCreate
	title="+ Команда"
	model={new Team()}
	handleSubmit={createTeamRenderer}
	bind:open={createOpen}
	requiredFields={['name', 'players']}
/>

{#key createOpen}
	<SideList
		newFunc={() => {
			createOpen = true;
		}}
		getFunc={getTeams}
		selectFunc={selectTeam}
		headers={[{ key: 'name', value: 'Назва' }]}
	/>
{/key}
