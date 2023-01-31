import {
	Recruiter,
	RecruiterRepositoryInterface,
	Status,
} from '@/recruiter/domain';
import { FindRecruiterUseCase } from './find.recruiter.usecase';

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
		findByEmail: jest.fn(),
		find: jest.fn().mockResolvedValue(recruiter),
		paginate: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
	};
};

describe('Unit test find recruiter usecase', () => {
	it('Should find recruiter usecase', async () => {
		const usecase = new FindRecruiterUseCase(MockRepository());

		const output = await usecase.execute({ id: 'any_id' });

		expect(output.id).toBe('any_id');
		expect(output.name).toBe(recruiter.name);
		expect(output.email).toBe(recruiter.email);
		expect(output.image).toBe(recruiter.image);
		expect(output.password).toBe(recruiter.password);
		expect(output.status).toBe(recruiter.status);
		expect(output.companyCNPJ).toBe(recruiter.companyCNPJ);
		expect(output.companyID).toBe(recruiter.companyID);
	});

	it('Should FindRecruiterUseCase throws error if candidate has already exists', async () => {
		const MockThrowRepository = (): RecruiterRepositoryInterface => ({
			...MockRepository(),
			find: jest.fn().mockResolvedValue(undefined),
		});

		const usecase = new FindRecruiterUseCase(MockThrowRepository());

		await expect(usecase.execute({ id: 'invalid_id' })).rejects.toThrow(
			'Recruiter not found',
		);
	});
});
