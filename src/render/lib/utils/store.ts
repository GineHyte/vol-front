import { writable } from 'svelte/store';
import { settingsUpdater } from './utils';

export const notifications = writable<NotificationType[]>([]);
export const settingsRenderer = writable<SettingsType>({});
export const versionRenderer = writable('');
export const loginData = writable<LoginDataType | null>(null);

// ----------------------- GLOBAL UPDATERS -----------------------

settingsRenderer.subscribe(settingsUpdater);