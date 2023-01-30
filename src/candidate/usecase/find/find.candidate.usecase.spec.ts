import {
	Tech as Techs,
	ProfessionalExperience,
	CandidateFactory,
	KnowledgeLevel,
} from '@/candidate/domain';
import FindCandidateUsecase from './find.candidate.usecase';

const techs = new Techs({
	knowledge_level: KnowledgeLevel.ADVANCED,
	tech: 'PHP',
});

const professionalExperience = new ProfessionalExperience({
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
	[professionalExperience],
);

const MockRepository = () => {
	return {
		find: jest.fn().mockReturnValue(candidate),
		findByEmail: jest.fn(),
		paginate: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
	};
};

describe('Unit test find candidate usecase', () => {
	it('should find candidate usecase', async () => {
		const repository = MockRepository();
		const usecase = new FindCandidateUsecase(repository);

		const output = await usecase.execute({ id: candidate.id });

		expect(output).toEqual(candidate);
	});
});
