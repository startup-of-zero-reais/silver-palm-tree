import { validatorCNPJ } from './validator.cnpj';

describe('Validator CNPJ', () => {
	it('should validate a cnpj returns true', () => {
		const cnpj = '39.064.108/0001-83';
		expect(validatorCNPJ(cnpj)).toBe(true);

		const cnpj2 = '39064108000183';
		expect(validatorCNPJ(cnpj2)).toBe(true);
	});

	it('should validate returns false', () => {
		const cnpj = '00000000000000';
		expect(validatorCNPJ(cnpj)).toBe(false);
	});
});
