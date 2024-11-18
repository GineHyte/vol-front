<script>
	import Field from './Field.svelte';
	import SideList from '$lib/ui/SideList.svelte';
	import { Players } from '$lib/scripts/players';
</script>

<div class="flex items-center w-full justify-center p-4">
	<Field />
</div>
<SideList model={new Players()} headers={[{ first_name: 'First Name' }]} />
