import { CandidateRepositoryInterface } from '@/candidate/domain/repository/candidate.repository.interface';
import { ProfessionalExperience } from '@/candidate/domain/value-object/professional-experience';
import Candidate from '@/candidate/domain/entity/candidate.entity';
import Techs, {
  KnowledgeLevel,
} from '@/candidate/domain/value-object/techs-value-object';
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

const candidate = new Candidate({
  id: 'any_id',
  email: 'foo@bar.com',
  image: 'http://image.com',
  name: 'foo',
  phone: '123',
  password: '123',
  techs: [techs],
  professionalExperiences: [professionalExperience],
});

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
  });
});
