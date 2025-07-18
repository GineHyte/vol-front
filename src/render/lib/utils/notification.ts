import { t } from '$lib/utils/utils';

const NOTIFICATIONS: { [key: string]: () => NotificationType} = {
    error: () => ({
        title: t('notifications.error'),
        kind: 'error',
    }),
    duplicatePlayerSuccess: () => ({
        title: t('notifications.success'),
        message: t('notifications.playerDuplicated'),
        kind: 'success',
    }),
    duplicatePlayerError: () => ({
        title: t('notifications.error'),
        message: t('notifications.playerCannotBeDuplicated'),
        kind: 'error',
    }),
    removePlayerSuccess: () => ({
        title: t('notifications.success'),
        message: t('notifications.playerRemoved'),
        kind: 'success',
    }),
    removePlayerError: () => ({
        title: t('notifications.error'),
        message: t('notifications.playerCannotBeRemoved'),
        kind: 'error',
    }),
    createPlayerSuccess: () => ({
        title: t('notifications.success'),
        message: t('notifications.playerCreated'),
        kind: 'success',
    }),
    createPlayerError: () => ({
        title: t('notifications.error'),
        message: t('notifications.playerCannotBeCreated'),
        kind: 'error',
    }),
    settingsSaveSuccess: () => ({
        title: t('notifications.success'),
        message: t('notifications.settingsSaved'),
        kind: 'success',
    }),
    duplicateTeamSuccess: () => ({
        title: t('notifications.success'),
        message: t('notifications.teamDuplicated'),
        kind: 'success',
    }),
    duplicateTeamError: () => ({
        title: t('notifications.error'),
        message: t('notifications.teamCannotBeDuplicated'),
        kind: 'error',
    }),
    removeTeamSuccess: () => ({
        title: t('notifications.success'),
        message: t('notifications.teamRemoved'),
        kind: 'success',
    }),
    removeTeamError: () => ({
        title: t('notifications.error'),
        message: t('notifications.teamCannotBeRemoved'),
        kind: 'error',
    }),
    createTeamSuccess: () => ({
        title: t('notifications.success'),
        message: t('notifications.teamCreated'),
        kind: 'success',
    }),
    createTeamError: () => ({
        title: t('notifications.error'),
        message: t('notifications.teamCannotBeCreated'),
        kind: 'error',
    }),
    duplicateTechSuccess: () => ({
        title: t('notifications.success'),
        message: t('notifications.techDuplicated'),
        kind: 'success',
    }),
    duplicateTechError: () => ({
        title: t('notifications.error'),
        message: t('notifications.techCannotBeDuplicated'),
        kind: 'error',
    }),
    removeTechSuccess: () => ({
        title: t('notifications.success'),
        message: t('notifications.techRemoved'),
        kind: 'success',
    }),
    removeTechError: () => ({
        title: t('notifications.error'),
        message: t('notifications.techCannotBeRemoved'),
        kind: 'error',
    }),
    createTechSuccess: () => ({
        title: t('notifications.success'),
        message: t('notifications.techCreated'),
        kind: 'success',
    }),
    createTechError: () => ({
        title: t('notifications.error'),
        message: t('notifications.techCannotBeCreated'),
        kind: 'error',
    }),
    duplicateSubtechSuccess: () => ({
        title: t('notifications.success'),
        message: t('notifications.subtechDuplicated'),
        kind: 'success',
    }),
    duplicateSubtechError: () => ({
        title: t('notifications.error'),
        message: t('notifications.subtechCannotBeDuplicated'),
        kind: 'error',
    }),
    removeSubtechSuccess: () => ({
        title: t('notifications.success'),
        message: t('notifications.subtechRemoved'),
        kind: 'success',
    }),
    removeSubtechError: () => ({
        title: t('notifications.error'),
        message: t('notifications.subtechCannotBeRemoved'),
        kind: 'error',
    }),
    createSubtechSuccess: () => ({
        title: t('notifications.success'),
        message: t('notifications.subtechCreated'),
        kind: 'success',
    }),
    createSubtechError: () => ({
        title: t('notifications.error'),
        message: t('notifications.subtechCannotBeCreated'),
        kind: 'error',
    }),
    settingsServerIPError: () => ({
        title: t('notifications.error'),
        message: t('notifications.settingsNotFound'),
        kind: 'error',
    }),
    apiError: () => ({
        title: t('notifications.error'),
        timeout: -1,
        message: t('notifications.serverCommunicationError'),
        kind: 'error',
    }),
    duplicateGameSuccess: () => ({
        title: t('notifications.success'),
        message: t('notifications.gameDuplicated'),
        kind: 'success',
    }),
    duplicateGameError: () => ({
        title: t('notifications.error'),
        message: t('notifications.gameCannotBeDuplicated'),
        kind: 'error',
    }),
    removeGameSuccess: () => ({
        title: t('notifications.success'),
        message: t('notifications.gameRemoved'),
        kind: 'success',
    }),
    removeGameError: () => ({
        title: t('notifications.error'),
        message: t('notifications.gameCannotBeRemoved'),
        kind: 'error',
    }),
    createGameSuccess: () => ({
        title: t('notifications.success'),
        message: t('notifications.gameCreated'),
        kind: 'success',
    }),
    createGameError: () => ({
        title: t('notifications.error'),
        message: t('notifications.gameCannotBeCreated'),
        kind: 'error',
    }),
    duplicateActionSuccess: () => ({
        title: t('notifications.success'),
        message: t('notifications.actionDuplicated'),
        kind: 'success',
    }),
    duplicateActionError: () => ({
        title: t('notifications.error'),
        message: t('notifications.actionCannotBeDuplicated'),
        kind: 'error',
    }),
    removeActionSuccess: () => ({
        title: t('notifications.success'),
        message: t('notifications.actionRemoved'),
        kind: 'success',
    }),
    removeActionError: () => ({
        title: t('notifications.error'),
        message: t('notifications.actionCannotBeRemoved'),
        kind: 'error',
    }),
    createActionSuccess: () => ({
        title: t('notifications.success'),
        message: t('notifications.actionCreated'),
        kind: 'success',
    }),
    createActionError: () => ({
        title: t('notifications.error'),
        message: t('notifications.actionCannotBeCreated'),
        kind: 'error',
    }),
    duplicateExerciseSuccess: () => ({
        title: t('notifications.success'),
        message: t('notifications.exerciseDuplicated'),
        kind: 'success',
    }),
    duplicateExerciseError: () => ({
        title: t('notifications.error'),
        message: t('notifications.exerciseCannotBeDuplicated'),
        kind: 'error',
    }),
    removeExerciseSuccess: () => ({
        title: t('notifications.success'),
        message: t('notifications.exerciseRemoved'),
        kind: 'success',
    }),
    removeExerciseError: () => ({
        title: t('notifications.error'),
        message: t('notifications.exerciseCannotBeRemoved'),
        kind: 'error',
    }),
    createExerciseSuccess: () => ({
        title: t('notifications.success'),
        message: t('notifications.exerciseCreated'),
        kind: 'success',
    }),
    createExerciseError: () => ({
        title: t('notifications.error'),
        message: t('notifications.exerciseCannotBeCreated'),
        kind: 'error',
    }),
    generatePlanSuccess: () => ({
        title: t('notifications.success'),
        message: t('notifications.planGenerated'),
        kind: 'success',
    }),
    generatePlanError: () => ({
        title: t('notifications.error'),
        message: t('notifications.planCannotBeGenerated'),
        kind: 'error',
    }),
    calculatePlayerStatsSuccess: () => ({
        title: t('notifications.success'),
        message: t('notifications.playerStatsCalculated'),
        kind: 'success',
    }),
    calculatePlayerStatsNoActionError: () => ({
        title: t('notifications.error'),
        message: t('notifications.playerStatsCannotBeCalculatedNoActions'),
        kind: 'error',
    }),
    calculatePlayerStatsNoPlayerError: () => ({
        title: t('notifications.error'),
        message: t('notifications.playerStatsCannotBeCalculatedNoPlayer'),
        kind: 'error',
    }),
    editGameSuccess: () => ({
        title: t('notifications.success'),
        message: t('notifications.gameEdited'),
        kind: 'success',
    }),
    editGameError: () => ({
        title: t('notifications.error'),
        message: t('notifications.gameCannotBeEdited'),
        kind: 'error',
    }),
    editExerciseSuccess: () => ({
        title: t('notifications.success'),
        message: t('notifications.exerciseEdited'),
        kind: 'success',
    }),
    editExerciseError: () => ({
        title: t('notifications.error'),
        message: t('notifications.exerciseCannotBeEdited'),
        kind: 'error',
    }),
    errorLoginData: () => ({
        title: t('notifications.error'),
        message: t('notifications.loginDataError'),
        kind: 'error',
    }),
    successLoginData: () => ({
        title: t('notifications.success'),
        message: t('notifications.loginDataSuccess'),
        kind: 'success',
    }),
    errorPasswordPlausibility: () => ({
        title: t('notifications.error'),
        message: t('notifications.plausibilityPassword'),
        kind: 'error',
    }),
    errorUsernamePlausibility: () => ({
        title: t('notifications.error'),
        message: t('notifications.plausibilityUsername'),
        kind: 'error',
    }),
    errorInvalidCredentials: () => ({
        title: t('notifications.error'),
        message: t('notifications.invalidCredentials'),
        kind: 'error',
    }),
    successLogin: () => ({
        title: t('notifications.success'),
        message: t('notifications.loginSuccess'),
        kind: 'success',
    }),
    successLogout: () => ({
        title: t('notifications.success'),
        message: t('notifications.logoutSuccess'),
        kind: 'success',
    }),
    successTokenUpdate: () => ({
        title: t('notifications.success'),
        message: t('notifications.tokenUpdateSuccess'),
        kind: 'success',
    }),
    errorPasswordMismatch: () => ({
        title: t('notifications.error'),
        message: t('notifications.passwordMismatch'),
        kind: 'error',
    }),
    successRegister: () => ({
        title: t('notifications.success'),
        message: t('notifications.registerSuccess'),
        kind: 'success',
    }),
    errorRegister: () => ({
        title: t('notifications.error'),
        message: t('notifications.registerError'),
        kind: 'error',
    }),
};

export default function getNotification(name: string, params: { [key: string]: string } = {}) {
    if (!NOTIFICATIONS[name]) {
        console.warn(`Notification "${name}" does not exist.`);
        return {
            title: t('notifications.error'),
            message: t('notifications.notificationNotFound'),
            kind: 'error',
        };
    }
    let notification: NotificationType = NOTIFICATIONS[name as keyof typeof NOTIFICATIONS]();
    Object.keys(params).forEach((key) => {
        if (!notification.title) notification.title = '{title}';
        if (!notification.message) notification.message = '{message}';
        notification.title = notification.title.replace(`{${key}}`, params[key]);
        notification.message = notification.message.replace(`{${key}}`, params[key]);
    });
    return notification;
}
