import { Inject, Injectable } from '@nestjs/common';
import UseCaseInterface from '@/@shared/usecase/use-case.interface';
import Candidate from '@/candidate/domain/entity/candidate.entity';
import CandidateFacade from '@/candidate/facade/candidate.facade';
import CandidateFacadeInterface from '@/candidate/facade/candidate.facade.interface';
import { Recruiter } from '@/recruiter/domain';
import { RecruiterFacade } from '@/recruiter/facade/recruiter.facade';
import RecruiterFacadeInterface from '@/recruiter/facade/recruiter.facade.interface';
import { LoginInputDto, LoginOkDto } from './login.dto';

@Injectable()
export class LoginUseCase implements UseCaseInterface {
  constructor(
    @Inject(CandidateFacade)
    private readonly candidateFacade: CandidateFacadeInterface,

    @Inject(RecruiterFacade)
    private readonly recruiterFacade: RecruiterFacadeInterface,
  ) {}

  async execute(input: LoginInputDto): Promise<LoginOkDto> {
    let [candidate, recruiter] = await Promise.all([
      // catch to not throw any error, just undefined result
      this.candidateFacade
        .getByEmail(input.email)
        .catch(() => undefined as Candidate),
      // catch to not throw any error, just undefined result
      this.recruiterFacade
        .getByEmail(input.email)
        .catch(() => undefined as Recruiter),
    ]);

    // is candidate and has no valid password
    if (candidate && !candidate?.valid_password(input.password)) {
      candidate = undefined;
    }

    // is recruiter and has no valid password
    if (recruiter) {
      // is recruiter but can not login
      if (!recruiter.isValidPassword(input.password) || !recruiter.canLogin())
        recruiter = undefined;
    }

    return {
      candidate,
      recruiter,
    };
  }
}
