import type { iModel } from "$lib/scripts/schemas"



export default class Model implements iModel {
  serializationAlias: { [key: string]: string } = {}
  deserializationAlias: { [key: string]: string } = {}

  serialize(): { [key: string]: any } {
    const data: { [key: string]: any } = {}
    for (const key in this) {
      data[] = 
    }
    return data
  }

  deserialize(data: { [key: string]: any }): Model {
    return this
  }

  protected getSerializationAlias(): { [key: string]: string } {
    if (this.serializationAlias) {
      return this.serializationAlias
    } else {
      return Object.keys(this)
    }
  }

  protected getDeserializationAlias(): string[] {
    return Object.keys(this.deserializationAlias)
  }
}