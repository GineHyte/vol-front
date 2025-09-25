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
	theme?: string = 'g100';
}

declare interface NotificationType {
	timeout?: number;
	kind?: 'error' | 'info' | 'info-square' | 'success' | 'warning' | 'warning-alt';
	title?: string;
	message?: string;
}

declare interface LoginDataType {
	username?: string;
	accessToken?: string;
	refreshToken?: string;
}