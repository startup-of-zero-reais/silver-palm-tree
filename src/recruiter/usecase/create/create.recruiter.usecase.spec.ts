import CompanyFacadeInterface from '@/company/facade/company.facade.interface';
import {
	Recruiter,
	RecruiterRepositoryInterface,
	Status,
} from '@/recruiter/domain';
import { CreateRecruiterUseCase } from './create.recruiter.usecase';

const recruiter = new Recruiter({
	company: { cnpj: 'any_cnpj', id: 'any_id' },
	email: 'any_email',
	password: 'any_password',
	image: 'http://any_image.com',
	name: 'any_name',
	status: Status.ACTIVATED,
});

const input = {
	name: 'any_name',
	email: 'any_email',
	image: 'http://image.com',
	password: 'any_password',
	company: {
		cnpj: 'any',
	},
};

const MockRepository = (): RecruiterRepositoryInterface => {
	return {
		findByEmail: jest.fn().mockResolvedValue(undefined),
		find: jest.fn(),
		paginate: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
	};
};

const MockCompanyFacade = (): CompanyFacadeInterface => {
	return {
		getByCNPJ: jest
			.fn()
			.mockReturnValue({ id: 'any_id', cnpj: 'any_cnpj' }),
		create: jest.fn(),
	};
};

describe('Unit test create recruiter usecase', () => {
	it('Should create recruiter usecase', async () => {
		const usecase = new CreateRecruiterUseCase(
			MockRepository(),
			MockCompanyFacade(),
		);

		const output = await usecase.execute(input);

		expect(output.id).toBeDefined();
		expect(output.name).toBe(input.name);
		expect(output.email).toBe(input.email);
		expect(output.image).toBe(input.image);
		expect(output.password).not.toBe(input.password);
	});

	it('Should CreateRecruiterUseCase throws error if candidate has already exists', async () => {
		const MockThrowRepository = (): RecruiterRepositoryInterface => ({
			...MockRepository(),
			findByEmail: jest.fn().mockResolvedValue(recruiter),
		});

		const usecase = new CreateRecruiterUseCase(
			MockThrowRepository(),
			MockCompanyFacade(),
		);

		await expect(usecase.execute(input)).rejects.toThrow(
			'Recruiter with this email already exists',
		);
	});
});
