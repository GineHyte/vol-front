<script lang="ts">

	import { createEventDispatcher } from 'svelte';
	let { left, top, title } = $props();

	const dispatch = createEventDispatcher();
</script>

<button
	class="absolute rounded-full bg-red-800 w-12 h-12
font-bold text-lg text-white flex justify-center items-center"
	style="left:{left}px;top:{top}px"
	onclick={() => dispatch('select')}
>
	{title}
</button>
