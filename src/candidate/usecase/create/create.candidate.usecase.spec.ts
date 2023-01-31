import {
	CandidateRepositoryInterface,
	KnowledgeLevel,
	ProfessionalExperience,
	Tech,
} from '@/candidate/domain';
import CreateCandidateUseCase from './create.candidate.usecase';

const input = {
	name: 'test',
	phone: 'any_phone',
	email: 'test@example.com',
	github: 'http://example.com',
	image: 'http://example.com',
	techs: [{ knowledge_level: KnowledgeLevel.ADVANCED, tech: 'PHP' }],
	professionalExperiences: [
		{
			acting_time: '1 year',
			company: 'any_company',
			description: 'any_description',
			qualification: 'any_qualification',
			role: 'any_role',
		},
	],
};
const MockRepository = (): CandidateRepositoryInterface => {
	return {
		find: jest.fn(),
		findByEmail: jest.fn().mockResolvedValueOnce(false),
		paginate: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
	};
};

describe('Unit test create candidate use case', () => {
	it('Should create a candidate', async () => {
		const candidateRepository = MockRepository();
		const createCandidateUseCase = new CreateCandidateUseCase(
			candidateRepository,
		);

		const output = await createCandidateUseCase.execute({
			name: 'test',
			phone: 'any_phone',
			email: 'test@example.com',
			image: 'http://example.com',
			password: 'any_password',
			techs: [
				new Tech({
					knowledge_level: KnowledgeLevel.ADVANCED,
					tech: 'PHP',
				}),
			],
			professionalExperiences: [
				new ProfessionalExperience({
					acting_time: '1 year',
					company: 'any_company',
					description: 'any_description',
					qualification: 'any_qualification',
					role: 'any_role',
				}),
			],
		});

		expect(output.id).toBeDefined();
		expect(output.name).toBe(input.name);
		expect(output.email).toBe(input.email);
		expect(output.phone).toBe(input.phone);
		expect(output.professionalExperiences.length).toBe(1);
		expect(output.techs.length).toEqual(1);
	});
});
