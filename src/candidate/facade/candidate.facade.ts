import { Inject, Injectable } from '@nestjs/common';
import UseCaseInterface from 'src/@shared/usecase/use-case.interface';
import Candidate from '../domain/entity/candidate.entity';
import FindCandidateByEmailUsecase from '../usecase/find-by-email/find-by-email.candidate.usecase';
import CandidateFacadeInterface from './candidate.facade.interface';

@Injectable()
export default class CandidateFacade implements CandidateFacadeInterface {
  constructor(
    @Inject(FindCandidateByEmailUsecase)
    private readonly _findByEmail: UseCaseInterface,
  ) {}

  async getByEmail(email: string): Promise<Candidate> {
    return await this._findByEmail.execute({ email });
  }
}
