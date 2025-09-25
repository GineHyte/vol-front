import { writable } from 'svelte/store';
import { settingsUpdater, loginUpdater } from './utils';

export const notifications = writable<NotificationType[]>([]);
export const settingsRenderer = writable<SettingsType>({});
export const versionRenderer = writable('');
export const loginData = writable<LoginDataType>({});

export const currentPlanPlayer = writable(-1);
export const currentPlanPlan = writable(-1);

// ----------------------- GLOBAL UPDATERS -----------------------
settingsRenderer.subscribe(settingsUpdater);
loginData.subscribe(loginUpdater);