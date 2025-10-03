<script lang="ts">
	import { Button, Tile } from 'carbon-components-svelte';
	import { Action, ActionsBatchUpdateOptions, Game, Team } from '$lib/scripts/models';
	import {
		batchEditActions,
		editGame,
		getAction,
		getGame,
		getTeams,
	} from '$lib/scripts/endpoints';
	import ModalCreateRelation from '$lib/ui/ModalCreateRelation.svelte';
	import ModalEdit from '@/render/lib/ui/ModalEdit.svelte';
	import { pushNotification } from '$lib/utils/utils';
	import { t } from '$lib/utils/utils';
	import { Pagination, PaginationProps } from '$lib/scripts/pagination';
	import ModalSkeleton from '@/render/lib/ui/ModalSkeleton.svelte';

	interface Props {
		editActions?: Action[];
		editOpen?: boolean;
		teamA?: number;
		teamB?: number;
	}

	let { editActions, editOpen = $bindable(false), teamA, teamB }: Props = $props();

	let action = $state(new Action());
	let team = $state(new Team());

	async function pullActions() {
		if (editActions) {
		}
	}

	async function batchEditActionsRenderer() {
		let batchOptions = new ActionsBatchUpdateOptions();
		batchOptions.actions = editActions;
		batchOptions.mainAction = action;
		let status = await batchEditActions(batchOptions);
		if (status.status === 'success') {
			pushNotification('editGameSuccess');
		} else {
			pushNotification('editGameError');
		}
		editOpen = false;
	}
</script>

{#if editOpen}
	{#await pullActions()}
		<ModalSkeleton model={action} title={t('titles.action')} />
	{:then _}
		<ModalEdit
			title={t('titles.action')}
			bind:model={action}
			onSubmit={batchEditActionsRenderer}
			bind:open={editOpen}
		>
			{#snippet createRelationField()}
				<Tile>{t('buttons.selectTeamB')}: {team.name}</Tile>
				<Button
					class="mt-4"
					on:click={() => {
						selectTeamAOpen = true;
					}}
				>
					{t('buttons.selectTeamA')}
				</Button>
				<Button
					class="mt-4"
					on:click={() => {
						selectTeamBOpen = true;
					}}
					disabled={!teamA}
				>
					{t('buttons.selectTeamB')}
				</Button>
			{/snippet}
		</ModalEdit>
	{/await}
{/if}
