import Datatype from "$lib/scripts/datatype"
import { Relation } from "$lib/scripts/relation"

export default class Field {
  sereliazationAlias: string
  originalType: Datatype
  tableTitle: string;
  relation: Relation | null;
  deserializationAlias: string;

  constructor(
    sereliazationAlias: string,
    originalType: Datatype,
    tableTitle: string = '',
    relation: Relation | null = null
  ) {
    this.deserializationAlias = '';
    this.sereliazationAlias = sereliazationAlias
    this.originalType = originalType
    this.tableTitle = tableTitle
    this.relation = relation
  }
}