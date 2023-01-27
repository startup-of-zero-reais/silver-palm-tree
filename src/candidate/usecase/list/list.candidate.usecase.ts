import { CandidateRepositoryInterface } from '../../../candidate/domain/repository/candidate.repository.interface';
import { List } from './list.dto';

export default class ListCandidateUseCase {
  constructor(
    private readonly candidateRepository: CandidateRepositoryInterface,
  ) {}

  async execute(): Promise<List.Output> {
    const candidates = await this.candidateRepository.findAll();

    return candidates.map((candidate) => ({
      id: candidate.id,
      email: candidate.email,
      name: candidate.name,
      image: candidate.image,
      phone: candidate.phone,
      techs: candidate.techs.map((tech) => ({
        knowledge_level: tech.knowledge_level,
        tech: tech.tech,
      })),
    }));
  }
}
