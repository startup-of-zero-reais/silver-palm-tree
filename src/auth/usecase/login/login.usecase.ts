import { Inject, Injectable } from '@nestjs/common';
import UseCaseInterface from '@/@shared/usecase/use-case.interface';
import Candidate from '@/candidate/domain/entity/candidate.entity';
import CandidateFacade from '@/candidate/facade/candidate.facade';
import CandidateFacadeInterface from '@/candidate/facade/candidate.facade.interface';
import { Recruiter } from '@/recruiter/domain';
import { RecruiterFacade } from '@/recruiter/facade/recruiter.facade';
import RecruiterFacadeInterface from '@/recruiter/facade/recruiter.facade.interface';
import { LoginInputDto } from './login.dto';

@Injectable()
export class LoginUseCase implements UseCaseInterface {
  constructor(
    @Inject(CandidateFacade)
    private readonly candidateFacade: CandidateFacadeInterface,

    @Inject(RecruiterFacade)
    private readonly recruiterFacade: RecruiterFacadeInterface,
  ) {}

  async execute(input: LoginInputDto): Promise<Candidate | Recruiter> {
    const [candidate, recruiter] = await Promise.all([
      // catch to not throw any error, just undefined result
      this.candidateFacade
        .getByEmail(input.email)
        .catch(() => undefined as Candidate),
      // catch to not throw any error, just undefined result
      this.recruiterFacade
        .getByEmail(input.email)
        .catch(() => undefined as Recruiter),
    ]);

    // in case of result is a candidate build-it
    if (candidate?.valid_password(input.password)) {
      return candidate;
    }

    if (recruiter?.isValidPassword(input.password)) {
      return recruiter;
    }

    throw new Error('Invalid authentication credentials');
  }
}
