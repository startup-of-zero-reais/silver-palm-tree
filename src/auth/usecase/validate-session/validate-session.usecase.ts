import { Inject, Injectable } from '@nestjs/common';
import UseCaseInterface from '@/@shared/usecase/use-case.interface';
import CandidateFacade from '@/candidate/facade/candidate.facade';
import CandidateFacadeInterface from '@/candidate/facade/candidate.facade.interface';
import { PayloadDto, SessionOutputDto } from './validate-session.dto';

@Injectable()
export class ValidateSessionUseCase implements UseCaseInterface {
  constructor(
    @Inject(CandidateFacade)
    private readonly candidateFacade: CandidateFacadeInterface,
  ) {}

  async validateSession(
    token: PayloadDto,
    // error: any, user?: Express.User | false, info?: any
    done: (err: any, user?: SessionOutputDto, info?: any) => void,
  ) {
    const session = await this.execute(token);
    return done(null, session, session);
  }

  async execute(input: PayloadDto): Promise<any> {
    if (input.type === 'candidate') {
      const candidate = await this.candidateFacade.getByID(input.sub);
      return candidate;
    }

    return false;
  }
}
