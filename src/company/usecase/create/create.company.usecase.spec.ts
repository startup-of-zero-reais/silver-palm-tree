import { faker } from '@faker-js/faker';
import { CompanyRepositoryInterface } from '../../domain/repository/company.repository.interface';
import { CreateCompanyUseCase } from './create.company.usecase';

const MockRepository = (): CompanyRepositoryInterface => {
	return {
		find: jest.fn(),
		paginate: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		findByCnpj: jest.fn(),
		delete: jest.fn(),
	};
};

const input = {
	cnpj: '61.662.803/0001-04',
	description: 'any_description',
	logo: 'http://logo.com',
	admin: faker.datatype.uuid(),
};

describe('Unit test create company usecase', () => {
	it('Should CreateCompanyUseCase create a company', async () => {
		const usecase = new CreateCompanyUseCase(MockRepository());

		const company = await usecase.execute(input);

		expect(company.cnpj).toBe(input.cnpj);
		expect(company.description).toBe(input.description);
		expect(company.logo).toBe(input.logo);
	});
});
