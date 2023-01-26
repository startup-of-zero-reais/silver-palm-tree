import { KnowledgeLevel } from '../../../candidate/domain/value-object/techs-value-object';
import CreateCandidateUseCase from './create.candidate.usecase';

const input = {
  name: 'test',
  phone: 'any_phone',
  email: 'test@example.com',
  github: 'http://example.com',
  image: 'http://example.com',
  techs: [{ knowledge_level: KnowledgeLevel.ADVANCED, tech: 'PHP' }],
};
const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
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
      github: 'http://example.com',
      image: 'http://example.com',
      techs: [{ knowledge_level: KnowledgeLevel.ADVANCED, tech: 'PHP' }],
    });

    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      phone: input.phone,
      email: input.email,
      github: input.github,
      image: input.image,
      techs: input.techs,
    });
  });
});
