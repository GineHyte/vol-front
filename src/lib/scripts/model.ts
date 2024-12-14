import Field from "$lib/scripts/field"


export default class Model {
  serializationMap: { [index: string]: string } = {}

  getTableData(): { [key: string]: any } {
    const data: { [key: string]: any } = {}
    for (const key in this) {
      if (!(this[key] instanceof Field)) { continue }
      const field = this[key] as Field
      data[field.deserializationAlias] = field.value
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
      field.value = data[key]
    }
    return this
  }

  serialize(): { [key: string]: any } {
    const data: { [key: string]: any } = {}
    for (const key in this) {
      if (!(this[key] instanceof Field) || (key == "id")) { continue }
      const field = this[key] as Field
      data[field.sereliazationAlias] = field.value
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