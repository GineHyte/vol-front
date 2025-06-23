import { init, register } from 'svelte-i18n';
import { get } from 'svelte/store';
import { browser } from '$app/environment';

const defaultLocale = 'uk';

register('en', () => import('./locales/en.json'));
register('uk', () => import('./locales/uk.json'));
register('de', () => import('./locales/de.json'));

let initialized = false;

export function initI18n() {
    if (initialized || !browser) return;
    
    // Dynamically import the store only on the client side
    import('$lib/utils/store').then(({ settingsRenderer }) => {
        const settings = get(settingsRenderer);
        
        init({
            fallbackLocale: defaultLocale,
            initialLocale: settings.locale || defaultLocale,
        });
        
        initialized = true;
    });
}

// Auto-initialize with default locale for SSR/initial load
init({
    fallbackLocale: defaultLocale,
    initialLocale: defaultLocale,
});