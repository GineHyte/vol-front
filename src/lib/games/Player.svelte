<script>
	export let left;
	export let top;
	export let title;

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
</script>

<button
	class="absolute rounded-full bg-red-800 w-12 h-12
font-bold text-lg text-white flex justify-center items-center"
	style="left:{left}px;top:{top}px"
	on:click={() => dispatch('select')}
>
	{title}
</button>
