import Datatype from '$lib/scripts/datatype';
import Model from '$lib/scripts/model';

export default class Field {
	sereliazationAlias: string;
	__datatype: Datatype;
	value: any;
	tableTitle: string;
	relation: boolean;
	deserializationAlias: string;
	tableAlias: string[];
	tableMapping: {};

	constructor(
		sereliazationAlias: string,
		datatype: Datatype,
		tableTitle: string = '',
		tableAlias: string[] = [],
		tableMapping: {} = {},
		value: any = undefined,
	) {
		this.deserializationAlias = '';
		this.sereliazationAlias = sereliazationAlias;
		this.__datatype = datatype;
		this.value = value;
		this.tableAlias = tableAlias;
		this.tableTitle = tableTitle;
		this.tableMapping = tableMapping;
		this.relation = this.datatype instanceof Model;
	}

	get datatype() {
		return this.__datatype.__type;
	}
}
