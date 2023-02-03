import { parseTime } from './parse-time';

describe('Parse time', function () {
	it('should parse string time to seconds', () => {
		expect(parseTime('60s')).toBe(60);
		expect(parseTime('5m')).toBe(300);
		expect(parseTime('1h')).toBe(3600);
		expect(parseTime('1d')).toBe(86400);
	});
});
