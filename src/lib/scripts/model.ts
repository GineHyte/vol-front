import Field from "$lib/scripts/field"
import Datatype from "$lib/scripts/datatype"

export default class Model {
  serializationMap: { [index: string]: string } = {}

  getTableData(): { [key: string]: any } {
    const data: { [key: string]: any } = {}
    for (const key in this) {
      if (!(this[key] instanceof Field)) { continue }
      const field = this[key] as Field
      data[field.deserializationAlias] = field.originalType.value
    }
    return data
  }

  deserialize(data: any): Model {
    if (Object.keys(this.serializationMap).length === 0) {
      for (const key in this) {
        if (!(this[key] instanceof Field)) { continue }
        const field = this[key] as Field
        this.serializationMap[field.sereliazationAlias] = field.deserializationAlias
      }
    }
    for (const key in data) {
      const field = this[this.serializationMap[key] as keyof this] as Field
      if (!field) { continue }
      if (field.relation && field.relation.relationModel) {
        if (field.originalType.jsType === 'array') {
          let relations = []
          for (const item of data[key]) {
            let relation = new field.relation.relationModel()
            relation.deserialize(item)
            relations.push(relation)
          }
          field.originalType.value = relations
        } else {
          let relation = new field.relation.relationModel()
          relation.deserialize(data[key])
          field.originalType.value = relation
        }
      }
      field.originalType.value = data[key]
    }
    return this
  }

  serialize(): { [key: string]: any } {
    const data: { [key: string]: any } = {}
    for (const key in this) {
      if (!(this[key] instanceof Field) || (key == "id")) { continue }
      const field = this[key] as Field
      if (field.originalType.jsType == 'array' && field.originalType.value) {
        data[field.sereliazationAlias] = field.originalType.value.map((item: any) => item.serialize())
        continue
      }
      if (field.originalType.isNaN()) { continue }
      data[field.sereliazationAlias] = field.originalType.value
    }
    return data
  }

  getHeaders(): { [key: string]: any }[] {
    const headers: { [key: string]: any }[] = []
    for (const key in this) {
      if (!(this[key] instanceof Field) || (key == "id")) { continue }
      const field = this[key] as Field
      headers.push({ key: field.deserializationAlias, value: field.tableTitle })
    }
    return headers
  }
}