import Candidate from '@/candidate/domain/entity/candidate.entity';
import Techs, {
  KnowledgeLevel,
} from '@/candidate/domain/value-object/techs-value-object';
import FindCandidateByEmailUsecase from '../usecase/find-by-email/find-by-email.candidate.usecase';
import CandidateFacade from './candidate.facade';

const techs = new Techs({
  knowledge_level: KnowledgeLevel.ADVANCED,
  tech: 'PHP',
});

const candidate = new Candidate({
  id: 'any_id',
  email: 'foo@bar.com',
  image: 'http://image.com',
  name: 'foo',
  phone: '123',
  techs: [techs],
});

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(candidate),
    findByEmail: jest.fn().mockReturnValue(candidate),
    paginate: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe('Candidate test', () => {
  beforeEach(() => {
    return;
  });

  it('should return user who match with email', async () => {
    const candidateRepository = MockRepository();
    const candidateUseCase = new FindCandidateByEmailUsecase(
      candidateRepository,
    );
    const candidateFacade = new CandidateFacade(candidateUseCase);

    const input = 'foo@bar.com';

    const output = await candidateFacade.getByEmail(input);

    expect(output).toEqual({
      id: candidate.id,
      email: candidate.email,
      image: candidate.image,
      name: candidate.name,
      phone: candidate.phone,
      techs: [
        {
          knowledge_level: techs.knowledge_level,
          tech: techs.tech,
        },
      ],
      createdAt: output.createdAt,
      updatedAt: output.updatedAt,
    });
  });
});
