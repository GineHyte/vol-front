<script>
	import { Content, Grid, Row, Column, Tile, ClickableTile } from 'carbon-components-svelte';
	import { WatsonHealthRegionAnalysisVolume } from 'carbon-icons-svelte';
	import { DetectAndStopAdvancingThreats } from 'carbon-pictograms-svelte';
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
				<ClickableTile href="/games" class="h-full">
					<h3 class="text-xl font-bold mb-2">Ігри</h3>
					<p>
						Створюйте та аналізуйте ігри, відстежуйте дії гравців та технічні показники.
					</p>
				</ClickableTile>
			</Column>

			<Column sm={4} md={4} lg={4} class="mb-4">
				<ClickableTile href="/players" class="h-full">
					<h3 class="text-xl font-bold mb-2">Гравці</h3>
					<p>
						Управління профілями гравців, перегляд статистики та створення
						індивідуальних планів тренувань.
					</p>
				</ClickableTile>
			</Column>

			<Column sm={4} md={4} lg={4} class="mb-4">
				<ClickableTile href="/teams" class="h-full">
					<h3 class="text-xl font-bold mb-2">Команди</h3>
					<p>
						Створюйте та керуйте командами, додавайте гравців та аналізуйте командну
						продуктивність.
					</p>
					<DetectAndStopAdvancingThreats />
				</ClickableTile>
			</Column>
		</Row>

		<Row>
			<Column sm={4} md={4} lg={4} class="mb-4">
				<ClickableTile href="/techs" class="h-full">
					<h3 class="text-xl font-bold mb-2">Технічні навички</h3>
					<p>
						Керування базою технічних навичок та підтехнік для детального аналізу гри.
					</p>
				</ClickableTile>
			</Column>

			<Column sm={4} md={4} lg={4} class="mb-4">
				<ClickableTile href="/exercises" class="h-full">
					<h3 class="text-xl font-bold mb-2">Вправи</h3>
					<p>
						Створюйте та використовуйте вправи для розвитку технічних навичок гравців.
					</p>
				</ClickableTile>
			</Column>

			<Column sm={4} md={4} lg={4} class="mb-4">
				<ClickableTile href="/settings" class="h-full">
					<h3 class="text-xl font-bold mb-2">Налаштування</h3>
					<p>Налаштуйте програму відповідно до своїх потреб.</p>
				</ClickableTile>
			</Column>
		</Row>
	</Grid>
</Content>
