import { Inject, Injectable } from '@nestjs/common';
import UseCaseInterface from '@/@shared/usecase/use-case.interface';
import JobAd from '../domain/entity/job.entity';
import { FindJobByIDUseCase } from '../usecase/find-by-id/find-by-id.job.usecase';
import JobFacadeInterface from './job.facade.interface';

@Injectable()
export class JobFacade implements JobFacadeInterface {
	constructor(
		@Inject(FindJobByIDUseCase)
		private readonly findJobByIDUseCase: UseCaseInterface,
	) {}

	async getJobByID(id: string): Promise<JobAd> {
		return this.findJobByIDUseCase.execute({ id });
	}
}
