<script>
	import { Content, Grid, Row, Column, Tile, ClickableTile } from 'carbon-components-svelte';
	import { WatsonHealthRegionAnalysisVolume } from 'carbon-icons-svelte';
	import {
		RenewTeam,
		KeyUsers,
		GpuComputing,
		AcceleratedComputing,
		AssessmentUsed,
		DesignLeadership,
	} from 'carbon-pictograms-svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import AnimTile from './AnimTile.svelte';
</script>

<Content>
	<Grid>
		<Row>
			<Column>
				<h1 class="text-3xl font-bold mb-4">
					Ласкаво просимо до системи аналізу технічних навичок у пляжному волейболі
				</h1>
				<p class="mb-6">
					Ця програма допоможе вам аналізувати, відстежувати та вдосконалювати технічні
					навички гравців.
				</p>
			</Column>
		</Row>

		<Row>
			<Column sm={4} md={4} lg={4} class="mb-4">
				<AnimTile
					href="/games"
					title="Ігри"
					text="Створюйте та аналізуйте ігри, відстежуйте дії гравців та технічні показники."
				>
					{#snippet pentogram()}
						<AcceleratedComputing />
					{/snippet}
				</AnimTile>
			</Column>

			<Column sm={4} md={4} lg={4} class="mb-4">
				<AnimTile
					href="/players"
					title="Гравці"
					text="Управління профілями гравців, перегляд статистики та створення
						індивідуальних планів тренувань."
				>
					{#snippet pentogram()}
						<KeyUsers />
					{/snippet}
				</AnimTile>
			</Column>

			<Column sm={4} md={4} lg={4} class="mb-4">
				<AnimTile
					href="/teams"
					title="Команди"
					text="Створюйте та керуйте командами, додавайте гравців та аналізуйте командну продуктивність."
				>
					{#snippet pentogram()}
						<RenewTeam />
					{/snippet}
				</AnimTile>
			</Column>
		</Row>

		<Row>
			<Column sm={4} md={4} lg={4} class="mb-4">
				<AnimTile
					href="/techs"
					title="Технічні навички"
					text="Керування базою технічних навичок та підтехнік для детального аналізу гри."
				>
					{#snippet pentogram()}
						<AssessmentUsed />
					{/snippet}
				</AnimTile>
			</Column>

			<Column sm={4} md={4} lg={4} class="mb-4">
				<AnimTile
					href="/exercises"
					title="Вправи"
					text="Створюйте та використовуйте вправи для розвитку технічних навичок гравців."
				>
					{#snippet pentogram()}
						<DesignLeadership />
					{/snippet}
				</AnimTile>
			</Column>

			<Column sm={4} md={4} lg={4} class="mb-4">
				<AnimTile
					href="/settings"
					title="Налаштування"
					text="Налаштуйте програму відповідно до своїх потреб."
				>
					{#snippet pentogram()}
						<GpuComputing />
					{/snippet}
				</AnimTile>
			</Column>
		</Row>
	</Grid>
</Content>
