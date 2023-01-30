import {
  Tech,
  KnowledgeLevel,
  CandidateFactory,
  ProfessionalExperience,
} from '@/candidate/domain';
import FindCandidateByEmailUsecase from '../usecase/find-by-email/find-by-email.candidate.usecase';
import FindCandidateUsecase from '../usecase/find/find.candidate.usecase';
import CandidateFacade from './candidate.facade';

const tech = new Tech({
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
  [tech],
  [professionalExperiences],
);

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
    const candidateUseCase = new FindCandidateUsecase(candidateRepository);
    const candidateByEmailUseCase = new FindCandidateByEmailUsecase(
      candidateRepository,
    );
    const candidateFacade = new CandidateFacade(
      candidateUseCase,
      candidateByEmailUseCase,
    );

    const input = 'foo@bar.com';

    const output = await candidateFacade.getByEmail(input);

    expect(output).toEqual(candidate);
  });
});
