import { writable } from 'svelte/store';

export const notifications = writable([]);
export const settingsRenderer = writable({});
export const versionRenderer = writable('');