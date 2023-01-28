import { Inject, Injectable } from '@nestjs/common';
import Candidate from '../../../candidate/domain/entity/candidate.entity';
import { CandidateRepositoryInterface } from 'src/candidate/domain/repository/candidate.repository.interface';
import CandidateMongoRepository from '../../../candidate/infra/repository/mongo/candidate.repository';
import { FindInputDto } from './find.dto';

@Injectable()
export default class FindCandidateUsecase {
  constructor(
    @Inject(CandidateMongoRepository)
    private readonly candidateRepository: CandidateRepositoryInterface,
  ) {}

  async execute(input: FindInputDto): Promise<Candidate> {
    const candidate = await this.candidateRepository.find(input.id);

    if (!candidate) {
      throw new Error('Candidate not found');
    }

    return candidate;
  }
}
