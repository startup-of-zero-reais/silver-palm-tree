import Candidate from '../../../candidate/domain/entity/candidate.entity';
import { CandidateRepositoryInterface } from '../../../candidate/domain/repository/candidate.repository.interface';
import Techs from '../../../candidate/domain/value-object/techs-value-object';
import {
  CreateCandidateInputDto,
  CreateCandidateOutputDto,
} from './create.dto';

export default class CreateCandidateUseCase {
  constructor(
    private readonly candidateRepository: CandidateRepositoryInterface,
  ) {}

  async execute(
    input: CreateCandidateInputDto,
  ): Promise<CreateCandidateOutputDto> {
    const candidate = new Candidate({
      email: input.email,
      name: input.name,
      phone: input.phone,
      image: input.image,
      password: input.password,
      techs: input.techs.map(
        (tech) =>
          new Techs({
            knowledge_level: tech.knowledge_level,
            tech: tech.tech,
          }),
      ),
    });

    candidate.encrypt_password();

    await this.candidateRepository.create(candidate);

    return new CreateCandidateOutputDto(
      candidate.id,
      candidate.name,
      candidate.email,
      candidate.image,
      candidate.phone,
      candidate.techs.map((tech) => ({
        knowledge_level: tech.knowledge_level,
        tech: tech.tech,
      })),
      candidate.createdAt,
      candidate.updatedAt,
    );
  }
}
