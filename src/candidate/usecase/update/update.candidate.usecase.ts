import { CandidateRepositoryInterface } from '../../../candidate/domain/repository/candidate.repository.interface';
import Techs from '../../../candidate/domain/value-object/techs-value-object';
import {
  UpdateCandidateInputDto,
  UpdateCandidateOutputDto,
} from './update.candidate.dto';

export default class UpdateCandidateUseCase {
  constructor(
    private readonly candidateRepository: CandidateRepositoryInterface,
  ) {}

  async execute(
    input: UpdateCandidateInputDto,
  ): Promise<UpdateCandidateOutputDto> {
    const candidate = await this.candidateRepository.find(input.id);

    if (!candidate) {
      throw new Error('Candidate not found');
    }

    candidate.update(
      input.name,
      input.image,
      input.phone,
      input.techs.map(
        (tech) =>
          new Techs({ knowledge_level: tech.knowledge_level, tech: tech.tech }),
      ),
    );

    await this.candidateRepository.update(candidate);

    return new UpdateCandidateOutputDto(
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
