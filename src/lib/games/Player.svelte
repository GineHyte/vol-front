<script>
	export let left;
	export let top;
	export let player;

	export let setSelectedPlayer;
</script>

<button
	class="absolute rounded-full bg-red-800 w-12 h-12
  font-bold text-lg text-white flex justify-center items-center"
	style="left:{left}px;top:{top}px"
	on:click={setSelectedPlayer}
>
	{player.firstName}
</button>
