import { Inject, Injectable } from '@nestjs/common';
import Candidate from '../domain/entity/candidate.entity';
import FindCandidateByEmailUsecase from '../usecase/find-by-email/find-by-email.candidate.usecase';
import FindCandidateUsecase from '../usecase/find/find.candidate.usecase';
import CandidateFacadeInterface from './candidate.facade.interface';
import UseCaseInterface from 'src/@shared/usecase/use-case.interface';

@Injectable()
export default class CandidateFacade implements CandidateFacadeInterface {
	constructor(
		@Inject(FindCandidateUsecase)
		private readonly _find: UseCaseInterface,
		@Inject(FindCandidateByEmailUsecase)
		private readonly _findByEmail: UseCaseInterface,
	) {}

	async getByID(id: string): Promise<Candidate> {
		return await this._find.execute({ id });
	}

	async getByEmail(email: string): Promise<Candidate> {
		return await this._findByEmail.execute({ email });
	}
}
