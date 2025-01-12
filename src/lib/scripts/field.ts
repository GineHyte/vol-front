import Datatype from "$lib/scripts/datatype"
import Model from "$lib/scripts/model"
import { Relation } from "$lib/scripts/relation"

export default class Field {
  deserializationAlias: string
  sereliazationAlias: string
  originalType: Datatype
  tableTitle: string;
  relation: Relation | null;

  constructor(
    deserializationAlias: string,
    sereliazationAlias: string,
    originalType: Datatype,
    tableTitle: string = '',
    relation: Relation | null = null
  ) {
    this.deserializationAlias = deserializationAlias
    this.sereliazationAlias = sereliazationAlias
    this.originalType = originalType
    this.tableTitle = tableTitle || deserializationAlias
    this.relation = relation
  }
}