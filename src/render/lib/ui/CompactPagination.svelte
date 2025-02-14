<script lang="ts">
	import { Button, Grid, Row, Column } from 'carbon-components-svelte';
	import { CaretLeft, CaretRight } from 'carbon-icons-svelte';

	interface Props {
		page?: number;
		total?: number;
	}

	let { page = $bindable(1), total = 1 }: Props = $props();
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
