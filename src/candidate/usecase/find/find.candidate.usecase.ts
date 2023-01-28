import { CandidateRepositoryInterface } from 'src/candidate/domain/repository/candidate.repository.interface';
import { FindInputDto, FindOutputDto } from './find.dto';

export default class FindCandidateUsecase {
  constructor(
    private readonly candidateRepository: CandidateRepositoryInterface,
  ) {}

  async execute(input: FindInputDto): Promise<FindOutputDto> {
    const candidate = await this.candidateRepository.find(input.id);

    if (!candidate) {
      throw new Error('Candidate not found');
    }

    return new FindOutputDto(
      candidate.id,
      candidate.name,
      candidate.email,
      candidate.image,
      candidate.phone,
      candidate.techs.map((tech) => ({
        tech: tech.tech,
        knowledge_level: tech.knowledge_level,
      })),
      candidate.createdAt,
      candidate.updatedAt,
    );
  }
}
