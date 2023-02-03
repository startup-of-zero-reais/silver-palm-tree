import Company from '@/company/domain/entity/company.entity';
import { CompanyRepositoryInterface } from '@/company/domain/repository/company.repository.interface';
import { FindByCNPJUseCase } from './find-by-cnpj.usecase';

const company = new Company({
	id: 'any_id',
	cnpj: '98.668.465/0001-10',
	description: 'any_description',
	logo: 'http://logo.com',
});

const MockRepository = (): CompanyRepositoryInterface => {
	return {
		find: jest.fn(),
		paginate: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		findByCnpj: jest.fn().mockResolvedValue(company),
		delete: jest.fn(),
	};
};

describe('Unit test find company usecase', () => {
	it('Should find company usecase', async () => {
		const usecase = new FindByCNPJUseCase(MockRepository());

		const output = await usecase.execute({
			cnpj: 'any_cnpj',
		});

		expect(output.id).toBe(company.id);
		expect(output.cnpj).toBe(company.cnpj);
		expect(output.description).toBe(company.description);
		expect(output.logo).toBe(company.logo);
	});

	it('Should FindCompanyUseCase throws error if company not exists', async () => {
		const MockThrowRepository = (): CompanyRepositoryInterface => ({
			...MockRepository(),
			findByCnpj: jest.fn().mockResolvedValue(undefined),
		});
		const usecase = new FindByCNPJUseCase(MockThrowRepository());
		const output = await usecase.execute({ cnpj: 'any_cnpj' });
		expect(output).toBeNull();
	});
});
