<script>
	import { Button, Grid, Row, Column } from 'carbon-components-svelte';
	import { CaretLeft, CaretRight } from 'carbon-icons-svelte';

	export let page = 1;
	export let total = 1;
</script>

<div class="w-full flex justify-between items-center">
	<Button
		kind="ghost"
		tooltipPosition="right"
		iconDescription="Previous"
		icon={CaretLeft}
		disabled={page == 1}
		on:click={() => {
			page = page - 1;
		}}
	/>
	<span>{page}</span>
	<Button
		kind="ghost"
		tooltipPosition="left"
		iconDescription="Next"
		icon={CaretRight}
		disabled={page == total}
		on:click={() => {
			page = page + 1;
		}}
	/>
</div>
