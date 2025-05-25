import { browser } from '$app/environment';
import { init, register } from 'svelte-i18n';

const defaultLocale = 'uk';

register('en', () => import('./locales/en.json'));
register('uk', () => import('./locales/uk.json'));
register('de', () => import('./locales/de.json'));

init({
	fallbackLocale: defaultLocale,
	initialLocale: browser ? window.localStorage.getItem('locale') || defaultLocale : defaultLocale,
});