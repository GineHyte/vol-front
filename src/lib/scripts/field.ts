import Datatype from "$lib/scripts/datatype"

export default class Field {
  deserializationAlias: string
  sereliazationAlias: string
  originalType: Datatype
  value: any
  tableTitle: string;
  relation: string;

  constructor(
    deserializationAlias: string,
    sereliazationAlias: string,
    originalType: Datatype,
    tableTitle: string = '',
    value: any = undefined,
    relation: string = ''
  ) {
    this.deserializationAlias = deserializationAlias
    this.sereliazationAlias = sereliazationAlias
    this.originalType = originalType
    this.value = value
    this.tableTitle = tableTitle || deserializationAlias
    this.relation = relation
  }
}