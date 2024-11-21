import { notifications } from '$lib/utils/store';

export function pushNotification(notification) {
    let notificationsLocal;
    let unsubscribe = notifications.subscribe((v) => { notificationsLocal = v; });
    notifications.set([...notificationsLocal, notification]);
    unsubscribe();
} 