<script lang="ts">
	import { ComposedModal, ModalHeader, ModalBody } from 'carbon-components-svelte';

	interface Props {
		open?: boolean;
		title?: string;
		text?: string;
	}

	let { open = $bindable(false), title = '', text }: Props = $props();
</script>

{#if open}
	<ComposedModal
		size={'lg'}
		open={true}
		on:close={() => {
			open = false;
		}}
	>
		<ModalHeader {title} />
		<ModalBody class="text-2xl">
			{text}
		</ModalBody>
	</ComposedModal>
{/if}
