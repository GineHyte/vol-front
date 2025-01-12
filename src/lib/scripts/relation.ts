import Model from "$lib/scripts/model";

export class Relation {
  jsRelation: string
  relationTitle: string
  relationModel: { new(): Model; } | null = null

  constructor(
    jsRelation: string,
    relationTitle: string,
    relationModel: { new(): Model; } | null = null,
  ) {
    this.jsRelation = jsRelation
    this.relationTitle = relationTitle
    this.relationModel = relationModel
  }
}