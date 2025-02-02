import Model from '$lib/scripts/model';
import type { DataTableHeader } from 'carbon-components-svelte/types/DataTable/DataTable.svelte.d';
import type { DataTableRow } from 'carbon-components-svelte/types/DataTable/DataTable.svelte.d';


export class PaginationProps {
  page: number;
  size: number;

  constructor(page: number = 1, size: number = 10) {
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
    if (data) {
      this.page = data.page;
      this.pages = data.pages;
      this.size = data.size;
      this.total = data.total;
      this.items = data.items.map((item: any) => { return item instanceof type ? item : this.deserialize(item, type) });
    } else {
      this.page = 1;
      this.pages = 1;
      this.size = 10;
      this.total = 0;
      this.items = [];
    }
  }


  // /**
  // NOT IMPLEMENTED
  //  * This function returns the rows for the DataTable component (Carbon Components)
  //  * @param translateIdToField Parameter to translate all relations id to their names or other fields 
  //  * @returns 
  //  */
  getRows(): DataTableRow[] {
    const rows = this.items.map((item: T) => item.__tableData);
    return rows as DataTableRow[]
  }

  getHeaders(exclude: string[] = []): DataTableHeader[] | undefined {
    if (this.items.length == 0) { return [{ key: 'noData', empty: true, value: 'Немає Даних' }] }
    const headers = this.items[0].getHeaders();
    return headers.filter((header: any) => !exclude.includes(header.key)) as DataTableHeader[]
  }

  private deserialize<U extends Model>(data: any, type: { new(): U; }): U {
    return new type().deserialize(data) as U
  }
}