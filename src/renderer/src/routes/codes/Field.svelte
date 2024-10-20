<script>
  import Player from "./Player.svelte";
  import Zone from "./Zone.svelte";

  let isZoneEnabled = false;
  let isPlayersEnabled = true;
</script>

<div class="flex w-[36rem] h-[18rem] bg-amber-600 relative">
  {#if isZoneEnabled}
    <div class="grid grid-cols-2 grid-rows-3 border-white w-full">
      {#each Array.from(Array(6).keys()) as i}
        <Zone number={i}></Zone>
      {/each}
    </div>
    <div class="grid grid-cols-2 grid-rows-3 border-white w-full">
      {#each Array.from(Array(6).keys()) as i}
        <Zone number={i}></Zone>
      {/each}
    </div>
  {/if}
  {#if isPlayersEnabled}
    <Player amplua="Defender" top="10" left="10" />
    <Player amplua="Atacker" left="300" top="10" />
  {/if}
</div>
