import {
	Recruiter,
	RecruiterRepositoryInterface,
	Status,
} from '@/recruiter/domain';
import { FindByEmailRecruiterUseCase } from './find-by-email.recruiter.usecase';

const recruiter = new Recruiter({
	id: 'any_id',
	company: { cnpj: 'any_cnpj', id: 'any_id' },
	email: 'any_email',
	password: 'any_password',
	image: 'http://any_image.com',
	name: 'any_name',
	status: Status.ACTIVATED,
});

const MockRepository = (): RecruiterRepositoryInterface => {
	return {
		findByEmail: jest.fn().mockResolvedValue(recruiter),
		find: jest.fn(),
		paginate: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
	};
};

describe('Unit test find by email recruiter usecase', () => {
	it('Should FindByEmailRecuiter find a recruiter by email usecase', async () => {
		const usecase = new FindByEmailRecruiterUseCase(MockRepository());

		const output = await usecase.execute({ email: 'any_mail@com' });

		expect(output.id).toBe('any_id');
		expect(output.name).toBe(recruiter.name);
		expect(output.email).toBe(recruiter.email);
		expect(output.image).toBe(recruiter.image);
		expect(output.password).toBe(recruiter.password);
		expect(output.status).toBe(recruiter.status);
		expect(output.companyCNPJ).toBe(recruiter.companyCNPJ);
		expect(output.companyID).toBe(recruiter.companyID);
	});

	it('Should FindByEmailRecruiterUseCase throws error if candidate has already exists', async () => {
		const MockThrowRepository = (): RecruiterRepositoryInterface => ({
			...MockRepository(),
			findByEmail: jest.fn().mockResolvedValue(undefined),
		});

		const usecase = new FindByEmailRecruiterUseCase(MockThrowRepository());

		await expect(
			usecase.execute({ email: 'invalid_email' }),
		).rejects.toThrow('Recruiter not found');
	});
});
