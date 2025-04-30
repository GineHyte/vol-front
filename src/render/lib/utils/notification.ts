const NOTIFICATIONS = {
	duplicatePlayerSuccess: {
		title: 'Успіх!',
		message: 'Гравець дубльований.',
		kind: 'success',
	},
	duplicatePlayerError: {
		title: 'Помилка!',
		message: 'Гравець не може бути дубльований.',
		kind: 'error',
	},
	removePlayerSuccess: {
		title: 'Успіх!',
		message: 'Гравець видалений.',
		kind: 'success',
	},
	removePlayerError: {
		title: 'Помилка!',
		message: 'Гравець не може бути видалений.',
		kind: 'error',
	},
	createPlayerSuccess: {
		title: 'Успіх!',
		message: 'Ви створили нового гравця.',
		kind: 'success',
	},
	createPlayerError: {
		title: 'Помилка!',
		message: 'Гравець не може бути створений.',
		kind: 'error',
	},
	settingsSaveSuccess: {
		title: 'Успіх!',
		message: 'Налаштування збережено.',
		kind: 'success',
	},
	duplicateTeamSuccess: {
		title: 'Успіх!',
		message: 'Команда дубльована.',
		kind: 'success',
	},
	duplicateTeamError: {
		title: 'Помилка!',
		message: 'Команда не може бути дубльована.',
		kind: 'error',
	},
	removeTeamSuccess: {
		title: 'Успіх!',
		message: 'Команда видалена.',
		kind: 'success',
	},
	removeTeamError: {
		title: 'Помилка!',
		message: 'Команда не може бути видалена.',
		kind: 'error',
	},
	createTeamSuccess: {
		title: 'Успіх!',
		message: 'Ви створили нову команду.',
		kind: 'success',
	},
	createTeamError: {
		title: 'Помилка!',
		message: 'Команда не може бути створена.',
		kind: 'error',
	},
	duplicateTechSuccess: {
		title: 'Успіх!',
		message: 'Техніка дубльована.',
		kind: 'success',
	},
	duplicateTechError: {
		title: 'Помилка!',
		message: 'Техніка не може бути дубльована.',
		kind: 'error',
	},
	removeTechSuccess: {
		title: 'Успіх!',
		message: 'Техніка видалена.',
		kind: 'success',
	},
	removeTechError: {
		title: 'Помилка!',
		message: 'Техніка не може бути видалена.',
		kind: 'error',
	},
	createTechSuccess: {
		title: 'Успіх!',
		message: 'Ви створили нову техніку.',
		kind: 'success',
	},
	createTechError: {
		title: 'Помилка!',
		message: 'Техніка не може бути створена.',
		kind: 'error',
	},
	duplicateSubtechSuccess: {
		title: 'Успіх!',
		message: 'Підтехніка дубльована.',
		kind: 'success',
	},
	duplicateSubtechError: {
		title: 'Помилка!',
		message: 'Підтехніка не може бути дубльована.',
		kind: 'error',
	},
	removeSubtechSuccess: {
		title: 'Успіх!',
		message: 'Підтехніка видалена.',
		kind: 'success',
	},
	removeSubtechError: {
		title: 'Помилка!',
		message: 'Підтехніка не може бути видалена.',
		kind: 'error',
	},
	createSubtechSuccess: {
		title: 'Успіх!',
		message: 'Ви створили нову підтехніку.',
		kind: 'success',
	},
	createSubtechError: {
		title: 'Помилка!',
		message: 'Підтехніка не може бути створена. ({errorDetail})',
		kind: 'error',
	},
	settingsServerIPError: {
		title: 'Помилка!',
		message: 'Налаштування не знайдено. Будь ласка, вкажіть IP адрес сервера в налаштуваннях.',
		kind: 'error',
	},
	apiError: {
		title: 'Помилка!',
		timeout: -1,
		message: 'Помилка в комунікації з сервером: {status} - {statusText}\n{url}\n{body}',
		kind: 'error',
	},
	duplicateGameSuccess: {
		title: 'Успіх!',
		message: 'Гра дубльована.',
		kind: 'success',
	},
	duplicateGameError: {
		title: 'Помилка!',
		message: 'Гра не може бути дубльована.',
		kind: 'error',
	},
	removeGameSuccess: {
		title: 'Успіх!',
		message: 'Гра видалена.',
		kind: 'success',
	},
	removeGameError: {
		title: 'Помилка!',
		message: 'Гра не може бути видалена.',
		kind: 'error',
	},
	createGameSuccess: {
		title: 'Успіх!',
		message: 'Ви створили нову гру.',
		kind: 'success',
	},
	createGameError: {
		title: 'Помилка!',
		message: 'Гра не може бути створена.',
		kind: 'error',
	},
	duplicateActionSuccess: {
		title: 'Успіх!',
		message: 'Дія дубльована.',
		kind: 'success',
	},
	duplicateActionError: {
		title: 'Помилка!',
		message: 'Дія не може бути дубльована.',
		kind: 'error',
	},
	removeActionSuccess: {
		title: 'Успіх!',
		message: 'Дія видалена.',
		kind: 'success',
	},
	removeActionError: {
		title: 'Помилка!',
		message: 'Дія не може бути видалена.',
		kind: 'error',
	},
	createActionSuccess: {
		title: 'Успіх!',
		message: 'Ви створили нову дію.',
		kind: 'success',
	},
	createActionError: {
		title: 'Помилка!',
		message: 'Дія не може бути створена.',
		kind: 'error',
	},
	duplicateExerciseSuccess: {
		title: 'Успіх!',
		message: 'Вправа дубльована.',
		kind: 'success',
	},
	duplicateExerciseError: {
		title: 'Помилка!',
		message: 'Вправа не може бути дубльована.',
		kind: 'error',
	},
	removeExerciseSuccess: {
		title: 'Успіх!',
		message: 'Вправа видалена.',
		kind: 'success',
	},
	removeExerciseError: {
		title: 'Помилка!',
		message: 'Вправа не може бути видалена.',
		kind: 'error',
	},
	createExerciseSuccess: {
		title: 'Успіх!',
		message: 'Ви створили нову вправу.',
		kind: 'success',
	},
	createExerciseError: {
		title: 'Помилка!',
		message: 'Вправа не може бути створена.',
		kind: 'error',
	},
	generatePlanSuccess: {
		title: 'Успіх!',
		message: 'План згенеровано.',
		kind: 'success',
	},
	generatePlanError: {
		title: 'Помилка!',
		message: 'План не може бути згенерований: гравця не знайдено.',
		kind: 'error',
	},
	calculatePlayerStatsSuccess: {
		title: 'Успіх!',
		message: 'Статистика гравця розрахована.',
		kind: 'success',
	},
	calculatePlayerStatsNoActionError: {
		title: 'Помилка!',
		message: 'Статистика гравця не може бути розрахована: немає дій.',
		kind: 'error',
	},
	calculatePlayerStatsNoPlayerError: {
		title: 'Помилка!',
		message: 'Статистика гравця не може бути розрахована: гравця не знайдено.',
		kind: 'error',
	},
};

export default function getNotification(name: string, params: { [key: string]: string } = {}) {
	let notification = NOTIFICATIONS[name as keyof typeof NOTIFICATIONS];
	Object.keys(params).forEach((key) => {
		notification.title = notification.title.replace(`{${key}}`, params[key]);
		notification.message = notification.message.replace(`{${key}}`, params[key]);
	});
	return notification;
}
