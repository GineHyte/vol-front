import Datatype from "$lib/scripts/datatype"

export default class Field {
  deserializationAlias: string
  sereliazationAlias: string
  originalType: Datatype
  tableTitle: string;
  relation: string;

  constructor(
    deserializationAlias: string,
    sereliazationAlias: string,
    originalType: Datatype,
    tableTitle: string = '',
    relation: string = ''
  ) {
    this.deserializationAlias = deserializationAlias
    this.sereliazationAlias = sereliazationAlias
    this.originalType = originalType
    this.tableTitle = tableTitle || deserializationAlias
    this.relation = relation
  }
}