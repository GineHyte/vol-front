import Model from '$lib/scripts/model';


export class PaginationProps {
  page: number;
  size: number;

  constructor(page: number, size: number) {
    this.page = page;
    this.size = size;
  }
}

export class Pagination<T extends Model> {
  page: number;
  size: number;
  pages: number;
  total: number;

  items: T[];

  constructor(data: { page: number, size: number, pages: number, total: number, items: any[] }, type: { new(): T; }) {
    this.page = data.page;
    this.pages = data.pages;
    this.size = data.size;
    this.total = data.total;
    this.items = data.items.map((item: any) => { return this.deserialize(item, type) });
  }

  getRows(): { [key: string]: any }[] {
    const rows = this.items.map((item: T) => item.getTableData());
    return rows
  }

  getHeaders(): { [key: string]: any }[] | undefined {
    if (this.items.length == 0) { return [{ key: 'noData', 'value': 'Немає Даних' }] }
    const headers = this.items[0].getHeaders();
    return headers
  }

  private deserialize<U extends Model>(data: any, type: { new(): U; }): U {
    return new type().deserialize(data) as U
  }
}