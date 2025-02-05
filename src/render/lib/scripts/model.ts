import Field from "$lib/scripts/field"

export default class Model {
  __serializationMap: { [index: string]: string } = {}
  __deserializationMap: { [index: string]: string } = {}
  __deserialized: boolean = false
  __fields: string[] = []
  private __pTableData: { [index: string]: any } = {}
  private __pCreationArray: { [key: string]: any }[] = []

  get __tableData(): { [index: string]: any } {
    if (this.__pTableData.length > 0) { return this.__pTableData }
    let data: { [index: string]: any } = {}
    this.__fields.forEach(dkey => {
      let _dkey = ("__" + dkey) as keyof this
      const field = this[_dkey as keyof this] as Field
      let value = field.value
      if (value == undefined) { data[dkey] = "-"; return }
      field.tableAlias.forEach(alias => { value = value[alias] });
      data[dkey] = value || "-"
    });
    this.__pTableData = data
    return data
  }

  deserialize(data: any): Model {
    if (this.__deserialized) { return this }
    else { this.__deserialized = true }
    for (const key in data) {
      let dkey = this.__serializationMap[key]
      let _dkey = ("__" + dkey) as keyof this
      const field = this[_dkey] as Field
      if (!dkey) { continue }
      if (data[key] == null) { continue }
      if (Array.isArray(data[key])) {
        if (Array.isArray(field.datatype)) {
          // @ts-ignore
          this[dkey as keyof this] = data[key].map((item: any) => {
            const constructor = (field.datatype as { new(): Model }[])[0] as { new(): Model }
            return new constructor().deserialize(item)
          });
          continue
        }
      } else if (data[key] instanceof Object) {
        if (field.datatype instanceof Object) {
          const constructor = field.datatype as { new(): Model }
          // @ts-ignore
          this[_dkey as keyof this].value = (new constructor()).deserialize(data[key])
          continue
        }
      }
      (this[_dkey as keyof this] as Field).value = data[key]
    }
    return this
  }

  serialize(exclude: string[] = []): { [index: string]: any } {
    let data: { [index: string]: any } = {}
    this.__fields.forEach((dkey) => {
      let skey = this.__deserializationMap[dkey]
      let _dkey = ("__" + dkey) as keyof this
      if (!skey) { return }
      let value = (this[_dkey as keyof this] as Field).value
      if (value == null) { return }
      if (Array.isArray(value)) {
        data[skey] = value.map((item: any) => {
          return item.serialize()
        });
      } else if (value instanceof Model) {
        data[skey] = (value as Model).serialize()
      } else {
        data[skey] = value
      }
    });
    return data
  }

  getHeaders(): { [key: string]: any }[] {
    return Object.keys(this.__deserializationMap).map(key => {
      let _key = ("__" + key) as keyof this
      const field = this[_key] as Field
      return { key: key, value: field.tableTitle }
    })
  }

  getCreationArray(exclude: string[] = []): { [key: string]: any }[] {
    if (this.__pCreationArray.length > 0) { return this.__pCreationArray }
    let data: { [key: string]: any }[] = []
    this.__fields.forEach(dkey => {
      if (exclude.includes(dkey)) { return }
      let _dkey = ("__" + dkey) as keyof this
      const field = this[_dkey] as Field
      data.push({ key: dkey, type: field.datatype, title: field.tableTitle, relation: field.relation })
    });
    this.__pCreationArray = data
    return data
  }

  proxify() {
    for (const key in this) {
      if (!(this[key] instanceof Field)) { continue }
      const field = this[key] as Field
      this.__serializationMap[field.sereliazationAlias] = key
      this.__deserializationMap[key] = field.sereliazationAlias
      this.__fields.push(key)
      let _key = ("__" + key) as keyof this
      field.deserializationAlias = key
      this[_key] = field as any
      delete this[key]
    }
    return new Proxy(this, {
      get(target, p, receiver) {
        p = p.toString()
        if (target.__fields.includes(p)) {
          // @ts-ignore
          return (target[("__" + p) as keyof Model] as Field).value
        } else {
          return Reflect.get(target, p, receiver)
        }
      },
      set(target, p, value, receiver) {
        p = p.toString()
        if (!p.startsWith("__")) {
          // @ts-ignore
          (target[("__" + p) as keyof Model] as Field).value = value
          return true
        } else {
          return Reflect.set(target, p, value, receiver)
        }
      }
    })
  }

}