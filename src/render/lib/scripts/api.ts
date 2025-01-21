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
    console.log('settings', settings);
    apiUrl = settings.apiUrl || '';
    apiVersion = settings.apiVersion || '';
    if (apiUrl === '') {
      noIpNotification();
    }
  }
});

function noIpNotification() {
  pushNotification({
    title: 'Помилка!',
    message: 'Налаштування не знайдено. Будь ласка, вкажіть IP адрес сервера в налаштуваннях.',
    kind: 'error',
  });
}

interface Api {
  get(url: string, paginationProps: PaginationProps | null, headers: any): Promise<any>
  post(url: string, data: any, headers: any): Promise<any>
  put(url: string, data: any, headers: any): Promise<any>
  delete(url: string, headers: any): Promise<any>
}

export class ApiImpl implements Api {
  async get(url: string, paginationProps: PaginationProps | null = null, headers: any = {}): Promise<any> {
    if (!isLoaded) {
      noIpNotification();
      return;
    }
    return new Promise((resolve, reject) => {
      let queryUrl = `http://${apiUrl}:8000${apiVersion}${url}`
      if (paginationProps !== null) {
        queryUrl += `${queryUrl.includes('?') ? '&' : '?'}page=${paginationProps.page}&size=${paginationProps.size}`
      }
      fetch(queryUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      }
      )
        .then((response: any) => response.json())
        .then((data: any) => resolve(data))
        .catch((error: any) => reject(error))
    })
  }

  async post(url: string, data: any, headers: any = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      fetch(`http://${apiUrl}:8000${apiVersion}${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(data)
      })
        .then((response: any) => response.json())
        .then((data: any) => resolve(data))
        .catch((error: any) => reject(error))
    })
  }

  async put(url: string, data: any, headers: any = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      fetch(`http://${apiUrl}:8000${apiVersion}${url}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(data)
      })
        .then((response: any) => response.json())
        .then((data: any) => resolve(data))
        .catch((error: any) => reject(error))
    })
  }

  async delete(url: string, headers: any = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      fetch(`http://${apiUrl}:8000${apiVersion}${url}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
      })
        .then((response: any) => response.json())
        .then((data: any) => resolve(data))
        .catch((error: any) => reject(error))
    })
  }
}
