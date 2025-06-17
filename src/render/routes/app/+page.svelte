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
	import { t } from '$lib/utils/utils';
</script>

<Content>
	<Grid>
		<Row>
			<Column>
				<h1 class="text-3xl font-bold mb-4">
					{t('titles.appTitle')}
				</h1>
				<p class="mb-6">
					{t('descriptions.homeDescription')}
				</p>
			</Column>
		</Row>

		<Row>
			<Column sm={4} md={4} lg={4} class="mb-4">
				<AnimTile
					href="/app/games"
					title={t('navigation.games')}
					text={t('descriptions.gamesDescription')}
				>
					{#snippet pentogram()}
						<AcceleratedComputing />
					{/snippet}
				</AnimTile>
			</Column>

			<Column sm={4} md={4} lg={4} class="mb-4">
				<AnimTile
					href="/app/players"
					title={t('navigation.players')}
					text={t('descriptions.playersDescription')}
				>
					{#snippet pentogram()}
						<KeyUsers />
					{/snippet}
				</AnimTile>
			</Column>

			<Column sm={4} md={4} lg={4} class="mb-4">
				<AnimTile
					href="/app/teams"
					title={t('navigation.teams')}
					text={t('descriptions.teamsDescription')}
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
					href="/app/techs"
					title={t('navigation.techs')}
					text={t('descriptions.techsDescription')}
				>
					{#snippet pentogram()}
						<AssessmentUsed />
					{/snippet}
				</AnimTile>
			</Column>

			<Column sm={4} md={4} lg={4} class="mb-4">
				<AnimTile
					href="/app/exercises"
					title={t('navigation.exercises')}
					text={t('descriptions.exercisesDescription')}
				>
					{#snippet pentogram()}
						<DesignLeadership />
					{/snippet}
				</AnimTile>
			</Column>

			<Column sm={4} md={4} lg={4} class="mb-4">
				<AnimTile
					href="/app/settings"
					title={t('navigation.settings')}
					text={t('descriptions.settingsDescription')}
				>
					{#snippet pentogram()}
						<GpuComputing />
					{/snippet}
				</AnimTile>
			</Column>
		</Row>
	</Grid>
</Content>
