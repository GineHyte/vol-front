/// <reference types='@sveltejs/kit' />
/// <reference types='svelte' />
/// <reference types='vite/client' />
declare interface Window {
	electron: any;
}

declare interface SettingsType {
	trunicate?: boolean;
	apiUrl?: string;
	apiVersion?: string;
	loaded?: boolean = false;
	locale?: string = 'uk';
}

declare interface NotificationType {
	timeout?: number;
	kind?: 'error' | 'info' | 'info-square' | 'success' | 'warning' | 'warning-alt';
	title?: string;
	message?: string;
}
