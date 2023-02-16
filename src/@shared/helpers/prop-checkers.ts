export function isObject(input: any): boolean {
	return typeof input === 'object' && !Array.isArray(input);
}

export function isArray(input: any): boolean {
	return Array.isArray(input);
}

export function areTypeEquals(src: any, cmp: any): boolean {
	if (isObject(src) || isObject(cmp)) return isObject(src) == isObject(cmp);

	if (isArray(src) || isArray(cmp)) return isArray(src) == isArray(cmp);

	return typeof src == typeof cmp;
}

export function isEmpty(input: any): boolean {
	if (typeof input === 'undefined') return true;
	if (isObject(input)) return Object.values(input).every(isEmpty);
	if (isArray(input))
		return input.map(isEmpty).filter((v) => !Boolean(v)).length === 0;

	return false;
}
