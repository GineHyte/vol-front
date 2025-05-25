import { browser } from '$app/environment';
import { locale, _ } from 'svelte-i18n';
import { writable } from 'svelte/store';

// Available languages
export const languages = [
	{ code: 'uk', name: 'Українська' },
	{ code: 'en', name: 'English' },
	{ code: 'de', name: 'Deutsch' }
];

// Create a writable store for the current language
export const currentLanguage = writable('uk');

// Function to change language
export function changeLanguage(lang: string) {
	locale.set(lang);
	currentLanguage.set(lang);
	
	// Save to localStorage if in browser
	if (browser) {
		localStorage.setItem('locale', lang);
	}
}

// Get current language code
export function getCurrentLanguage(): string {
	let current = 'uk';
	currentLanguage.subscribe(value => current = value)();
	return current;
}

// Export the translation function for easy import
export { _ as t };