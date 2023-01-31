import { createDate } from './create-date';

jest.useFakeTimers();

describe('CreateDate', () => {
	it('should create a new date on every cases', () => {
		const validDate = '2023-01-01T23:59:59.000Z';
		expect(createDate(validDate)).toStrictEqual(new Date(validDate));
		expect(createDate('invalid')).toStrictEqual(new Date());
	});
});
