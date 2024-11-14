<script>
	import { Button, Modal, DataTable, DataTableSkeleton } from 'carbon-components-svelte';
	import { Player, Players } from '$lib/scripts/players.js';

	export let player; // bind player here to choose it from the list
	export let open = false; // bind open to open the modal

	let players = new Players();

	function setSelectedPlayer() {
		player = 'TEST';
	}
</script>

<Modal
	bind:open
	modalHeading="Choose a player"
	primaryButtonText="Confirm"
	secondaryButtonText="Cancel"
	on:click:button--secondary={() => (open = false)}
	on:open
	on:close
	on:submit
>
	<p>Choose a player from the list:</p>
</Modal>

{#await players.getPlayers()}
	<DataTableSkeleton />
{:then}
	<DataTable
		headers={[
			{ key: 'firstName', value: 'First Name' },
			{ key: 'secondName', value: 'Second Name' },
			{ key: 'age', value: 'Age' },
			{ key: 'height', value: 'Height' },
			{ key: 'weight', value: 'Weight' },
			{ key: 'amplua', value: 'Amplua' },
		]}
		rows={players.rawData}
	/>
{/await}
