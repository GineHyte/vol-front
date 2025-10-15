<script lang="ts">
	import { Button } from 'carbon-components-svelte';
	import {
		Action,
		ActionsBatchUpdateOptions,
		ImpactRow,
		NameWithId,
		Player,
		Team,
	} from '$lib/scripts/models';
	import {
		batchEditActions,
		getPlayers,
		getTeam,
	} from '$lib/scripts/endpoints';
	import ModalCreateRelation from '$lib/ui/ModalCreateRelation.svelte';
	import ModalEdit from '@/render/lib/ui/ModalEdit.svelte';
	import { getImpact, pushNotification } from '$lib/utils/utils';
	import { t } from '$lib/utils/utils';
	import { Pagination, PaginationProps } from '$lib/scripts/pagination';
	import ModalSkeleton from '@/render/lib/ui/ModalSkeleton.svelte';
	import type { DataTableRow } from 'carbon-components-svelte/types/DataTable/DataTable.svelte';

	interface Props {
		editActions?: Action[];
		editOpen?: boolean;
		teamA?: number;
		teamB?: number;
	}

	let { editActions, editOpen = $bindable(false), teamA, teamB }: Props = $props();

	console.log(editActions)

	let mainAction = $state(new Action());
	let isLoaded = $state(false);
	let lastEditActionsId = $state(''); // Track processed actions by ID

	// "open" flags
	let impactSelectionOpen = $state(false);
	let teamSelectionOpen = $state(false);
	let playerSelectionOpen = $state(false);
	let subtechSelectionOpen = $state(false);

	// selected relations
	let selectedImpact = $state(new ImpactRow());
	let selectedTeam = $state(new NameWithId());
	let selectedPlayer: DataTableRow | NameWithId = $state(new NameWithId());
	let selectedSubtech = $state(new NameWithId());

	let selectedTeamPlayerIds: number[] = [];
	let teamAplayerIds: number[] = [];
	let teamBplayerIds: number[] = [];

	function resolveNameWithId(team: Team) {
		let playerIds: number[] = [];
		team.players = team.players.map((player: any) => {
			playerIds.push(player.player.id);
			return player.player.name;
		});
		return { team, playerIds };
	}

	async function getTeamsRenderer(pprop: PaginationProps): Promise<Pagination<any>> {
		if (!teamA || !teamB) throw new Error('team A and team are undefined');
		let teamAModel = await getTeam(teamA);
		let teamBModel = await getTeam(teamB);

		({ team: teamAModel, playerIds: teamAplayerIds } = resolveNameWithId(teamAModel));
		({ team: teamBModel, playerIds: teamBplayerIds } = resolveNameWithId(teamBModel));

		return new Pagination(
			{ page: 1, size: 2, items: [teamAModel, teamBModel], total: 2, pages: 1 },
			Team,
		);
	}

	function setSelectedTeamPlayerIds(selectedTeamId: number) {
		if (teamA === selectedTeamId) {
			selectedTeamPlayerIds = teamAplayerIds;
		} else if (teamB === selectedTeamId) {
			selectedTeamPlayerIds = teamBplayerIds;
		}
	}

	async function getPlayersRenderer(pprop: PaginationProps): Promise<Pagination<any>> {
		let players = await getPlayers(pprop);
		players.items = players.items.filter((player: Player) =>
			selectedTeamPlayerIds.includes(player.id),
		);
		return players;
	}
	function onTeamSelectionSubmit(e: CustomEvent) {
		selectedTeam = e.detail;
		teamSelectionOpen = false;

		setSelectedTeamPlayerIds(selectedTeam.id);
	}

	function onPlayerSelectionSubmit(e: CustomEvent) {
		selectedPlayer = e.detail;
		playerSelectionOpen = false;
	}

	function getSelectPlayerButtonTitle() {
		if (selectedPlayer instanceof NameWithId) {
			return `Selected player: ${selectedPlayer.name}`;
		}
		if (selectedPlayer) {
			return `Selected player: ${selectedPlayer.firstName} ${selectedPlayer.lastName}`;
		} else {
			return 'Select player';
		}
	}

	async function pullActions() {
		if (!editActions || editActions.length === 0) {
			return;
		}

		const newAction = editActions[0];

		// Store selected values before applying to main action
		let tempSelectedImpact = newAction.impact || '';
		let tempSelectedTeam = newAction.team || 0;
		let tempSelectedPlayer = newAction.player || 0;
		let tempSelectedSubtech = newAction.subtech || 0;

		// check the integrity of all editActions
		for (let editAction of editActions) {
			for (const editKey in editAction) {
				const editKeyofAction = editKey as keyof Action;
				if (newAction[editKeyofAction] != editAction[editKey]) {
					if (editKeyofAction === '__tableData') {
						continue;
					}
					newAction[editKeyofAction] = '-';
					// Reset temp values if inconsistent
					if (editKey === 'impact') tempSelectedImpact = '';
					if (editKey === 'team') tempSelectedTeam = 0;
					if (editKey === 'player') tempSelectedPlayer = 0;
					if (editKey === 'subtech') tempSelectedSubtech = 0;
				}
			}
		}

		// Apply all changes at once to minimize reactivity
		mainAction = newAction;
		selectedImpact.impact = tempSelectedImpact;
		selectedTeam.name = tempSelectedTeam;
		if (selectedPlayer instanceof NameWithId) {
			selectedPlayer.name = tempSelectedPlayer;
		}
		selectedSubtech.name = tempSelectedSubtech;
		isLoaded = true;
	}

	function updateMainActionWithSelectedModels() {
		mainAction.impact = selectedImpact.id
		mainAction.team = selectedTeam.id
		mainAction.subtech = selectedSubtech.id
		mainAction.player = selectedPlayer.id
	}

	async function batchEditActionsRenderer() {
		let batchOptions = new ActionsBatchUpdateOptions();
		batchOptions.actions = editActions?.map(action => action.id);
		batchOptions.mainAction = mainAction;
		updateMainActionWithSelectedModels()
		console.log(selectedPlayer, selectedSubtech, selectedTeam)
		let status = await batchEditActions(batchOptions);
		if (status.status === 'success') {
			pushNotification('editGameSuccess');
		} else {
			pushNotification('editGameError');
		}
		editOpen = false;
	}

	async function getImpactPagination() {
		return new Pagination<ImpactRow>(
			{
				page: 1,
				size: 2,
				pages: 1,
				total: 2,
				items: Object.entries(getImpact()).map(([key, value]) => {
					const row = new ImpactRow();
					row.id = key;
					row.impact = value;
					return row;
				}),
			},
			ImpactRow,
		);
	}

	// Only trigger when editActions actually changes
	$effect(() => {
		if (editActions && editOpen) {
			// Create a unique ID for this set of editActions to prevent re-processing
			const currentId = editActions.map((action) => action.id).join(',');
			if (currentId !== lastEditActionsId) {
				lastEditActionsId = currentId;
				isLoaded = false;
				pullActions();
			}
		} else {
			isLoaded = false;
			lastEditActionsId = '';
		}
	});
