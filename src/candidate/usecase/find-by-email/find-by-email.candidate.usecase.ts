import UseCaseInterface from '@/@shared/usecase/use-case.interface';
import { CandidateRepositoryInterface } from 'src/candidate/domain/repository/candidate.repository.interface';
import { FindByEmailInputDto, FindByEmailOutputDto } from './find-by-email.dto';

export default class FindCandidateByEmailUsecase implements UseCaseInterface {
  constructor(
    private readonly candidateRepository: CandidateRepositoryInterface,
  ) {}

  async execute(input: FindByEmailInputDto): Promise<FindByEmailOutputDto> {
    const candidate = await this.candidateRepository.findByEmail(input.email);

    if (!candidate) {
      throw new Error('Candidate not found');
    }

    return new FindByEmailOutputDto(
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
