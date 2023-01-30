import {
	Tech as Techs,
	KnowledgeLevel,
	CandidateRepositoryInterface,
	ProfessionalExperience,
	CandidateFactory,
} from '@/candidate/domain';
import FindCandidateByEmailUsecase from './find-by-email.candidate.usecase';

const techs = new Techs({
	knowledge_level: KnowledgeLevel.ADVANCED,
	tech: 'PHP',
});

const professionalExperiences = new ProfessionalExperience({
	acting_time: '1 year',
	company: 'any_company',
	description: 'any_description',
	qualification: 'any_qualification',
	role: 'any_role',
});

const candidate = CandidateFactory.create(
	{
		email: 'foo@bar.com',
		image: 'http://image.com',
		name: 'foo',
		phone: '123',
		password: '123',
	},
	[techs],
	[professionalExperiences],
);

const MockRepository = (): CandidateRepositoryInterface => {
	return {
		findByEmail: jest.fn().mockReturnValue(candidate),
		find: jest.fn(),
		paginate: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
	};
};

describe('Unit test find candidate usecase', () => {
	it('should find candidate by email usecase', async () => {
		const repository = MockRepository();
		const usecase = new FindCandidateByEmailUsecase(repository);

		const output = await usecase.execute({ email: candidate.email });

		expect(output).toEqual(candidate);
	});
});
