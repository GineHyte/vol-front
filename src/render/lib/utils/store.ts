import { writable } from 'svelte/store';
import { settingsUpdater, loginUpdater } from './utils';

export const notifications = writable<NotificationType[]>([]);
export const settingsRenderer = writable<SettingsType>({});
export const versionRenderer = writable('');
export const loginData = writable<LoginDataType>({});

// ----------------------- GLOBAL UPDATERS -----------------------
settingsRenderer.subscribe(settingsUpdater);
loginData.subscribe(loginUpdater);