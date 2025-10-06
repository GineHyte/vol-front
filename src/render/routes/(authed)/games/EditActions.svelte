<script lang="ts">
	import { Button, Tile } from 'carbon-components-svelte';
	import {
		Action,
		ActionsBatchUpdateOptions,
		Game,
		ImpactRow,
		Player,
		Subtech,
		Team,
	} from '$lib/scripts/models';
	import {
		batchEditActions,
		editGame,
		getAction,
		getGame,
		getTeams,
	} from '$lib/scripts/endpoints';
	import ModalCreateRelation from '$lib/ui/ModalCreateRelation.svelte';
	import ModalEdit from '@/render/lib/ui/ModalEdit.svelte';
	import { getImpact, pushNotification } from '$lib/utils/utils';
	import { t } from '$lib/utils/utils';
	import { Pagination, PaginationProps } from '$lib/scripts/pagination';
	import ModalSkeleton from '@/render/lib/ui/ModalSkeleton.svelte';
	import type { DataTableRow } from 'carbon-components-svelte/types/DataTable/DataTable.svelte';

	interface Props {
		editActions?: DataTableRow[];
		editOpen?: boolean;
		teamA?: number;
		teamB?: number;
	}

	let { editActions, editOpen = $bindable(false), teamA, teamB }: Props = $props();

	let mainAction = $state(new Action());

	// "open" flags
	let impactSelectionOpen = $state(false);
	let teamSelectionOpen = $state(false);
	let playerSelectionOpen = $state(false);
	let subtechSelectionOpen = $state(false);

	// selected relations
	let selectedImpact = $state('');
	let selectedTeam = $state(0);
	let selectedPlayer = $state(0);
	let selectedSubtech = $state(0);

	async function pullActions() {
		if (!editActions) {
			return;
		}
		// pull the first editAction
		for (const key in editActions[0]) {
			// @ts-ignore
			mainAction[key] = editActions[key];
		}
		// check the integrity of all editActions
		for (let editAction of editActions) {
			for (const key in editAction) {
				const keyofAction = key as keyof Action;
				if (mainAction[keyofAction] != editAction[key]) {
					if (keyofAction === '__tableData') {
						continue;
					}
					mainAction[keyofAction] = null;
				}
			}
		}
	}

	async function batchEditActionsRenderer() {
		let batchOptions = new ActionsBatchUpdateOptions();
		batchOptions.actions = editActions;
		batchOptions.mainAction = mainAction;
		let status = await batchEditActions(batchOptions);
		if (status.status === 'success') {
			pushNotification('editGameSuccess');
		} else {
			pushNotification('editGameError');
		}
		editOpen = false;
	}

	async function getTeamsPagination() {
		return new Pagination<Team>(
			{ page: 1, size: 2, pages: 1, total: 2, items: [teamA, teamB] },
			Team,
		);
	}

	async function getImpactRows() {
		return new Pagination<ImpactRow>(
			{
				page: 1,
				size: 2,
				pages: 1,
				total: 2,
				items: Object.entries(getImpact).map(([key, value]) => {
					const row = new ImpactRow();
					row.id = key;
					row.impact = value;
					return row
				})),
			},
			ImpactRow,
		);
	}
</script>

{#await pullActions()}
	<ModalSkeleton model={mainAction} title={t('titles.action')} />
{:then _}
	<ModalEdit
		title={t('titles.action')}
		bind:model={mainAction}
		onSubmit={batchEditActionsRenderer}
		exclude={['impact']}
		bind:open={editOpen}
	>
		{#snippet createRelationField()}
			<Tile>Selected impact: {selectedImpact}</Tile>
			<Button
				class="mt-4"
				on:click={() => {
					impactSelectionOpen = true;
				}}
				disabled={!!selectedImpact}
			>
				Select action
			</Button>
		{/snippet}
		{#snippet modalCreateRelation()}
			{#if impactSelectionOpen}
				<ModalCreateRelation
					title={'Impact'}
					getFunc={getImpactRows}
					bind:open={impactSelectionOpen}
					on:submit={(e) => {
						selectedImpact = e.detail;
						impactSelectionOpen = false;
					}}
					excludeHeaders={['id']}
				/>
			{/if}
		{/snippet}
	</ModalEdit>
{/await}
