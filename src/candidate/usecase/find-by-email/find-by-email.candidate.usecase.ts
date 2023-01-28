import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import UseCaseInterface from '@/@shared/usecase/use-case.interface';
import Candidate from '@/candidate/domain/entity/candidate.entity';
import { Candidate as CandidateModel } from '@/candidate/infra/repository/mongo/candidate.model';
import { CandidateRepositoryInterface } from '@/candidate/domain/repository/candidate.repository.interface';
import { FindByEmailInputDto } from './find-by-email.dto';

@Injectable()
export default class FindCandidateByEmailUsecase implements UseCaseInterface {
  constructor(
    @InjectModel(CandidateModel.name)
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
