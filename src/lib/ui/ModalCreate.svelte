<script lang="ts">
	export let label = '';
	export let title = 'New';
	export let model: Model;
	export let requiredFields: string[] = ['all'];
	export let handleSubmit: (e: Event) => void;
	export let open: boolean = false;
	export let tableUpdate: boolean = false;

	import Model from '$lib/scripts/model';
	import Field from '$lib/scripts/field';
	import {
		ComposedModal,
		ModalHeader,
		ModalBody,
		ModalFooter,
		NumberInput,
		TextInput,
		Dropdown,
		SelectableTile,
	} from 'carbon-components-svelte';
	import { IbmCloudSecurityComplianceCenterWorkloadProtection } from 'carbon-icons-svelte';

	let data: any[] = [];
	let inputData: any = {};

	if (requiredFields.includes('all')) {
		requiredFields = Object.keys(model).filter((key) => {
			return model[key as keyof Model] instanceof Field && key !== 'id';
		});
	}

	Object.keys(model).forEach((key) => {
		if (!(model[key as keyof Model] instanceof Field) || key === 'id') {
			return;
		}
		// @ts-ignore
		const field = model[key as keyof Model] as Field;
		let item = {
			type: field.originalType.jsType,
			title: field.tableTitle,
			key: field.deserializationAlias,
			relation: field.relation,
		};
		data.push(item);
	});

	let primaryButtonDisabled = true;

	function handleDropdownInput(e: CustomEvent) {
		inputData[e.detail.selectedItem.key] = e.detail.selectedId;
		primaryButtonDisabled = false;

		requiredFields.forEach((field) => {
			if (!Object.keys(inputData).includes(field)) {
				primaryButtonDisabled = true;
			}
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

		primaryButtonDisabled = false;

		requiredFields.forEach((field) => {
			if (!Object.keys(inputData).includes(field)) {
				primaryButtonDisabled = true;
			}
		});
	}
</script>

<ComposedModal
	size={'lg'}
	bind:open
	on:submit={() => {
		handleSubmit(inputData);
		tableUpdate = !tableUpdate;
	}}
>
	<ModalHeader {label} {title} />
	<ModalBody hasForm>
		<!-- TODO: make dropdowns dynamic -->
		{#each data as item}
			{#if item.type === 'number'}
				<NumberInput
					id={item.key}
					label={item.title}
					value={0}
					on:input={(_) => handleInput(item.key)}
				/>
			{:else if item.type === 'string'}
				<!-- @ts-ignore -->
				<TextInput
					id={item.key}
					labelText={item.title}
					on:input={(_) => handleInput(item.key)}
				/>
			{/if}
		{/each}
	</ModalBody>
	<ModalFooter primaryButtonText="Готово" {primaryButtonDisabled} />
</ComposedModal>
