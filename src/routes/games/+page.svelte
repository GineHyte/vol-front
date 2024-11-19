<script>
	import Field from '$lib/games/Field.svelte';
	import SideList from '$lib/ui/SideList.svelte';
	import { Game, Games } from '$lib/scripts/games';

	let game;

	function selectGame(id) {
		game.id = id;
	}
</script>

<div class="flex items-center w-full justify-center p-4">
	<Field bind:game />
</div>

<SideList model={new Games()} headers={[{ key: 'name', value: 'Games' }]} selectFunc={selectGame} />
