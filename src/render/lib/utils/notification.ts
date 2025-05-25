import { t } from '$lib/i18n/utils';
import { get } from 'svelte/store';

const NOTIFICATIONS = {
	duplicatePlayerSuccess: () => ({
		title: get(t)('notifications.success'),
		message: get(t)('notifications.playerDuplicated'),
		kind: 'success',
	}),
	duplicatePlayerError: () => ({
		title: get(t)('notifications.error'),
		message: get(t)('notifications.playerCannotBeDuplicated'),
		kind: 'error',
	}),
	removePlayerSuccess: () => ({
		title: get(t)('notifications.success'),
		message: get(t)('notifications.playerRemoved'),
		kind: 'success',
	}),
	removePlayerError: () => ({
		title: get(t)('notifications.error'),
		message: get(t)('notifications.playerCannotBeRemoved'),
		kind: 'error',
	}),
	createPlayerSuccess: () => ({
		title: get(t)('notifications.success'),
		message: get(t)('notifications.playerCreated'),
		kind: 'success',
	}),
	createPlayerError: () => ({
		title: get(t)('notifications.error'),
		message: get(t)('notifications.playerCannotBeCreated'),
		kind: 'error',
	}),
	settingsSaveSuccess: () => ({
		title: get(t)('notifications.success'),
		message: get(t)('notifications.settingsSaved'),
		kind: 'success',
	}),
	duplicateTeamSuccess: () => ({
		title: get(t)('notifications.success'),
		message: get(t)('notifications.teamDuplicated'),
		kind: 'success',
	}),
	duplicateTeamError: () => ({
		title: get(t)('notifications.error'),
		message: get(t)('notifications.teamCannotBeDuplicated'),
		kind: 'error',
	}),
	removeTeamSuccess: () => ({
		title: get(t)('notifications.success'),
		message: get(t)('notifications.teamRemoved'),
		kind: 'success',
	}),
	removeTeamError: () => ({
		title: get(t)('notifications.error'),
		message: get(t)('notifications.teamCannotBeRemoved'),
		kind: 'error',
	}),
	createTeamSuccess: () => ({
		title: get(t)('notifications.success'),
		message: get(t)('notifications.teamCreated'),
		kind: 'success',
	}),
	createTeamError: () => ({
		title: get(t)('notifications.error'),
		message: get(t)('notifications.teamCannotBeCreated'),
		kind: 'error',
	}),
	duplicateTechSuccess: () => ({
		title: get(t)('notifications.success'),
		message: get(t)('notifications.techDuplicated'),
		kind: 'success',
	}),
	duplicateTechError: () => ({
		title: get(t)('notifications.error'),
		message: get(t)('notifications.techCannotBeDuplicated'),
		kind: 'error',
	}),
	removeTechSuccess: () => ({
		title: get(t)('notifications.success'),
		message: get(t)('notifications.techRemoved'),
		kind: 'success',
	}),
	removeTechError: () => ({
		title: get(t)('notifications.error'),
		message: get(t)('notifications.techCannotBeRemoved'),
		kind: 'error',
	}),
	createTechSuccess: () => ({
		title: get(t)('notifications.success'),
		message: get(t)('notifications.techCreated'),
		kind: 'success',
	}),
	createTechError: () => ({
		title: get(t)('notifications.error'),
		message: get(t)('notifications.techCannotBeCreated'),
		kind: 'error',
	}),
	duplicateSubtechSuccess: () => ({
		title: get(t)('notifications.success'),
		message: get(t)('notifications.subtechDuplicated'),
		kind: 'success',
	}),
	duplicateSubtechError: () => ({
		title: get(t)('notifications.error'),
		message: get(t)('notifications.subtechCannotBeDuplicated'),
		kind: 'error',
	}),
	removeSubtechSuccess: () => ({
		title: get(t)('notifications.success'),
		message: get(t)('notifications.subtechRemoved'),
		kind: 'success',
	}),
	removeSubtechError: () => ({
		title: get(t)('notifications.error'),
		message: get(t)('notifications.subtechCannotBeRemoved'),
		kind: 'error',
	}),
	createSubtechSuccess: () => ({
		title: get(t)('notifications.success'),
		message: get(t)('notifications.subtechCreated'),
		kind: 'success',
	}),
	createSubtechError: () => ({
		title: get(t)('notifications.error'),
		message: get(t)('notifications.subtechCannotBeCreated'),
		kind: 'error',
	}),
	settingsServerIPError: () => ({
		title: get(t)('notifications.error'),
		message: get(t)('notifications.settingsNotFound'),
		kind: 'error',
	}),
	apiError: () => ({
		title: get(t)('notifications.error'),
		timeout: -1,
		message: get(t)('notifications.serverCommunicationError'),
		kind: 'error',
	}),
	duplicateGameSuccess: () => ({
		title: get(t)('notifications.success'),
		message: get(t)('notifications.gameDuplicated'),
		kind: 'success',
	}),
	duplicateGameError: () => ({
		title: get(t)('notifications.error'),
		message: get(t)('notifications.gameCannotBeDuplicated'),
		kind: 'error',
	}),
	removeGameSuccess: () => ({
		title: get(t)('notifications.success'),
		message: get(t)('notifications.gameRemoved'),
		kind: 'success',
	}),
	removeGameError: () => ({
		title: get(t)('notifications.error'),
		message: get(t)('notifications.gameCannotBeRemoved'),
		kind: 'error',
	}),
	createGameSuccess: () => ({
		title: get(t)('notifications.success'),
		message: get(t)('notifications.gameCreated'),
		kind: 'success',
	}),
	createGameError: () => ({
		title: get(t)('notifications.error'),
		message: get(t)('notifications.gameCannotBeCreated'),
		kind: 'error',
	}),
	duplicateActionSuccess: () => ({
		title: get(t)('notifications.success'),
		message: get(t)('notifications.actionDuplicated'),
		kind: 'success',
	}),
	duplicateActionError: () => ({
		title: get(t)('notifications.error'),
		message: get(t)('notifications.actionCannotBeDuplicated'),
		kind: 'error',
	}),
	removeActionSuccess: () => ({
		title: get(t)('notifications.success'),
		message: get(t)('notifications.actionRemoved'),
		kind: 'success',
	}),
	removeActionError: () => ({
		title: get(t)('notifications.error'),
		message: get(t)('notifications.actionCannotBeRemoved'),
		kind: 'error',
	}),
	createActionSuccess: () => ({
		title: get(t)('notifications.success'),
		message: get(t)('notifications.actionCreated'),
		kind: 'success',
	}),
	createActionError: () => ({
		title: get(t)('notifications.error'),
		message: get(t)('notifications.actionCannotBeCreated'),
		kind: 'error',
	}),
	duplicateExerciseSuccess: () => ({
		title: get(t)('notifications.success'),
		message: get(t)('notifications.exerciseDuplicated'),
		kind: 'success',
	}),
	duplicateExerciseError: () => ({
		title: get(t)('notifications.error'),
		message: get(t)('notifications.exerciseCannotBeDuplicated'),
		kind: 'error',
	}),
	removeExerciseSuccess: () => ({
		title: get(t)('notifications.success'),
		message: get(t)('notifications.exerciseRemoved'),
		kind: 'success',
	}),
	removeExerciseError: () => ({
		title: get(t)('notifications.error'),
		message: get(t)('notifications.exerciseCannotBeRemoved'),
		kind: 'error',
	}),
	createExerciseSuccess: () => ({
		title: get(t)('notifications.success'),
		message: get(t)('notifications.exerciseCreated'),
		kind: 'success',
	}),
	createExerciseError: () => ({
		title: get(t)('notifications.error'),
		message: get(t)('notifications.exerciseCannotBeCreated'),
		kind: 'error',
	}),
	generatePlanSuccess: () => ({
		title: get(t)('notifications.success'),
		message: get(t)('notifications.planGenerated'),
		kind: 'success',
	}),
	generatePlanError: () => ({
		title: get(t)('notifications.error'),
		message: get(t)('notifications.planCannotBeGenerated'),
		kind: 'error',
	}),
	calculatePlayerStatsSuccess: () => ({
		title: get(t)('notifications.success'),
		message: get(t)('notifications.playerStatsCalculated'),
		kind: 'success',
	}),
	calculatePlayerStatsNoActionError: () => ({
		title: get(t)('notifications.error'),
		message: get(t)('notifications.playerStatsCannotBeCalculatedNoActions'),
		kind: 'error',
	}),
	calculatePlayerStatsNoPlayerError: () => ({
		title: get(t)('notifications.error'),
		message: get(t)('notifications.playerStatsCannotBeCalculatedNoPlayer'),
		kind: 'error',
	}),
};

export default function getNotification(name: string, params: { [key: string]: string } = {}) {
	let notification = NOTIFICATIONS[name as keyof typeof NOTIFICATIONS]();
	Object.keys(params).forEach((key) => {
		notification.title = notification.title.replace(`{${key}}`, params[key]);
		notification.message = notification.message.replace(`{${key}}`, params[key]);
	});
	return notification;
}
