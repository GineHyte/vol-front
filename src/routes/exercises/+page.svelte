<script>
	import { DataTable } from 'carbon-components-svelte';
</script>

<DataTable
	expandable
	headers={[
		{ key: 'name', value: 'Назва техніки' },
		{ key: 'actions', value: 'Кількість дій' },
	]}
	rows={[
		{
			id: 1,
			name: 'Подача',
			actions: 84,
		},
	]}
>
	<svelte:fragment slot="expanded-row" let:row>
		<DataTable
			sortable
			headers={[
				{ key: 'name', value: 'Назва під-техніки' },
				{ key: 'actions', value: 'Кількість дій' },
			]}
			rows={[
				{
					id: 1,
					name: 'Подача 1',
					actions: 13,
				},
				{
					id: 2,
					name: 'Подача 2',
					actions: 43,
				},
			]}
		/>
	</svelte:fragment>
</DataTable>
