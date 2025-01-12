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
	import {
		getTeams,
		getTeam,
		getPlayer,
		createTeam,
		deleteTeam,
		getTech,
		getTechs,
		createTech,
		deleteTech,
	} from '$lib/scripts/endpoints';
	import { Team, PlayerTeam, Player, Tech } from '$lib/scripts/models';
	import ModalCreate from '$lib/ui/ModalCreate.svelte';
	import { pushNotification } from '$lib/utils/utils';
	import { Pagination } from '$lib/scripts/pagination';
	import Datatype from '$lib/scripts/datatype';

	let techId: number | undefined = undefined;
	let createOpen = false;
	let tableUpdate = false;

	function selectTech(id: number) {
		techId = id;
	}

	async function duplicateTech(dispatch: (event: string) => void, currentId: number) {
		if (currentId) {
			let tech = await getTech(currentId);
			console.log(tech);
			let status = await createTech(tech);
			if (status.status.originalType.value === 'success') {
				pushNotification({
					title: 'Успіх!',
					message: 'Техніка дубльована.',
					kind: 'success',
				});
				dispatch('update');
			} else {
				pushNotification({
					title: 'Помилка!',
					message: 'Техніка не може бути дубльована.',
					kind: 'error',
				});
			}
		}
	}

	async function removeTech(dispatch: (event: string) => void, currentId: number) {
		if (currentId) {
			let status = await deleteTech(currentId);
			if (status.status.originalType.value === 'success') {
				pushNotification({
					title: 'Успіх!',
					message: 'Техніка видалена.',
					kind: 'success',
				});
				dispatch('update');
			} else {
				pushNotification({
					title: 'Помилка!',
					message: 'Техніка не може бути видалена.',
					kind: 'error',
				});
			}
		}
	}

	async function createTechRenderer(inputData: any) {
		let tech = new Tech();
		tech.deserialize(inputData);
		let status = await createTech(tech);
		if (status.status.originalType.value === 'success') {
			pushNotification({
				title: 'Успіх!',
				message: 'Ви створили нову техніку.',
				kind: 'success',
			});
		} else {
			pushNotification({
				title: 'Помилка!',
				message: 'Техніка не може бути створена.',
				kind: 'error',
			});
		}
		createOpen = false;
	}
</script>

{#if techId}
	<Content>
		<Grid>
			{#await getTech(techId)}
				<Row class="min-h-96 m-4">
					<Column>
						<SkeletonPlaceholder class="size-96" />
					</Column>
					<Column>
						<SkeletonText paragraph lines={8} />
					</Column>
				</Row>
			{:then tech}
				<Row>
					<Column>
						<ImageLoader class="size-96" ratio="4x3" fadeIn alt="Tech`s photo" />
					</Column>
					<Column>
						<p>Назва: {tech.name.originalType.value}</p>
					</Column>
				</Row>
			{/await}
		</Grid>
	</Content>
{/if}

<ModalCreate
	label="tech"
	title="Техніка"
	model={new Tech()}
	handleSubmit={createTechRenderer}
	bind:open={createOpen}
	requiredFields={['name', 'description']}
/>

{#key createOpen}
	<SideList
		bind:currentId={techId}
		title="Техніка"
		deleteFunc={removeTech}
		duplicateFunc={duplicateTech}
		newFunc={() => {
			createOpen = true;
		}}
		getFunc={getTechs}
		selectFunc={selectTech}
		headers={[{ key: 'name', value: 'Назва' }]}
	/>
{/key}
