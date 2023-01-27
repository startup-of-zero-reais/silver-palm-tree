import { CandidateRepositoryInterface } from 'src/candidate/domain/repository/candidate.repository.interface';
import { Find } from './find.dto';

export default class FindCandidateUsecase {
  constructor(
    private readonly candidateRepository: CandidateRepositoryInterface,
  ) {}

  async execute(input: Find.Input): Promise<Find.Output> {
    const candidate = await this.candidateRepository.find(input.id);
    if (!candidate) {
      throw new Error('Candidate not found');
    }
    return {
      id: candidate.id,
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      image: candidate.image,
      techs: candidate.techs.map((tech) => ({
        tech: tech.tech,
        knowledge_level: tech.knowledge_level,
      })),
      createdAt: candidate.createdAt,
      updatedAt: candidate.updatedAt,
    };
  }
}
