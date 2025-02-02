import Field from "$lib/scripts/field"
import Datatype from "$lib/scripts/datatype"
import { comma } from "postcss/lib/list"

export default class Model {
  __serializationMap: { [index: string]: string } = {}
  __deserializationMap: { [index: string]: string } = {}
  __deserialized: boolean = false

  get __tableData(): { [index: string]: any } {
    let data: { [index: string]: any } = {}
    for (const key in Object.keys(this.__deserializationMap)) {
      data[key] = this[key as keyof this]
    }
    return data
  }

  deserialize(data: any): Model {
    if (this.__deserialized) { return this }
    else { this.__deserialized = true }
    for (const key in data) {
      let dkey = this.__serializationMap[key]
      if (!dkey) { continue }
      this[dkey as keyof this] = data[key]
    }
    return this
  }

  serialize(): { [index: string]: any } {
    let data: { [index: string]: any } = {}
    for (const key in this) {
      let skey = this.__deserializationMap[key]
      if (!skey) { continue }
      data[skey] = this[key as keyof this]
    }
    return data
  }

  getHeaders(): { [key: string]: any }[] {
    return Object.keys(this.__deserializationMap).map(key => {
      let _key = ("__" + key) as keyof this
      const field = this[_key] as Field
      return { key: field.tableTitle, value: key }
    })
  }

  proxify() {
    for (const key in this) {
      if (!(this[key] instanceof Field)) { continue }
      const field = this[key] as Field
      this.__serializationMap[field.sereliazationAlias] = key
      this.__deserializationMap[key] = field.sereliazationAlias
      let _key = ("__" + key) as keyof this
      field.deserializationAlias = key
      this[_key] = field as any
      delete this[key]
    }
    return new Proxy(this, {
      get(target, p, receiver) {
        p = p.toString()
        if (!p.startsWith("__") && typeof target[p as keyof Model] !== 'function') {
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