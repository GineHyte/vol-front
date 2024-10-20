<script>
  export let routes;
</script>

<div class="w-32 text-2xl font-bold h-full shadow-md bg-white px-1 absolute">
  <ul class="relative">
    {#each routes as route}
      <li class="relative">
        <a
          class="flex items-center px-6 h-12 text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out"
          href={route.href}>{route.title}</a
        >
      </li>
    {/each}
  </ul>
</div>
