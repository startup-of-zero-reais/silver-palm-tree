import {
	KnowledgeLevel,
	Tech as Techs,
	ProfessionalExperience,
	CandidateRepositoryInterface,
	CandidateFactory,
} from '@/candidate/domain';
import UpdateCandidateUseCase from './update.candidate.usecase';

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

const MockRepository = (): CandidateRepositoryInterface => {
	return {
		find: jest.fn().mockResolvedValue(candidate),
		findByEmail: jest.fn(),
		paginate: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
	};
};

describe('Unit test update candidate usecase', () => {
	it('should update candidate', async () => {
		const repository = MockRepository();
		const usecase = new UpdateCandidateUseCase(repository);

		const output = await usecase.execute({
			id: 'id_updated',
			image: 'http://image-updated.com',
			name: 'name updated',
			phone: 'phone updated',
			techs: [
				new Techs({
					knowledge_level: KnowledgeLevel.INTERMEDIATE,
					tech: 'PHP UPDATED',
				}),
			],
			professionalExperiences: [
				new ProfessionalExperience({
					acting_time: '2 year',
					company: 'Google Inc.',
					description: 'ANY',
					qualification: 'ANY',
					role: 'Developer',
				}),
			],
		});

		expect(output.id).not.toBe('id_updated'); // id can not be updated
		expect(output.name).toBe('name updated');
		expect(output.phone).toBe('phone updated');
		expect(output.image).toBe('http://image-updated.com');
		// techs should be updated
		expect(output.techs[0].tech).toBe('PHP UPDATED');
		expect(output.techs[0].knowledge_level).toBe(
			KnowledgeLevel.INTERMEDIATE,
		);
		expect(output.techs.length).toBe(1);

		expect(output.professionalExperiences[0].acting_time).toBe('2 year');
		expect(output.professionalExperiences[0].company).toBe('Google Inc.');
		expect(output.professionalExperiences[0].description).toBe('ANY');
		expect(output.professionalExperiences[0].qualification).toBe('ANY');
		expect(output.professionalExperiences[0].role).toBe('Developer');
		expect(output.professionalExperiences.length).toBe(1);
	});
});
