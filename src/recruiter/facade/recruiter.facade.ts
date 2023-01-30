import { Inject, Injectable } from '@nestjs/common';
import { Recruiter } from '../domain';
import { FindByEmailRecruiterUseCase } from '../usecase/find-by-email/find-by-email.recruiter.usecase';
import { FindRecruiterUseCase } from '../usecase/find/find.recruiter.usecase';
import RecruiterFacadeInterface from './recruiter.facade.interface';

@Injectable()
export class RecruiterFacade implements RecruiterFacadeInterface {
	constructor(
		@Inject(FindRecruiterUseCase)
		private readonly _find: FindRecruiterUseCase,

		@Inject(FindByEmailRecruiterUseCase)
		private readonly _findByEmail: FindByEmailRecruiterUseCase,
	) {}

	async getByID(id: string): Promise<Recruiter> {
		return this._find.execute({ id });
	}

	async getByEmail(email: string): Promise<Recruiter> {
		return await this._findByEmail.execute({ email });
	}
}
