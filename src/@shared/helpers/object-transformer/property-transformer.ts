import { set, get } from 'lodash';
import { DotKeys } from './typings';

export class PropertyTransformer<T, To> {
	constructor(
		private readonly _originalProp: {
			value: T;
			propName: DotKeys<T>;
		},
		private readonly _objTransformer,
	) {}

	public to(newPropName: DotKeys<To>) {
		const value = get(
			this._originalProp.value,
			this._originalProp.propName,
		);

		if (typeof value === 'undefined') return this._objTransformer;
		return this._objTransformer.apply(set({}, newPropName, value));
	}
}
