export default class Datatype {
  value: any;
  jsType: string;

  constructor(jsType: string | undefined, value: any = undefined) {
    this.value = value;
    this.jsType = jsType || typeof value;
  }

  isNaN() {
    if (this.jsType == 'number') {
      return isNaN(this.value)
    } else if (this.jsType == 'string') {
      return this.value == ''
    } else if (this.jsType == 'array') {
      return !this.value || this.value?.length == 0 || this.value.every((item: any) => item.isNaN())
    }
    return false
  }
}