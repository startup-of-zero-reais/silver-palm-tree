import Candidate from '../../../candidate/domain/entity/candidate.entity';
import { CandidateRepositoryInterface } from '../../../candidate/domain/repository/candidate.repository.interface';
import Techs from '../../../candidate/domain/value-object/techs-value-object';
import { Create } from './create.dto';

export default class CreateCandidateUseCase {
  constructor(
    private readonly candidateRepository: CandidateRepositoryInterface,
  ) {}

  async execute(input: Create.Input): Promise<Create.Output> {
    const candidate = new Candidate({
      email: input.email,
      name: input.name,
      phone: input.phone,
      image: input.image,
      techs: input.techs.map(
        (tech) =>
          new Techs({
            knowledge_level: tech.knowledge_level,
            tech: tech.tech,
          }),
      ),
    });

    await this.candidateRepository.create(candidate);

    return {
      id: candidate.id,
      email: candidate.email,
      image: candidate.image,
      name: candidate.name,
      phone: candidate.phone,
      techs: candidate.techs.map((tech) => ({
        knowledge_level: tech.knowledge_level,
        tech: tech.tech,
      })),
    };
  }
}
