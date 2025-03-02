import { notifications, settingsRenderer } from '$lib/utils/store';
import getNotification from './notification';

export function pushNotification(notification: string, params: { [key: string]: string } = {}) {
	let notificationsLocal;
	let unsubscribe = notifications.subscribe((v) => {
		notificationsLocal = v;
	});
	// @ts-ignore
	notifications.set([...notificationsLocal, getNotification(notification, params)]);
	unsubscribe();
}

export function setSetting(key: string, value: string) {
	settingsRenderer.set({ ...settingsRenderer, [key]: value });
}

export function getTime() {
	let now = new Date();
	return ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2);
}

export function trunicate(value: any, length: number = 20) {
	let trunicate = false;
	settingsRenderer.subscribe((settings: any) => {
		trunicate = settings.trunicate;
	});
	if (trunicate) {
		return value.toString().substring(0, length) + (value.toString().length > length ? '...' : '');
	}
	return value;
}

export const Amplua: {} = {
	Defender: 'Захисник',
	Attacker: 'Нападник',
	Universal: 'Універсальний',
};

export enum Side {
	LEFT = 1,
	RIGHT = 2,
	NOTSET = 0,
}

export const Impact: {} = {
	Efficiency: 'Ефективність',
	Mistake: 'Помилка',
	Score: 'Вигране очко',
	Fail: 'Брак',
};

export const TrueFalse: {} = {
	true: 'Так',
	false: 'Ні',
};
