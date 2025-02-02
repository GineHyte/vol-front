import Model from '$lib/scripts/model'

export default class Datatype {
  __type: string | Model | Model[];

  constructor(type: string | Model | Model[]) {
    this.__type = type;
  }

  isNaN(value: any): boolean {
    if (this.__type == 'number') {
      return isNaN(value)
    } else if (this.__type == 'string') {
      return value == ''
    } else if (this.__type == 'array') {
      return !value || value?.length == 0 || value.every((item: any) => item.isNaN())
    } else if (this.__type instanceof Model) {
      return value.isNaN()
    }
    return false
  }
}