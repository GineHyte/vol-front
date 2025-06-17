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