import {
	Recruiter,
	RecruiterRepositoryInterface,
	Status,
} from '@/recruiter/domain';
import { UpdateRecruiterUseCase } from './update.recruiter.usecase';

const recruiter = new Recruiter({
	id: 'any_id',
	company: { cnpj: 'any_cnpj', id: 'any_id' },
	email: 'any_email@mail.com',
	password: 'any_password',
	image: 'https://anyimage.com',
	name: 'any_name',
	status: Status.ACTIVATED,
});

const input = {
	id: 'any_id',
	name: 'name updated',
	image: 'https://imageimageupdated.com',
	company: { cnpj: 'any_cnpj', id: 'any_id' },
};

let MockRepository = (): RecruiterRepositoryInterface => {
	return {
		findByEmail: jest.fn(),
		find: jest.fn().mockResolvedValue(recruiter),
		paginate: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
	};
};

describe('Unit test update recruiter usecase', () => {
	it('Should UpdateRecruiterUseCase updated a recruiter', async () => {
		const usecase = new UpdateRecruiterUseCase(MockRepository());
		const output = await usecase.execute(input);

		expect(output.id).toBe(input.id);
		expect(output.name).toBe(input.name);
		expect(output.image).toBe(input.image);
		expect(output.companyCNPJ).toEqual(input.company.cnpj);
		expect(output.companyID).toEqual(input.company.id);
	});

	it('Should UpdateRecruiterUseCase throw error not found', async () => {
		const MockThrowRepository = (): RecruiterRepositoryInterface => ({
			...MockRepository(),
			find: jest.fn().mockResolvedValue(null),
		});
		const usecase = new UpdateRecruiterUseCase(MockThrowRepository());
		await expect(usecase.execute(input)).rejects.toThrow(
			'Recruiter not found',
		);
	});
});
