<script lang="ts">
	import {
		ComposedModal,
		ModalHeader,
		ModalBody,
		ModalFooter,
		NumberInput,
		TextInput,
		Tile,
		Button,
		DatePicker,
		TimePicker,
		Checkbox,
		DatePickerInput,
	} from 'carbon-components-svelte';

	import { getPlayer, getSubtech, getTeam } from '$lib/scripts/endpoints';
	import { Amplua } from '$lib/utils/utils';
	import Model from '$lib/scripts/model';
	import Field from '$lib/scripts/field';
	import ModalCreateRelation from '$lib/ui/ModalCreateRelation.svelte';

	export let label = '';
	export let title = '+ ';
	export let model: Model;
	export let requiredFields: string[] = ['all'];
	export let handleSubmit: (e: Event) => Promise<void>;
	export let open: boolean = false;
	export let excludeFields: string[] = [];

	let data: any[] = [];
	let inputData: any = {};
	let openRelations: { [key: string]: boolean } = {};
	title = '+ ' + title;

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
			ge: field.originalType.ge,
			le: field.originalType.le,
		};
		data.push(item);
	});

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

	async function getPrimaryButtonDisabled() {
		let primaryButtonDisabled = false;

		requiredFields.forEach((field) => {
			if (!Object.keys(inputData).includes(field)) {
				primaryButtonDisabled = true;
			}
		});

		return primaryButtonDisabled;
	}

	$: console.log('openRelations: ', openRelations);
	$: console.log('Modal Create Open: ', open);
</script>

{#if open}
	<ComposedModal
		size={'lg'}
		bind:open
		on:submit={async () => {
			await handleSubmit(inputData);
			inputData = {};
		}}
	>
		<ModalHeader {title} />
		<ModalBody hasForm>
			{#each data.filter((item) => !excludeFields.includes(item.key)) as item}
				{#if item.type === 'number' && !item.relation}
					<NumberInput
						id={item.key}
						label={item.title}
						value={0}
						min={item.ge ? item.ge : undefined}
						max={item.le ? item.le : undefined}
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
				{#if item.relation}
					{#if inputData[item.key]}
						{#if item.type === 'array'}
							{#each inputData[item.key] as relation}
								{#if label === 'team'}
									{#await getPlayer(relation[0])}
										<Tile>
											{relation[0]}
										</Tile>
									{:then player}
										<Tile>
											{player.firstName.originalType.value}
											{player.lastName.originalType.value}
											{Amplua[relation[1]]}
										</Tile>
									{/await}
								{/if}
							{/each}
						{:else}
							<!-- not an array -->
							{#if item.relation.jsRelation === 'teams'}
								{#await getTeam(inputData[item.key])}
									<Tile>
										{inputData[item.key]}
									</Tile>
								{:then team}
									<Tile>
										{team.name.originalType.value}
									</Tile>
								{/await}
							{:else if item.relation.jsRelation === 'subtechs'}
								{#await getSubtech(inputData[item.key])}
									<Tile>
										{inputData[item.key]}
									</Tile>
								{:then subtech}
									<Tile>
										{subtech.name.originalType.value}
									</Tile>
								{/await}
							{:else}
								<Tile>
									{inputData[item.key]}
								</Tile>
							{/if}
						{/if}
					{/if}
					<Button
						class="mt-4"
						on:click={() => {
							openRelations[item.key] = true;
						}}
					>
						Вибрати {item.title}
					</Button>
				{/if}
			{/each}
		</ModalBody>
		{#key inputData}
			{#await getPrimaryButtonDisabled()}
				<ModalFooter primaryButtonText="Готово" primaryButtonDisabled={true} />
			{:then primaryButtonDisabled}
				<ModalFooter primaryButtonText="Готово" {primaryButtonDisabled} />
			{/await}
		{/key}
	</ComposedModal>
{/if}
{#each data as item}
	{#if item.relation}
		<ModalCreateRelation
			relation={item.relation}
			selectedRelation={inputData[item.key] || []}
			open={openRelations[item.key] || false}
			on:close={() => {
				openRelations[item.key] = false;
				open = true;
			}}
			on:submit={(selectedRelation) => {
				if (item.type === 'array') {
					if (Array.isArray(inputData[item.key])) {
						inputData[item.key] = [...inputData[item.key], selectedRelation.detail];
					} else {
						inputData[item.key] = [selectedRelation.detail];
					}
				} else {
					inputData[item.key] = selectedRelation.detail[0];
				}
			}}
		/>
	{/if}
{/each}
