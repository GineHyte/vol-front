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

	interface Props {
		title?: string;
		model: Model;
		requiredFields?: string[];
		open?: boolean;
		exclude?: string[];
		createRelationField?: import('svelte').Snippet;
		modalCreateRelation?: import('svelte').Snippet;
		onSubmit: (e: Event) => Promise<void>;
		onClose?: () => void;
	}

	let {
		title = $bindable('+ '),
		model = $bindable(),
		requiredFields = $bindable(['all']),
		open = $bindable(false),
		exclude = [],
		createRelationField,
		modalCreateRelation,
		onSubmit,
		onClose = () => {},
	}: Props = $props();

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
		// @ts-ignore
		model[id] = value;
	}

	function handleCheckbox(id: string) {
		let target = document.getElementById(id) as HTMLInputElement;
		let value = target.checked;
		// @ts-ignore
		model[id] = value;
	}

	function handleDatePicker(id: string) {
		let date = document.getElementById(id + 'date') as HTMLInputElement;
		let time = document.getElementById(id + 'time') as HTMLInputElement;
		// @ts-ignore
		model[id] = date.value + ' ' + time.value;
	}

	function getPrimaryButtonDisabled() {
		let primaryButtonDisabled = false;

		requiredFields.forEach((field) => {
			if (!model.__fields.includes(field)) {
				primaryButtonDisabled = true;
			}
		});

		return primaryButtonDisabled;
	}
</script>

{#if open}
	<ComposedModal size={'lg'} bind:open on:submit={onSubmit} on:close={onClose}>
		<ModalHeader {title} />
		<ModalBody hasForm>
			{#each model.getCreationArray(exclude) as item}
				{#if item.type === 'number'}
					<NumberInput
						id={item.key}
						label={item.title}
						value={item.value}
						on:input={(_) => handleInput(item.key)}
					/>
				{:else if item.type === 'string'}
					<TextInput
						id={item.key}
						labelText={item.title}
						value={item.value}
						on:input={(_) => handleInput(item.key)}
					/>
				{:else if item.type === 'bigstring'}
					<TextArea
						id={item.key}
						labelText={item.title}
						value={item.value}
						on:input={(_) => handleInput(item.key)}
					/>
				{:else if item.type === 'boolean'}
					<Checkbox
						id={item.key}
						labelText={item.title}
						checked={item.value}
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
							value={item.value}
						/>
					</DatePicker>
					<TimePicker
						id={item.key + 'time'}
						value={item.value}
						placeholder="hh:mm"
						pattern="([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9](\\s)?"
						on:change={(_) => handleDatePicker(item.key)}
					/>
				{/if}
			{/each}
			{@render createRelationField?.()}
		</ModalBody>
		{#key model}
			<ModalFooter
				primaryButtonText="Готово"
				primaryButtonDisabled={getPrimaryButtonDisabled()}
			/>
		{/key}
	</ComposedModal>
{/if}
{@render modalCreateRelation?.()}
