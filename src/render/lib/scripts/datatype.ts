import Model from '$lib/scripts/model';

export default class Datatype {
	__type: string | Datatype[] | { new (): Model } | { new (): Model }[];

	constructor(type: string | Datatype[] | { new (): Model } | { new (): Model }[]) {
		this.__type = type;
	}

	isNaN(value: any): boolean {
		if (this.__type == 'number') {
			return isNaN(value);
		} else if (this.__type == 'string') {
			return value == '';
		} else if (this.__type == 'array') {
			return !value || value?.length == 0 || value.every((item: any) => item.isNaN());
		} else if (this.__type instanceof Model) {
			return value.isNaN();
		} else if (Array.isArray(this.__type)) {
			if (this.__type.length !== 0) {
				if (this.__type[0] instanceof Model) {
					return !value || value?.length == 0 || value.every((item: any) => item.isNaN());
				} else if (this.__type[0] instanceof Datatype) {
					return this.__type[0].isNaN(value);
				}
			}
		}
		return false;
	}
}
