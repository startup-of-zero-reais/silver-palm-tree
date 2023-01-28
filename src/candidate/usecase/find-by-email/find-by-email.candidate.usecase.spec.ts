import Candidate from '@/candidate/domain/entity/candidate.entity';
import Techs, {
  KnowledgeLevel,
} from '@/candidate/domain/value-object/techs-value-object';
import FindCandidateByEmailUsecase from './find-by-email.candidate.usecase';

const techs = new Techs({
  knowledge_level: KnowledgeLevel.ADVANCED,
  tech: 'PHP',
});

const candidate = new Candidate({
  id: 'any_id',
  email: 'foo@bar.com',
  image: 'http://image.com',
  name: 'foo',
  password: '123',
  phone: '123',
  techs: [techs],
});

const MockRepository = () => {
  return {
    findByEmail: jest.fn().mockReturnValue(candidate),
    find: jest.fn(),
    paginate: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe('Unit test find candidate usecase', () => {
  it('should find candidate usecase', async () => {
    const repository = MockRepository();
    const usecase = new FindCandidateByEmailUsecase(repository);

    const output = await usecase.execute({ email: candidate.email });

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
