import { Inject, Injectable } from '@nestjs/common';
import UseCaseInterface from '@/@shared/usecase/use-case.interface';
import Candidate from '@/candidate/domain/entity/candidate.entity';
import { CandidateRepositoryInterface } from '@/candidate/domain/repository/candidate.repository.interface';
import { FindByEmailInputDto } from './find-by-email.dto';
import CandidateMongoRepository from '@/candidate/infra/repository/mongo/candidate.repository';

@Injectable()
export default class FindCandidateByEmailUsecase implements UseCaseInterface {
  constructor(
    @Inject(CandidateMongoRepository)
    private readonly candidateRepository: CandidateRepositoryInterface,
  ) {}

  async execute(input: FindByEmailInputDto): Promise<Candidate> {
    const candidate = await this.candidateRepository.findByEmail(input.email);

    if (!candidate) {
      throw new Error('Candidate not found');
    }

    return candidate;
  }
}
