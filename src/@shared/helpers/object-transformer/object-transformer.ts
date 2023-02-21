import { PropertyTransformer } from './property-transformer';
import { DotKeys } from './typings';

export class ObjectTransformer<T = any, To = any> {
	private _transformed: To = {} as To;

	private constructor(private readonly _obj: T) {}

	static transform<T = any, To = any>(_obj: T): ObjectTransformer<T, To> {
		return new ObjectTransformer<T, To>(_obj);
	}

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

	/**
	 * **WATCHOUT**
	 *
	 * transformed method will NOT instantiate a class object. It will only create
	 * a object who matches the property keys
	 *
	 * So you try to use a class method it will fail
	 *
	 * @returns {object}
	 */
	public transformed(): To {
		return this._transformed;
	}
}
