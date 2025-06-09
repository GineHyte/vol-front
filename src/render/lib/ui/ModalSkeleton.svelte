<script lang="ts">
	import {
		ComposedModal,
		ModalHeader,
		ModalBody,
		ModalFooter,
		NumberInputSkeleton,
		TextInputSkeleton,
		TextAreaSkeleton,
		CheckboxSkeleton,
		DatePickerSkeleton,
	} from 'carbon-components-svelte';

	import Model from '$lib/scripts/model';
	import { t } from '$lib/utils/utils';

	interface Props {
		title?: string;
		model: Model;
		exclude?: string[];
		createRelationField?: import('svelte').Snippet;
		modalCreateRelation?: import('svelte').Snippet;
	}

	let {
		title = $bindable('+ '),
		model = $bindable(),
		exclude = [],
		createRelationField,
		modalCreateRelation,
	}: Props = $props();

	title = '... ' + title;
	exclude.push('id');

	function getPrimaryButtonDisabled() {
		let primaryButtonDisabled = false;

		return primaryButtonDisabled;
	}
</script>

<ComposedModal size={'lg'} open={true}>
	<ModalHeader {title} />
	<ModalBody hasForm>
		{#each model.getCreationArray(exclude) as item}
			{#if item.type === 'number'}
				<NumberInputSkeleton />
			{:else if item.type === 'string'}
				<TextInputSkeleton />
			{:else if item.type === 'bigstring'}
				<TextAreaSkeleton />
			{:else if item.type === 'boolean'}
				<CheckboxSkeleton />
			{:else if item.type === 'datetime'}
				<div class="flex w-44 mt-6">
					<DatePickerSkeleton />
				</div>
			{/if}
		{/each}
		{@render createRelationField?.()}
	</ModalBody>
	{#key model}
		<ModalFooter
			primaryButtonText={t('common.done')}
			primaryButtonDisabled={getPrimaryButtonDisabled()}
		/>
	{/key}
</ComposedModal>
{@render modalCreateRelation?.()}
