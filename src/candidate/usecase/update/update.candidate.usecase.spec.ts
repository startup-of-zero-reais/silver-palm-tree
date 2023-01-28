import { CandidateRepositoryInterface } from '@/candidate/domain/repository/candidate.repository.interface';
import Candidate from '../../domain/entity/candidate.entity';
import Techs, {
  KnowledgeLevel,
} from '../../domain/value-object/techs-value-object';
import UpdateCandidateUseCase from './update.candidate.usecase';

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
  password: '123',
  techs: [techs],
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
    });

    expect(output.name).toBe('name updated');
    expect(output.image).toBe('http://image-updated.com');
    expect(output.phone).toBe('phone updated');
    expect(output.techs).toEqual([
      { knowledge_level: KnowledgeLevel.INTERMEDIATE, tech: 'PHP UPDATED' },
    ]);
  });
});
