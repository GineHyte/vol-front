<script lang="ts">
	import {
		ComposedModal,
		ModalHeader,
		ModalBody,
		ModalFooter,
		NumberInput,
		TextInput,
		DatePicker,
		TimePicker,
		Checkbox,
		DatePickerInput,
		TextArea,
	} from 'carbon-components-svelte';

	import Model from '$lib/scripts/model';
	import Field from '$lib/scripts/field';
	import { createEventDispatcher } from 'svelte';
	import { t } from '$lib/utils/utils';

	interface Props {
		title?: string;
		model: Model;
		requiredFields?: string[];
		handleSubmit: (e: Event) => Promise<void>;
		open?: boolean;
		exclude?: string[];
		createRelationField?: import('svelte').Snippet;
		modalCreateRelation?: import('svelte').Snippet;
	}

	let {
		title = $bindable('+ '),
		model,
		requiredFields = $bindable(['all']),
		handleSubmit,
		open = $bindable(false),
		exclude = [],
		createRelationField,
		modalCreateRelation,
	}: Props = $props();

	let inputData: any = $state({});
	const dispatch = createEventDispatcher();
	title = '+ ' + title;
	exclude.push('id');

	if (requiredFields.includes('all')) {
		requiredFields = Object.keys(model).filter((key) => {
			return model[key as keyof Model] instanceof Field && key !== 'id';
		});
	}

	function handleInput(id: string) {
		// workaround for Carbon Design System Custom Events
		let target = document.getElementById(id) as HTMLInputElement;
		let value = target.value;
		inputData[id] = value;
		if (inputData[id] === '') {
			delete inputData[id];
		}
	}

	function handleCheckbox(id: string) {
		let target = document.getElementById(id) as HTMLInputElement;
		let value = target.checked;
		inputData[id] = value;
	}

	function handleDatePicker(id: string) {
		let date = document.getElementById(id + 'date') as HTMLInputElement;
		let time = document.getElementById(id + 'time') as HTMLInputElement;
		inputData[id] = date.value + ' ' + time.value;
	}

	function getPrimaryButtonDisabled() {
		let primaryButtonDisabled = false;

		requiredFields.forEach((field) => {
			if (!Object.keys(inputData).includes(field)) {
				primaryButtonDisabled = true;
			}
		});

		return primaryButtonDisabled;
	}
</script>

{#if open}
	<ComposedModal
		size={'lg'}
		bind:open
		on:submit={async () => {
			await handleSubmit(inputData);
			inputData = {};
		}}
		on:close={() => {
			inputData = {};
			dispatch('close');
		}}
	>
		<ModalHeader {title} />
		<ModalBody hasForm>
			{#each model.getCreationArray(exclude) as item}
				{#if item.type === 'number'}
					<NumberInput
						id={item.key}
						label={item.title}
						value={0}
						on:input={(_) => handleInput(item.key)}
					/>
				{:else if item.type === 'string'}
					<TextInput
						id={item.key}
						labelText={item.title}
						on:input={(_) => handleInput(item.key)}
					/>
				{:else if item.type === 'bigstring'}
					<TextArea
						id={item.key}
						labelText={item.title}
						on:input={(_) => handleInput(item.key)}
					/>
				{:else if item.type === 'boolean'}
					<Checkbox
						id={item.key}
						labelText={item.title}
						on:change={(_) => handleCheckbox(item.key)}
					/>
				{:else if item.type === 'datetime'}
					<DatePicker
						datePickerType="single"
						on:change={(_) => handleDatePicker(item.key)}
					>
						<DatePickerInput
							id={item.key + 'date'}
							labelText={item.title}
							placeholder="mm/dd/yyyy"
						/>
					</DatePicker>
					<TimePicker
						id={item.key + 'time'}
						placeholder="hh:mm"
						pattern="([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9](\\s)?"
						on:change={(_) => handleDatePicker(item.key)}
					/>
				{/if}
			{/each}
			{@render createRelationField?.()}
		</ModalBody>
		{#key inputData}
			<ModalFooter
				primaryButtonText={t('common.done')}
				primaryButtonDisabled={getPrimaryButtonDisabled()}
			/>
		{/key}
	</ComposedModal>
{/if}
{@render modalCreateRelation?.()}
