import Company, { Status } from './company.entity';

describe('Domain Company', () => {
	it('Should create a company', () => {
		const company = new Company({
			description: 'This is a test company',
			cnpj: '61.662.803/0001-04',
			logo: 'http://example.com',
			status: Status.INSPECTION,
		});

		expect(company.description).toBe('This is a test company');
		expect(company.cnpj).toBe('61.662.803/0001-04');
		expect(company.logo).toBe('http://example.com');
	});

	it('Should throw an error when passing wrong properties', () => {
		expect(
			() =>
				new Company({
					cnpj: '',
					description: '',
					logo: '',
					status: Status.INSPECTION,
				}),
		).toThrowError(
			[
				'cnpj is invalid',
				'cnpj is a required field',
				'description is a required field',
				'logo is a required field',
			].join(','),
		);
	});
});
