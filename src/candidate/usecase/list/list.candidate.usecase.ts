import { CandidateRepositoryInterface } from '../../../candidate/domain/repository/candidate.repository.interface';
import { List } from './list.dto';

export default class ListCandidateUseCase {
  constructor(
    private readonly candidateRepository: CandidateRepositoryInterface,
  ) {}

  async execute(input: List.Input): Promise<List.Output> {
    const candidates = await this.candidateRepository.paginate(
      input.page_size,
      input.page,
    );

    return {
      data: candidates.items().map((candidate) => ({
        id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone,
        image: candidate.image,
        techs: candidate.techs,
        createdAt: candidate.createdAt,
        updatedAt: candidate.updatedAt,
      })),
      meta: {
        total: candidates.total(),
        currentPage: candidates.currentPage(),
        firstPage: candidates.firstPage(),
        lastPage: candidates.lastPage(),
        perPage: candidates.perPage(),
      },
    };
  }
}
