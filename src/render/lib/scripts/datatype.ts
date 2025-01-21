export default class Datatype {
  value: any;
  jsType: string;
  ge: number;
  le: number;

  constructor(jsType: string | undefined, ge: number = 0, le: number = 0, value: any = undefined) {
    this.jsType = jsType || typeof value;
    this.ge = ge;
    this.le = le;
    this.value = value;
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