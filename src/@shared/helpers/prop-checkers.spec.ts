import { areTypeEquals, isArray, isEmpty, isObject } from './prop-checkers';

describe('Helpers > PropCheckers', () => {
	describe('isObject', () => {
		it('should return true to object types and false to non object types', () => {
			const obj = { key: 'non-empty-obj' };
			const obj1 = {};
			const str = 'string';
			const arr = [];
			const int = 1;
			const bool = false;
			const undef = undefined;

			expect(isObject(obj)).toBe(true);
			expect(isObject(obj1)).toBe(true);

			expect(isObject(str)).toBe(false);
			expect(isObject(arr)).toBe(false);
			expect(isObject(int)).toBe(false);
			expect(isObject(bool)).toBe(false);
			expect(isObject(undef)).toBe(false);
		});
	});

	describe('isArray', () => {
		it('should return true to arrays and false to not arrays', () => {
			const obj = { key: 'non-empty-obj' };
			const obj1 = {};
			const str = 'string';
			const arr = [];
			const int = 1;
			const bool = false;
			const undef = undefined;

			expect(isArray(obj)).toBe(false);
			expect(isArray(obj1)).toBe(false);
			expect(isArray(str)).toBe(false);
			expect(isArray(arr)).toBe(true);
			expect(isArray(int)).toBe(false);
			expect(isArray(bool)).toBe(false);
			expect(isArray(undef)).toBe(false);
		});
	});

	describe('areTypeEquals', () => {
		it('should return true to matching types', () => {
			const obj = { key: 'non-empty-obj' };
			const obj1 = {};
			const str = 'string';
			const arr = [];
			const int = 1;
			const bool = false;
			const undef = undefined;

			expect(areTypeEquals(obj, {})).toBe(true);
			expect(areTypeEquals(obj1, {})).toBe(true);
			expect(areTypeEquals(str, '')).toBe(true);
			expect(areTypeEquals(arr, [])).toBe(true);
			expect(areTypeEquals(int, 0)).toBe(true);
			expect(areTypeEquals(bool, true)).toBe(true);
			expect(areTypeEquals(undef, undefined)).toBe(true);

			expect(areTypeEquals(obj, [])).toBe(false);
			expect(areTypeEquals(obj1, [])).toBe(false);
			expect(areTypeEquals(str, 1)).toBe(false);
			expect(areTypeEquals(arr, {})).toBe(false);
			expect(areTypeEquals(int, 'a')).toBe(false);
			expect(areTypeEquals(bool, 2)).toBe(false);
			expect(areTypeEquals(undef, 'not undefined')).toBe(false);
		});
	});

	describe('isEmpty', () => {
		it('arrays with no values or clean values should be empty', () => {
			const arr = [];
			const cleanValArr = [undefined];
			const validValArr = [false, 0];
			const cleanRecursiveArr = [[undefined]];
			const validRecursiveArr = [[false], [0]];

			expect(isEmpty(arr)).toBe(true);
			expect(isEmpty(cleanValArr)).toBe(true);
			expect(isEmpty(cleanRecursiveArr)).toBe(true);
			expect(isEmpty(validValArr)).toBe(false);
			expect(isEmpty(validRecursiveArr)).toBe(false);
		});

		it('objects with no values or undefined values should be empty', () => {
			const obj = {};
			const cleanObj = { key: undefined };
			const recursiveCleanObj = { key: { subkey: undefined } };
			const validObj = { key: false, num: 0, str: '' };
			const recursiveValidObj = {
				key: { subkey: false },
				num: 0,
				str: '',
			};

			expect(isEmpty(obj)).toBe(true);
			expect(isEmpty(cleanObj)).toBe(true);
			expect(isEmpty(recursiveCleanObj)).toBe(true);
			expect(isEmpty(validObj)).toBe(false);
			expect(isEmpty(recursiveValidObj)).toBe(false);
		});
	});
});
