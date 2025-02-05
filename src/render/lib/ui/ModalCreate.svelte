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
	} from 'carbon-components-svelte';

	import Model from '$lib/scripts/model';
	import Field from '$lib/scripts/field';
	import { createEventDispatcher } from 'svelte';

	export let title = '+ ';
	export let model: Model;
	export let requiredFields: string[] = ['all'];
	export let handleSubmit: (e: Event) => Promise<void>;
	export let open: boolean = false;
	export let exclude: string[] = [];

	let inputData: any = {};
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
				{:else if item.type === 'boolean'}
					<Checkbox
						id={item.key}
						labelText={item.title}
						on:change={(_) => handleInput(item.key)}
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
			<slot name="createRelationField" />
		</ModalBody>
		{#key inputData}
			<ModalFooter
				primaryButtonText="Готово"
				primaryButtonDisabled={getPrimaryButtonDisabled()}
			/>
		{/key}
	</ComposedModal>
{/if}
<slot name="modalCreateRelation" />
