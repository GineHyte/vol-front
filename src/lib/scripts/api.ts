// @ts-ignore
import { PUBLIC_API_URL, PUBLIC_API_VERSION } from '$env/static/public';
import { PaginationProps } from '$lib/scripts/pagination';

interface Api {
  get(url: string, paginationProps: PaginationProps | null, headers: any): Promise<any>
  post(url: string, data: any, headers: any): Promise<any>
  put(url: string, data: any, headers: any): Promise<any>
  delete(url: string, headers: any): Promise<any>
}

export class ApiImpl implements Api {
  async get(url: string, paginationProps: PaginationProps | null = null, headers: any = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let queryUrl = `${PUBLIC_API_URL}${PUBLIC_API_VERSION}${url}`
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
      fetch(`${PUBLIC_API_URL}${PUBLIC_API_VERSION}${url}`, {
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
      fetch(`${PUBLIC_API_URL}${PUBLIC_API_VERSION}${url}`, {
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
      fetch(`${PUBLIC_API_URL}${PUBLIC_API_VERSION}${url}`, {
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