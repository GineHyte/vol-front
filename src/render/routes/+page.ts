import { get } from 'svelte/store';
import { loginData } from '$lib/utils/store';
import { token } from '$lib/scripts/endpoints';
import { pushNotification } from '$lib/utils/utils';


async function checkAccessToken() {
    const { refreshToken, username } = get(loginData) || {};
    if (!refreshToken || !username) {
        pushNotification('errorLoginData');
        window.location.href = '/login';
        return;
    } else {
        const resp = await token(refreshToken, username);
        if (!resp.accessToken) {
            pushNotification('errorLoginData');
            window.location.href = '/login';
            return;
        } else {
            loginData.set({
                accessToken: resp.accessToken,
                refreshToken: resp.refreshToken,
                username: username,
            });
            pushNotification('successLoginData');
        }
    }
}

export async function load() {
    await checkAccessToken();
}