import { Inject, Injectable } from '@nestjs/common';
import { HttpErrorException } from '@/@shared/exception-filter/http-error.exception';
import UseCaseInterface from '@/@shared/usecase/use-case.interface';
import { Candidate } from '@/candidate/domain';
import CandidateFacade from '@/candidate/facade/candidate.facade';
import CandidateFacadeInterface from '@/candidate/facade/candidate.facade.interface';
import { Recruiter } from '@/recruiter/domain';
import { RecruiterFacade } from '@/recruiter/facade/recruiter.facade';
import RecruiterFacadeInterface from '@/recruiter/facade/recruiter.facade.interface';
import { PayloadDto, SessionOutputDto } from './validate-session.dto';

@Injectable()
export class ValidateSessionUseCase implements UseCaseInterface {
	constructor(
		@Inject(CandidateFacade)
		private readonly candidateFacade: CandidateFacadeInterface,

		@Inject(RecruiterFacade)
		private readonly recruiterFacade: RecruiterFacadeInterface,
	) {}

	async validateSession(
		token: PayloadDto,
		// error: any, user?: Express.User | false, info?: any
		done: (err: any, user?: SessionOutputDto, info?: any) => void,
	) {
		const session = await this.execute(token);

		if (typeof session === 'boolean') {
			return done(
				new HttpErrorException('Invalid session', 403),
				null,
				null,
			);
		}

		return done(null, session, null);
	}

	async execute(input: PayloadDto) {
		let candidate: Candidate, recruiter: Recruiter;
		if (['candidate', 'both'].includes(input.aud)) {
			candidate = await this.candidateFacade
				.getByID(input.cid)
				.catch(() => undefined);
		}

		if (['recruiter', 'both'].includes(input.aud)) {
			recruiter = await this.recruiterFacade
				.getByID(input.rid)
				.catch(() => undefined);
		}

		if (!candidate && !recruiter) return false;

		return {
			candidate,
			recruiter,
		};
	}
}
