<script>
	export let amplua;
	export let left;
	export let top;

	export let selectedPlayer;

	function setSelectedPlayer() {
		selectedPlayer = 'TEST';
	}
</script>

<button
	class="absolute rounded-full bg-red-800 w-12 h-12
  font-bold text-lg text-white flex justify-center items-center"
	style="left:{left}px;top:{top}px"
	on:click={setSelectedPlayer}
>
	{amplua}
</button>
