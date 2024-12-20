export default class Datatype {
  value: any;
  jsType: string;

  constructor(typeConstructor: any, value: any = undefined) {
    this.value = new typeConstructor(value);
    this.jsType = this.getType(typeConstructor);
  }

  getType(typeConstructor: any): string {
    if (typeConstructor === String) {
      return 'string';
    } else if (typeConstructor === Number) {
      return 'number';
    } else if (typeConstructor === Boolean) {
      return 'boolean';
    } else if (typeConstructor === Date) {
      return 'date';
    } else if (typeConstructor === Array) {
      return 'array';
    }
    return 'undefined';
  }

  isNaN(): boolean {
    return isNaN(this.value);
  }
}