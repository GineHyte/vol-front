import { notifications, settingsRenderer } from '$lib/utils/store';
import getNotification from './notification';
import { t } from '$lib/i18n/utils';
import { get } from 'svelte/store';

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

export function getAmplua(): { [key: string]: string } {
	return {
		DEFENDER: get(t)('amplua.DEFENDER'),
		ATTACKER: get(t)('amplua.ATTACKER'),
		UNIVERSAL: get(t)('amplua.UNIVERSAL'),
	};
}

export enum Side {
	LEFT = 1,
	RIGHT = 2,
	NOTSET = 0,
}

export function getImpact(): { [key: string]: string } {
	return {
		EFFICIENCY: get(t)('impact.EFFICIENCY'),
		MISTAKE: get(t)('impact.MISTAKE'),
		SCORE: get(t)('impact.SCORE'),
		FAIL: get(t)('impact.FAIL'),
	};
}

export function getTrueFalse(): { [key: string]: string } {
	return {
		true: get(t)('common.yes'),
		false: get(t)('common.no'),
	};
}

// Backward compatibility - keeping old constants for now
export const Amplua: { [key: string]: string } = {
	DEFENDER: 'Захисник',
	ATTACKER: 'Нападник',
	UNIVERSAL: 'Універсальний',
};

export const Impact: { [key: string]: string } = {
	EFFICIENCY: 'Ефективність',
	MISTAKE: 'Помилка',
	SCORE: 'Вигране очко',
	FAIL: 'Брак',
};

export const TrueFalse: { [key: string]: string } = {
	true: 'Так',
	false: 'Ні',
};
