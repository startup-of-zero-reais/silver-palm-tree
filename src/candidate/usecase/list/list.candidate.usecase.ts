import { CandidateRepositoryInterface } from '../../../candidate/domain/repository/candidate.repository.interface';
import { ListCandidateInputDto, ListCandidateOutputDto } from './list.dto';

export default class ListCandidateUseCase {
  constructor(
    private readonly candidateRepository: CandidateRepositoryInterface,
  ) {}

  async execute(input: ListCandidateInputDto): Promise<ListCandidateOutputDto> {
    const candidates = await this.candidateRepository.paginate(
      input.page_size,
      input.page,
    );

    return new ListCandidateOutputDto(
      candidates.items().map((candidate) => ({
        id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone,
        image: candidate.image,
        techs: candidate.techs.map((tech) => ({
          knowledge_level: tech.knowledge_level,
          tech: tech.tech,
        })),
        updatedAt: candidate.updatedAt,
        createdAt: candidate.createdAt,
      })),
      {
        total: candidates.total(),
        currentPage: candidates.currentPage(),
        firstPage: candidates.firstPage(),
        lastPage: candidates.lastPage(),
        perPage: candidates.perPage(),
      },
    );
  }
}
