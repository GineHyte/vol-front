<script>
	import Field from './Field.svelte';
	import SideList from '$lib/ui/SideList.svelte';
	import { Games } from '$lib/scripts/games';
</script>

<div class="flex items-center w-full justify-center p-4">
	<Field />
</div>

<SideList model={new Games()} headers={[{ key: 'name', value: 'Games' }]} />
