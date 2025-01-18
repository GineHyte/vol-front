import { notifications, settingsRenderer } from '$lib/utils/store';

// @ts-ignore
export function pushNotification(notification) {
  let notificationsLocal;
  let unsubscribe = notifications.subscribe((v) => { notificationsLocal = v; });
  // @ts-ignore
  notifications.set([...notificationsLocal, notification]);
  unsubscribe();
}

export function setSetting(key: string, value: string) {
  settingsRenderer.set({ ...settingsRenderer, [key]: value });
}

export function getTime() {
  let now = new Date();
  return ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2);
}

export const Amplua = {
  "Defender": "Захисник",
  "Attacker": "Нападник",
  "Universal": "Універсальний",
}

export enum Side {
  LEFT = 1,
  RIGHT = 2,
  NOTSET = 0,
}

export const Impact = {
  "Efficiency": "Ефективність",
  "Mistake": "Помилка",
  "Score": "Вигране очко",
  "Fail": "Брак",
}