</script>

{#if !isLoaded}
	<ModalSkeleton model={mainAction} title={t('titles.action')} />
{:else}
	<ModalEdit
		title={t('titles.action')}
		requiredFields={[]}
		bind:model={mainAction}
		onSubmit={batchEditActionsRenderer}
		exclude={['impact']}
		bind:open={editOpen}
	>
		{#snippet createRelationField()}
			<Button
				class="mt-4"
				on:click={() => {
					impactSelectionOpen = true;
				}}
			>
				{selectedImpact.impact
					? 'Selected impact: '
					: 'Select impact'}{selectedImpact.impact}
			</Button>
			<Button
				class="mt-4"
				on:click={() => {
					teamSelectionOpen = true;
				}}
			>
				{selectedTeam.name ? 'Selected team: ' : 'Select team'}{selectedTeam.name}
			</Button>
			<Button
				class="mt-4"
				on:click={() => {
					playerSelectionOpen = true;
				}}
				disabled={!selectedTeam}
			>
				{getSelectPlayerButtonTitle()}
			</Button>
		{/snippet}
		{#snippet modalCreateRelation()}
			{#if impactSelectionOpen}
				<ModalCreateRelation
					title={'Impact'}
					getFunc={getImpactPagination}
					bind:open={impactSelectionOpen}
					on:submit={(e) => {
						selectedImpact = e.detail;
						impactSelectionOpen = false;
					}}
					excludeHeaders={['id']}
				/>
			{:else if teamSelectionOpen}
				<ModalCreateRelation
					title={'Team'}
					getFunc={getTeamsRenderer}
					bind:open={teamSelectionOpen}
					on:submit={onTeamSelectionSubmit}
					excludeHeaders={['id']}
				/>
			{:else if playerSelectionOpen}
				<ModalCreateRelation
					title={'Player'}
					getFunc={getPlayersRenderer}
					bind:open={playerSelectionOpen}
					on:submit={onPlayerSelectionSubmit}
					excludeHeaders={['teams', 'imageFile', 'id']}
				/>
			{:else if subtechSelectionOpen}{/if}
		{/snippet}
	</ModalEdit>
{/if}
