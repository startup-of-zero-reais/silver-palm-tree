import { PropertyTransformer } from './property-transformer';
import { DotKeys } from './typings';

export class ObjectTransformer<T = any, To = any> {
	private _transformed: To = {} as To;

	constructor(private readonly _obj: T) {}

	public property(propName: DotKeys<T>) {
		return new PropertyTransformer<T, To>(
			{ value: this._obj, propName },
			this,
		);
	}

	public apply(value: T) {
		Object.assign(this._transformed, value);
		return this;
	}

	public transformed() {
		return this._transformed;
	}
}
