import { notifications, settingsRenderer } from '$lib/utils/store';
import getNotification from './notification';
import { _, locale } from 'svelte-i18n';
import { get } from 'svelte/store';


export const t: (k: string) => string = (key: string) => {
    const formatter = get(_);
    return formatter(key);
};

export function pushNotification(notification: string, params: { [key: string]: string } = {}) {
    // Use get() instead of manual subscribe/unsubscribe
    const notificationsLocal = get(notifications);
    notifications.set([...notificationsLocal, getNotification(notification, params)]);
}

// This function will be called on settingsRenderer update
// It sends the updated settings to the main process
export function settingsUpdater(settings: any) {
    if (Object.keys(settings).length === 0) return;
    if (settings.locale) {
        // Update the locale in the i18n system
        locale.set(settings.locale);
    }
    window.electron.setSettings(settings);
}

export function loginUpdater(loginData: any) {
    if (Object.keys(loginData).length === 0) return;
    window.electron.setLoginData(loginData);
}

export function getTime() {
    let now = new Date();
    return ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2);
}

export function trunicate(value: any, length: number = 20) {
    // Fix this function too - it has the same issue
    const settings = get(settingsRenderer);
    const shouldTruncate = settings.trunicate;

    if (shouldTruncate) {
        return value.toString().substring(0, length) + (value.toString().length > length ? '...' : '');
    }
    return value;
}

export function getAmplua(): { [key: string]: string } {
    return {
        DEFENDER: t('amplua.DEFENDER'),
        ATTACKER: t('amplua.ATTACKER'),
        UNIVERSAL: t('amplua.UNIVERSAL'),
    };
}

export const languages = [
    { code: 'uk', name: 'Українська' },
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' }
];

export enum Side {
    LEFT = 1,
    RIGHT = 2,
    NOTSET = 0,
}

export function getImpact(): { [key: string]: string } {
    return {
        EFFICIENCY: t('impact.EFFICIENCY'),
        MISTAKE: t('impact.MISTAKE'),
        SCORE: t('impact.SCORE'),
        FAIL: t('impact.FAIL'),
    };
}

export function getTrueFalse(): { [key: string]: string } {
    return {
        true: t('common.yes'),
        false: t('common.no'),
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
