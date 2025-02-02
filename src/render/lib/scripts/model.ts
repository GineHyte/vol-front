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
    this.__fields.forEach(key => {
      data[key] = this[key as keyof this]
    });
    this.__pTableData = data
    return data
  }

  deserialize(data: any): Model {
    if (this.__deserialized) { return this }
    else { this.__deserialized = true }
    for (const key in data) {
      let dkey = this.__serializationMap[key]
      if (!dkey) { continue }
      if (data[key] == null) { continue }
      console.log('key', key, 'dkey', dkey)
      if (typeof data[key] === 'object' || Array.isArray(data[key])) {
        let _dkey = ("__" + dkey) as keyof this 
        const field = this[_dkey] as Field
        let isModel = field.datatype instanceof Model
        if (field.datatype instanceof Array) {
          if (isModel) {
            // @ts-ignore
            this[dkey as keyof this] = data[key].map((item: any) => field.datatype[0].deserialize(item))
          } else {
            // @ts-ignore
            this[dkey as keyof this] = data[key]
          }
        } else {
          if (isModel) {
            // @ts-ignore
            this[dkey as keyof this] = field.datatype.deserialize(data[key])
          }
        }
      } else {
        // @ts-ignore
        this[dkey as keyof this] = data[key]
      }
    }
    console.log('deserialized', this)
    return this
  }

  serialize(exclude: string[] = []): { [index: string]: any } {
    let data: { [index: string]: any } = {}
    this.__fields.forEach(key => {
      let skey = this.__deserializationMap[key]
      if (!skey) { return }
      data[skey] = this[key as keyof this]
    });
    return data
  }

  getHeaders(): { [key: string]: any }[] {
    return Object.keys(this.__deserializationMap).map(key => {
      let _key = ("__" + key) as keyof this
      const field = this[_key] as Field
      return { key: field.tableTitle, value: key }
    })
  }

  getCreationArray(exclude: string[] = []): { [key: string]: any }[] {
    if (this.__pCreationArray.length > 0) { return this.__pCreationArray }
    let data: { [key: string]: any }[] = []
    this.__fields.forEach(key => {
      if (exclude.includes(key)) { return }
      let _key = ("__" + key) as keyof this
      const field = this[_key] as Field
      data.push({ key: key, type: field.datatype, title: field.tableTitle, relation: field.relation })
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
        console.log('get ', p, target)
        if (!p.startsWith("__") && typeof target[p as keyof Model] !== 'function') {
          // @ts-ignore
          return (target[("__" + p) as keyof Model] as Field).value
        } else {
          return Reflect.get(target, p, receiver)
        }
      },
      set(target, p, value, receiver) {
        p = p.toString()
        console.log('set ', p)
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