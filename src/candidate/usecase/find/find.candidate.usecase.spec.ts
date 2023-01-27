import Candidate from '../../../candidate/domain/entity/candidate.entity';
import Techs, {
  KnowledgeLevel,
} from '../../../candidate/domain/value-object/techs-value-object';
import FindCandidateUsecase from './find.candidate.usecase';

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
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});
