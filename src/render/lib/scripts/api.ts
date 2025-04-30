// @ts-ignore
import { PaginationProps } from '$lib/scripts/pagination';
import { pushNotification } from '$lib/utils/utils';
import { settingsRenderer } from '$lib/utils/store';

var apiUrl = '';
var apiVersion = '';
var isLoaded = false;

settingsRenderer.subscribe((settings: any) => {
	isLoaded = settings.loaded;
	if (isLoaded === true) {
		apiUrl = settings.apiUrl.trim() || '';
		apiVersion = settings.apiVersion || '';
		const isDev = apiUrl.includes('localhost');
		console.log(settings);
		if (apiUrl === '') {
			pushNotification('settingsServerIPError');
		}
		if (isDev) {
			apiUrl = 'http://' + apiUrl;
		} else {
			apiUrl = 'https://' + apiUrl;
		}
	}
});

interface Api {
	get(url: string, paginationProps: PaginationProps | null, headers: any): Promise<any>;
	post(url: string, data: any, headers: any): Promise<any>;
	put(url: string, data: any, headers: any): Promise<any>;
	delete(url: string, headers: any): Promise<any>;
}

export class ApiImpl implements Api {
	async get(
		url: string,
		paginationProps: PaginationProps | null = null,
		headers: any = {},
	): Promise<any> {
		if (!isLoaded) {
			return;
		}
		return new Promise((resolve, reject) => {
			let queryUrl = `${apiUrl}${apiVersion}${url}`;
			if (paginationProps !== null) {
				queryUrl += `${queryUrl.includes('?') ? '&' : '?'}page=${paginationProps.page}&size=${paginationProps.size}`;
			}
			fetch(queryUrl, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					...headers,
				},
			})
				.then((response: any) => {
					if (response.status !== 200) {
						this.__errorHandler(response);
					}
					return response.json();
				})
				.then((data: any) => resolve(data))
				.catch((error: Error) => {
					this.__errorHandler(error);
				});
		});
	}

	async post(url: string, data: any, headers: any = {}): Promise<any> {
		return new Promise((resolve, reject) => {
			fetch(`${apiUrl}${apiVersion}${url}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					...headers,
				},
				body: JSON.stringify(data),
			})
				.then((response: any) => {
					if (response.status !== 200) {
						this.__errorHandler(response);
					}
					return response.json();
				})
				.then((data: any) => resolve(data))
				.catch((error: Error) => {
					this.__errorHandler(error);
					return reject(error);
				});
		});
	}

	async put(url: string, data: any, headers: any = {}): Promise<any> {
		return new Promise((resolve, reject) => {
			fetch(`${apiUrl}${apiVersion}${url}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					...headers,
				},
				body: JSON.stringify(data),
			})
				.then((response: any) => {
					if (response.status !== 200) {
						this.__errorHandler(response);
					}
					return response.json();
				})
				.then((data: any) => resolve(data))
				.catch((error: Error) => {
					this.__errorHandler(error);
					return reject(error);
				});
		});
	}

	async delete(url: string, headers: any = {}): Promise<any> {
		return new Promise((resolve, reject) => {
			fetch(`${apiUrl}${apiVersion}${url}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					...headers,
				},
			})
				.then((response: Response) => {
					if (response.status !== 200) {
						this.__errorHandler(response);
					}
					return response.json();
				})
				.then((data: any) => resolve(data))
				.catch((error: Error) => {
					this.__errorHandler(error);
					return reject(error);
				});
		});
	}

	private __errorHandler(resp: Response | Error) {
		return
		if (resp instanceof Response) {
			pushNotification('apiError', {
				body: JSON.stringify(resp.body),
				status: resp.status.toString(),
				statusText: resp.statusText,
				url: resp.url,
			});
		} else {
			pushNotification('apiError', {
				body: resp.message,
				status: '500',
				statusText: 'Internal Server Error',
				url: 'Unknown',
			});
		}
	}
}
