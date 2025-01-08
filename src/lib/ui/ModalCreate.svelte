<script lang="ts">
	export let label = '';
	export let title = 'New';
	export let model: Model;
	export let requiredFields: string[] = ['all'];
	export let handleSubmit: (e: Event) => void;
	export let open: boolean = false;

	import Model from '$lib/scripts/model';
	import Field from '$lib/scripts/field';
	import {
		ComposedModal,
		ModalHeader,
		ModalBody,
		ModalFooter,
		NumberInput,
		TextInput,
		Tile,
		Button,
	} from 'carbon-components-svelte';
	import ModalCreateRelation from './ModalCreateRelation.svelte';

	let data: any[] = [];
	let inputData: any = {};
	let openRelations: { [key: string]: boolean } = {};

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
			{#if item.type === 'array' && item.relation}
				{#if inputData[item.key]}
					{#each inputData[item.key] as relation}
						<Tile>{relation}</Tile>
					{/each}
				{/if}
				<Button class="mt-4" on:click={() => (openRelations[item.key] = true)}>
					Вибрати {item.title}
				</Button>
			{/if}
		{/each}
	</ModalBody>
	<ModalFooter primaryButtonText="Готово" {primaryButtonDisabled} />
</ComposedModal>

{#each data as item}
	{#if item.type === 'array' && item.relation}
		<ModalCreateRelation
			relation={item.relation}
			selectedRelation={inputData[item.key] || []}
			open={openRelations[item.key] || false}
			bind:parentOpen={open}
			on:submit={(selectedRelation) => {
				console.log(inputData);
				if (Array.isArray(inputData[item.key])) {
					inputData[item.key].push(selectedRelation.detail);
				} else {
					inputData[item.key] = [selectedRelation.detail];
				}
			}}
		/>
	{/if}
{/each}
