import Datatype from "$lib/scripts/datatype"
import Model from "$lib/scripts/model"

export default class Field {
  sereliazationAlias: string
  __datatype: Datatype
  value: any;
  tableTitle: string;
  relation: boolean;
  deserializationAlias: string;

  constructor(
    sereliazationAlias: string,
    datatype: Datatype,
    tableTitle: string = '',
    value: any = undefined,
  ) {
    this.deserializationAlias = '';
    this.sereliazationAlias = sereliazationAlias
    this.__datatype = datatype
    this.value = value
    this.tableTitle = tableTitle
    this.relation = (this.datatype instanceof Model)
  }

  get datatype() {
    return this.__datatype.__type
  }
}